// node imports
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// local imports
import { A11yTree } from '../src/a11y_tree';
import { A11yQuery } from '../src/a11y_selector';
import { SAMPLE_TREE_TEXT } from './test-fixtures';

describe('A11yQuery', () => {
	describe('simple selectors', () => {
		it('matches by role', () => {
			const root = A11yTree.parse(SAMPLE_TREE_TEXT);
			const found = A11yQuery.querySelector(root, 'button');
			assert.equal(found?.uid, '5');
		});

		it('matches by #uid', () => {
			const root = A11yTree.parse(SAMPLE_TREE_TEXT);
			const found = A11yQuery.querySelector(root, '#4');
			assert.equal(found?.role, 'link');
		});

		it('matches any role with *', () => {
			const root = A11yTree.parse(SAMPLE_TREE_TEXT);
			const all = A11yQuery.querySelectorAll(root, '*');
			assert.equal(all.length, 7);
		});
	});

	describe('attribute selectors', () => {
		it('matches [attr] existence', () => {
			const root = A11yTree.parse(SAMPLE_TREE_TEXT);
			const all = A11yQuery.querySelectorAll(root, 'link[href]');
			assert.deepEqual(all.map((n) => n.uid), ['4', '7']);
		});

		it('matches [attr=value]', () => {
			const root = A11yTree.parse(SAMPLE_TREE_TEXT);
			const found = A11yQuery.querySelector(root, 'link[href="/"]');
			assert.equal(found?.uid, '7');
		});

		it('matches [attr^=prefix]', () => {
			const root = A11yTree.parse(SAMPLE_TREE_TEXT);
			const all = A11yQuery.querySelectorAll(root, 'link[href^="https"]');
			assert.deepEqual(all.map((n) => n.uid), ['4']);
		});

		it('matches [attr$=suffix]', () => {
			const root = A11yTree.parse(SAMPLE_TREE_TEXT);
			const all = A11yQuery.querySelectorAll(root, 'link[href$=".com"]');
			assert.deepEqual(all.map((n) => n.uid), ['4']);
		});

		it('matches [attr*=substring]', () => {
			const root = A11yTree.parse(SAMPLE_TREE_TEXT);
			const all = A11yQuery.querySelectorAll(root, 'link[href*="example"]');
			assert.deepEqual(all.map((n) => n.uid), ['4']);
		});

		it('matches the virtual name attribute', () => {
			const root = A11yTree.parse(SAMPLE_TREE_TEXT);
			const found = A11yQuery.querySelector(root, 'heading[name="Welcome"]');
			assert.equal(found?.uid, '3');
		});

		it('matches quoted attribute values containing special chars', () => {
			const root = A11yTree.parse(SAMPLE_TREE_TEXT);
			const found = A11yQuery.querySelector(root, 'link[name="Click \\"here\\""]');
			assert.equal(found?.uid, '4');
		});
	});

	describe('combinators', () => {
		it('descendant combinator (A B)', () => {
			const root = A11yTree.parse(SAMPLE_TREE_TEXT);
			const all = A11yQuery.querySelectorAll(root, 'WebArea link');
			assert.deepEqual(all.map((n) => n.uid), ['4', '7']);
		});

		it('child combinator (A > B)', () => {
			const root = A11yTree.parse(SAMPLE_TREE_TEXT);
			const direct = A11yQuery.querySelectorAll(root, 'WebArea > link');
			assert.deepEqual(direct, []);
			const viaMain = A11yQuery.querySelectorAll(root, 'main > link');
			assert.deepEqual(viaMain.map((n) => n.uid), ['4']);
		});

		it('union selector (A, B)', () => {
			const root = A11yTree.parse(SAMPLE_TREE_TEXT);
			const all = A11yQuery.querySelectorAll(root, 'heading, button');
			assert.deepEqual(all.map((n) => n.uid).sort(), ['3', '5']);
		});
	});

	describe('return semantics', () => {
		it('querySelector returns the first match in walk order', () => {
			const root = A11yTree.parse(SAMPLE_TREE_TEXT);
			const found = A11yQuery.querySelector(root, 'link');
			assert.equal(found?.uid, '4');
		});

		it('querySelector returns undefined when nothing matches', () => {
			const root = A11yTree.parse(SAMPLE_TREE_TEXT);
			const found = A11yQuery.querySelector(root, 'nonexistent');
			assert.equal(found, undefined);
		});

		it('querySelectorAll returns an empty array when nothing matches', () => {
			const root = A11yTree.parse(SAMPLE_TREE_TEXT);
			const all = A11yQuery.querySelectorAll(root, 'nonexistent');
			assert.deepEqual(all, []);
		});
	});

	describe('parse errors', () => {
		it('throws on unterminated string', () => {
			const root = A11yTree.parse(SAMPLE_TREE_TEXT);
			assert.throws(
				() => A11yQuery.querySelector(root, 'link[href="unterminated'),
				/Unterminated string/,
			);
		});

		it('throws on unexpected character', () => {
			const root = A11yTree.parse(SAMPLE_TREE_TEXT);
			assert.throws(
				() => A11yQuery.querySelector(root, 'link%'),
				/Unexpected character/,
			);
		});
	});
});
