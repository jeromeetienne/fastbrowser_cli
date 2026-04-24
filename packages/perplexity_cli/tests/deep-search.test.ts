import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CommandDeepSearch } from '../src/commands/deep-search';

test('deep-search throws when PERPLEXITY_API_KEY is missing', async () => {
	const original = process.env['PERPLEXITY_API_KEY'];
	delete process.env['PERPLEXITY_API_KEY'];
	try {
		await assert.rejects(
			() => CommandDeepSearch.run({ query: 'test', markdown: false, preset: 'deep-research' }),
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

test('deep-search throws when PERPLEXITY_API_KEY is empty string', async () => {
	const original = process.env['PERPLEXITY_API_KEY'];
	process.env['PERPLEXITY_API_KEY'] = '';
	try {
		await assert.rejects(
			() => CommandDeepSearch.run({ query: 'test', markdown: false, preset: 'pro-search' }),
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

test('stripMarkdown removes heading symbols', () => {
	const input = '# Title\n## Subtitle\n### Section';
	const result = CommandDeepSearch.stripMarkdown(input);
	assert.ok(result.includes('Title'), 'expected "Title"');
	assert.ok(result.includes('Subtitle'), 'expected "Subtitle"');
	assert.ok(result.includes('Section'), 'expected "Section"');
	assert.ok(result.includes('#') === false, 'expected no # symbols');
});

test('stripMarkdown removes bold markers', () => {
	const input = 'This is **bold** text and __also bold__';
	const result = CommandDeepSearch.stripMarkdown(input);
	assert.ok(result.includes('bold'), 'expected "bold"');
	assert.ok(result.includes('**') === false, 'expected no ** markers');
});

test('stripMarkdown removes inline code backticks', () => {
	const input = 'Use the `const` keyword';
	const result = CommandDeepSearch.stripMarkdown(input);
	assert.ok(result.includes('const'), 'expected "const"');
	assert.ok(result.includes('`') === false, 'expected no backticks');
});

test('stripMarkdown converts links to text only', () => {
	const input = 'See [the docs](https://example.com) for more';
	const result = CommandDeepSearch.stripMarkdown(input);
	assert.ok(result.includes('the docs'), 'expected link text');
	assert.ok(result.includes('https://example.com') === false, 'expected no URL');
});
