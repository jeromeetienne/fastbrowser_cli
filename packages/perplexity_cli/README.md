# perplexity_cli

CLI for searching the web and running deep research queries using [Perplexity AI](https://www.perplexity.ai/).

## Requirements

- Node.js 20+
- A [Perplexity API key](https://www.perplexity.ai/settings/api)

## Setup

```bash
cd packages/perplexity_cli
npm install
export PERPLEXITY_API_KEY=pplx-your-key-here
```

## Commands

### `search`

Search the web and return a list of results (title, URL, snippet).

```bash
# Basic search
npx tsx src/cli.ts search -q "TypeScript generics"

# Multi-query batch (up to 5 queries in one request)
npx tsx src/cli.ts search -q "TypeScript generics" -q "TypeScript decorators"

# Regional results
npx tsx src/cli.ts search -q "weather forecast" --country FR

# Domain allowlist
npx tsx src/cli.ts search -q "machine learning" --domain arxiv.org

# Domain blocklist (prefix with -)
npx tsx src/cli.ts search -q "machine learning" --domain -example.com

# Language filter
npx tsx src/cli.ts search -q "intelligence artificielle" --language fr

# Limit number of results
npx tsx src/cli.ts search -q "rust programming" --max-results 5
```

**Options:**

| Flag                  | Description                                             | Default  |
|-----------------------|---------------------------------------------------------|----------|
| `-q, --query <query>` | Search query — repeatable up to 5 times                 | required |
| `--domain <domain>`   | Domain filter — repeatable, prefix `-` to block         | —        |
| `--country <code>`    | ISO 3166-1 alpha-2 country code (e.g. `US`, `FR`, `JP`) | —        |
| `--language <code>`   | ISO 639-1 language code — repeatable up to 10           | —        |
| `--max-results <n>`   | Number of results (1–20)                                | `10`     |

### `deep-search`

Run a comprehensive research query and get a full text answer.

```bash
# Deep research, plain text output (default preset)
npx tsx src/cli.ts deep-search -q "explain transformer neural networks"

# Deep research with markdown output
npx tsx src/cli.ts deep-search -q "explain transformer neural networks" -m

# Quick factual lookup
npx tsx src/cli.ts deep-search -q "capital of France" -p fast-search

# Maximum depth research
npx tsx src/cli.ts deep-search -q "impact of quantum computing on cryptography" -p advanced-deep-research -m
```

**Options:**

| Flag                    | Description                                          | Default         |
|-------------------------|------------------------------------------------------|-----------------|
| `-q, --query <query>`   | Search query                                         | required        |
| `-m, --markdown`        | Output as raw markdown (default: plain text)         | false           |
| `-p, --preset <preset>` | Research preset (see below)                          | `deep-research` |

**Presets:**

| Preset                   | Model                 | Use case                                       |
|--------------------------|-----------------------|------------------------------------------------|
| `fast-search`            | sonar                 | Quick factual lookups                          |
| `pro-search`             | sonar-pro             | Reliably researched standard queries           |
| `deep-research`          | sonar-deep-research   | In-depth analysis requiring extensive research |
| `advanced-deep-research` | sonar-reasoning-pro   | Maximum depth research with extensive sources  |

### `install`

Copy the perplexity skill into an agent folder.

```bash
npx tsx src/cli.ts install --skill
```

This copies `skills/perplexity/` into `<cwd>/skills/perplexity/`, making it available to [skillmd_runner](../skillmd_runner) agent folders.

## Development

```bash
npm run build      # compile TypeScript → dist/
npm run typecheck  # type-check without emitting
npm test           # run tests
```

## Output

- `search` and `deep-search` write results to **stdout**.
- Errors are written to **stderr** and the process exits with code 1.
