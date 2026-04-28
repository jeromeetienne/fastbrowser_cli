// ─── Types ───────────────────────────────────────────────────────────────────

export type AtsReviewAction = {
	/** Priority of this action */
	priority: 'high' | 'medium' | 'low';
	/** Category of the action */
	category:
	| 'keyword_gap'
	| 'formatting_issue'
	| 'section_missing'
	| 'section_reorder'
	| 'content_rewrite'
	| 'metrics_needed'
	| 'contact_info'
	| 'length_issue'
	| 'acronym_expansion';
	/** What is wrong or suboptimal */
	problem: string;
	/** Exact action the user should take to fix this */
	action: string;
	/** Current text or a representative snippet showing the problem */
	exampleBefore: string;
	/** Rewritten text after applying the fix */
	exampleAfter: string;
};

export type AtsReview = {
	/** One-paragraph executive summary of the resume's ATS compliance */
	summary: string;
	/** Overall ATS compliance level */
	complianceLevel: 'non_compliant' | 'partially_compliant' | 'mostly_compliant' | 'fully_compliant';
	/** Ordered list of concrete actions to improve ATS compliance, highest priority first */
	actions: AtsReviewAction[];
	/** Easy fixes that can be done in under a minute each */
	quickWins: string[];
	/** Issues that will almost certainly cause ATS rejection if not fixed */
	dealBreakers: string[];
};
