import { generateText } from 'ai';
import { openai } from "@ai-sdk/openai";
import { createOpenAI } from '@ai-sdk/openai';
import KeyvSqlite from '@keyv/sqlite';
import { Cacheable } from "cacheable";
import OpenAICache from 'openai-cache';

const __dirname = new URL('.', import.meta.url).pathname;

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
//	
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

async function main(): Promise<void> {
	// init OpenAI cache with sqlite backend (you can use any Keyv backend or even an in-memory cache)
	const sqlitePath = `sqlite://${__dirname}/.openai_cache.sqlite`;
	const sqliteCache = new Cacheable({ secondary: new KeyvSqlite(sqlitePath) });
	const openaiCache = new OpenAICache(sqliteCache, {
		markResponseEnabled: true, // enable marking cached responses with a special header
	});

	const openai = createOpenAI({
		apiKey: process.env.OPENAI_API_KEY,
		fetch: openaiCache.getFetchFn(), // use the caching fetch function
	});

	const { text } = await generateText({
		model: openai("gpt-4.1-nano"),
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

