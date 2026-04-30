import { promises as fs } from 'node:fs';
import * as path from 'node:path';

export type GenerationTranscribeOptions = {
        baseUrl: string;
        file: string;
        language?: string;
};

export type TranscriptionResponse = {
        text: string;
        duration: number;
};

export class CommandGenerationTranscribe {
        static async run(options: GenerationTranscribeOptions): Promise<void> {
                const url = `${options.baseUrl.replace(/\/+$/, '')}/transcribe`;

                const bytes = await fs.readFile(options.file);
                const blob = new Blob([new Uint8Array(bytes)]);
                const form = new FormData();
                form.append('file', blob, path.basename(options.file));
                if (options.language !== undefined) {
                        form.append('language', options.language);
                }

                const response = await fetch(url, {
                        method: 'POST',
                        body: form,
                });
                if (response.ok === false) {
                        const detail = await response.text();
                        throw new Error(`Transcribe request failed: ${response.status} ${response.statusText} ${detail}`);
                }

                const data = await response.json() as TranscriptionResponse;
                console.log(JSON.stringify(data, null, 2));
        }
}
