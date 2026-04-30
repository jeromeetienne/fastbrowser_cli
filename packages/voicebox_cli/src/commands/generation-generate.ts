export type GenerationGenerateOptions = {
        baseUrl: string;
        profileId: string;
        text: string;
        language?: string;
        seed?: number;
        modelSize?: string;
};

export type GenerationResponse = {
        id: string;
        profile_id: string;
        text: string;
        language: string;
        audio_path: string;
        duration: number;
        seed?: number | null;
        created_at: string;
};

type GenerationRequestBody = {
        profile_id: string;
        text: string;
        language?: string;
        seed?: number;
        model_size?: string;
};

export class CommandGenerationGenerate {
        static async run(options: GenerationGenerateOptions): Promise<void> {
                const url = `${options.baseUrl.replace(/\/+$/, '')}/generate`;

                const body: GenerationRequestBody = {
                        profile_id: options.profileId,
                        text: options.text,
                };
                if (options.language !== undefined) {
                        body.language = options.language;
                }
                if (options.seed !== undefined) {
                        body.seed = options.seed;
                }
                if (options.modelSize !== undefined) {
                        body.model_size = options.modelSize;
                }

                const response = await fetch(url, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(body),
                });
                if (response.ok === false) {
                        const detail = await response.text();
                        throw new Error(`Generate request failed: ${response.status} ${response.statusText} ${detail}`);
                }

                const data = await response.json() as GenerationResponse;
                console.log(JSON.stringify(data, null, 2));
        }
}
