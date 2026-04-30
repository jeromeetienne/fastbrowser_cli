import { promises as fs } from 'node:fs';

export type GenerationGetOptions = {
        baseUrl: string;
        generationId: string;
        output: string;
};

export class CommandGenerationGet {
        static async run(options: GenerationGetOptions): Promise<void> {
                const encodedId = encodeURIComponent(options.generationId);
                const url = `${options.baseUrl.replace(/\/+$/, '')}/audio/${encodedId}`;

                const response = await fetch(url);
                if (response.ok === false) {
                        const detail = await response.text();
                        throw new Error(`Audio request failed: ${response.status} ${response.statusText} ${detail}`);
                }

                const buffer = await response.arrayBuffer();
                const bytes = new Uint8Array(buffer);
                await fs.writeFile(options.output, bytes);
                console.log(`Wrote ${bytes.byteLength} bytes to ${options.output}`);
        }
}
