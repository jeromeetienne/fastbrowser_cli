// npm imports
import Chalk from "chalk";
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
//	ResumeHelper
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

export class ResumeHelper {
	/**
	 * - use `Chalk` to pretty-print the ResumeJson in the terminal with colors and formatting for better readability.
	 *
	 * @param resumeJson
	 */
	static async prettyPrint(resumeJson: ResumeJson): Promise<string> {
		const lines: string[] = [];

		lines.push(Chalk.bold.underline("Resume"));
		lines.push("");

		if (resumeJson.basics !== null) {
			ResumeHelper.appendBasics(lines, resumeJson.basics);
		}

		if (resumeJson.work !== null && resumeJson.work.length > 0) {
			lines.push(Chalk.bold.underline("Work Experience:"));
			for (const work of resumeJson.work) {
				const index = resumeJson.work.indexOf(work) + 1;
				ResumeHelper.appendWork(lines, work, index);
			}
			lines.push("");
		}

		if (resumeJson.volunteer !== null && resumeJson.volunteer.length > 0) {
			lines.push(Chalk.bold.underline("Volunteer Experience:"));
			for (const volunteer of resumeJson.volunteer) {
				const index = resumeJson.volunteer.indexOf(volunteer) + 1;
				ResumeHelper.appendVolunteer(lines, volunteer, index);
			}
			lines.push("");
		}

		if (resumeJson.education !== null && resumeJson.education.length > 0) {
			lines.push(Chalk.bold.underline("Education:"));
			for (const education of resumeJson.education) {
				const index = resumeJson.education.indexOf(education) + 1;
				ResumeHelper.appendEducation(lines, education, index);
			}
			lines.push("");
		}

		if (resumeJson.awards !== null && resumeJson.awards.length > 0) {
			lines.push(Chalk.bold.underline("Awards:"));
			for (const award of resumeJson.awards) {
				const index = resumeJson.awards.indexOf(award) + 1;
				ResumeHelper.appendAward(lines, award, index);
			}
			lines.push("");
		}

		if (resumeJson.certificates !== null && resumeJson.certificates.length > 0) {
			lines.push(Chalk.bold.underline("Certificates:"));
			for (const certificate of resumeJson.certificates) {
				const index = resumeJson.certificates.indexOf(certificate) + 1;
				ResumeHelper.appendCertificate(lines, certificate, index);
			}
			lines.push("");
		}

		if (resumeJson.publications !== null && resumeJson.publications.length > 0) {
			lines.push(Chalk.bold.underline("Publications:"));
			for (const publication of resumeJson.publications) {
				const index = resumeJson.publications.indexOf(publication) + 1;
				ResumeHelper.appendPublication(lines, publication, index);
			}
			lines.push("");
		}

		if (resumeJson.skills !== null && resumeJson.skills.length > 0) {
			lines.push(Chalk.bold.underline("Skills:"));
			for (const skill of resumeJson.skills) {
				const index = resumeJson.skills.indexOf(skill) + 1;
				ResumeHelper.appendSkill(lines, skill, index);
			}
			lines.push("");
		}

		if (resumeJson.languages !== null && resumeJson.languages.length > 0) {
			lines.push(Chalk.bold.underline("Languages:"));
			for (const language of resumeJson.languages) {
				const index = resumeJson.languages.indexOf(language) + 1;
				ResumeHelper.appendLanguage(lines, language, index);
			}
			lines.push("");
		}

		if (resumeJson.interests !== null && resumeJson.interests.length > 0) {
			lines.push(Chalk.bold.underline("Interests:"));
			for (const interest of resumeJson.interests) {
				const index = resumeJson.interests.indexOf(interest) + 1;
				ResumeHelper.appendInterest(lines, interest, index);
			}
			lines.push("");
		}

		if (resumeJson.references !== null && resumeJson.references.length > 0) {
			lines.push(Chalk.bold.underline("References:"));
			for (const reference of resumeJson.references) {
				const index = resumeJson.references.indexOf(reference) + 1;
				ResumeHelper.appendReference(lines, reference, index);
			}
			lines.push("");
		}

		if (resumeJson.projects !== null && resumeJson.projects.length > 0) {
			lines.push(Chalk.bold.underline("Projects:"));
			for (const project of resumeJson.projects) {
				const index = resumeJson.projects.indexOf(project) + 1;
				ResumeHelper.appendProject(lines, project, index);
			}
			lines.push("");
		}

		if (resumeJson.meta !== null) {
			ResumeHelper.appendMeta(lines, resumeJson.meta);
		}

		return lines.join("\n");
	}

	///////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////
	//	Section helpers
	///////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////

	private static appendBasics(lines: string[], basics: ResumeBasics): void {
		lines.push(Chalk.bold.underline("Basics:"));
		if (basics.name !== null) {
			lines.push(Chalk.bold(`    Name: ${basics.name}`));
		}
		if (basics.label !== null) {
			lines.push(Chalk.cyan(`    Label: ${basics.label}`));
		}
		if (basics.email !== null) {
			lines.push(`    Email: ${basics.email}`);
		}
		if (basics.phone !== null) {
			lines.push(`    Phone: ${basics.phone}`);
		}
		if (basics.url !== null) {
			lines.push(`    URL: ${basics.url}`);
		}
		if (basics.image !== null) {
			lines.push(`    Image: ${basics.image}`);
		}
		if (basics.summary !== null) {
			lines.push(Chalk.dim(`    Summary: ${basics.summary}`));
		}
		if (basics.location !== null) {
			const location = basics.location;
			const parts: string[] = [];
			if (location.address !== null) parts.push(location.address);
			if (location.postalCode !== null) parts.push(location.postalCode);
			if (location.city !== null) parts.push(location.city);
			if (location.region !== null) parts.push(location.region);
			if (location.countryCode !== null) parts.push(location.countryCode);
			if (parts.length > 0) {
				lines.push(`    Location: ${parts.join(", ")}`);
			}
		}
		if (basics.profiles !== null && basics.profiles.length > 0) {
			lines.push(Chalk.bold("    Profiles:"));
			for (const profile of basics.profiles) {
				const network = profile.network ?? "Unknown";
				const username = profile.username ?? "";
				const url = profile.url ?? "";
				lines.push(`        - ${network}: ${username} ${Chalk.dim(url)}`);
			}
		}
		lines.push("");
	}

	private static appendWork(lines: string[], work: ResumeWork, index: number): void {
		const title = work.position ?? "Unknown Position";
		const company = work.name ?? "Unknown Company";
		const dateRange = ResumeHelper.formatDateRange(work.startDate, work.endDate);
		lines.push(Chalk.bold(`    ${index}. ${title} @ ${company} ${Chalk.dim(dateRange)}`));
		if (work.location !== null) {
			lines.push(Chalk.dim(`       Location: ${work.location}`));
		}
		if (work.url !== null) {
			lines.push(Chalk.dim(`       URL: ${work.url}`));
		}
		if (work.description !== null) {
			lines.push(Chalk.dim(`       ${work.description}`));
		}
		if (work.summary !== null) {
			lines.push(`       Summary: ${work.summary}`);
		}
		if (work.highlights !== null && work.highlights.length > 0) {
			for (const highlight of work.highlights) {
				lines.push(Chalk.green(`       • ${highlight}`));
			}
		}
	}

	private static appendVolunteer(lines: string[], volunteer: ResumeVolunteer, index: number): void {
		const position = volunteer.position ?? "Unknown Position";
		const organization = volunteer.organization ?? "Unknown Organization";
		const dateRange = ResumeHelper.formatDateRange(volunteer.startDate, volunteer.endDate);
		lines.push(Chalk.bold(`    ${index}. ${position} @ ${organization} ${Chalk.dim(dateRange)}`));
		if (volunteer.url !== null) {
			lines.push(Chalk.dim(`       URL: ${volunteer.url}`));
		}
		if (volunteer.summary !== null) {
			lines.push(`       Summary: ${volunteer.summary}`);
		}
		if (volunteer.highlights !== null && volunteer.highlights.length > 0) {
			for (const highlight of volunteer.highlights) {
				lines.push(Chalk.green(`       • ${highlight}`));
			}
		}
	}

	private static appendEducation(lines: string[], education: ResumeEducation, index: number): void {
		const institution = education.institution ?? "Unknown Institution";
		const studyType = education.studyType ?? "";
		const area = education.area ?? "";
		const dateRange = ResumeHelper.formatDateRange(education.startDate, education.endDate);
		const heading = [studyType, area].filter((part) => part !== "").join(" in ");
		lines.push(Chalk.bold(`    ${index}. ${institution} — ${heading} ${Chalk.dim(dateRange)}`));
		if (education.url !== null) {
			lines.push(Chalk.dim(`       URL: ${education.url}`));
		}
		if (education.score !== null) {
			lines.push(`       Score: ${education.score}`);
		}
		if (education.courses !== null && education.courses.length > 0) {
			lines.push(`       Courses:`);
			for (const course of education.courses) {
				lines.push(Chalk.cyan(`         • ${course}`));
			}
		}
	}

	private static appendAward(lines: string[], award: ResumeAward, index: number): void {
		const title = award.title ?? "Unknown Award";
		const date = award.date ?? "";
		const awarder = award.awarder ?? "";
		lines.push(Chalk.bold(`    ${index}. ${title} ${Chalk.dim(date)}`));
		if (awarder !== "") {
			lines.push(`       Awarder: ${awarder}`);
		}
		if (award.summary !== null) {
			lines.push(Chalk.dim(`       ${award.summary}`));
		}
	}

	private static appendCertificate(lines: string[], certificate: ResumeCertificate, index: number): void {
		const name = certificate.name ?? "Unknown Certificate";
		const date = certificate.date ?? "";
		const issuer = certificate.issuer ?? "";
		lines.push(Chalk.bold(`    ${index}. ${name} ${Chalk.dim(date)}`));
		if (issuer !== "") {
			lines.push(`       Issuer: ${issuer}`);
		}
		if (certificate.url !== null) {
			lines.push(Chalk.dim(`       URL: ${certificate.url}`));
		}
	}

	private static appendPublication(lines: string[], publication: ResumePublication, index: number): void {
		const name = publication.name ?? "Unknown Publication";
		const date = publication.releaseDate ?? "";
		lines.push(Chalk.bold(`    ${index}. ${name} ${Chalk.dim(date)}`));
		if (publication.publisher !== null) {
			lines.push(`       Publisher: ${publication.publisher}`);
		}
		if (publication.url !== null) {
			lines.push(Chalk.dim(`       URL: ${publication.url}`));
		}
		if (publication.summary !== null) {
			lines.push(Chalk.dim(`       ${publication.summary}`));
		}
	}

	private static appendSkill(lines: string[], skill: ResumeSkill, index: number): void {
		const name = skill.name ?? "Unknown Skill";
		const level = skill.level ?? "";
		const levelText = level !== "" ? ` (${level})` : "";
		lines.push(Chalk.bold(`    ${index}. ${name}${Chalk.dim(levelText)}`));
		if (skill.keywords !== null && skill.keywords.length > 0) {
			lines.push(Chalk.cyan(`       Keywords: ${skill.keywords.join(", ")}`));
		}
	}

	private static appendLanguage(lines: string[], language: ResumeLanguage, index: number): void {
		const name = language.language ?? "Unknown Language";
		const fluency = language.fluency ?? "";
		const fluencyText = fluency !== "" ? ` — ${fluency}` : "";
		lines.push(`    ${index}. ${Chalk.bold(name)}${Chalk.dim(fluencyText)}`);
	}

	private static appendInterest(lines: string[], interest: ResumeInterest, index: number): void {
		const name = interest.name ?? "Unknown Interest";
		lines.push(Chalk.bold(`    ${index}. ${name}`));
		if (interest.keywords !== null && interest.keywords.length > 0) {
			lines.push(Chalk.cyan(`       Keywords: ${interest.keywords.join(", ")}`));
		}
	}

	private static appendReference(lines: string[], reference: ResumeReference, index: number): void {
		const name = reference.name ?? "Unknown Reference";
		lines.push(Chalk.bold(`    ${index}. ${name}`));
		if (reference.reference !== null) {
			lines.push(Chalk.dim(`       "${reference.reference}"`));
		}
	}

	private static appendProject(lines: string[], project: ResumeProject, index: number): void {
		const name = project.name ?? "Unknown Project";
		const dateRange = ResumeHelper.formatDateRange(project.startDate, project.endDate);
		lines.push(Chalk.bold(`    ${index}. ${name} ${Chalk.dim(dateRange)}`));
		if (project.entity !== null) {
			lines.push(Chalk.dim(`       Entity: ${project.entity}`));
		}
		if (project.type !== null) {
			lines.push(Chalk.dim(`       Type: ${project.type}`));
		}
		if (project.url !== null) {
			lines.push(Chalk.dim(`       URL: ${project.url}`));
		}
		if (project.description !== null) {
			lines.push(`       ${project.description}`);
		}
		if (project.roles !== null && project.roles.length > 0) {
			lines.push(`       Roles: ${project.roles.join(", ")}`);
		}
		if (project.keywords !== null && project.keywords.length > 0) {
			lines.push(Chalk.cyan(`       Keywords: ${project.keywords.join(", ")}`));
		}
		if (project.highlights !== null && project.highlights.length > 0) {
			for (const highlight of project.highlights) {
				lines.push(Chalk.green(`       • ${highlight}`));
			}
		}
	}

	private static appendMeta(lines: string[], meta: ResumeMeta): void {
		lines.push(Chalk.bold.underline("Meta:"));
		if (meta.canonical !== null) {
			lines.push(Chalk.dim(`    Canonical: ${meta.canonical}`));
		}
		if (meta.version !== null) {
			lines.push(Chalk.dim(`    Version: ${meta.version}`));
		}
		if (meta.lastModified !== null) {
			lines.push(Chalk.dim(`    Last Modified: ${meta.lastModified}`));
		}
		lines.push("");
	}

	private static formatDateRange(startDate: string | null, endDate: string | null): string {
		const start = startDate ?? "?";
		const end = endDate ?? "Present";
		return `(${start} — ${end})`;
	}
}
