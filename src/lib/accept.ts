export const PRODUCED_CONTENT_TYPES = ["text/html", "text/markdown"] as const;

type ProducedContentType = (typeof PRODUCED_CONTENT_TYPES)[number];

type AcceptEntry = {
  type: string;
  q: number;
  specificity: number;
  position: number;
};

function parseQuality(value: string | undefined) {
  if (value === undefined) return 1;

  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.max(0, Math.min(1, parsed)) : 0;
}

export function parseAcceptHeader(header: string): AcceptEntry[] {
  return header
    .split(",")
    .map((raw, position) => {
      const [mediaRange = "", ...parameters] = raw.trim().toLowerCase().split(";").map((part) => part.trim());
      const qualityParameter = parameters.find((parameter) => parameter.startsWith("q="));
      const q = parseQuality(qualityParameter?.slice(2));
      const specificity = mediaRange === "*/*" ? 0 : mediaRange.endsWith("/*") ? 1 : 2;

      return { type: mediaRange, q, specificity, position };
    })
    .filter((entry) => entry.type.length > 0);
}

function matches(entry: AcceptEntry, candidate: string) {
  return entry.type === "*/*" || entry.type === candidate || (entry.type.endsWith("/*") && candidate.startsWith(entry.type.slice(0, -1)));
}

/**
 * Selects a representation according to RFC 9110 precedence: the most
 * specific matching media range controls a candidate; q-value then client
 * order select between candidates.
 */
export function preferredContentType(header: string | null): ProducedContentType | null {
  if (!header?.trim()) return "text/html";

  const entries = parseAcceptHeader(header);
  if (entries.length === 0) return "text/html";

  let selected: ProducedContentType | null = null;
  let bestQuality = -1;
  let bestPosition = Number.POSITIVE_INFINITY;

  for (const candidate of PRODUCED_CONTENT_TYPES) {
    const candidateMatches = entries.filter((entry) => matches(entry, candidate));
    if (candidateMatches.length === 0) continue;

    const mostSpecific = Math.max(...candidateMatches.map((entry) => entry.specificity));
    const controllingEntry = candidateMatches.find((entry) => entry.specificity === mostSpecific);
    if (!controllingEntry || controllingEntry.q <= 0) continue;

    if (
      controllingEntry.q > bestQuality ||
      (controllingEntry.q === bestQuality && controllingEntry.position < bestPosition)
    ) {
      selected = candidate;
      bestQuality = controllingEntry.q;
      bestPosition = controllingEntry.position;
    }
  }

  return selected;
}

export function appendVaryAccept(headers: Headers) {
  const existing = headers.get("Vary");
  if (!existing) {
    headers.set("Vary", "Accept");
    return;
  }

  if (!existing.split(",").some((value) => value.trim().toLowerCase() === "accept")) {
    headers.set("Vary", `${existing}, Accept`);
  }
}
