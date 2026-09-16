import type { Media, Post } from "../../payload-types";

const timestamp = "2026-09-09T12:00:00.000Z";
const rewriteTimestamp = "2026-09-12T12:00:00.000Z";

function editorialCover(id: number, url: string, alt: string): Media {
  return {
    id,
    alt,
    createdAt: timestamp,
    updatedAt: timestamp,
    url,
    width: 1600,
    height: 900,
    mimeType: "image/svg+xml",
  };
}

/**
 * Checked-in editorial notes keep the public archive useful before Payload is
 * connected. When the CMS is configured, these records are merged with its
 * published posts in src/lib/blog.ts.
 */
export const builtInPosts: Post[] = [
  {
    id: -1001,
    title: "GPT-6 vs Fable 5.1",
    slug: "gpt-6-astra-vs-fable-5-1",
    excerpt:
      "A documentation-first comparison of GPT-6 Astra and Claude Fable 5.1 across price, context, tools, reasoning controls, benchmarks, and deployment fit. The verdict stays conditional where the public evidence is vendor-reported or incomplete.",
    cover: editorialCover(-2001, "/images/blog/gpt-6-astra-vs-fable.svg", "Editorial diagram comparing GPT-6 Astra and Claude Fable 5.1 across documented model surfaces."),
    content: `## Scope

In this article, GPT-6 means OpenAI's GPT-6 Astra, whose public model identifier is \`gpt-6-astra\`. Fable 5.1 means Anthropic's Claude Fable 5.1, whose public model identifier is \`claude-fable-5-1\`. I checked the provider documentation and OpenAI's published comparison tables on September 12, 2026.

This is a documentation-first comparison, not a benchmark I ran. I separate published specifications from vendor-reported evaluations, call out important footnotes, and leave gaps open instead of filling them with guesses. Model pages, prices, availability, and limits can change, so the linked source pages should be the final check before I commit a production workload or budget.

> **Key takeaways**
>
> - GPT-6 Astra documents a 1,050,000-token context window. Fable 5.1 documents 1,000,000 tokens. Both list a 128,000-token maximum output.
> - Both models list $10 per million input tokens and $50 per million output tokens at the standard API rate. Their caching and long-prompt pricing is different.
> - Astra exposes configurable reasoning effort and a broad set of OpenAI API tools. Fable 5.1 keeps adaptive thinking always on and adds Anthropic-specific controls for long-running work.
> - OpenAI's published comparison table gives Astra the higher score on several rows and Fable the higher score on Humanity's Last Exam with tools. Those results are not a neutral, independently reproduced leaderboard.

## The short answer

I would start with GPT-6 Astra when I need an OpenAI API-native integration, configurable reasoning effort, or the tool surfaces OpenAI documents for hosted shell, apply patch, computer use, skills, MCP, web search, and tool search. I would start with Fable 5.1 when the workflow is already built around Anthropic's Messages API or one of its partner platforms, and the main job is long-horizon coding, research, document work, spreadsheets, slides, or vision.

That is an integration decision, not a universal quality verdict. The headline specifications are close, the interfaces are not identical, and the available benchmark evidence has enough provider-specific context that I would use it to form a test plan rather than to skip testing.

## At a glance

| | GPT-6 Astra | Claude Fable 5.1 |
| --- | --- | --- |
| Provider | OpenAI | Anthropic |
| Model identifier | \`gpt-6-astra\` | \`claude-fable-5-1\` |
| Documented context window | 1,050,000 tokens | 1,000,000 tokens |
| Maximum output | 128,000 tokens | 128,000 tokens |
| Standard input / output price | $10 / $50 per million tokens | $10 / $50 per million tokens |
| Knowledge cutoff in model documentation | April 30, 2026 | June 2026 |
| Reasoning controls | Low, medium, high, xhigh, max | Adaptive thinking always on; default effort high |
| Input and output | Text and image input; text output | Text and image input; text output |
| Documented availability | OpenAI API and supported OpenAI product surfaces | Claude API, Amazon Bedrock, Google Cloud, Microsoft Foundry, and Claude Platform on AWS |

The specifications above come from the [GPT-6 Astra model page](https://developers.openai.com/api/docs/models/gpt-6-astra) and [Anthropic's Fable 5.1 overview](https://platform.claude.com/docs/en/models/fable-5-1/overview). The small context difference is real in the documentation, but it is not a reason by itself to fill either window. A million-token limit is an upper bound, not a guarantee of equally reliable retrieval, latency, or reasoning across a million tokens.

## The model interfaces point in different directions

OpenAI documents Astra as a model for difficult end-to-end work. Its API page lists streaming, function calling, structured outputs, web search, file search, image generation, code interpreter, hosted shell, apply patch, skills, computer use, MCP, and tool search. It also lists reasoning effort from low through max. I read that as a strong set of primitives for an OpenAI-centered agent harness, not as a promise that every third-party client exposes every tool or handles every result in the same way.

The [OpenAI model guidance](https://developers.openai.com/api/docs/guides/latest-model) also describes async tool calling, mid-turn steering, and changing reasoning effort during a conversation while preserving cache. Those controls can matter more than a small benchmark gap when an agent has to pause, ask for confirmation, or recover from a tool failure.

Anthropic documents Fable 5.1 for demanding reasoning and long-running agentic work. Adaptive thinking is always on, the default effort is high, and per-message effort is available as a beta control. Anthropic also documents turn-scoped system messages, readable progress updates, content provenance, and changes to how thinking blocks move through a conversation. The [Fable 5.1 release notes](https://platform.claude.com/docs/en/models/fable-5-1/whats-new-fable-5-1) are particularly useful here because they describe behavior changes that a generic model table would miss.

One compatibility detail is easy to miss: Fable 5.1 does not support forced tool use with \`tool_choice: any\` or \`tool_choice: tool\`, which returns a 400 error. Auto, default, and none remain available. Anthropic also warns that editing earlier turns can invalidate thinking blocks and that earlier models cannot read Fable 5.1 thinking blocks. If I am swapping models inside an existing agent, the message schema and state-handling work is part of the migration.

## Price is tied at the headline and different in use

| Pricing detail | GPT-6 Astra | Claude Fable 5.1 |
| --- | --- | --- |
| Standard input | $10 per million tokens | $10 per million tokens |
| Standard output | $50 per million tokens | $50 per million tokens |
| Cached input / cache read | $1 per million tokens | $0.25 per million tokens |
| Cache write | $12.50 per million tokens | $12.50 per million tokens for 5 minutes; $20 for 1 hour |
| Batch pricing | 50% of standard; flex pricing is also listed | 50% of standard |
| Long-prompt note | Above 272,000 input tokens, the full request uses 2x input and cache rates and 1.5x output | Separate cache durations and rates are documented |

The figures come from the [OpenAI model documentation](https://developers.openai.com/api/docs/models/gpt-6-astra) and [Anthropic's pricing section for Fable 5.1](https://platform.claude.com/docs/en/models/fable-5-1/overview). OpenAI also documents a fast mode priced at 2x the applicable rate. Partner clouds can add their own terms, and tools, retries, output length, cache hit rate, and prompt shape can dominate a real bill.

The practical difference is not simply that one model is cheap. Fable's documented cache reads are lower. Astra's long-prompt surcharge makes very large requests worth measuring before I assume the one-million-token context is economical. A fair cost test should replay the same multi-turn workload, count input and output tokens, record cache hits, and include failed or repeated tool calls.

## What the published benchmark table actually shows

OpenAI's [GPT-6 Astra announcement](https://openai.com/index/gpt-6-astra/) includes selected rows comparing Astra with Claude Fable 5.1. The following values are copied from that announcement, not from a test I ran:

| Evaluation | GPT-6 Astra | Claude Fable 5.1 | Reading note |
| --- | ---: | ---: | --- |
| AutomationBench | 41.4% | 31.4% | Professional-work evaluation |
| BenchCAD | 95.9% | 84.3% | OpenAI notes three modifications to the Claude evaluation |
| Terminal-Bench 4.0 | 57.9% | 55.8% | Coding evaluation |
| DeepSWE v1.1 | 74.1% | 67.4% | Coding-agent evaluation |
| Terminal-Bench Science 0.1 | 64.6% | 52.6% | Science and terminal-work evaluation |
| GPQA Diamond | 96.0% | 93.7% | Graduate-level question answering |
| Humanity's Last Exam with tools | 57.2% | 65.0% | Fable is higher on this row |
| Internal computer-use safety benchmark | 2.4% | 9.5% | Lower is better on this row |

The table needs more context before it becomes a conclusion. OpenAI says the displayed scores are the maximum at any effort and that GPT evaluations from research or API settings may differ from production products. Its footnotes describe changes to individual evaluations. It also notes that some Fable scores, including ExploitGym, come from Mythos for the reported comparison. That is one reason I do not use the cyber rows as a clean model-quality ranking.

There are also rows without a Fable value. A missing value is not a loss, and a close score is not evidence that two tasks used the same prompt, tool harness, effort budget, grader, or safety route. Anthropic's [Fable 5.1 model documentation](https://platform.claude.com/docs/en/models/fable-5-1/overview) is the companion source for what the model supports and how its behavior is configured.

## Safety and reliability belong in the decision

Provider safety claims are useful evidence, but they are not a cross-provider certification. OpenAI's [Astra safety overview](https://openai.com/index/safety-overview-gpt-6-astra/) reports results from its own jailbreak, prompt-injection, and internal Codex-task testing, along with a warning about lower monitorability relative to the comparison model. I treat those as OpenAI's test results and caveats, not as a general safety ranking.

Anthropic's Fable 5.1 documentation describes a refusal response that can arrive as HTTP 200 with \`stop_reason: "refusal"\` and additional refusal details. It also documents fallback behavior and changes to tool use. An agent that only checks HTTP status can mishandle a refusal, while an agent that assumes forced tool use is universal can fail before the model does.

For either model, I would isolate credentials, require confirmation before destructive or external actions, and inspect tool inputs and outputs. My test set would include prompt injection in retrieved files, incorrect code edits, long-context distraction, refusal handling, malformed tool arguments, timeout recovery, and a human takeover path. A large context window and a high benchmark score do not remove those operational responsibilities.

## How I would evaluate them fairly

I would build a small private suite from the work the model is actually expected to do. I would keep the files, prompts, permissions, tool descriptions, and acceptance criteria constant, then adapt only the provider-specific message format required by each API. I would run enough repeats to see variance rather than recording a single lucky completion.

I would track:

- First-pass correctness and the number of human corrections.
- Tool-call validity, unnecessary calls, and recovery after a failed call.
- End-to-end latency, time spent thinking, and time to the first useful action.
- Input, output, cache-hit, retry, and tool-related costs.
- Refusal behavior and whether the application handles it explicitly.
- Performance when the useful context is large but not artificially padded.
- How often I need to take control of the run.

For coding, I would include repository changes that require reading existing conventions, making a small patch, running tests, and explaining the remaining uncertainty. For research, I would check source selection and claim traceability. For document work, I would grade the final artifact, not only the intermediate prose. These tests reveal workflow fit more reliably than a single aggregate score.

## Who should choose what

| If the priority is... | First model I would test | Why |
| --- | --- | --- |
| OpenAI Responses API integration and structured tool orchestration | GPT-6 Astra | The documented tools and reasoning-effort controls line up with that stack |
| Computer use, hosted shell, apply patch, skills, or MCP in an OpenAI workflow | GPT-6 Astra | Those API surfaces are listed in the Astra documentation |
| Anthropic Messages API or a supported partner cloud | Fable 5.1 | The deployment route and message model are already aligned |
| Long-running coding, research, document, spreadsheet, or slide work in Anthropic's stack | Fable 5.1 | Adaptive thinking and the model-specific agentic-work guidance are the relevant fit |
| Repeated prefixes where cache reads dominate | Test both, with special attention to Fable | Fable's documented cache-read price is lower, but workload shape still decides the bill |
| A high-stakes or destructive workflow | Neither without an evaluation and approval path | The provider, model, and tool harness all contribute to risk |

The recommendation can change when the integration changes. A model that looks better in a generic coding table may be slower or more expensive once a particular SDK, tool wrapper, region, or approval flow is added.

## Frequently asked questions

### Is GPT-6 better than Fable 5.1?

The public evidence does not support a universal answer. OpenAI's own comparison table gives Astra the higher value on several rows, while Fable is higher on Humanity's Last Exam with tools. The evaluation setup, provider footnotes, and production harness matter enough that I would choose the model that wins on my representative tasks.

### Which one is cheaper?

At standard input and output rates, the documented prices are the same: $10 and $50 per million tokens. Fable 5.1 lists cheaper cache reads, while Astra has a documented long-prompt surcharge above 272,000 input tokens and a separate fast mode. I would compare a replay of the real workload instead of using the headline rates alone.

### Can I swap one into the same agent without changes?

Not reliably. The providers use different APIs, tool schemas, reasoning controls, and state rules. Fable's thinking blocks and tool-choice restrictions are explicit migration concerns. Astra's tools may also depend on the OpenAI endpoint and the client exposing them. I would build an adapter and run the full task suite after the swap.

### Which model has the larger context window?

GPT-6 Astra documents 1,050,000 tokens and Fable 5.1 documents 1,000,000 tokens. That is a modest Astra lead on paper. It does not establish better long-context quality, because retrieval and reasoning depend on the prompt, the task, the client, and the provider's current limits.

## Verdict

| Criterion | Practical read |
| --- | --- |
| Headline context | Astra has the larger documented window, 1.05 million versus 1 million tokens |
| Maximum output | Tie in the current model pages at 128,000 tokens |
| Standard token price | Tie at $10 input and $50 output per million tokens |
| Cache economics | Fable has the lower documented cache-read rate; Astra has different long-prompt rules |
| Reasoning controls | Astra exposes effort levels; Fable uses always-on adaptive thinking with its own beta controls |
| OpenAI-native tools | Astra is the natural first test |
| Anthropic long-horizon workflows | Fable is the natural first test |
| Benchmark conclusion | Mixed, vendor-reported, and not independently reproduced here |

My conclusion is conditional: GPT-6 Astra looks like the better first experiment for an OpenAI-native tool workflow, while Fable 5.1 looks like the better first experiment for an Anthropic-native long-running workbench. The published numbers help prioritize tests, but they do not replace them. I would keep the stable model adapter, log every tool interaction, and let a representative task set decide which model belongs in the portfolio.
`,
    tags: [
      { tag: "AI models" },
      { tag: "comparison" },
      { tag: "source notes" },
    ],
    publishedAt: "2026-09-09T12:00:00.000Z",
    updatedAt: rewriteTimestamp,
    createdAt: timestamp,
    _status: "published",
  },
  {
    id: -1002,
    title: "Navier-Stokes solution by an OpenAI internal model",
    slug: "navier-stokes-solution-openai-internal-model",
    excerpt:
      "A careful account of OpenAI's reported Navier-Stokes proof, its public Lean formalization, the precise C and D claims, and what official review still means.",
    cover: editorialCover(-2002, "/images/blog/navier-stokes-report.svg", "Editorial fluid-flow diagram for a reported Navier-Stokes proof and its independent review."),
    content: `## Start with the status

On September 8, 2026, OpenAI published [On the Navier-Stokes Millennium Prize Problem](https://openai.com/index/navier-stokes-solution/). The post says an internal system produced an analytical proof and that OpenAI is sharing a paper and a Lean formalization. I am treating that as a reported result, not as an independently certified solution.

The distinction matters because the announcement and the official Clay materials serve different purposes. As of September 12, I found OpenAI's report, its paper, the public Lean repository, and Clay's problem statement and rules. I did not find a Clay announcement accepting the result or awarding the prize in those materials. That does not settle the mathematics. It does mean that I will describe the claim precisely and avoid calling the problem officially solved.

> **Key takeaways**
>
> - OpenAI reports that an internal model produced a finite-time blowup construction for three-dimensional incompressible Navier-Stokes.
> - OpenAI says the result establishes alternatives C and D in the Clay problem formulation, and it has published a paper plus Lean code.
> - GPT-6 Astra is described as helping with Lean formalization and verification, not as the model that found the proof.
> - The public artifacts can now be inspected, but the Clay recognition process and broad mathematical acceptance are separate questions.

## What OpenAI reported

OpenAI says its internal system found a construction for the three-dimensional incompressible Navier-Stokes equations. In the description, the flow starts from rest under a smooth force, develops a finite-time singularity, and retains finite energy. OpenAI presents that as an analytical proof of finite-time blowup under the conditions stated in its paper.

The [full paper](https://cdn.openai.com/pdf/32d9f210-8b73-45e0-91bc-82a30aef8a9a/navier-stokes.pdf) is titled *Finite Time Blowup for Navier-Stokes*. Its abstract says that, for every positive viscosity, the authors construct a solution on three-dimensional space with smooth compactly supported forcing. The solution has bounded kinetic energy while the velocity becomes unbounded as time approaches a finite endpoint. The paper then explains the implication for the whole-space and periodic formulations.

Those are strong and specific statements, but in this article they remain statements attributed to OpenAI and its published artifacts. I have not independently checked every line of the proof or rebuilt the formalization. A public PDF and repository make a claim easier to audit; they are not the same thing as an independent mathematical review.

## What alternatives C and D mean

The Clay problem statement contains several alternatives concerning global existence, smoothness, and breakdown. OpenAI says its paper and Lean formalization establish C and D, the breakdown alternatives.

| Alternative | Setting | Reported claim |
| --- | --- | --- |
| C | Whole space, R3 | With smooth initial data and a smooth force satisfying the stated conditions, there is no global smooth solution with uniformly bounded kinetic energy |
| D | Periodic torus, R3/Z3 | With smooth periodic initial data and force, there is no global smooth solution |

The exact hypotheses are part of the problem. The [Clay problem statement](https://www.claymath.org/wp-content/uploads/2022/06/navierstokes.pdf) describes the data, decay or periodicity conditions, regularity, and energy requirements. The public [OpenAI Lean repository](https://github.com/openai/NavierStokesAndEuler) describes its formalizations of the Navier-Stokes and Euler results and labels the two Navier-Stokes alternatives as C and D.

This is why a headline such as "AI solved Navier-Stokes" is too broad for a careful account. The reported result concerns particular mathematical statements in a particular formulation. It does not mean that every question about turbulence, numerical simulation, boundary layers, physical fluids, or the wider research program has disappeared.

## A singularity result is not a claim about every fluid

The equations are mathematical models. A proof of finite-time breakdown under specified data would answer an important existence question, but it would not make every physical flow predictable. Real fluids involve measurement uncertainty, constitutive assumptions, boundaries, forcing, and numerical approximation. Those issues can remain difficult even when a theorem settles one alternative in the idealized equations.

There is also a difference between an informal demonstration and the reported construction. A simulation can show a plausible vortex for a finite time. The Clay alternatives ask for precise statements about smoothness, bounded energy, the domain, the force, and what happens at the endpoint. A serious review has to trace those conditions through the paper and the formal code.

## What is public and what is not

| Question | What I could verify from the public material |
| --- | --- |
| Is there a public announcement? | Yes. OpenAI published its report on September 8, 2026 |
| Is there a paper? | Yes. OpenAI links a paper describing the reported construction |
| Is there a formalization? | Yes. OpenAI links a public Lean repository with build instructions |
| What is the internal model called? | The report does not provide a public model identifier for the system credited with finding the proof |
| What did GPT-6 Astra do? | OpenAI says Astra helped with the later Lean formalization and verification |
| Has Clay accepted the result? | I did not find an acceptance or prize announcement in the official Clay materials I checked |
| Has the wider community accepted the proof? | The sources above do not establish that |

The last two rows are deliberately narrow. Not finding an announcement in the pages I checked is not proof that no discussion or later decision exists elsewhere. It is enough to keep the article from presenting acceptance as a fact.

## How OpenAI describes the process

OpenAI says the effort began on August 28 and accelerated after a rumor on September 1. Its account describes a coordination system that assigned many agents to try both proof and disproof routes. OpenAI reports an order of 10,000 concurrent agents for the Navier-Stokes effort, a resolution on September 5 after about 88 hours, and another 17 hours for Lean formalization and verification with GPT-6 Astra.

The same report gives scale figures for the broader set of problems: 4.9 million messages and about 300 billion output tokens. For the Navier-Stokes effort, it reports 2.7 million messages and approximately 130 billion output tokens.

These figures describe the computational process OpenAI says it ran. They do not measure the truth of the theorem, the quality of the proof, or the completeness of the formalization. More agents and more generated text can help search a large space, but the final mathematical object still has to satisfy the statement being claimed.

## The role of GPT-6 Astra

OpenAI distinguishes the internal discovery system from GPT-6 Astra. The report says the internal model was significantly more capable than Astra and credits Astra with helping verify the Lean formalization. I therefore would not write that GPT-6 Astra found the Navier-Stokes proof, and I would not imply that the internal system is available through a public API.

That distinction is relevant to both the science and the product story. A model helping to formalize or check a result can be doing a different job from a system that searches for the construction. The public report does not give enough detail to reconstruct the internal model, its training, its prompts, or its complete tool environment.

## What a serious review would check

The repository makes the next steps unusually concrete:

1. Build the public project with the Lean version, Mathlib revision, and Lake instructions pinned by the repository.
2. Read the formal theorem statements instead of inferring them from names or a news summary.
3. Compare the definitions of solution, force, initial data, regularity, and energy with the corresponding Clay formulation.
4. Follow the construction to the finite-time endpoint and check that the claimed unbounded quantity and bounded-energy condition are the ones required.
5. Check the passage from the whole-space result to the periodic result and the exact role of each hypothesis.
6. Have independent mathematicians and formal-methods researchers inspect both the informal exposition and the formal code.

At the time of writing, the repository's README specifies Lean 4.34.0-rc2, Mathlib, and Lake. Its documented build path includes \`lake exe cache get\` followed by \`lake build\`. I am not claiming that I independently built the repository here. Those commands are the repository's current starting point for a reviewer, and they should be checked against the README before use.

## Why I do not write "officially solved"

The [Clay Mathematics Institute's Navier-Stokes page](https://www.claymath.org/millennium/navier-stokes-equation/) explains the problem and its long-standing existence and smoothness question. The [Clay rules](https://www.claymath.org/millennium-problems/rules/) say that before CMI considers a proposed solution, it must satisfy three conditions: publication in a qualifying outlet, at least two years since publication, and general acceptance in the global mathematical community.

OpenAI also says in its report that it does not intend to claim the Millennium Prize. That is consistent with keeping three labels separate:

- **Reported proof:** what OpenAI says its paper and artifacts establish.
- **Formalized proof:** what the public Lean project claims to encode and check.
- **Officially recognized solution:** a status that depends on the process and acceptance requirements set out by Clay.

A result can be important, public, and worth serious technical attention without having reached the third label.

## Questions readers are asking

### Did GPT-6 Astra solve Navier-Stokes?

That is not what OpenAI's report says. OpenAI attributes the discovery to an internal system and describes GPT-6 Astra as helping with Lean formalization and verification.

### Does a Lean formalization settle the question?

It can provide a powerful check of a precisely written proof relative to the definitions, axioms, and libraries used by the formal system. Reviewers still need to establish that the formal statement matches the intended Clay alternative and that the informal interpretation does not overstate what the code proves.

### What did OpenAI actually claim?

OpenAI reports a finite-time breakdown construction for the C and D alternatives in the Clay formulation. The paper describes smooth forcing and data, a finite-time unbounded velocity, and bounded kinetic energy under its stated setup.

### Has Clay accepted it?

I did not find an official acceptance or prize announcement in the Clay materials I checked on September 12, 2026. I am not treating that limited source check as a final statement about every later development. I am using it to avoid claiming acceptance without evidence.

### Is this about a public model I can try?

No public model identifier is supplied for the internal system credited with finding the result. GPT-6 Astra is discussed as a separate model used for later formalization work, and the report does not turn the internal research system into a public API product.

## Bottom line

OpenAI has reported a specific Navier-Stokes result, published a paper, and released a Lean repository for the C and D alternatives. That is substantial public material and deserves careful independent examination.

My wording stays narrower than the headline: this is a reported proof and a public formalization, not a claim that Clay has officially accepted or awarded the Millennium Prize. Until the definitions, proof, formal code, publication path, and community review line up, precision is more useful than a victory lap.
`,
    tags: [
      { tag: "mathematics" },
      { tag: "AI research" },
      { tag: "source notes" },
    ],
    publishedAt: "2026-09-09T08:00:00.000Z",
    updatedAt: rewriteTimestamp,
    createdAt: timestamp,
    _status: "published",
  },
  {
    id: -1003,
    title: "How to set up Ollama and use it with Claude Code",
    slug: "set-up-ollama-with-claude-code",
    excerpt:
      "A practical, version-aware tutorial for installing Ollama, choosing a local model, connecting Claude Code through Ollama's Anthropic-compatible endpoint, testing the path safely, and troubleshooting the common failures.",
    cover: editorialCover(-2003, "/images/blog/ollama-claude-code.svg", "Editorial diagram showing a local Ollama model connected to a Claude Code terminal workflow."),
    content: `## What this setup gives you

This setup puts Ollama behind Claude Code's normal coding interface. Ollama runs the model you select, Claude Code manages the project session and permissions, and Ollama's Anthropic-compatible endpoint connects the two. It does not turn a local Ollama model into Anthropic-hosted Claude.

I checked the current [Ollama Anthropic compatibility documentation](https://docs.ollama.com/api/anthropic-compatibility), [Ollama launch guide](https://ollama.com/blog/launch), and [Claude Code quickstart](https://code.claude.com/docs/en/quickstart) on September 12, 2026. Commands, model names, and supported features can change, so keep those pages open while following this guide.

> **Key takeaways**
>
> - ollama launch claude is the shortest current path when your Ollama release includes the launcher.
> - The manual path uses ANTHROPIC_AUTH_TOKEN=ollama and ANTHROPIC_BASE_URL=http://localhost:11434.
> - The local API is normally at http://localhost:11434. The /api/generate request tests Ollama itself; /v1/messages tests the compatibility layer Claude Code uses.
> - A model with a :cloud tag is hosted by Ollama. It is not running entirely on the local machine.
> - A successful connection proves the route works, not that every Claude Code feature has parity with an Anthropic-hosted session.

## Before you install

You need a supported macOS, Windows, or Linux computer, a terminal, and a project that is safe to inspect. I recommend starting with a disposable repository or a clean branch. Use a read-only prompt first, and keep production credentials out of the test.

There are two separate privacy decisions:

1. A model such as qwen3-coder is downloaded and run by Ollama on your computer, subject to your machine's logs and configuration.
2. A model with a cloud tag, such as glm-4.7:cloud, sends the work to Ollama's hosted service. It may be easier to run, but it is not an offline setup.

Claude Code's normal hosted workflow may ask you to sign in. That authentication path is separate from the placeholder token used by Ollama's local compatibility endpoint. Do not assume that seeing a Claude login prompt proves that your local route is active.

For model sizing, leave room for the model weights, the context window, the operating system, and other applications. Ollama's current compatibility guide recommends coding models including glm-4.7, minimax-m2.1, and qwen3-coder. It notes that qwen3-coder is a 30B model that runs smoothly with at least 24 GB of VRAM, with more memory useful for longer context. Treat that as a planning note, not a guarantee for every device.

## 1. Install Ollama

### macOS

Download the current app from [ollama.com/download](https://ollama.com/download). The current download page requires macOS 14 Sonoma or newer. Open Ollama once after installation so its local service can start.

### Windows

Download and run [OllamaSetup.exe](https://ollama.com/download/windows). Ollama's Windows documentation says the installer does not require administrator rights and exposes the local API at http://localhost:11434. The current documentation also lists Windows 10 22H2 or newer as the baseline.

Ollama stores its Windows configuration and logs under %LOCALAPPDATA%/Ollama; the model directory is under %HOMEPATH%/.ollama unless you configure OLLAMA_MODELS. Models can take tens or hundreds of gigabytes, so check the disk before pulling a large one. Do not move the installation or model directory until the basic setup works.

### Linux

Follow the current [Ollama Linux instructions](https://docs.ollama.com/linux). The maintained installer command is:

    curl -fsSL https://ollama.com/install.sh | sh

If the service is not already running, start it in a separate terminal:

    ollama serve

Verify the CLI from a new terminal:

    ollama --version

ollama -v is also accepted by the current documentation. If the command is not found after installation, open a new terminal and check your PATH before reinstalling.

The Ollama app is also useful for seeing which model is loaded and for adjusting settings. This is a real screenshot from Ollama's official app article, stored locally with this post rather than hotlinked:

![Official Ollama app showing model download and chat controls](/images/blog/ollama-app-screenshot.png)

Source: [Ollama's new app article](https://ollama.com/blog/new-app).

## 2. Pull and test a model

Start with the coding model used in Ollama's current compatibility examples:

    ollama pull qwen3-coder

Confirm the exact model identifier:

    ollama list

Then open a direct Ollama chat:

    ollama run qwen3-coder

At the prompt, enter:

    Reply with exactly: Ollama is running.

Exit with /bye or Ctrl+C, depending on the interface you are using. If the model is still loading, the first response can take longer than later responses.

The model name is part of the connection. If you choose another model, copy its exact identifier from ollama list and reuse that identifier in the API tests and the Claude Code command. The current compatibility documentation also lists local options such as gpt-oss:20b and cloud options such as glm-4.7:cloud. A cloud suffix is a routing decision, not a performance setting: the work goes to Ollama's cloud service.

If you want broader model tradeoffs before selecting a hosted model, I keep the evidence and uncertainty separate in [my GPT-6 vs Fable 5.1 comparison](/blog/gpt-6-astra-vs-fable-5-1). That comparison is about different hosted model surfaces, while this tutorial is about the Ollama route and its compatibility boundary.

## 3. Test both API boundaries

Testing the APIs separately saves time. First prove that Ollama can serve the model. Then prove that the Anthropic-compatible endpoint can translate a Messages API request. Only after both work should you debug Claude Code.

### Test Ollama directly

On macOS, Linux, or WSL:

    curl http://localhost:11434/api/generate -d '{"model":"qwen3-coder","prompt":"Reply with exactly: API is running.","stream":false}'

On Windows PowerShell:

    $body = @{ model = "qwen3-coder"; prompt = "Reply with exactly: API is running."; stream = $false } | ConvertTo-Json
    (Invoke-WebRequest -Method Post -Uri http://localhost:11434/api/generate -Body $body -ContentType "application/json").Content

A JSON response with generated text confirms that the service is listening and that Ollama recognizes the model. It does not test the endpoint used by Claude Code.

### Test the Anthropic-compatible endpoint

Ollama documents the following request shape for /v1/messages. On macOS, Linux, or WSL:

    curl -X POST http://localhost:11434/v1/messages -H "Content-Type: application/json" -H "x-api-key: ollama" -H "anthropic-version: 2023-06-01" -d '{"model":"qwen3-coder","max_tokens":128,"messages":[{"role":"user","content":"Reply with exactly: Anthropic endpoint is running."}]}'

In PowerShell:

    $headers = @{
      "Content-Type" = "application/json"
      "x-api-key" = "ollama"
      "anthropic-version" = "2023-06-01"
    }
    $body = @{
      model = "qwen3-coder"
      max_tokens = 128
      messages = @(
        @{
          role = "user"
          content = "Reply with exactly: Anthropic endpoint is running."
        }
      )
    } | ConvertTo-Json -Depth 4
    (Invoke-WebRequest -Method Post -Uri http://localhost:11434/v1/messages -Headers $headers -Body $body).Content

The x-api-key value is ollama because the compatibility layer requires an API key-shaped header. Ollama says that this value is required but ignored. The anthropic-version header is accepted but not used for compatibility behavior.

If /api/generate works and /v1/messages fails, the model runtime is healthy but the compatibility path is not. Check the Ollama version, the model identifier, the URL, and the request shape before changing Claude Code settings.

## 4. Set a sensible context length

A coding model needs memory for its weights, the active context, tool results, and the operating system. Ollama's app exposes a context-length setting. Ollama's launch guide recommends at least 64,000 tokens for coding tools, but that is a starting point for machines with enough memory, not a universal requirement.

Increase the context only when the machine can sustain it. If the process swaps, becomes unresponsive, or loses the useful beginning of a task, lower the context length or choose a smaller model. A larger context limit does not guarantee that the model will retrieve or reason over every part of a large repository equally well.

Here is the second official Ollama screenshot, also stored locally:

![Official Ollama context length setting](/images/blog/ollama-context-length.png)

Source: [Ollama's new app article](https://ollama.com/blog/new-app).

## 5. Install Claude Code

Install Claude Code from its current official quickstart. On macOS, Linux, or WSL:

    curl -fsSL https://claude.ai/install.sh | bash

On Windows PowerShell:

    irm https://claude.ai/install.ps1 | iex

The same [Claude Code quickstart](https://code.claude.com/docs/en/quickstart) lists Homebrew, WinGet, and the Windows CMD installer when those options fit your environment. Open a new terminal and verify the command:

    claude --version

On native Windows, Claude Code recommends [Git for Windows](https://git-scm.com/downloads/win) because Claude Code can use Unix-like tools. If Git for Windows is not installed, Claude Code can use PowerShell, but some project scripts and shell examples may behave differently. WSL does not need Git for Windows inside the WSL environment.

At this stage you have installed two independent CLIs. ollama --version checks Ollama, and claude --version checks Claude Code. Neither command proves that Claude Code is using Ollama yet.

## 6. Use Ollama's one-command launcher

The current Ollama launch guide says to use the launcher with Ollama v0.15 or newer:

    ollama launch claude

The launcher sets up the connection and starts Claude Code. Depending on the current Ollama interface, it may ask you to choose a model or tool. Follow that selection step and choose the model you pulled, such as qwen3-coder.

To configure the connection without launching a session:

    ollama launch claude --config

Use the launcher route first when it is available. If ollama launch claude is not recognized, update Ollama from the [official download page](https://ollama.com/download) or use the manual environment setup below. Do not add unverified flags to force a noninteractive session; the manual path gives you explicit control over the model, endpoint, and prompt.

## 7. Configure the connection manually

The manual route uses the same compatibility layer as the launcher. Set the variables in the same terminal that will start Claude Code.

### macOS, Linux, or WSL

For a session-scoped setup:

    export ANTHROPIC_AUTH_TOKEN=ollama
    export ANTHROPIC_API_KEY=
    export ANTHROPIC_BASE_URL=http://localhost:11434
    claude --model qwen3-coder

For a one-off launch:

    ANTHROPIC_AUTH_TOKEN=ollama ANTHROPIC_API_KEY= ANTHROPIC_BASE_URL=http://localhost:11434 claude --model qwen3-coder

### Windows PowerShell

PowerShell environment variables apply to the current window:

    $env:ANTHROPIC_AUTH_TOKEN = "ollama"
    $env:ANTHROPIC_API_KEY = ""
    $env:ANTHROPIC_BASE_URL = "http://localhost:11434"
    claude --model qwen3-coder

Clearing ANTHROPIC_API_KEY is a practical guard against Claude Code choosing a different provider credential during this test. The ollama token is not a real Anthropic secret for this route; Ollama's compatibility layer requires the field and ignores its value.

Do not commit these variables to a project file. When the test is over, close the terminal or remove the session variables:

    unset ANTHROPIC_AUTH_TOKEN ANTHROPIC_API_KEY ANTHROPIC_BASE_URL

In PowerShell:

    Remove-Item Env:ANTHROPIC_AUTH_TOKEN,Env:ANTHROPIC_API_KEY,Env:ANTHROPIC_BASE_URL -ErrorAction SilentlyContinue

If Claude Code still uses a hosted provider, inspect the environment in the same terminal that launches it:

    Get-ChildItem Env:ANTHROPIC*

A stale user-level or shell-level ANTHROPIC_API_KEY can make a local test look like it failed when the request never reached Ollama.

## 8. Test Claude Code safely

Start in a clean test repository. With the manual variables active, make the first request read-only:

    Read package.json and summarize the available scripts. Do not edit files or run destructive commands.

You can launch an interactive session with claude, or use the documented one-off form:

    claude -p "Read package.json and summarize the scripts. Do not edit files."

Check the route in layers:

1. ollama list shows the model you intended to use.
2. The direct /api/generate request returns a response.
3. The /v1/messages request returns a Messages-style response.
4. Claude Code can read the project and answer without switching to a hosted provider.
5. The model identifies the right files and follows the read-only constraint.

Only after those checks should you try a write. Ask for one small documentation change in a disposable branch, review the diff, and run the project's existing formatter or tests. Claude Code's permission prompts still matter: a local model can propose a bad command just as a hosted model can, and a successful tool call does not prove that the chosen edit was correct.

The quality of this workflow depends on more than the network route. Smaller local models can be slower, less reliable with long instructions, or less capable with tool calling than the model you normally use. Keep the first test narrow enough that you can tell whether the problem is transport, compatibility, permissions, or model behavior.

## 9. Know what compatibility does and does not mean

Ollama's current Anthropic compatibility documentation lists support for messages, streaming, system prompts, multi-turn conversations, vision, tools or function calling, tool results, and thinking or extended thinking. That is enough to make a Claude Code experiment practical, but it is not a promise of identical behavior for every feature.

The same documentation lists important differences and unsupported surfaces:

- /v1/messages/count_tokens is not supported.
- Forcing a specific tool or disabling tools through tool_choice is not supported.
- Metadata, prompt-caching cache_control blocks, the batches API, citations content blocks, and PDF document blocks are not supported.
- Token counts are approximate.
- URL images are unsupported in the compatibility layer, while base64 images are supported.
- Extended-thinking budgets are not enforced.
- Errors are returned as HTTP errors rather than server-sent error events.

The API key-shaped value is accepted but ignored, and the anthropic-version header is accepted but not used. This is why a request can look authenticated without having Anthropic account semantics. Claude Code features that depend on an unsupported field may fail or behave differently through Ollama even when a simple prompt works.

## Common issues

### Connection refused at port 11434

Start the Ollama app, or run ollama serve in a separate terminal. Confirm that the base URL is exactly http://localhost:11434 and that the process launching Claude Code can reach that address.

### Model not found

Run ollama list and copy the identifier exactly. Pull it with ollama pull <model>, then use the same identifier in the direct API request and in claude --model <model>. A tag such as :cloud is part of the identifier and changes where the model runs.

### The first response is very slow or memory runs out

The model may be loading into RAM or VRAM, or the context length may be too high. Try a smaller model, lower the context, close other GPU-heavy applications, or use an Ollama cloud model if sending the work off-device is acceptable. The compatibility guide specifically calls out the memory demands of qwen3-coder 30B.

### Claude Code uses the wrong provider

Set ANTHROPIC_AUTH_TOKEN, clear ANTHROPIC_API_KEY, and set ANTHROPIC_BASE_URL in the same terminal that starts Claude Code. In PowerShell, $env: values belong to the current window. In a shell, print the variables before starting the session if the route is unclear.

### Ollama and Claude Code run in different environments

If Ollama runs on native Windows while Claude Code runs in WSL, test the base URL from the WSL shell that will launch claude. A URL that works in PowerShell is not useful if the WSL process cannot reach it. Resolve that boundary first, then set the provider variables inside the same environment.

### The launcher is unavailable

ollama launch requires a current Ollama release. Update from the official download page, or use the manual environment setup. The manual path is not a separate backend; it still sends Claude Messages-shaped requests to Ollama's compatibility endpoint.

### A Claude feature behaves differently

Check the compatibility list before changing prompts. Tool choice, metadata, caching, batches, citations, PDFs, token counting, image URLs, thinking budgets, and error events can all differ from an Anthropic-hosted session. A feature gap is not necessarily a model failure.

### The installer completed but the command is missing

Open a new terminal and run ollama --version or claude --version. On Windows, check that the installed CLI directory is on PATH and review Ollama's logs under %LOCALAPPDATA%/Ollama if the app is running but the service is not reachable. On macOS or Linux, use the current official install troubleshooting page rather than copying an old PATH fix.

### The local route works but the result is poor

That is a model or context problem, not necessarily a connection problem. Re-test with a small prompt, check the exact model tag, lower the context length, and compare the result on a representative task. Do not conclude that Claude Code is broken because a local model makes a different coding decision.

## Reset the test

When you are finished, exit Claude Code with /exit or close the session. Remove the temporary environment variables from Bash, WSL, or PowerShell, then close Ollama if you do not need it running. Keeping the variables session-scoped is safer than adding them permanently before you know that the route is useful.

If you used ollama launch claude --config, inspect the generated configuration before relying on it for another project. Confirm the selected model, base URL, and any provider settings. A configuration file can outlive the terminal variables, so check it when a later session unexpectedly uses the local route.

## Checklist

    [ ] Ollama is installed and the local service is running
    [ ] The chosen model appears in ollama list
    [ ] /api/generate returns a response
    [ ] /v1/messages returns a Messages-style response
    [ ] Claude Code is installed and claude --version works
    [ ] ANTHROPIC_BASE_URL points to http://localhost:11434
    [ ] ANTHROPIC_API_KEY is empty for the local test
    [ ] The first Claude Code prompt is read-only
    [ ] I reviewed the route before giving the model a write action

## FAQ

### Does this run Claude locally?

No. It runs Claude Code as the client and Ollama as the model endpoint. If the selected model is a normal local tag, Ollama runs that model on your computer. If the model has a cloud tag, Ollama sends the inference to its hosted service. Neither path is the same as running Anthropic-hosted Claude locally.

### Do I need a Claude account?

The ordinary Claude Code setup has its own authentication requirements. The local Ollama compatibility path uses the placeholder token ollama because Ollama requires an API-key-shaped value and ignores it. Keep the two setups conceptually separate, and follow the current Claude Code documentation if the CLI asks for a hosted login.

### Can I use any Ollama model?

Use a model that Ollama documents as compatible with the Anthropic Messages API and that fits your hardware. A model can answer a normal Ollama chat while still being a poor fit for Claude Code's tool calls, context size, or instruction format. Start with a documented coding model and change one variable at a time.

### How can I tell which route Claude Code is using?

Check the environment in the same shell, confirm the base URL, test /v1/messages directly, and watch the Ollama process or logs while a short Claude Code prompt runs. A successful Claude Code response by itself is not enough evidence because Claude Code can be configured for another provider.

### Is a cloud-tagged model private?

Not in the same sense as a local model. A cloud tag means inference is performed by Ollama's hosted service. Read the current service terms and decide whether the source, prompts, and tool results are appropriate before using that route.

## Bottom line

The setup has three parts: Ollama owns the model runtime, the Anthropic compatibility layer translates the request, and Claude Code owns the project session and permissions. Verify those boundaries in order, keep the first prompt read-only, and treat model quality and feature support as separate from connectivity.

Once the path is working, test it on the kind of repository work you actually care about. That tells you whether Ollama and Claude Code are useful together, instead of making a successful hello-world request carry more meaning than it deserves.
`,
    tags: [
      { tag: "Ollama" },
      { tag: "Claude Code" },
      { tag: "tutorial" },
    ],
    publishedAt: "2026-09-08T12:00:00.000Z",
    updatedAt: rewriteTimestamp,
    createdAt: timestamp,
    _status: "published",
  },
];




