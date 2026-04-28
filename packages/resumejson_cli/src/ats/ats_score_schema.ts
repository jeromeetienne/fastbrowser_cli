// npm imports
import { z as Zod } from 'zod';

// ─── Schemas ─────────────────────────────────────────────────────────────────

export const AtsScoreIssueSchema = Zod.object({
	severity: Zod.enum(['critical', 'major', 'minor']),
	category: Zod.enum([
		'missing_section',
		'weak_language',
		'missing_keywords',
		'poor_formatting',
		'missing_metrics',
		'vague_content',
		'acronym_not_expanded',
		'missing_contact_info',
	]),
	message: Zod.string().describe('Human-readable explanation of the issue'),
	suggestion: Zod.string().describe('Concrete fix the user can apply'),
});

export const AtsScoreSectionSchema = Zod.object({
	section: Zod.string().describe('Section title as it appears in the resume'),
	score: Zod.number().min(0).max(100).describe('ATS readiness score for this section'),
	issues: Zod.array(AtsScoreIssueSchema),
});

export const AtsScoreSchema = Zod.object({
	overallScore: Zod.number().min(0).max(100).describe('Overall ATS readiness score'),
	sectionScores: Zod.array(AtsScoreSectionSchema),
	missingCriticalSections: Zod.array(Zod.string())
		.describe('Standard sections entirely absent from the resume'),
	keywordDensity: Zod.enum(['low', 'moderate', 'high']).describe('How keyword-rich the resume is'),
	topStrengths: Zod.array(Zod.string()).max(5)
		.describe('Top things this resume does well for ATS'),
	topImprovements: Zod.array(Zod.string()).max(5)
		.describe('Most impactful changes to improve ATS performance'),
});
