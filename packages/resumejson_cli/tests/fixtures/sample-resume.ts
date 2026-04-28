// local imports
import { ResumeJson } from '../../src/resume_json/resume_types.js';

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
//	Test fixtures: minimal-but-valid ResumeJson values for the pure-format
//	suites. Built once and frozen so a test can never mutate shared state.
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

export class SampleResume {
	static empty(): ResumeJson {
		return {
			$schema: null,
			basics: null,
			work: null,
			volunteer: null,
			education: null,
			awards: null,
			certificates: null,
			publications: null,
			skills: null,
			languages: null,
			interests: null,
			references: null,
			projects: null,
			meta: null,
		};
	}

	static full(): ResumeJson {
		return {
			$schema: 'https://example.com/resume.schema.json',
			basics: {
				name: 'Ada Lovelace',
				label: 'Mathematician',
				image: null,
				email: 'ada@example.com',
				phone: '555-0100',
				url: 'https://ada.example.com',
				summary: 'First programmer.',
				location: {
					address: '1 Analytical Engine Way',
					postalCode: '00000',
					city: 'London',
					countryCode: 'GB',
					region: null,
				},
				profiles: [
					{ network: 'GitHub', username: 'ada', url: 'https://github.com/ada' },
				],
			},
			work: [
				{
					name: 'Analytical Engine Co.',
					location: 'London',
					description: 'Computing pioneers',
					position: 'Lead Programmer',
					url: 'https://aec.example.com',
					startDate: '1843-01',
					endDate: '1852-11',
					summary: 'Designed first algorithms.',
					highlights: ['Wrote Note G', 'Conceived loops'],
				},
			],
			volunteer: null,
			education: [
				{
					institution: 'Self-taught',
					url: null,
					area: 'Mathematics',
					studyType: 'Independent Study',
					startDate: '1830',
					endDate: '1840',
					score: null,
					courses: ['Calculus', 'Logic'],
				},
			],
			awards: null,
			certificates: null,
			publications: null,
			skills: [
				{ name: 'Mathematics', level: 'Expert', keywords: ['algebra', 'calculus'] },
			],
			languages: [
				{ language: 'English', fluency: 'Native' },
			],
			interests: null,
			references: null,
			projects: null,
			meta: {
				canonical: 'https://ada.example.com/resume.json',
				version: 'v1.0.0',
				lastModified: '2024-01-01T00:00:00',
			},
		};
	}
}
