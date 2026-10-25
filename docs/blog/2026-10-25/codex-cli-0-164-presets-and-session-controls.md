---
title: "Codex CLI 0.164: Presets and Better Session Controls"
description: "What Codex CLI 0.164 changes, where presets help, and how to check session recovery, model settings, and permissions before adopting it."
date: "2026-10-25"
author: "Laurent Maxhuni"
slug: "codex-cli-0-164-presets-and-session-controls"
tags: ["Codex", "AI", "Developer Tools"]
coverAlt: "Monochrome editorial cover showing reusable Codex prompts and session controls."
---

Codex CLI 0.164.0 arrived on October 23 with reusable prompt presets and quicker access to session settings. The useful question for a developer is whether those controls make a repeated task easier to describe and easier to resume. I would start there, before changing a team's default workflow.

This is a review of the published documentation, checked on October 25, 2026. I have not run a comparative performance test of this release.

> **Key takeaways**
>
> - Use presets for a small set of repeated instructions with clear acceptance criteria.
> - Check the active model and permissions when resuming work.
> - Test recovery on a disposable task before relying on it for a long session.

## What changed in 0.164

The [official changelog](https://learn.chatgpt.com/docs/changelog) lists ten numbered `/presets` slots for saved prompts and slash commands. It also adds inline arguments for `/model` and `/permissions`, covering model choice, reasoning effort, speed, and permission profiles. Image previews in the fullscreen transcript require a terminal with Kitty or Sixel graphics support.

The same release addresses failed compaction and session recovery. Failed compaction should no longer leave partial summaries in history; resuming now restores saved thread settings and finds compressed histories. These are release-note claims, rather than behavior I independently verified. The changelog is the source to revisit if a later patch changes them.

## A useful preset describes the result

My first preset would be a narrowly defined review request. For example:

```text
Review the current diff for correctness and regressions.
Read the surrounding code before making a finding.
For each finding, name the trigger, affected behavior, and file.
Do not edit files. If there are no actionable findings, say so.
```

That prompt gives a reviewer an output contract. It is more useful than saving a broad instruction such as “make this production ready,” which leaves the scope open every time it runs. This example is suggested prompt text, not a special Codex command or a claim that the review will find every defect.

A second candidate is a focused implementation handoff: summarize the changed behavior, name the relevant checks, and list anything still unresolved. A third is a repository orientation prompt for unfamiliar projects. I would keep the set small enough that each slot has a distinct purpose.

Presets also need maintenance. If a repository changes its package manager, test command, or deployment path, a saved prompt can preserve an obsolete instruction. Put durable repository rules in the project's instructions and use presets for the task you want done in the current session.

## Settings belong in the task record

A repeated prompt is only part of a repeatable workflow. The model, available tools, repository state, and access rules can change the result. When comparing two runs, I would record those alongside the prompt instead of assuming the preset makes the environments equivalent.

| Task | What I would record | What I would inspect afterward |
| --- | --- | --- |
| Diff review | Commit, model, review scope | Whether each finding has a reproducible trigger |
| Small bug fix | Reproduction, allowed files, checks | Whether the original failure is resolved |
| Documentation change | Audience, source version, output format | Whether commands and links still match the project |
| Long implementation | Checkpoint, unfinished work, permissions | Whether resumed work preserves the intended scope |

The [CLI reference](https://learn.chatgpt.com/docs/developer-commands) documents command-line controls, including model and sandbox selection. Check the reference for your installed version before copying flags into automation. Interactive controls and automation configuration should be reviewed separately, because a setting you choose during a terminal session is easy to overlook in a scheduled command.

## Recovery deserves a small acceptance test

For a session I expect to resume, I would create a harmless task in a temporary branch: inspect a small module, write down a proposed change, and stop before editing. After resuming, ask the agent to state the scope and next step. Then check the active settings and compare its answer with the saved task record.

This does not prove every recovery path works. It checks the part that matters for that workflow: whether the resumed session starts with the right goal and constraints. A successful reconnect alone is a weak acceptance criterion if the agent then continues with the wrong assumptions.

For longer jobs, leave human-readable checkpoints at meaningful boundaries. A short note naming the current commit, completed checks, and remaining work is useful even when the product's history recovery works as intended.

## Keep model migration separate from the CLI update

October also included a model retirement. OpenAI's [October changelog](https://learn.chatgpt.com/docs/changelog) says GPT-5.5 retired from Codex for ChatGPT-authenticated users on October 14; API-key sessions and the OpenAI API were outside that change. Avoid treating a CLI upgrade as proof that every saved model selection remains available.

My adoption sequence would be simple: install the release in one development environment, check the version, try one preset on a known task, then test resume behavior. Expand only after inspecting the outputs. Teams already comparing models can use the evaluation approach in my [GPT-6 Astra and Fable comparison](/blog/gpt-6-astra-vs-fable-5-1), while developers exploring a different execution route can read the [Ollama and Claude Code setup](/blog/set-up-ollama-with-claude-code).

The strongest reason to adopt these controls is less repeated setup and clearer task boundaries. Keep the evidence for that decision local: a task you understand, a result you can inspect, and a workflow another developer can repeat.
