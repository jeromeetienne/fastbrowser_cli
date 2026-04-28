// node imports
import Path from 'node:path';

// npm imports
import * as AiSdkOpenAI from '@ai-sdk/openai';
import * as AiSdkOpenAiCompatible from '@ai-sdk/openai-compatible';
import * as AiSdk from 'ai';
import KeyvSqlite from '@keyv/sqlite';
import { Cacheable } from "cacheable";
import OpenAICache from 'openai-cache';



const __dirname = new URL('.', import.meta.url).pathname;
const PROJECT_ROOT = Path.resolve(__dirname, '..');

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
//	
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////


export class UtilsAisdk {
	private static _providerRegistry: AiSdk.ProviderRegistryProvider | null = null;

	///////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////
	//	
	///////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////

	/**
	 * 
	 * @param providerModelName "openai:gpt-4.1-nano" or "lmstudio:gemma-4-e2b" for example
	 * @returns 
	 */
	static async getAiSdkLanguageModel(providerModelName: string): Promise<AiSdk.LanguageModel> {
		console.log(`Getting AI SDK language model for provider model name: ${providerModelName}`);
		// Get or create provider registry
		const providerRegistry = await UtilsAisdk.getOrCreateRegistry();
		// Get language model from registry
		const aiSdkLanguageModel: AiSdk.LanguageModel = providerRegistry.languageModel(providerModelName as `${string}:${string}`);
		// Return language model
		return aiSdkLanguageModel;
	}

	///////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////
	//	
	///////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////

	private static async getOrCreateRegistry(): Promise<AiSdk.ProviderRegistryProvider> {
		if (UtilsAisdk._providerRegistry === null) {
			UtilsAisdk._providerRegistry = await UtilsAisdk.createRegistry();
		}
		return UtilsAisdk._providerRegistry;
	}

	private static async createRegistry(): Promise<AiSdk.ProviderRegistryProvider> {
		// init OpenAI cache with sqlite backend (you can use any Keyv backend or even an in-memory cache)
		const sqlitePath = Path.resolve(PROJECT_ROOT, '.openai_cache.sqlite');
		const sqliteUrl = `sqlite://${sqlitePath}`;
		const sqliteCache = new Cacheable({ secondary: new KeyvSqlite(sqliteUrl) });
		const openaiCache = new OpenAICache(sqliteCache, {
			markResponseEnabled: true, // enable marking cached responses with a special header
		});

		// create provider OpenAI
		const aiSdkProviderOpenAI: AiSdkOpenAI.OpenAIProvider = AiSdkOpenAI.createOpenAI({
			apiKey: process.env.OPENAI_API_KEY,
			fetch: openaiCache.getFetchFn(), // use the caching fetch function
		});

		// create provider LM Studio (OpenAI compatible)
		const aiSdkProviderLmStudio: AiSdkOpenAiCompatible.OpenAICompatibleProvider = AiSdkOpenAiCompatible.createOpenAICompatible({
			// const aiSdkProvider: AiSdkProvider.ProviderV3 = AiSdkOpenAiCompatible.createOpenAICompatible({
			name: 'lmstudio',
			baseURL: 'http://localhost:1234/v1',
			fetch: openaiCache.getFetchFn(), // use the caching fetch function
		});

		// create provider registry
		const providerRegistry: AiSdk.ProviderRegistryProvider = AiSdk.createProviderRegistry({
			openai: aiSdkProviderOpenAI,
			lmstudio: aiSdkProviderLmStudio,
		});

		// register providers
		return providerRegistry;
	}
}
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
//	
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

async function main(): Promise<void> {
	const providerModelName = process.env.AISDK_MODEL_NAME || 'openai:gpt-3.5-turbo';
	const aiSdkLanguageModel = await UtilsAisdk.getAiSdkLanguageModel(providerModelName);

	const { text } = await AiSdk.generateText({
		model: aiSdkLanguageModel,
		prompt: 'Write a one-sentence summary of what a resume is.',
	});

	console.log(text);
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
//	
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

void main();

