# Use the Agent Once, Run the Script Forever

Every time you let an AI agent solve the same problem twice, you're paying twice. There's a better pattern: use the agent to write the recipe, then throw the agent away.

This post is about a small workflow built on SKILL.md files that turns one-off agent runs into reusable shell scripts. The script is the artifact. The agent is just how you got there.

## What's a SKILL.md?

A SKILL.md is a Markdown file that gives an agent a *skill* — a bounded chunk of knowledge plus the shell commands it uses to act in the world. "Post to Bluesky" is a skill. "Snapshot a webpage's accessibility tree" is a skill. "Search Perplexity and filter by domain" is a skill.

The important detail: skills don't reach into APIs through magic. They shell out. Every action a skill takes is a CLI call you could have typed yourself. That's not an implementation detail — it's the whole point. It means the agent's work is, by construction, already a sequence of shell commands.

If you want to see real ones, [skillmd_collection](https://github.com/jeromeetienne/skillmd_collection) has a handful: `fastbrowser_cli` for browser automation, `a11y_parse` for accessibility-tree queries, `bsky_client` for Bluesky, `perplexity_cli` for web search.

## The pattern: agent first, script second

There are three steps, and the third is where the leverage lives.

**Step 1 — Agent run.** You describe a task in plain English: *"Scrape this competitor's pricing page and email me the diff weekly."* The agent picks the relevant skills, figures out the right sequence of CLI calls, runs them, and you watch the output. You iterate until it's right.

**Step 2 — Extraction.** You ask the agent: *"Give me a standalone shell script that does exactly what you just did."* This is the cheap part — every step was already a shell command, so you're asking for transcription, not code generation.

**Step 3 — Replay.** From now on, the script is the recipe. You don't need the agent anymore. You don't need an API key, a network connection to a model provider, or 30 seconds of LLM round-trips. You run bash.

The mental model: **agent = compiler, script = binary.** You compile once. You execute forever.

## A different cost curve

The first run, with the agent, is the expensive one. LLM round-trips per step. Token bills. A small amount of variance, because the agent might pick a slightly different path on a different day.

Every run after that is local shell. No API call. No tokens. No variance. Same input, same output, every time.

For a workflow that runs daily, you pay for the agent's reasoning *once*. The other 364 runs are free. That math gets attractive fast.

## What you actually get out of the script

**Reproducibility.** No more "it worked when the agent did it on Tuesday." The recipe is frozen, in a file, on disk.

**Auditability.** A shell script is a plain, reviewable artifact. You can `diff` it. You can commit it. You can code-review it on a pull request. You cannot code-review an agent's reasoning.

**Automation-friendly.** Drops straight into cron, systemd timers, CI/CD, Makefiles, GitHub Actions — all the places where "wait for the agent to think" isn't an option.

**Offline / air-gapped.** No outbound LLM call. Matters for restricted environments, regulated industries, or just running on a laptop on a plane.

## A concrete example

I asked an agent to post a message to my X account. It picked the `fastbrowser_cli` skill, opened x.com, clicked the composer, typed the message, and hit post. Four CLI calls. I asked for the script. Here it is, slightly trimmed:

```bash
#!/usr/bin/env bash
set -euo pipefail
MESSAGE="${1:?usage: $0 \"message\"}"

npx fastbrowser_cli new_page --url https://x.com/home
npx fastbrowser_cli click     -s 'link[name="Post"]'
npx fastbrowser_cli fill_form -s 'dialog textbox' -v "$MESSAGE"
npx fastbrowser_cli click     -s 'dialog button[name="Post"]'
npx fastbrowser_cli close_page --page-id 0
```

Twelve lines of bash. Boring on purpose — that's the whole point. It now lives in a repo, runs from a Makefile target, and never bothers an LLM again.

The same shape applies to scraping a pricing page, posting a daily digest to Bluesky, pulling metrics and charting them, or any other "fetch / transform / publish" loop you've been quietly paying an agent to redo every morning.

## When to keep the agent in the loop

Be honest about which workflows actually need judgment on every run. Writing replies, triaging incidents, reviewing code — those need the agent. Don't extract them.

Workflows that *look* dynamic but actually follow a fixed shape are where extraction wins. Most "scrape / fetch / transform / post" pipelines are in this bucket, even when they feel bespoke the first time.

The honest test: *if I gave this task to a junior engineer with a checklist, would the checklist be the same every week?* If yes, extract.

One caveat for the determinism claim: the script is deterministic, but the world it runs against — websites, APIs, third-party services — isn't. Selectors break, sites redesign. That's a maintenance problem, not an argument against the pattern. When the script breaks, you bring the agent back for one run, regenerate, and you're done.

## Closing thought

The unlock isn't smarter agents. It's recognizing that **most agent runs are recipes in disguise** — and recipes belong in a file you can read, diff, and run without anyone's permission.

If you've already extracted a workflow out of agent-land, I'd love to see it. The repo is [here](https://github.com/jeromeetienne/skillmd_collection); the `examples/` folders are the ones I've kept.
