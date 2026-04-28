
// npm imports
import { z as Zod } from 'zod';

// ─── Schemas ─────────────────────────────────────────────────────────────────

export const AtsReviewActionSchema = Zod.object({
	priority: Zod.enum(['high', 'medium', 'low']),
	category: Zod.enum([
		'keyword_gap',
		'formatting_issue',
		'section_missing',
		'section_reorder',
		'content_rewrite',
		'metrics_needed',
		'contact_info',
		'length_issue',
		'acronym_expansion',
	]),
	problem: Zod.string().describe('What is wrong or suboptimal'),
	action: Zod.string().describe('Exact action the user should take to fix this'),
	exampleBefore: Zod.string().describe('Current text or a representative snippet showing the problem'),
	exampleAfter: Zod.string().describe('Rewritten text after applying the fix'),
});

export const AtsReviewSchema = Zod.object({
	summary: Zod.string().describe('One-paragraph executive summary of the resume\'s ATS compliance'),
	complianceLevel: Zod.enum(['non_compliant', 'partially_compliant', 'mostly_compliant', 'fully_compliant'])
		.describe('Overall ATS compliance level'),
	actions: Zod
		.array(AtsReviewActionSchema)
		.describe('Ordered list of concrete actions to improve ATS compliance, highest priority first'),
	quickWins: Zod
		.array(Zod.string())
		.max(5)
		.describe('Easy fixes that can be done in under a minute each'),
	dealBreakers: Zod
		.array(Zod.string())
		.describe('Issues that will almost certainly cause ATS rejection if not fixed'),
});
