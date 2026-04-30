# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Structure

Monorepo with three packages under `packages/`:

- **`skillmd_runner`** — Core AI agent orchestration engine. Parses "agent folders" (directories with `AGENTS.md` + `skills/*/SKILL.md`), creates OpenAI sub-agents per skill, and routes user tasks to them via a readline-based chat REPL.
- **`bsky_cli`** — CLI for the Bluesky social network (ATProto). Handles auth, posts, replies, and search.
- **`tmp_social_agent`** — Experimental browser automation with Playwright/Puppeteer. Not yet integrated.

## Commands

All commands run from their package directory (e.g., `cd packages/skillmd_runner`).

### skillmd_runner

```bash
npm run build          # tsc compile
npm run typecheck      # tsc --noEmit

# Run sample agents interactively
npm run sample:chat:todo          # chat with todo list agent
npm run sample:task:todo          # single task: "what are my tasks?"
npm run sample:chat:social_agent  # social media agent
npm run sample:chat:writer        # writer room agent

# Direct invocation
npx tsx ./src/cli.ts -c ./data/agent_folders/sample_todo_list
npx tsx ./src/cli.ts -c <agent-folder> -i '<one-shot task>'
```

### bsky_cli

```bash
npm run build     # tsc compile
npm run typecheck
npm run dev       # tsx ./src/cli.ts (runs without build)
npm start         # node dist/cli.js (requires build first)
```

## Architecture: skillmd_runner

**Agent Folder format** — a directory containing:
- `AGENTS.md` — instructions for the orchestrating agent
- `skills/<skill-name>/SKILL.md` — frontmatter (`name`, `description`) + markdown instructions
- `skills/<skill-name>/` — scripts callable by the skill agent

**Flow:**
1. `cli.ts` calls `parseAgentFolder()` to load config
2. Each skill becomes an OpenAI tool-calling agent (via `@openai/agents`)
3. The orchestrator routes user messages to skill agents
4. Skill agents can call scripts in their folder via `ScriptHelper` (30s timeout, cwd = skill folder)
5. OpenAI API responses are cached in `.openai_cache.sqlite` (SQLite via `@keyv/sqlite`)

**Key source files:**
- `src/cli.ts` — entry point, OpenAI setup, agent wiring, readline REPL
- `src/agent_folder/config_parser.ts` — discovers and validates `AGENTS.md` + `SKILL.md` files
- `src/agent_folder/schema.ts` — Zod schema for SKILL.md frontmatter
- `src/libs/script_helper.ts` — executes skill scripts as child processes

## Architecture: bsky_cli

Commander.js CLI with subcommands. Session stored in `~/.bsky_cli/session.json`.

- `src/cli.ts` — command definitions and routing
- `src/libs/bluesky_client.ts` — ATProto API wrapper
- `src/libs/session_manager.ts` — local session persistence
- `src/commands/` — one file per command group

## Coding Style

When generating TypeScript code, follow these conventions:

### Conditionals
- **Never use `!varName` in if conditions.** Always use explicit checks: `=== null`, `=== undefined`, `=== false`, `!== null`, `!== undefined`, etc.

### TypeScript
- Prefer `type` aliases and Zod schemas for data shapes
- Use `async/await` over raw Promises
- Avoid `any`; prefer `unknown` when the type is genuinely unknown
- Named exports only; no default exports

### Naming
- `camelCase` for variables and functions
- `PascalCase` for classes, interfaces, and type aliases
- `kebab-case` for file names
- `UPPER_SNAKE_CASE` for true constants

### Formatting
- 8-tab indentation
- Single quotes for strings
- Trailing commas in multi-line structures
- Semicolons required

### Code Organization
- All exported functions in a module must live in a static class named after the file (kebab-case → PascalCase). Example: `ai-client.ts` → `class AiClient { static … }`. Classes with internal state use instance methods instead.
- Early returns over deeply nested conditions
- No unnecessary comments — let code speak for itself

## Tech Stack

- **TypeScript** (ES2020, strict), run via `tsx` for development
- **@openai/agents** — agent/tool orchestration
- **@atproto/api** — Bluesky protocol
- **Zod** — runtime validation of SKILL.md frontmatter
- **gray-matter** — markdown frontmatter parsing (used in skillmd_runner but missing from package.json)
- **Commander.js** — CLI arg parsing (both packages)
- **Chalk** — terminal colors (bsky_cli)
