import Perplexity from '@perplexity-ai/perplexity_ai';

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
//	Deep Search Command
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

export type DeepSearchPreset = 'fast-search' | 'pro-search' | 'deep-research' | 'advanced-deep-research';

export type DeepSearchOptions = {
	query: string;
	preset: DeepSearchPreset;
};

const PRESET_MODELS: Record<DeepSearchPreset, string> = {
	'fast-search': 'sonar',
	'pro-search': 'sonar-pro',
	'deep-research': 'sonar-deep-research',
	'advanced-deep-research': 'sonar-reasoning-pro',
};

export class CommandDeepSearch {
	static async run(options: DeepSearchOptions): Promise<void> {
		const apiKey = process.env['PERPLEXITY_API_KEY'];
		if (apiKey === undefined || apiKey === '') {
			throw new Error('PERPLEXITY_API_KEY environment variable is required');
		}

		const client = new Perplexity({ apiKey });

		const model = PRESET_MODELS[options.preset];

		const response = await client.chat.completions.create({
			model,
			messages: [{ role: 'user', content: options.query }],
		});

		const rawContent = response.choices[0]?.message?.content ?? '';
		const content = CommandDeepSearch._extractText(rawContent);

		process.stdout.write(content + '\n');
	}

	private static _extractText(content: string | Array<{ type: string; text?: string }> | null): string {
		if (content === null) {
			return '';
		}
		if (typeof content === 'string') {
			return content;
		}
		return content
			.filter((chunk): chunk is { type: 'text'; text: string } => chunk.type === 'text' && typeof chunk.text === 'string')
			.map((chunk) => chunk.text)
			.join('');
	}

}
