import Fs from 'node:fs';
import Path from 'node:path';

const PROJECT_ROOT = Path.resolve(__dirname, '..', '..');

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
//	Install Command
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

export type InstallOptions = {
	skill: boolean;
};

export class CommandInstall {
	static async run(options: InstallOptions): Promise<void> {
		if (options.skill === false) {
			console.log('Nothing to install. Use --skill to install the perplexity skill.');
			return;
		}
		await CommandInstall._installSkill();
	}

	///////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////
	//
	///////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////

	private static _copyDirSync(src: string, dest: string): void {
		Fs.mkdirSync(dest, { recursive: true });
		for (const entry of Fs.readdirSync(src, { withFileTypes: true })) {
			const srcPath = Path.join(src, entry.name);
			const destPath = Path.join(dest, entry.name);
			if (entry.isDirectory()) {
				CommandInstall._copyDirSync(srcPath, destPath);
			} else {
				Fs.copyFileSync(srcPath, destPath);
			}
		}
	}

	private static async _installSkill(): Promise<void> {
		const skillSrc = Path.join(PROJECT_ROOT, 'skills', 'perplexity');

		if (Fs.existsSync(skillSrc) === false) {
			console.error(`Skill source not found: ${skillSrc}`);
			process.exit(1);
		}

		const invokeDir = process.env['INIT_CWD'] ?? process.cwd();
		const skillDest = Path.join(invokeDir, 'skills', 'perplexity');

		console.log(`Installing skill to ${skillDest} ...`);

		try {
			CommandInstall._copyDirSync(skillSrc, skillDest);
			console.log(`Skill installed -> ${skillDest}`);
		} catch (error) {
			console.error(`Install failed: ${error instanceof Error ? error.message : String(error)}`);
			process.exit(1);
		}
	}
}
