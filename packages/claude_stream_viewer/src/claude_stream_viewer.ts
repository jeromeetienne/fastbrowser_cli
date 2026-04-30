#!/usr/bin/env node

import readline from "node:readline";
import chalk from "chalk";

// Types are partial because stream-json format can vary
type ClaudeEvent = {
	type?: string;
	event?: {
		type?: string;
		delta?: {
			type?: string;
			text?: string;
		};
	};
	message?: {
		content?: Array<{ type?: string; text?: string }>;
	};
};

// Color helpers
const colors = {
	text: chalk.white,
	tool: chalk.cyan,
	system: chalk.gray,
	error: chalk.red,
	json: chalk.dim,
	header: chalk.yellow.bold,
};

// Pretty printers
function printText(text: string) {
	process.stdout.write(colors.text(text));
}

function printNewline() {
	process.stdout.write("\n");
}

function printHeader(label: string) {
	printNewline();
	console.log(colors.header(`\n=== ${label} ===`));
}

function printJSON(obj: unknown) {
	console.log(colors.json(JSON.stringify(obj, null, 2)));
}

// Core handler
function handleEvent(data: ClaudeEvent) {
	try {
		// STREAM EVENTS (new format)
		if (data.type === "stream_event" && data.event) {
			const evt = data.event;

			// Text streaming
			if (evt.delta?.type === "text_delta" && evt.delta.text) {
				printText(evt.delta.text);
				return;
			}

			// Tool usage
			if (evt.type === "tool_use") {
				printHeader("TOOL USE");
				printJSON(evt);
				return;
			}

			// Other events
			if (evt.type && evt.type !== "content_block_delta") {
				printHeader(`EVENT: ${evt.type}`);
				printJSON(evt);
				return;
			}
		}

		// MESSAGE DELTA (older format)
		if ((data as any).type === "message_delta") {
			const text = (data as any)?.delta?.text;
			if (text) {
				printText(text);
				return;
			}
		}

		// FINAL MESSAGE
		if (data.message?.content) {
			printHeader("FINAL MESSAGE");
			for (const block of data.message.content) {
				if (block.text) {
					console.log(colors.text(block.text));
				}
			}
			return;
		}

		// FALLBACK (debug)
		printHeader("UNKNOWN EVENT");
		printJSON(data);
	} catch (err) {
		console.error(colors.error("Error processing event:"), err);
		printJSON(data);
	}
}

// Read stdin line-by-line
const rl = readline.createInterface({
	input: process.stdin,
	crlfDelay: Infinity,
});

rl.on("line", (line) => {
	if (!line.trim()) return;

	try {
		const parsed = JSON.parse(line);
		handleEvent(parsed);
	} catch (err) {
		console.error(colors.error("Invalid JSON:"), line);
	}
});

rl.on("close", () => {
	printNewline();
	console.log(colors.system("\n[stream ended]"));
});