// node imports
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// local imports
import { ResumeMarkdown } from '../src/resume_json/resume_markdown.js';
import { SampleResume } from './fixtures/sample-resume.js';

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
//	ResumeMarkdown.toMarkdown
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

describe('ResumeMarkdown.toMarkdown', () => {
	it('renders only the top heading for an empty resume', async () => {
		const md = await ResumeMarkdown.toMarkdown(SampleResume.empty());
		assert.equal(md, '# Resume\n');
	});

	it('renders the full resume with every populated section', async () => {
		const md = await ResumeMarkdown.toMarkdown(SampleResume.full());

		assert.match(md, /^# Resume\n/);
		assert.match(md, /^## Ada Lovelace$/m);
		assert.match(md, /\*Mathematician\*/);
		assert.match(md, /- \*\*Email:\*\* ada@example.com/);
		assert.match(md, /- \*\*Location:\*\* 1 Analytical Engine Way, 00000, London, GB/);
		assert.match(md, /- \*\*GitHub:\*\* \[ada\]\(https:\/\/github.com\/ada\)/);

		assert.match(md, /^## Work Experience$/m);
		assert.match(md, /^### Lead Programmer @ Analytical Engine Co\. \*\(1843-01 — 1852-11\)\*$/m);
		assert.match(md, /- Wrote Note G/);

		assert.match(md, /^## Education$/m);
		assert.match(md, /Independent Study in Mathematics/);
		assert.match(md, /^## Skills$/m);
		assert.match(md, /\*\*Mathematics\*\* \*\(Expert\)\* — algebra, calculus/);
		assert.match(md, /^## Languages$/m);
		assert.match(md, /\*\*English\*\* — Native/);

		assert.match(md, /^## Meta$/m);
		assert.match(md, /- \*\*Version:\*\* v1\.0\.0/);
	});

	it('omits sections whose array is empty rather than null', async () => {
		const resume = SampleResume.empty();
		resume.work = [];
		resume.skills = [];
		const md = await ResumeMarkdown.toMarkdown(resume);
		assert.doesNotMatch(md, /## Work Experience/);
		assert.doesNotMatch(md, /## Skills/);
	});

	it('uses "Present" when endDate is null', async () => {
		const resume = SampleResume.full();
		if (resume.work === null) assert.fail('fixture must include a work entry');
		resume.work[0].endDate = null;
		const md = await ResumeMarkdown.toMarkdown(resume);
		assert.match(md, /\*\(1843-01 — Present\)\*/);
	});

	it('uses "?" when startDate is null', async () => {
		const resume = SampleResume.full();
		if (resume.work === null) assert.fail('fixture must include a work entry');
		resume.work[0].startDate = null;
		const md = await ResumeMarkdown.toMarkdown(resume);
		assert.match(md, /\*\(\? — 1852-11\)\*/);
	});
});

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
//	ResumeMarkdown.toHtml
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

describe('ResumeMarkdown.toHtml', () => {
	it('renders a Mustache template against the resume data', async () => {
		const template = '<h1>{{basics.name}}</h1><p>{{basics.label}}</p>';
		const html = await ResumeMarkdown.toHtml(SampleResume.full(), template);
		assert.equal(html, '<h1>Ada Lovelace</h1><p>Mathematician</p>');
	});

	it('returns the template verbatim when it has no Mustache tags', async () => {
		const template = '<p>static</p>';
		const html = await ResumeMarkdown.toHtml(SampleResume.full(), template);
		assert.equal(html, '<p>static</p>');
	});
});
