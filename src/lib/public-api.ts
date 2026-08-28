import { getPublishedPosts } from "./blog";
import { absoluteUrl } from "./site";

export const API_VERSION = "1";
export const API_RATE_LIMIT = 60;
export const API_RATE_WINDOW_SECONDS = 60;

type RateLimitState = {
  count: number;
  resetAt: number;
};

type RateLimitSnapshot = {
  limit: number;
  remaining: number;
  resetAt: number;
  allowed: boolean;
};

type ProblemDetails = {
  type: string;
  title: string;
  status: number;
  code: string;
  message: string;
  detail: string;
  instance: string;
};

const rateLimitBuckets = new Map<string, RateLimitState>();

function clientKey(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip")?.trim() || "anonymous";
}

function consumeRateLimit(request: Request, now = Date.now()): RateLimitSnapshot {
  const key = clientKey(request);
  const existing = rateLimitBuckets.get(key);
  const state = existing && existing.resetAt > now
    ? existing
    : { count: 0, resetAt: now + API_RATE_WINDOW_SECONDS * 1000 };

  state.count += 1;
  rateLimitBuckets.set(key, state);

  // Keep this best-effort in-memory limiter bounded for long-lived Node.js instances.
  if (rateLimitBuckets.size > 1000) {
    const oldestKey = rateLimitBuckets.keys().next().value;
    if (oldestKey) rateLimitBuckets.delete(oldestKey);
  }

  return {
    limit: API_RATE_LIMIT,
    remaining: Math.max(0, API_RATE_LIMIT - state.count),
    resetAt: state.resetAt,
    allowed: state.count <= API_RATE_LIMIT,
  };
}

function rateLimitHeaders(snapshot: RateLimitSnapshot, now = Date.now()) {
  const reset = Math.max(1, Math.ceil((snapshot.resetAt - now) / 1000));

  return {
    "RateLimit-Limit": String(snapshot.limit),
    "RateLimit-Remaining": String(snapshot.remaining),
    "RateLimit-Reset": String(reset),
    RateLimit: `limit=${snapshot.limit}, remaining=${snapshot.remaining}, reset=${reset}`,
    "API-Version": API_VERSION,
  };
}

function normalizedPost(value: unknown) {
  if (!value || typeof value !== "object") return value;
  const post = value as Record<string, unknown>;
  const tags = Array.isArray(post.tags)
    ? post.tags
      .map((tag) => {
        if (typeof tag === "string") return tag;
        if (!tag || typeof tag !== "object") return null;
        const value = (tag as Record<string, unknown>).tag;
        return typeof value === "string" ? value : null;
      })
      .filter((tag): tag is string => Boolean(tag))
    : [];

  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    publishedAt: post.publishedAt ?? null,
    updatedAt: post.updatedAt,
    tags,
  };
}

function queryInteger(request: Request, name: string, fallback: number, minimum: number, maximum: number) {
  const rawValue = new URL(request.url).searchParams.get(name);
  if (rawValue === null) return { value: fallback };
  if (!/^\d+$/.test(rawValue)) return { error: `${name} must be an integer.` };

  const value = Number(rawValue);
  if (!Number.isSafeInteger(value) || value < minimum || value > maximum) {
    return { error: `${name} must be between ${minimum} and ${maximum}.` };
  }

  return { value };
}

async function normalizePostsSuccess(request: Request, snapshot: RateLimitSnapshot) {
  try {
    const limitResult = queryInteger(request, "limit", 100, 1, 100);
    const pageResult = queryInteger(request, "page", 1, 1, Number.MAX_SAFE_INTEGER);
    if (limitResult.error || pageResult.error) {
      return problemResponse(
        request,
        400,
        "invalid_pagination",
        limitResult.error || pageResult.error || "Invalid pagination parameters.",
        snapshot,
      );
    }

    const body = await getPublishedPosts({ limit: limitResult.value, page: pageResult.value });
    const normalized = {
      ...body,
      docs: body.docs.map(normalizedPost),
    };
    const headers = new Headers();
    for (const [name, value] of Object.entries(rateLimitHeaders(snapshot))) headers.set(name, value);
    headers.set("Cache-Control", "private, no-store");
    headers.set("Content-Type", "application/json; charset=utf-8");
    return Response.json(normalized, { status: 200, headers });
  } catch {
    return problemResponse(
      request,
      500,
      "malformed_upstream_response",
      "The public posts API returned an invalid response.",
      snapshot,
    );
  }
}

function statusTitle(status: number) {
  switch (status) {
    case 400:
      return "Bad Request";
    case 404:
      return "Not Found";
    case 429:
      return "Too Many Requests";
    case 500:
      return "Internal Server Error";
    default:
      return status >= 500 ? "Server Error" : "Request Error";
  }
}

function problemResponse(
  request: Request,
  status: number,
  code: string,
  message: string,
  snapshot: RateLimitSnapshot,
) {
  const safeStatus = status >= 400 && status <= 599 ? status : 500;
  const problem: ProblemDetails = {
    type: absoluteUrl("/developers/api#errors"),
    title: statusTitle(safeStatus),
    status: safeStatus,
    code,
    message,
    detail: message,
    instance: new URL(request.url).pathname,
  };
  const headers = new Headers({
    ...rateLimitHeaders(snapshot),
    "Cache-Control": "private, no-store",
    "Content-Type": "application/problem+json; charset=utf-8",
  });

  if (safeStatus === 429) {
    headers.set("Retry-After", String(Math.max(1, Math.ceil((snapshot.resetAt - Date.now()) / 1000))));
  }

  return Response.json(problem, { status: safeStatus, headers });
}

/**
 * Handles both the canonical /api/v1/posts route and its unversioned alias.
 * The published-post reader owns the CMS access policy; this wrapper owns the
 * stable public response contract and the small, documented pagination API.
 */
export async function handlePostsGet(request: Request) {
  const snapshot = consumeRateLimit(request);

  if (!snapshot.allowed) {
    return problemResponse(
      request,
      429,
      "rate_limit_exceeded",
      "Too many requests. Retry after the rate-limit window resets.",
      snapshot,
    );
  }

  const requestedVersion = request.headers.get("x-api-version");
  if (requestedVersion && requestedVersion !== API_VERSION) {
    return problemResponse(
      request,
      400,
      "unsupported_api_version",
      `Unsupported API version. Use X-API-Version: ${API_VERSION}.`,
      snapshot,
    );
  }

  try {
    return normalizePostsSuccess(request, snapshot);
  } catch {
    return problemResponse(
      request,
      500,
      "upstream_error",
      "The public posts API could not complete the request.",
      snapshot,
    );
  }
}
