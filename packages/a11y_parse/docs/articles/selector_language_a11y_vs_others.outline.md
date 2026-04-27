---
description: The purpose of this article is to compare the accessibility selector language from A11Y pass to the official CSS selectors and to the playwright selectors. We are just writing the outline of it right now, please give it a go.
---

## Meta

- **Title:** Three Selector Languages, One Page: A11y, CSS, and Playwright
- **Audience:** Developers who already use CSS selectors, and have at least seen Playwright. Comfortable with the DOM. Building scrapers, tests, or AI agents.
- **Length:** ~1500 words
- **Tone:** Technical, opinionated, first-person OK. Side-by-side examples over prose.
- **Status:** outline

## Thesis

CSS selectors, Playwright locators, and the `a11y_parse` selector language look superficially alike — they all "find a node" — but they target three different substrates (DOM, hybrid, accessibility tree) and that choice of substrate matters far more than the syntax. Pick the substrate first, then the syntax follows.

## Article Structure

### Introduction
- Three ways to point at "the Submit button":
  - CSS: `form#checkout button.btn-primary[type="submit"]`
  - Playwright: `page.getByRole('button', { name: 'Submit' })`
  - a11y: `button[name="Submit"]`
- All three "work" on the same page, but they're not interchangeable. They run against different trees, are stable under different kinds of change, and are legible to different audiences (humans, tools, LLMs).
- Frame the article: not a winner-takes-all comparison — a map of when each one is the right tool.

### What Each Language Actually Targets
- **CSS selectors** — operate on the DOM. Element tags, classes, ids, attributes, descendant/sibling structure. Standardized by W3C, implemented in every browser.
- **Playwright locators** — operate on a hybrid: the DOM under the hood, but the *recommended* locators (`getByRole`, `getByLabel`, `getByText`, `getByAltText`, `getByPlaceholder`, `getByTitle`, `getByTestId`) are computed from accessibility properties. Playwright also accepts raw CSS, XPath, and chained `.filter()` calls. So the "Playwright selector" is really a layered API, not one language.
- **a11y selector language** (`a11y_parse`) — operates on the accessibility tree only. No DOM, no styles. Selects by role, name, ARIA attributes, UID, and tree structure. CSS-shaped surface, accessibility-tree semantics.
- One diagram (or simple text table) showing: substrate → what's queryable.

### Side-by-Side: Selecting the Same Things
A handful of common tasks, three syntaxes each. Keep examples tight.

- **A button by visible label**
  - CSS: `button.cta-primary` (brittle), or `button[aria-label="Submit"]` (better but DOM-only)
  - Playwright: `page.getByRole('button', { name: 'Submit' })`
  - a11y: `button[name="Submit"]`
- **All external links**
  - CSS: `a[href^="https://"]`
  - Playwright: `page.locator('a[href^="https://"]')` *or* `getByRole('link').filter(...)` — note Playwright falls back to CSS here
  - a11y: `link[href^="https"]`
- **The third item in a nav menu**
  - CSS: `nav > ul > li:nth-child(3) > a`
  - Playwright: `page.getByRole('navigation').getByRole('link').nth(2)` (0-indexed!)
  - a11y: `navigation link:nth-child(3)` (1-indexed, like CSS)
- **A heading whose text starts with "Learn"**
  - CSS: not really possible — CSS can't match text content
  - Playwright: `page.getByRole('heading', { name: /^Learn/ })`
  - a11y: `heading[name^="Learn"]`
- Takeaway from the table: where CSS runs out (text content, semantic role), Playwright and a11y pick up. Where Playwright is verbose chained calls, a11y stays declarative.

### Where Each Language Is Strong
- **CSS** — strong when:
  - You wrote the markup, you control the classes, the page is yours.
  - You need to match on layout/structural details that aren't in the a11y tree.
  - You're styling, not scripting — that's what it was designed for.
- **Playwright locators** — strong when:
  - You're writing browser automation/tests and want auto-waiting, retries, and assertions baked in.
  - You want a recommended path (`getByRole`) that nudges you toward accessible markup.
  - You need to chain refinements: "the submit button *inside* the checkout form."
- **a11y selectors** — strong when:
  - You're consuming a snapshot, not driving a live browser (LLM agents, offline analysis, diffs).
  - You want a small, declarative, portable string — easy to log, easy to LLM-generate, easy to test.
  - You care about stability across visual redesigns.

### Where Each Language Breaks Down
- **CSS** — breaks on class soup that changes per deploy, can't match by visible text, has no notion of role or accessible name.
- **Playwright locators** — strong locators require the page to actually have good ARIA. On a poorly-marked-up page you fall back to CSS or `getByTestId`, and the "accessibility-first" promise weakens. Also: locators only exist inside a Playwright runtime; you can't pass a locator over the wire.
- **a11y selectors** — only as good as the accessibility tree. Custom components with bad ARIA, dynamic content that hasn't settled, or canvas-rendered UIs are blind spots. No `:hover`, no computed styles, no pseudo-elements.

### The Substrate Argument
- The syntactic differences are surface noise. The interesting question is *what tree are you querying?*
  - DOM: faithful, complete, noisy, unstable across redesigns.
  - Accessibility tree: pruned, semantic, stable, but lossy.
- Both Playwright's `getByRole` family and `a11y_parse` are bets that the *accessibility tree is the right substrate for finding things*, even if you eventually act on the DOM. They differ in where they make that bet:
  - Playwright bets at runtime, against a live browser, with full DOM fallback.
  - `a11y_parse` bets at the snapshot layer — once you've serialized the a11y tree, the DOM is gone.
- This makes them complements, not competitors: Playwright drives the page, `a11y_parse` queries the snapshot you took with it (or with `fastbrowser_cli`).

### A Note on LLM-Legibility
- Worth a short section because it's where a11y selectors quietly win.
- A 60-character a11y selector fits in a function-call argument; a Playwright locator chain is multi-line code; a CSS selector built from class soup is unreadable to a model and brittle to it too.
- LLMs generating selectors do better when:
  - The vocabulary is small (roles, names, a few attributes) — a11y wins.
  - The grammar is one they've seen a million times (CSS-shaped) — both CSS and a11y win, Playwright loses.
  - The target is stable across deploys (semantics, not classes) — Playwright `getByRole` and a11y win, CSS loses.
- This is why a11y_parse uses CSS *shape* (familiar) over accessibility *semantics* (stable, small vocabulary).

### Quick Decision Guide
A short flowchart-in-prose:
- Driving a live browser, writing tests? → Playwright locators, with `getByRole` first.
- Querying a snapshot, building an AI agent, doing offline analysis? → a11y selectors.
- Styling, or you control the markup and just need structural matching? → CSS.
- Mix-and-match is fine. Use Playwright to capture, a11y_parse to query, CSS only when you must.

### Conclusion / Takeaways
- Three languages, three substrates, three different stability guarantees.
- "Which selector language" is the wrong first question. "Which tree am I querying" is the right one.
- Pointers: [Playwright locators](https://playwright.dev/docs/locators), MDN CSS selectors, `a11y_parse` selector spec.

## What to Avoid
- Don't crown a winner. Each language is best at a different job.
- Don't turn this into a Playwright tutorial — assume the reader has skimmed the docs.
- Don't list every CSS pseudo-class or every ARIA role. Pick representative examples.
- Don't repeat the "why a11y trees" argument from the companion article — link to it and move on.
- No marketing voice.
