import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CommandSearch } from '../src/commands/search';

test('search throws when PERPLEXITY_API_KEY is missing', async () => {
	const original = process.env['PERPLEXITY_API_KEY'];
	delete process.env['PERPLEXITY_API_KEY'];
	try {
		await assert.rejects(
			() => CommandSearch.run({ query: ['test'], maxResults: 10 }),
			(err: Error) => {
				assert.ok(err.message.includes('PERPLEXITY_API_KEY'), `expected key name in: ${err.message}`);
				return true;
			},
		);
	} finally {
		if (original !== undefined) {
			process.env['PERPLEXITY_API_KEY'] = original;
		}
	}
});

test('search throws when PERPLEXITY_API_KEY is empty string', async () => {
	const original = process.env['PERPLEXITY_API_KEY'];
	process.env['PERPLEXITY_API_KEY'] = '';
	try {
		await assert.rejects(
			() => CommandSearch.run({ query: ['test'], maxResults: 10 }),
			(err: Error) => {
				assert.ok(err.message.includes('PERPLEXITY_API_KEY'), `expected key name in: ${err.message}`);
				return true;
			},
		);
	} finally {
		if (original !== undefined) {
			process.env['PERPLEXITY_API_KEY'] = original;
		} else {
			delete process.env['PERPLEXITY_API_KEY'];
		}
	}
});
