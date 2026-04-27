---
description: Outline for a LinkedIn article on turning AI-driven workflows into plain shell scripts via SKILL.md, so the agent runs once and the recipe runs forever.
---

## Meta

- **Title:** Use the Agent Once, Run the Script Forever
- **Audience:** LinkedIn — engineers, tech leads, and dev-productivity folks who already use coding agents (Claude Code, Cursor, etc.) and are starting to feel the cost/latency/reliability ceiling.
- **Length:** ~900 words (LinkedIn article sweet spot)
- **Tone:** First-person, opinionated, practitioner voice. Concrete examples over theory. No marketing fluff.
- **Status:** outline

## Thesis

The most valuable artifact of an AI-assisted workflow isn't the output — it's the **shell script the agent leaves behind**. Run the agent once to discover the recipe; run the script a thousand times after that, with no API key, no latency, no variance.

## Article Structure

### Hook (the opening 2–3 lines that show in the LinkedIn preview)
- Something like: *"Every time you let an AI agent solve the same problem twice, you're paying twice. There's a better pattern: use the agent to write the recipe, then throw the agent away."*
- One line framing the rest: this post is about a small workflow built on SKILL.md files that turns one-off agent runs into reusable shell scripts.

### What's a SKILL.md?
- One-paragraph definition: a Markdown file that gives an agent a *skill* — a bounded chunk of knowledge plus the shell commands it uses to act in the world.
- Key point: skills don't talk to APIs through magic. They shell out. That's what makes the next step possible.
- Pointer (without making it a sales pitch): link to the `skillmd_collection` repo for readers who want to see real examples (`fastbrowser_cli`, `a11y_parse`, `bsky_cli`, `perplexity`).

### The pattern: agent first, script second
- **Step 1 — Agent run.** You describe a task ("scrape this site weekly," "post a digest to Bluesky," "pull metrics and chart them"). The agent picks a skill, figures out the right sequence of CLI calls, runs them, and you confirm the output is correct.
- **Step 2 — Extraction.** You ask the agent: *"Give me a standalone shell script that does exactly what you just did."* Because every step was already a shell command, this is a transcription job, not a code-generation job.
- **Step 3 — Replay.** From now on, the script is the recipe. The agent is no longer in the loop.
- One-line visual / mental model: **agent = compiler, script = binary.** You compile once, you execute forever.

### Why this is a different cost curve
- **First run (with agent):** slow (LLM round-trips per step), expensive (token cost), non-deterministic (the agent might pick a slightly different path).
- **Every run after:** local shell. No API call, no token bill, no variance. Same input → same output, every time.
- Frame it as the kind of math that gets attractive fast: a workflow that runs daily pays for the agent run *once*; the other 364 runs are free.

### What you actually get out of the script
- **Reproducibility.** No more "it worked when the agent did it on Tuesday." The recipe is frozen.
- **Auditability.** A shell script is a plain, reviewable artifact — you can `diff` it, commit it, code-review it. You can't code-review an agent's reasoning.
- **Automation-friendly.** Drops straight into cron, CI/CD, Makefiles, GitHub Actions. Places where "wait for the agent to think" isn't an option.
- **Offline / air-gapped.** No network, no API key. Matters for restricted environments, regulated industries, or just running on a laptop on a plane.

### A concrete example (keep it tight — one example, not three)
- Pick one of the skills in the repo — e.g., `bsky_cli` posting a daily digest, or `fastbrowser_cli` scraping a competitor's pricing page.
- Show in 4–5 lines: *"I asked the agent to do X. It used skill Y, which ran these three CLI calls. I then asked it for a script. Here it is — 12 lines of bash. It now runs in cron every morning at 7am."*
- Optional: a screenshot or short code block of the resulting script. Keep it boring on purpose — that's the whole point.

### When to keep the agent in the loop (intellectual honesty section)
- Workflows that genuinely need judgment on every run (writing replies, triaging incidents, reviewing code) — keep the agent.
- Workflows that *look* dynamic but actually follow a fixed shape — that's where extraction wins. Most "scrape / fetch / transform / post" pipelines fall here.
- The honest test: *"If I gave this task to a junior engineer with a checklist, would the checklist be the same every week?"* If yes, extract.

### Closing thought
- The unlock isn't smarter agents. It's recognizing that **most agent runs are recipes in disguise** — and recipes belong in a file you can read, diff, and run without permission.
- Soft CTA: link to the repo, invite people to share workflows they've already "extracted" out of agent-land.

## What to Avoid
- No "AI will replace engineers" framing. The opposite — this is engineers using AI like a tool, then putting the tool down.
- No vendor pitch. The pattern works regardless of which agent or model you use; SKILL.md is the *mechanism*, not the product.
- Don't oversell determinism. The script is deterministic; the *world it runs against* (websites, APIs) isn't. Acknowledge in one line, move on.
- No "in today's fast-paced AI landscape" / "unlock" / "revolutionize." LinkedIn is already drowning in that.
- Don't turn it into a SKILL.md tutorial. The article is about the *pattern*; tutorials live in the repo.
