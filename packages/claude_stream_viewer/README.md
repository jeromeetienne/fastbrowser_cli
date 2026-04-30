# claude_stream_viewer

Pretty-prints [Claude Code](https://claude.com/claude-code) `stream-json` events from stdin with colorized output. Drop it at the end of a `claude --output-format stream-json` pipe to read the stream as a human instead of as raw JSON.

![claude_stream_viewer demo](demo/claude_stream_viewer.gif)

## Requirements

- Node.js 20+
- An upstream process emitting [Claude Code stream-json events](https://docs.claude.com/en/docs/claude-code/sdk) (typically the `claude` CLI run with `--output-format stream-json`)



## Install

```bash
npm install -g claude_stream_viewer
# or run on demand without installing
npx claude_stream_viewer@latest
```

## Usage

Pipe any source of stream-json events into the viewer:

```bash
claude --output-format stream-json --verbose --include-partial-messages \
       --permission-mode auto -p "explain quantum computing like I'm 5" \
  | npx claude_stream_viewer@latest
```

The viewer reads one JSON event per line from stdin and writes a colorized, human-readable rendering to stdout. It exits when stdin closes, printing `[stream ended]`.

### What it renders

| Event                              | Output                                                           |
|------------------------------------|------------------------------------------------------------------|
| `text_delta` (inside `stream_event`) | streamed inline as plain text — the assistant's reply            |
| `tool_use`                         | `=== TOOL USE ===` header followed by the event JSON             |
| Other `stream_event` types         | `=== EVENT: <type> ===` header followed by the event JSON        |
| Legacy `message_delta`             | streamed inline as plain text                                    |
| Final assistant message            | `=== FINAL MESSAGE ===` header followed by each content block    |
| Anything else                      | `=== UNKNOWN EVENT ===` header followed by the raw JSON          |

Malformed lines are reported on stderr (`Invalid JSON: …`) without aborting the stream.

## Options

| Flag                  | Description                                                  | Default |
|-----------------------|--------------------------------------------------------------|---------|
| `--no-color`          | Disable colored output                                       | colored |
| `--include <kinds>`   | Comma-separated event kinds to show (whitelist)              | all     |
| `--exclude <kinds>`   | Comma-separated event kinds to hide (blacklist)              | none    |
| `--version`           | Print the package version                                    | —       |
| `--help`              | Print usage help                                             | —       |

### Event kinds

`--include` and `--exclude` match against an event's *kind*. The known kinds are:

- `text` — streamed assistant text (both `text_delta` and legacy `message_delta`)
- `tool_use`
- `final_message`
- `unknown`
- any `stream_event` subtype: `message_start`, `message_stop`, `content_block_start`, `content_block_stop`, `message_delta`, …

### Filter examples

Show only the assistant's text, hiding all envelope events:

```bash
claude --output-format stream-json --verbose --include-partial-messages \
       --permission-mode auto -p "explain quantum computing like I'm 5" \
  | npx claude_stream_viewer@latest --include text
```

Show only tool calls (useful for auditing what the model is doing):

```bash
claude --output-format stream-json --verbose --include-partial-messages \
       --permission-mode auto -p "list files in this repo" \
  | npx claude_stream_viewer@latest --include tool_use
```

Hide the noisy start/stop envelopes, keep everything else:

```bash
claude --output-format stream-json --verbose --include-partial-messages \
       --permission-mode auto -p "summarize this file" \
  | npx claude_stream_viewer@latest --exclude message_start,message_stop,content_block_start,content_block_stop
```

Combine `--include` and `--exclude` (`--exclude` wins on conflicts):

```bash
… | npx claude_stream_viewer@latest --include text,tool_use --exclude tool_use
# → only text
```

## Development

```bash
cd packages/claude_stream_viewer
npm install
npm run dev        # tsx ./src/claude_stream_viewer.ts
npm run build      # compile TypeScript → dist/
npm run typecheck  # type-check without emitting
```

## Output

- Rendered events are written to **stdout**.
- Parse errors and processing errors are written to **stderr**; the process keeps reading.
