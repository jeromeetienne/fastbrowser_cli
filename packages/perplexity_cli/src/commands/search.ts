import Perplexity from '@perplexity-ai/perplexity_ai';

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
//	Search Command
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

export type SearchOptions = {
	query: string[];
	domain?: string[];
	country?: string;
	language?: string[];
	maxResults: number;
};

export class CommandSearch {
	static async run(options: SearchOptions): Promise<void> {
		// Retrieve API key from environment
		const apiKey = process.env['PERPLEXITY_API_KEY'];
		if (apiKey === undefined || apiKey === '') {
			throw new Error('PERPLEXITY_API_KEY environment variable is required');
		}

		// Initialize Perplexity client
		const client = new Perplexity({ apiKey });

		// Normalize query to string or array
		const query: string | string[] = options.query.length === 1
			? options.query[0]!
			: options.query;

		// Build search parameters
		const params: Perplexity.Search.SearchCreateParams = {
			query,
			max_results: options.maxResults,
		};

		// Apply optional filters
		if (options.domain !== undefined && options.domain.length > 0) {
			params.search_domain_filter = options.domain;
		}
		if (options.country !== undefined) {
			params.country = options.country;
		}
		if (options.language !== undefined && options.language.length > 0) {
			params.search_language_filter = options.language;
		}

		// Execute search
		const response = await client.search.create(params);

		// Output results in markdown format
		for (const result of response.results) {
			console.log(`### ${result.title}`);
			console.log(`${result.url}`);
			console.log(`${result.snippet}\n`);
			console.log('---\n');
		}
	}
}
