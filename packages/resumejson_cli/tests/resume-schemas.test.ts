// node imports
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// local imports
import {
	Iso8601Schema,
	ResumeJsonSchema,
} from '../src/resume_json/resume_schemas.js';
import { SampleResume } from './fixtures/sample-resume.js';

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
//	Iso8601Schema
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

describe('Iso8601Schema', () => {
	it('accepts year-only', () => {
		assert.equal(Iso8601Schema.parse('2023'), '2023');
	});

	it('accepts year-month', () => {
		assert.equal(Iso8601Schema.parse('2023-04'), '2023-04');
	});

	it('accepts full date', () => {
		assert.equal(Iso8601Schema.parse('2014-06-29'), '2014-06-29');
	});

	it('rejects an unparseable date string', () => {
		assert.throws(() => Iso8601Schema.parse('06/29/2014'));
	});

	it('rejects a year outside the 1xxx-2xxx range', () => {
		assert.throws(() => Iso8601Schema.parse('3001-01-01'));
	});
});

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
//	ResumeJsonSchema
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

describe('ResumeJsonSchema', () => {
	it('round-trips a fully-populated resume', () => {
		const resume = SampleResume.full();
		const parsed = ResumeJsonSchema.parse(resume);
		assert.deepEqual(parsed, resume);
	});

	it('round-trips an empty resume (all sections null)', () => {
		const resume = SampleResume.empty();
		const parsed = ResumeJsonSchema.parse(resume);
		assert.deepEqual(parsed, resume);
	});

	it('rejects a missing top-level required key', () => {
		const resume = SampleResume.empty() as Record<string, unknown>;
		delete resume.basics;
		assert.throws(() => ResumeJsonSchema.parse(resume));
	});

	it('rejects an invalid date inside a work entry', () => {
		const resume = SampleResume.full();
		if (resume.work === null) {
			assert.fail('fixture must include a work entry');
		}
		resume.work[0].startDate = 'not-a-date';
		assert.throws(() => ResumeJsonSchema.parse(resume));
	});
});
