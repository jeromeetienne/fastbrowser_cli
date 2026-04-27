import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import Fs from "node:fs";
import Path from "node:path";

const __dirname = new URL('.', import.meta.url).pathname;
const imagePath = Path.resolve(__dirname, "sample_image.png");
const imageBuffer = Fs.readFileSync(imagePath);

const result = await generateText({
	model: openai("gpt-4.1"), // or any multimodal model
	messages: [
		{
			role: "user",
			content: [
				{ type: "text", text: "Describe this image in detail" },
				{
					type: "image",
					image: imageBuffer, // Buffer
				},
			],
		},
	],
});




console.log(result.text);