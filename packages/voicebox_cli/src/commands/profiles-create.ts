export type ProfilesCreateOptions = {
        baseUrl: string;
        name: string;
        description?: string;
        language?: string;
};

export type VoiceProfileResponse = {
        id: string;
        name: string;
        description: string | null;
        language: string;
        created_at: string;
        updated_at: string;
};

type VoiceProfileCreateBody = {
        name: string;
        description?: string;
        language?: string;
};

export class CommandProfilesCreate {
        static async run(options: ProfilesCreateOptions): Promise<void> {
                const url = `${options.baseUrl.replace(/\/+$/, '')}/profiles`;

                const body: VoiceProfileCreateBody = {
                        name: options.name,
                };
                if (options.description !== undefined) {
                        body.description = options.description;
                }
                if (options.language !== undefined) {
                        body.language = options.language;
                }

                const response = await fetch(url, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(body),
                });
                if (response.ok === false) {
                        const detail = await response.text();
                        throw new Error(`Profiles create request failed: ${response.status} ${response.statusText} ${detail}`);
                }

                const data = await response.json() as VoiceProfileResponse;
                console.log(JSON.stringify(data, null, 2));
        }
}
