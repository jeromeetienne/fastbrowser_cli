#!/usr/bin/env node
import * as Commander from 'commander';
import { CommandHealth } from './commands/health.js';
import { CommandGenerationGenerate } from './commands/generation-generate.js';
import { CommandGenerationTranscribe } from './commands/generation-transcribe.js';
import { CommandGenerationGet } from './commands/generation-get.js';
import { CommandProfilesList } from './commands/profiles-list.js';
import { CommandProfilesCreate } from './commands/profiles-create.js';
import { CommandProfilesGet } from './commands/profiles-get.js';
import { CommandProfilesUpdate } from './commands/profiles-update.js';
import { CommandProfilesDelete } from './commands/profiles-delete.js';
import { CommandProfilesSamplesAdd } from './commands/profiles-samples-add.js';
import { CommandProfilesSamplesList } from './commands/profiles-samples-list.js';
import { CommandProfilesSamplesDelete } from './commands/profiles-samples-delete.js';

const DEFAULT_BASE_URL = 'http://localhost:17493';

const baseUrlDefault = (): string => process.env['VOICEBOX_BASE_URL'] ?? DEFAULT_BASE_URL;

const fail = (error: unknown): never => {
	const message = error instanceof Error ? error.message : String(error);
	process.stderr.write(`Error: ${message}\n`);
	process.exit(1);
};

const program = new Commander.Command();

program

	.name('voicebox-cli')
	.description('CLI for the Voicebox REST API')
	.version('1.0.0');

program
	.command('health')
	.description('Check the Voicebox server health endpoint')
	.option('--base-url <url>', 'Base URL of the Voicebox server', baseUrlDefault())
	.action(async (options: { baseUrl: string }) => {
		try {
			await CommandHealth.run({ baseUrl: options.baseUrl });
		} catch (error) {
			fail(error);
		}
	});

const generation = program
	.command('generation')
	.description('Voice generation, transcription, and audio retrieval');

generation
	.command('generate')
	.description('Generate speech from text using a voice profile')
	.requiredOption('--profile-id <id>', 'Voice profile ID')
	.requiredOption('--text <text>', 'Text to synthesize (1-5000 chars)')
	.option('--language <lang>', 'Language code: en or zh')
	.option('--seed <n>', 'Non-negative integer seed for reproducibility', (value) => Number.parseInt(value, 10))
	.option('--model-size <size>', 'Model size: 1.7B or 0.6B')
	.option('--base-url <url>', 'Base URL of the Voicebox server', baseUrlDefault())
	.action(async (options: {
		profileId: string;
		text: string;
		language?: string;
		seed?: number;
		modelSize?: string;
		baseUrl: string;
	}) => {
		try {
			await CommandGenerationGenerate.run({
				baseUrl: options.baseUrl,
				profileId: options.profileId,
				text: options.text,
				language: options.language,
				seed: options.seed,
				modelSize: options.modelSize,
			});
		} catch (error) {
			fail(error);
		}
	});

generation
	.command('transcribe')
	.description('Transcribe an audio file to text')
	.requiredOption('--file <path>', 'Path to local audio file to upload')
	.option('--language <lang>', 'Optional language code hint')
	.option('--base-url <url>', 'Base URL of the Voicebox server', baseUrlDefault())
	.action(async (options: {
		file: string;
		language?: string;
		baseUrl: string;
	}) => {
		try {
			await CommandGenerationTranscribe.run({
				baseUrl: options.baseUrl,
				file: options.file,
				language: options.language,
			});
		} catch (error) {
			fail(error);
		}
	});

generation
	.command('get <generationId>')
	.description('Download generated audio by generation ID')
	.requiredOption('--output <path>', 'Local file path to write audio to')
	.option('--base-url <url>', 'Base URL of the Voicebox server', baseUrlDefault())
	.action(async (generationId: string, options: { output: string; baseUrl: string }) => {
		try {
			await CommandGenerationGet.run({
				baseUrl: options.baseUrl,
				generationId,
				output: options.output,
			});
		} catch (error) {
			fail(error);
		}
	});

const profiles = program
	.command('profiles')
	.description('Voice profile management');

profiles
	.command('list')
	.description('List all voice profiles')
	.option('--base-url <url>', 'Base URL of the Voicebox server', baseUrlDefault())
	.action(async (options: { baseUrl: string }) => {
		try {
			await CommandProfilesList.run({ baseUrl: options.baseUrl });
		} catch (error) {
			fail(error);
		}
	});

profiles
	.command('create')
	.description('Create a new voice profile')
	.requiredOption('--name <name>', 'Profile name (1-100 chars)')
	.option('--description <text>', 'Profile description (up to 500 chars)')
	.option('--language <lang>', 'Language code: en or zh')
	.option('--base-url <url>', 'Base URL of the Voicebox server', baseUrlDefault())
	.action(async (options: {
		name: string;
		description?: string;
		language?: string;
		baseUrl: string;
	}) => {
		try {
			await CommandProfilesCreate.run({
				baseUrl: options.baseUrl,
				name: options.name,
				description: options.description,
				language: options.language,
			});
		} catch (error) {
			fail(error);
		}
	});

profiles
	.command('get <profileId>')
	.description('Get a voice profile by ID')
	.option('--base-url <url>', 'Base URL of the Voicebox server', baseUrlDefault())
	.action(async (profileId: string, options: { baseUrl: string }) => {
		try {
			await CommandProfilesGet.run({
				baseUrl: options.baseUrl,
				profileId,
			});
		} catch (error) {
			fail(error);
		}
	});

profiles
	.command('update <profileId>')
	.description('Update a voice profile')
	.requiredOption('--name <name>', 'Profile name (1-100 chars)')
	.option('--description <text>', 'Profile description (up to 500 chars)')
	.option('--language <lang>', 'Language code: en or zh')
	.option('--base-url <url>', 'Base URL of the Voicebox server', baseUrlDefault())
	.action(async (profileId: string, options: {
		name: string;
		description?: string;
		language?: string;
		baseUrl: string;
	}) => {
		try {
			await CommandProfilesUpdate.run({
				baseUrl: options.baseUrl,
				profileId,
				name: options.name,
				description: options.description,
				language: options.language,
			});
		} catch (error) {
			fail(error);
		}
	});

profiles
	.command('delete <profileId>')
	.description('Delete a voice profile')
	.option('--base-url <url>', 'Base URL of the Voicebox server', baseUrlDefault())
	.action(async (profileId: string, options: { baseUrl: string }) => {
		try {
			await CommandProfilesDelete.run({
				baseUrl: options.baseUrl,
				profileId,
			});
		} catch (error) {
			fail(error);
		}
	});

const samples = profiles
	.command('samples')
	.description('Manage voice profile audio samples');

samples
	.command('add <profileId>')
	.description('Add an audio sample to a voice profile')
	.requiredOption('--file <path>', 'Path to local audio file to upload')
	.requiredOption('--reference-text <text>', 'Reference text spoken in the audio file')
	.option('--base-url <url>', 'Base URL of the Voicebox server', baseUrlDefault())
	.action(async (profileId: string, options: {
		file: string;
		referenceText: string;
		baseUrl: string;
	}) => {
		try {
			await CommandProfilesSamplesAdd.run({
				baseUrl: options.baseUrl,
				profileId,
				file: options.file,
				referenceText: options.referenceText,
			});
		} catch (error) {
			fail(error);
		}
	});

samples
	.command('list <profileId>')
	.description('List all samples for a voice profile')
	.option('--base-url <url>', 'Base URL of the Voicebox server', baseUrlDefault())
	.action(async (profileId: string, options: { baseUrl: string }) => {
		try {
			await CommandProfilesSamplesList.run({
				baseUrl: options.baseUrl,
				profileId,
			});
		} catch (error) {
			fail(error);
		}
	});

samples
	.command('delete <sampleId>')
	.description('Delete a profile sample by ID')
	.option('--base-url <url>', 'Base URL of the Voicebox server', baseUrlDefault())
	.action(async (sampleId: string, options: { baseUrl: string }) => {
		try {
			await CommandProfilesSamplesDelete.run({
				baseUrl: options.baseUrl,
				sampleId,
			});
		} catch (error) {
			fail(error);
		}
	});

program.parseAsync(process.argv);
