---
name: resume-json
description: >
  Convert resumes between PDF, JSON, and Markdown, and optimize them for Applicant
  Tracking Systems (ATS) using AI. Use this skill whenever the user wants to extract
  a resume from a PDF, render a resume back to PDF or Markdown, score how ATS-friendly
  a resume is, generate or answer ATS-style screening questions, or rewrite a resume
  to improve its ATS performance. Triggers on: "extract resume from PDF",
  "convert resume to PDF", "convert resume to markdown", "score my resume",
  "ATS score", "ATS review", "optimize my resume for ATS", "ATS screening questions",
  "answer ATS questions", "improve my resume", or any reference to `resumejson_cli`.
---

# resumejson_cli Skill

A CLI for converting resumes between **PDF / JSON / Markdown** and running an
**AI-powered ATS pipeline** (score → questions → answers → review → optimize).

The canonical format is a `ResumeJson` object validated by a Zod schema. Every
command reads or writes that JSON.

**Requires:** `OPENAI_API_KEY` environment variable (uses the OpenAI AI SDK,
default model `gpt-4.1`).

---

## Quick Reference

| Goal                                     | Command                                                                                              |
|------------------------------------------|------------------------------------------------------------------------------------------------------|
| Extract resume JSON from PDF             | `npx resumejson_cli from_pdf -i resume.pdf -o resume.json`                                           |
| Render resume JSON to PDF                | `npx resumejson_cli to_pdf -i resume.json -o resume.pdf`                                             |
| Render resume JSON to Markdown           | `npx resumejson_cli to_markdown -i resume.json -o resume.md`                                         |
| Extract resume JSON from Markdown        | `npx resumejson_cli from_markdown -i resume.md -o resume.json`                                       |
| Score a resume against ATS criteria      | `npx resumejson_cli ats_score -i resume.json -o ats_score.json`                                      |
| Generate an ATS review                   | `npx resumejson_cli ats_review -i resume.json -o ats_review.json`                                    |
| Generate ATS screening questions         | `npx resumejson_cli ats_question -i resume.json -o questions.json`                                   |
| Auto-answer ATS questions from resume    | `npx resumejson_cli ats_answering -i resume.json -q questions.json -o answered.questions.json`       |
| Fold answered questions into resume      | `npx resumejson_cli ats_answered -i resume.json -q answered.questions.json -o answered.resume.json`  |
| Optimize resume from an ATS review       | `npx resumejson_cli ats_optimize -i resume.json -r ats_review.json -o optimized.resume.json`         |

`-` is accepted as `<path>` for stdin/stdout.

---

## Setup

```bash
cd packages/resumejson_cli
npm install
npm run build

# Set API key
export OPENAI_API_KEY=sk-...
```

---

## Commands

All commands take `-i <input>` and `-o <output>`. AI-backed commands also print a
human-readable summary to stdout in addition to writing the JSON output file.

### Conversion: `from_pdf` / `to_pdf`

```bash
# PDF -> resume JSON (uses GPT-4.1 vision over rendered PDF pages, cached in SQLite)
npx resumejson_cli from_pdf -i ./resume.pdf -o ./resume.json

# resume JSON -> PDF (renders via Mustache HTML template + Puppeteer)
npx resumejson_cli to_pdf -i ./resume.json -o ./resume.pdf
```

### Conversion: `from_markdown` / `to_markdown`

```bash
# Markdown -> resume JSON
npx resumejson_cli from_markdown -i ./resume.md -o ./resume.json

# resume JSON -> Markdown
npx resumejson_cli to_markdown -i ./resume.json -o ./resume.md
```

### `ats_score`

Quick numerical ATS readiness evaluation — use this as a "before / after" gauge.

```bash
npx resumejson_cli ats_score -i ./resume.json -o ./ats_score.json
```

### `ats_review`

Detailed qualitative ATS review (strengths, weaknesses, suggestions). Feeds
`ats_optimize`.

```bash
npx resumejson_cli ats_review -i ./resume.json -o ./ats_review.json
```

### `ats_question` / `ats_answering` / `ats_answered`

Three-step loop that surfaces typical ATS screening questions, answers them from
the resume, then folds the answers back in to enrich the resume.

```bash
# 1. Generate the questions an ATS would ask about this resume
npx resumejson_cli ats_question  -i ./resume.json                              -o ./questions.unanswered.json

# 2. Have the AI answer them using the resume as context
npx resumejson_cli ats_answering -i ./resume.json -q ./questions.unanswered.json -o ./questions.answered.json

# 3. Merge the answers back into a richer resume JSON
npx resumejson_cli ats_answered  -i ./resume.json -q ./questions.answered.json   -o ./resume.answered.json
```

### `ats_optimize`

Rewrites the resume guided by an ATS review (typically run on the
post-`ats_answered` resume).

```bash
npx resumejson_cli ats_optimize -i ./resume.answered.json -r ./ats_review.json -o ./resume.optimized.json
```

---

## Workflow: full ATS pipeline

The recommended end-to-end pipeline, mirroring the `full_pipeline` script in
`package.json`:

```bash
# 1. ingest
npx resumejson_cli from_pdf      -i resume.pdf                                  -o resume.json

# 2. baseline score (optional, for before/after comparison)
npx resumejson_cli ats_score     -i resume.json                                 -o resume.ats_score.json

# 3. enrich with answered ATS questions
npx resumejson_cli ats_question  -i resume.json                                 -o questions.unanswered.json
npx resumejson_cli ats_answering -i resume.json -q questions.unanswered.json    -o questions.answered.json
npx resumejson_cli ats_answered  -i resume.json -q questions.answered.json      -o resume.answered.json

# 4. review and optimize
npx resumejson_cli ats_review    -i resume.answered.json                        -o resume.ats_review.json
npx resumejson_cli ats_optimize  -i resume.answered.json -r resume.ats_review.json -o resume.optimized.json

# 5. render the optimized result
npx resumejson_cli to_pdf        -i resume.optimized.json -o resume.optimized.pdf
npx resumejson_cli to_markdown   -i resume.optimized.json -o resume.optimized.md

# 6. (optional) confirm the score improved
npx resumejson_cli ats_score     -i resume.optimized.json -o resume.optimized.ats_score.json
```

When the user asks to "improve / optimize my resume for ATS", run this full pipeline
unless they ask for a single step.

---

## Output

- All commands write structured JSON (or PDF / Markdown for conversion outputs) to the path given in `-o`.
- AI-backed commands also print a human-readable pretty-printed summary to **stdout**.
- Use `-` for either `-i` or `-o` to read from stdin / write to stdout.
- The `from_pdf` PDF→images step is memoised in `.openai_cache.sqlite` next to the package, so re-running it on the same PDF is cheap.

## Error handling

- Missing `OPENAI_API_KEY` — every AI command will fail; tell the user to export it before retrying.
- Input JSON that does not match `ResumeJsonSchema` — the CLI throws a Zod validation error; surface it and ask the user to fix the offending field rather than silently retrying.
- `from_pdf` on a non-text / image-only PDF still works (it uses the vision model), but very long PDFs are slow and may need a smaller input.
