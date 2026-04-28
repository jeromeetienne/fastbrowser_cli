// ─── Types ───────────────────────────────────────────────────────────────────

export type AtsScoreIssue = {
	/** Severity of the issue */
	severity: 'critical' | 'major' | 'minor';
	/** Category of the issue */
	category:
	| 'missing_section'
	| 'weak_language'
	| 'missing_keywords'
	| 'poor_formatting'
	| 'missing_metrics'
	| 'vague_content'
	| 'acronym_not_expanded'
	| 'missing_contact_info';
	/** Human-readable explanation of the issue */
	message: string;
	/** Concrete fix the user can apply */
	suggestion: string;
};

export type AtsScoreSection = {
	/** Section title as it appears in the resume */
	section: string;
	/** ATS readiness score for this section */
	score: number;
	issues: AtsScoreIssue[];
};

export type AtsScore = {
	/** Overall ATS readiness score */
	overallScore: number;
	sectionScores: AtsScoreSection[];
	/** Standard sections entirely absent from the resume */
	missingCriticalSections: string[];
	/** How keyword-rich the resume is */
	keywordDensity: 'low' | 'moderate' | 'high';
	/** Top things this resume does well for ATS */
	topStrengths: string[];
	/** Most impactful changes to improve ATS performance */
	topImprovements: string[];
};
