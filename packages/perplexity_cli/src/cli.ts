#!/usr/bin/env node
import * as Commander from 'commander';
import { CommandSearch } from './commands/search.js';
import { CommandDeepSearch, type DeepSearchPreset } from './commands/deep-search.js';
import { CommandInstall } from './commands/install.js';

const collect = (val: string, prev: string[]): string[] => [...prev, val];

const program = new Commander.Command();

program
	.name('perplexity-cli')
	.description('Search the web using Perplexity AI')
	.version('1.0.0');

program
	.command('search')
	.description('Search the web and return results')
	.requiredOption('-q, --query <query>', 'Search query (repeatable, up to 5)', collect, [] as string[])
	.option('--domain <domain>', 'Domain filter — repeatable, prefix with - to block (e.g. --domain -example.com)', collect, [] as string[])
	.option('--country <code>', 'ISO 3166-1 alpha-2 country code for regional results (e.g. US, FR)')
	.option('--language <code>', 'ISO 639-1 language code filter — repeatable', collect, [] as string[])
	.option('--max-results <n>', 'Number of results to return (1-20)', '10')
	.action(async (options: { query: string[]; domain: string[]; country?: string; language: string[]; maxResults: string }) => {
		try {
			await CommandSearch.run({
				query: options.query,
				domain: options.domain.length > 0 ? options.domain : undefined,
				country: options.country,
				language: options.language.length > 0 ? options.language : undefined,
				maxResults: parseInt(options.maxResults, 10),
			});
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			process.stderr.write(`Error: ${message}\n`);
			process.exit(1);
		}
	});

program
	.command('deep-search')
	.description('Run a comprehensive research query using Perplexity AI presets')
	.requiredOption('-q, --query <query>', 'Search query')
	.option('-p, --preset <preset>', 'Preset: fast-search | pro-search | deep-research | advanced-deep-research', 'fast-research')
	.action(async (options: { query: string; preset: string }) => {
		const validPresets: DeepSearchPreset[] = ['fast-search', 'pro-search', 'deep-research', 'advanced-deep-research'];
		if (validPresets.includes(options.preset as DeepSearchPreset) === false) {
			process.stderr.write(`Error: Invalid preset "${options.preset}". Must be one of: ${validPresets.join(', ')}\n`);
			process.exit(1);
		}
		try {
			await CommandDeepSearch.run({
				query: options.query,
				preset: options.preset as DeepSearchPreset,
			});
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			process.stderr.write(`Error: ${message}\n`);
			process.exit(1);
		}
	});

program
	.command('install')
	.description('Install the perplexity skill into the current working directory')
	.option('--skill', 'Install the perplexity skill folder')
	.action(async (options: { skill?: boolean }) => {
		await CommandInstall.run({ skill: options.skill === true });
	});

program.parseAsync(process.argv);
