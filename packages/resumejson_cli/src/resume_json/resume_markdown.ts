// npm imports
import Mustache from "mustache";
import {
	ResumeJson,
	ResumeBasics,
	ResumeWork,
	ResumeVolunteer,
	ResumeEducation,
	ResumeAward,
	ResumeCertificate,
	ResumePublication,
	ResumeSkill,
	ResumeLanguage,
	ResumeInterest,
	ResumeReference,
	ResumeProject,
	ResumeMeta,
} from "./resume_types.js";

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
//	ResumeMarkdown
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

export class ResumeMarkdown {
	///////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////
	//	
	///////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////

	static async toHtml(resumeJson: ResumeJson, htmlMustacheTemplate: string): Promise<string> {
		// const resumeMdJson = await UtilsMarked.resumemdToJson(resumeMd);
		const htmlContent = Mustache.render(htmlMustacheTemplate, resumeJson);
		return htmlContent;
	}

	///////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////
	//	.toMarkdown
	///////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////

	static async toMarkdown(resumeJson: ResumeJson): Promise<string> {
		const lines: string[] = [];

		lines.push('# Resume');
		lines.push('');

		if (resumeJson.basics !== null) {
			ResumeMarkdown.appendBasicsMarkdown(lines, resumeJson.basics);
		}

		if (resumeJson.work !== null && resumeJson.work.length > 0) {
			lines.push('## Work Experience');
			lines.push('');
			for (const work of resumeJson.work) {
				ResumeMarkdown.appendWorkMarkdown(lines, work);
			}
		}

		if (resumeJson.volunteer !== null && resumeJson.volunteer.length > 0) {
			lines.push('## Volunteer Experience');
			lines.push('');
			for (const volunteer of resumeJson.volunteer) {
				ResumeMarkdown.appendVolunteerMarkdown(lines, volunteer);
			}
		}

		if (resumeJson.education !== null && resumeJson.education.length > 0) {
			lines.push('## Education');
			lines.push('');
			for (const education of resumeJson.education) {
				ResumeMarkdown.appendEducationMarkdown(lines, education);
			}
		}

		if (resumeJson.awards !== null && resumeJson.awards.length > 0) {
			lines.push('## Awards');
			lines.push('');
			for (const award of resumeJson.awards) {
				ResumeMarkdown.appendAwardMarkdown(lines, award);
			}
		}

		if (resumeJson.certificates !== null && resumeJson.certificates.length > 0) {
			lines.push('## Certificates');
			lines.push('');
			for (const certificate of resumeJson.certificates) {
				ResumeMarkdown.appendCertificateMarkdown(lines, certificate);
			}
		}

		if (resumeJson.publications !== null && resumeJson.publications.length > 0) {
			lines.push('## Publications');
			lines.push('');
			for (const publication of resumeJson.publications) {
				ResumeMarkdown.appendPublicationMarkdown(lines, publication);
			}
		}

		if (resumeJson.skills !== null && resumeJson.skills.length > 0) {
			lines.push('## Skills');
			lines.push('');
			for (const skill of resumeJson.skills) {
				ResumeMarkdown.appendSkillMarkdown(lines, skill);
			}
			lines.push('');
		}

		if (resumeJson.languages !== null && resumeJson.languages.length > 0) {
			lines.push('## Languages');
			lines.push('');
			for (const language of resumeJson.languages) {
				ResumeMarkdown.appendLanguageMarkdown(lines, language);
			}
			lines.push('');
		}

		if (resumeJson.interests !== null && resumeJson.interests.length > 0) {
			lines.push('## Interests');
			lines.push('');
			for (const interest of resumeJson.interests) {
				ResumeMarkdown.appendInterestMarkdown(lines, interest);
			}
			lines.push('');
		}

		if (resumeJson.references !== null && resumeJson.references.length > 0) {
			lines.push('## References');
			lines.push('');
			for (const reference of resumeJson.references) {
				ResumeMarkdown.appendReferenceMarkdown(lines, reference);
			}
		}

		if (resumeJson.projects !== null && resumeJson.projects.length > 0) {
			lines.push('## Projects');
			lines.push('');
			for (const project of resumeJson.projects) {
				ResumeMarkdown.appendProjectMarkdown(lines, project);
			}
		}

		if (resumeJson.meta !== null) {
			ResumeMarkdown.appendMetaMarkdown(lines, resumeJson.meta);
		}

		return lines.join('\n');
	}

	///////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////
	//	
	///////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////

	private static appendBasicsMarkdown(lines: string[], basics: ResumeBasics): void {
		if (basics.name !== null) {
			lines.push(`## ${basics.name}`);
			lines.push('');
		}
		if (basics.label !== null) {
			lines.push(`*${basics.label}*`);
			lines.push('');
		}
		if (basics.summary !== null) {
			lines.push(basics.summary);
			lines.push('');
		}

		const contactLines: string[] = [];
		if (basics.email !== null) contactLines.push(`- **Email:** ${basics.email}`);
		if (basics.phone !== null) contactLines.push(`- **Phone:** ${basics.phone}`);
		if (basics.url !== null) contactLines.push(`- **Website:** ${basics.url}`);
		if (basics.image !== null) contactLines.push(`- **Image:** ${basics.image}`);
		if (basics.location !== null) {
			const location = basics.location;
			const parts: string[] = [];
			if (location.address !== null) parts.push(location.address);
			if (location.postalCode !== null) parts.push(location.postalCode);
			if (location.city !== null) parts.push(location.city);
			if (location.region !== null) parts.push(location.region);
			if (location.countryCode !== null) parts.push(location.countryCode);
			if (parts.length > 0) {
				contactLines.push(`- **Location:** ${parts.join(', ')}`);
			}
		}
		if (contactLines.length > 0) {
			lines.push(...contactLines);
			lines.push('');
		}

		if (basics.profiles !== null && basics.profiles.length > 0) {
			lines.push('### Profiles');
			lines.push('');
			for (const profile of basics.profiles) {
				const network = profile.network ?? 'Unknown';
				const username = profile.username ?? '';
				const url = profile.url ?? '';
				if (url !== '') {
					lines.push(`- **${network}:** [${username !== '' ? username : url}](${url})`);
				} else {
					lines.push(`- **${network}:** ${username}`);
				}
			}
			lines.push('');
		}
	}

	private static appendWorkMarkdown(lines: string[], work: ResumeWork): void {
		const title = work.position ?? 'Unknown Position';
		const company = work.name ?? 'Unknown Company';
		const dateRange = ResumeMarkdown.formatDateRangeMarkdown(work.startDate, work.endDate);
		lines.push(`### ${title} @ ${company} ${dateRange}`);
		lines.push('');
		if (work.location !== null) {
			lines.push(`- **Location:** ${work.location}`);
		}
		if (work.url !== null) {
			lines.push(`- **URL:** ${work.url}`);
		}
		if (work.description !== null) {
			lines.push(`- **About:** ${work.description}`);
		}
		if (work.summary !== null) {
			lines.push('');
			lines.push(work.summary);
		}
		if (work.highlights !== null && work.highlights.length > 0) {
			lines.push('');
			for (const highlight of work.highlights) {
				lines.push(`- ${highlight}`);
			}
		}
		lines.push('');
	}

	private static appendVolunteerMarkdown(lines: string[], volunteer: ResumeVolunteer): void {
		const position = volunteer.position ?? 'Unknown Position';
		const organization = volunteer.organization ?? 'Unknown Organization';
		const dateRange = ResumeMarkdown.formatDateRangeMarkdown(volunteer.startDate, volunteer.endDate);
		lines.push(`### ${position} @ ${organization} ${dateRange}`);
		lines.push('');
		if (volunteer.url !== null) {
			lines.push(`- **URL:** ${volunteer.url}`);
		}
		if (volunteer.summary !== null) {
			lines.push('');
			lines.push(volunteer.summary);
		}
		if (volunteer.highlights !== null && volunteer.highlights.length > 0) {
			lines.push('');
			for (const highlight of volunteer.highlights) {
				lines.push(`- ${highlight}`);
			}
		}
		lines.push('');
	}

	private static appendEducationMarkdown(lines: string[], education: ResumeEducation): void {
		const institution = education.institution ?? 'Unknown Institution';
		const studyType = education.studyType ?? '';
		const area = education.area ?? '';
		const dateRange = ResumeMarkdown.formatDateRangeMarkdown(education.startDate, education.endDate);
		const heading = [studyType, area].filter((part) => part !== '').join(' in ');
		const headingPart = heading !== '' ? ` — ${heading}` : '';
		lines.push(`### ${institution}${headingPart} ${dateRange}`);
		lines.push('');
		if (education.url !== null) {
			lines.push(`- **URL:** ${education.url}`);
		}
		if (education.score !== null) {
			lines.push(`- **Score:** ${education.score}`);
		}
		if (education.courses !== null && education.courses.length > 0) {
			lines.push('- **Courses:**');
			for (const course of education.courses) {
				lines.push(`  - ${course}`);
			}
		}
		lines.push('');
	}

	private static appendAwardMarkdown(lines: string[], award: ResumeAward): void {
		const title = award.title ?? 'Unknown Award';
		const date = award.date ?? '';
		const dateText = date !== '' ? ` (${date})` : '';
		lines.push(`### ${title}${dateText}`);
		lines.push('');
		if (award.awarder !== null) {
			lines.push(`- **Awarder:** ${award.awarder}`);
		}
		if (award.summary !== null) {
			lines.push('');
			lines.push(award.summary);
		}
		lines.push('');
	}

	private static appendCertificateMarkdown(lines: string[], certificate: ResumeCertificate): void {
		const name = certificate.name ?? 'Unknown Certificate';
		const date = certificate.date ?? '';
		const dateText = date !== '' ? ` (${date})` : '';
		lines.push(`### ${name}${dateText}`);
		lines.push('');
		if (certificate.issuer !== null) {
			lines.push(`- **Issuer:** ${certificate.issuer}`);
		}
		if (certificate.url !== null) {
			lines.push(`- **URL:** ${certificate.url}`);
		}
		lines.push('');
	}

	private static appendPublicationMarkdown(lines: string[], publication: ResumePublication): void {
		const name = publication.name ?? 'Unknown Publication';
		const date = publication.releaseDate ?? '';
		const dateText = date !== '' ? ` (${date})` : '';
		lines.push(`### ${name}${dateText}`);
		lines.push('');
		if (publication.publisher !== null) {
			lines.push(`- **Publisher:** ${publication.publisher}`);
		}
		if (publication.url !== null) {
			lines.push(`- **URL:** ${publication.url}`);
		}
		if (publication.summary !== null) {
			lines.push('');
			lines.push(publication.summary);
		}
		lines.push('');
	}

	private static appendSkillMarkdown(lines: string[], skill: ResumeSkill): void {
		const name = skill.name ?? 'Unknown Skill';
		const level = skill.level ?? '';
		const levelText = level !== '' ? ` *(${level})*` : '';
		const keywordsText = skill.keywords !== null && skill.keywords.length > 0
			? ` — ${skill.keywords.join(', ')}`
			: '';
		lines.push(`- **${name}**${levelText}${keywordsText}`);
	}

	private static appendLanguageMarkdown(lines: string[], language: ResumeLanguage): void {
		const name = language.language ?? 'Unknown Language';
		const fluency = language.fluency ?? '';
		const fluencyText = fluency !== '' ? ` — ${fluency}` : '';
		lines.push(`- **${name}**${fluencyText}`);
	}

	private static appendInterestMarkdown(lines: string[], interest: ResumeInterest): void {
		const name = interest.name ?? 'Unknown Interest';
		const keywordsText = interest.keywords !== null && interest.keywords.length > 0
			? ` — ${interest.keywords.join(', ')}`
			: '';
		lines.push(`- **${name}**${keywordsText}`);
	}

	private static appendReferenceMarkdown(lines: string[], reference: ResumeReference): void {
		const name = reference.name ?? 'Unknown Reference';
		lines.push(`### ${name}`);
		lines.push('');
		if (reference.reference !== null) {
			lines.push(`> ${reference.reference}`);
		}
		lines.push('');
	}

	private static appendProjectMarkdown(lines: string[], project: ResumeProject): void {
		const name = project.name ?? 'Unknown Project';
		const dateRange = ResumeMarkdown.formatDateRangeMarkdown(project.startDate, project.endDate);
		lines.push(`### ${name} ${dateRange}`);
		lines.push('');
		if (project.entity !== null) {
			lines.push(`- **Entity:** ${project.entity}`);
		}
		if (project.type !== null) {
			lines.push(`- **Type:** ${project.type}`);
		}
		if (project.url !== null) {
			lines.push(`- **URL:** ${project.url}`);
		}
		if (project.roles !== null && project.roles.length > 0) {
			lines.push(`- **Roles:** ${project.roles.join(', ')}`);
		}
		if (project.keywords !== null && project.keywords.length > 0) {
			lines.push(`- **Keywords:** ${project.keywords.join(', ')}`);
		}
		if (project.description !== null) {
			lines.push('');
			lines.push(project.description);
		}
		if (project.highlights !== null && project.highlights.length > 0) {
			lines.push('');
			for (const highlight of project.highlights) {
				lines.push(`- ${highlight}`);
			}
		}
		lines.push('');
	}

	private static appendMetaMarkdown(lines: string[], meta: ResumeMeta): void {
		lines.push('## Meta');
		lines.push('');
		if (meta.canonical !== null) {
			lines.push(`- **Canonical:** ${meta.canonical}`);
		}
		if (meta.version !== null) {
			lines.push(`- **Version:** ${meta.version}`);
		}
		if (meta.lastModified !== null) {
			lines.push(`- **Last Modified:** ${meta.lastModified}`);
		}
		lines.push('');
	}

	private static formatDateRangeMarkdown(startDate: string | null, endDate: string | null): string {
		const start = startDate ?? '?';
		const end = endDate ?? 'Present';
		return `*(${start} — ${end})*`;
	}

}
