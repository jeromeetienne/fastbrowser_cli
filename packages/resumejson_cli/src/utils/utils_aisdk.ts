// node imports
import Path from 'node:path';

// npm imports
import * as AiSdkOpenAI from '@ai-sdk/openai';
import * as AiSdkOpenAiCompatible from '@ai-sdk/openai-compatible';
import * as AiSdk from 'ai';
import * as AiSdkProvider from '@ai-sdk/provider';
import KeyvSqlite from '@keyv/sqlite';
import { Cacheable } from "cacheable";
import OpenAICache from 'openai-cache';

const __dirname = new URL('.', import.meta.url).pathname;
const PROJECT_ROOT = Path.resolve(__dirname, '../..');

export class UtilsAisdk {

	static async openaiAiSdk(): Promise<AiSdkOpenAI.OpenAIProvider> {
		// init OpenAI cache with sqlite backend (you can use any Keyv backend or even an in-memory cache)
		const sqlitePath = Path.resolve(PROJECT_ROOT, '.openai_cache.sqlite');
		const sqliteUrl = `sqlite://${sqlitePath}`;
		const sqliteCache = new Cacheable({ secondary: new KeyvSqlite(sqliteUrl) });
		const openaiCache = new OpenAICache(sqliteCache, {
			markResponseEnabled: true, // enable marking cached responses with a special header
		});

		const openaiAiSdk = AiSdkOpenAI.createOpenAI({
			apiKey: process.env.OPENAI_API_KEY,
			fetch: openaiCache.getFetchFn(), // use the caching fetch function
		});


		return openaiAiSdk;
	}


	static async getAiSdkLanguageModel(): Promise<AiSdk.LanguageModel> {
		const modelName = process.env.AI_SDK_MODEL_NAME || 'gpt-3.5-turbo';

		// init OpenAI cache with sqlite backend (you can use any Keyv backend or even an in-memory cache)
		const sqlitePath = Path.resolve(PROJECT_ROOT, '.openai_cache.sqlite');
		const sqliteUrl = `sqlite://${sqlitePath}`;
		const sqliteCache = new Cacheable({ secondary: new KeyvSqlite(sqliteUrl) });
		const openaiCache = new OpenAICache(sqliteCache, {
			markResponseEnabled: true, // enable marking cached responses with a special header
		});



		let aiSdkLanguageModel: AiSdk.LanguageModel;
		const isOpenaiProvider = modelName.startsWith("gpt-") || modelName.startsWith("text-davinci-") || modelName.startsWith("code-davinci-");
		if (isOpenaiProvider) {
			const aiSdkProvider: AiSdkOpenAI.OpenAIProvider = AiSdkOpenAI.createOpenAI({
				apiKey: process.env.OPENAI_API_KEY,
				fetch: openaiCache.getFetchFn(), // use the caching fetch function
			});
			aiSdkLanguageModel = aiSdkProvider(modelName);
		} else {
			const aiSdkProvider: AiSdkOpenAiCompatible.OpenAICompatibleProvider = AiSdkOpenAiCompatible.createOpenAICompatible({
				// const aiSdkProvider: AiSdkProvider.ProviderV3 = AiSdkOpenAiCompatible.createOpenAICompatible({
				name: 'lmstudio',
				baseURL: 'http://localhost:1234/v1',
				fetch: openaiCache.getFetchFn(), // use the caching fetch function
			});
			aiSdkLanguageModel = aiSdkProvider(modelName);
		}

		return aiSdkLanguageModel;
	}
}