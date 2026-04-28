// node imports
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// local imports
import { ResumePrettyPrint } from '../src/resume_json/resume_pretty_print.js';
import { SampleResume } from './fixtures/sample-resume.js';

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
//	stripAnsi — Chalk emits color escape codes; strip them so assertions
//	stay readable and robust against Chalk version changes.
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

const ANSI_RE = /\[[0-9;]*m/g;
const stripAnsi = (s: string): string => s.replace(ANSI_RE, '');

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
//	ResumePrettyPrint.prettyPrint
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

describe('ResumePrettyPrint.prettyPrint', () => {
	it('renders only the "Resume" heading for an empty resume', async () => {
		const out = stripAnsi(await ResumePrettyPrint.prettyPrint(SampleResume.empty()));
		assert.equal(out, 'Resume\n');
	});

	it('renders every populated section of the full resume', async () => {
		const out = stripAnsi(await ResumePrettyPrint.prettyPrint(SampleResume.full()));

		assert.match(out, /^Resume$/m);
		assert.match(out, /^Basics:$/m);
		assert.match(out, /Name: Ada Lovelace/);
		assert.match(out, /Email: ada@example.com/);
		assert.match(out, /Location: 1 Analytical Engine Way, 00000, London, GB/);

		assert.match(out, /^Work Experience:$/m);
		assert.match(out, /1\. Lead Programmer @ Analytical Engine Co\. \(1843-01 — 1852-11\)/);
		assert.match(out, /• Wrote Note G/);

		assert.match(out, /^Education:$/m);
		assert.match(out, /1\. Self-taught — Independent Study in Mathematics/);
		assert.match(out, /^Skills:$/m);
		assert.match(out, /1\. Mathematics \(Expert\)/);
		assert.match(out, /Keywords: algebra, calculus/);
		assert.match(out, /^Languages:$/m);
		assert.match(out, /1\. English — Native/);

		assert.match(out, /^Meta:$/m);
		assert.match(out, /Version: v1\.0\.0/);
	});

	it('uses "Present" for a null endDate', async () => {
		const resume = SampleResume.full();
		if (resume.work === null) assert.fail('fixture must include a work entry');
		resume.work[0].endDate = null;
		const out = stripAnsi(await ResumePrettyPrint.prettyPrint(resume));
		assert.match(out, /\(1843-01 — Present\)/);
	});

	it('omits sections whose array is empty rather than null', async () => {
		const resume = SampleResume.empty();
		resume.work = [];
		resume.skills = [];
		const out = stripAnsi(await ResumePrettyPrint.prettyPrint(resume));
		assert.doesNotMatch(out, /Work Experience:/);
		assert.doesNotMatch(out, /Skills:/);
	});
});
