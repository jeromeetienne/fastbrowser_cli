// node imports
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// npm imports
import { Cacheable } from 'cacheable';

// local imports
import { UtilsMemoisation } from '../src/utils/utils_memoisation.js';

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
//	UtilsMemoisation.memoise — uses an in-memory Cacheable per test so
//	state never leaks between cases.
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

describe('UtilsMemoisation.memoise', () => {
	it('runs the underlying fn once and serves the cached value on a hit', async () => {
		const cache = new Cacheable();
		let calls = 0;
		const slowAdd = async (a: number, b: number): Promise<number> => {
			calls += 1;
			return a + b;
		};
		const fastAdd = UtilsMemoisation.memoise(slowAdd, { cache, keyPrefix: 'slowAdd' });

		assert.equal(await fastAdd(2, 3), 5);
		assert.equal(await fastAdd(2, 3), 5);
		assert.equal(calls, 1);
	});

	it('treats different argument lists as different cache keys', async () => {
		const cache = new Cacheable();
		let calls = 0;
		const slowAdd = async (a: number, b: number): Promise<number> => {
			calls += 1;
			return a + b;
		};
		const fastAdd = UtilsMemoisation.memoise(slowAdd, { cache, keyPrefix: 'slowAdd' });

		assert.equal(await fastAdd(2, 3), 5);
		assert.equal(await fastAdd(2, 4), 6);
		assert.equal(calls, 2);
	});

	it('isolates cache entries by keyPrefix', async () => {
		const cache = new Cacheable();
		let aCalls = 0;
		let bCalls = 0;
		const fnA = UtilsMemoisation.memoise(
			async (n: number): Promise<string> => {
				aCalls += 1;
				return `A:${n}`;
			},
			{ cache, keyPrefix: 'fnA' },
		);
		const fnB = UtilsMemoisation.memoise(
			async (n: number): Promise<string> => {
				bCalls += 1;
				return `B:${n}`;
			},
			{ cache, keyPrefix: 'fnB' },
		);

		assert.equal(await fnA(1), 'A:1');
		assert.equal(await fnB(1), 'B:1');
		assert.equal(await fnA(1), 'A:1');
		assert.equal(await fnB(1), 'B:1');
		assert.equal(aCalls, 1);
		assert.equal(bCalls, 1);
	});

	it('propagates errors from the underlying fn without caching them', async () => {
		const cache = new Cacheable();
		let calls = 0;
		const flaky = async (): Promise<number> => {
			calls += 1;
			throw new Error('boom');
		};
		const memoFlaky = UtilsMemoisation.memoise(flaky, { cache, keyPrefix: 'flaky' });

		await assert.rejects(memoFlaky(), /boom/);
		await assert.rejects(memoFlaky(), /boom/);
		assert.equal(calls, 2);
	});
});
