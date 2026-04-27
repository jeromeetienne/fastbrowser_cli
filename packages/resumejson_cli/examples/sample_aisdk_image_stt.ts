import { generateText, Output } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { readFile } from "node:fs/promises";
import Fs from "node:fs";
import Path from "node:path";

const imageAnalysisSchema = z.object({
	description: z.string().describe("A concise description of the image"),
	objects: z.array(z.string()).describe("Main objects detected"),
	dominantColors: z.array(z.string()).describe("Top 3-5 dominant colors"),
	mood: z.enum(["happy", "neutral", "sad", "energetic", "calm"]),
	containsText: z.boolean(),
	extractedText: z.string().nullable(),
});

export type ImageAnalysis = z.infer<typeof imageAnalysisSchema>;

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
//	
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

export async function analyzeImage(imagePath: string): Promise<ImageAnalysis> {
	const image = await readFile(imagePath);

	const result = await generateText({
		model: openai("gpt-4.1"),
		output: Output.object({ schema: imageAnalysisSchema }),
		messages: [
			{
				role: "user",
				content: [
					{ type: "text", text: "Analyze this image." },
					{ type: "image", image }, // Buffer, Uint8Array, base64 string, or URL
				],
			},
		],
	});
	const output = result.output
	return output;
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
//	
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

const __dirname = new URL('.', import.meta.url).pathname;
const imagePath = Path.resolve(__dirname, "sample_image.png");
const result = await analyzeImage(imagePath);
console.log(result);