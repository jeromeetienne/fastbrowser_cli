---
description: Outline for an article on why AI browser agents should use the accessibility tree, with a CSS-like selector language as the interaction layer.
---

## Meta

- **Title:** Accessibility Trees for AI Browsing
- **Audience:** Developers building AI browser agents. Assumes comfort with JavaScript and CSS selectors. Does not assume prior accessibility expertise.
- **Length:** ~1200 words
- **Tone:** Technical, opinionated, first-person OK. Concrete over abstract.
- **Status:** outline

## Thesis

The accessibility tree — not the DOM, not screenshots — is the right substrate for AI agents that browse the web. A CSS-like selector language over that tree gives agents a cheap, robust, and LLM-legible way to act on a page.

## Article Structure

### Introduction
- One-paragraph hook: an AI agent looking at a webpage has three options — raw HTML, a screenshot, or the accessibility tree. Frame the article as why the third wins.
- What the accessibility tree actually is: a hierarchical, semantic view of the page (role, name, attributes) that browsers already build for assistive tech.
- Where it comes from in practice:
  - Chrome DevTools — link to the Accessibility pane docs
  - Playwright / Puppeteer — link to their accessibility snapshot APIs
  - Playwright [Accessibility Testing](https://playwright.dev/docs/accessibility-testing) — uses `@axe-core/playwright` to scan for WCAG issues; shows how the a11y tree is already a first-class testing surface in mainstream tooling.
  - Note: this is not something we invented; we're repurposing infrastructure that's been there for years.

### Why the DOM and Screenshots Both Fall Short
- **DOM/HTML:** noisy, deeply nested, full of layout divs and class soup that changes every deploy. Expensive in tokens, brittle as a grounding signal.
- **Screenshots / vision-only agents:** no structure, click coordinates that break on resize, costly per call, hard to verify what the agent "saw."
- **Accessibility tree:** pre-pruned, semantic, stable across visual redesigns. Roles and names are written for humans (well, for screen-reader users), which is exactly what an LLM is good at reading.

### Why It Matters for AI Agents
- **Token economy.** A typical a11y snapshot is a fraction of the raw HTML. Smaller context = cheaper calls + better recall.
- **Stable grounding.** A button is a `button` with a name; it doesn't matter that its class changed from `btn-primary-v2` to `cta-2025`.
- **LLM-legible.** Roles (`button`, `link`, `heading`) and names ("Submit", "Sign in") are natural-language anchors. The model already knows what they mean.
- **Verifiable.** You can log exactly which node the agent acted on. With pixel-coord clicks, you can't.

### A Selector Language Over the Tree
- Why a *selector language* at all: agents need to point at things. Free-form "click the blue button on the right" is unreliable; a selector is a contract.
- Why CSS-shaped: developers already know it, LLMs have seen millions of examples of it, tooling exists. Don't invent syntax when you don't have to.
- Prior art worth citing: Playwright [Locators](https://playwright.dev/docs/locators) — `getByRole`, `getByLabel`, `getByText`, `getByAltText` are effectively a (non-CSS) selector API over the accessibility tree. Same intuition: select by role + accessible name, not by class soup. Our contribution is putting a *CSS-shaped* surface on top of the same idea so it composes the way developers already think.
- What's different from real CSS: we select on `role`, `name`, and ARIA attributes — not tags, classes, or IDs. Show the same target two ways:
  - DOM/CSS: `div.header > nav > ul > li:nth-child(3) > a.nav-link--external`
  - a11y selector: `navigation link[href^="https"]`
- Honest limits: no `:hover`, no computed styles, no pseudo-elements. The tree doesn't carry that information, and that's fine — agents don't need it.

### Concrete Example
- Walk through the `fastbrowser_cli take_snapshot | a11y_parse …` pipeline from the README.
- Show `A11yTree.parse` + `A11yQuery.querySelectorAll` on a small inlined snapshot.
- One realistic agent task ("find all external links in the nav") solved in two or three lines.

### Conclusion / Takeaways
- For AI agents, the substrate matters as much as the model. The accessibility tree is the cheapest and most stable substrate available today.
- A CSS-shaped selector language is the lowest-friction way to let agents act on it.
- Pointers to `a11y_parse` and `fastbrowser_cli` for readers who want to try it.

## What to Avoid
- Don't rehash WAI-ARIA history or list every ARIA role.
- Don't turn this into a Selenium/Puppeteer comparison — the focus is AI agents, not test automation.
- Don't claim the a11y tree is perfect. It has gaps (custom components with bad ARIA, dynamic content). Acknowledge briefly, move on.
- No marketing voice. No "revolutionize," no "unlock," no "in today's fast-paced world."
