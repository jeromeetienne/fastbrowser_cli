export type ProfilesUpdateOptions = {
        baseUrl: string;
        profileId: string;
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

type VoiceProfileUpdateBody = {
        name: string;
        description?: string;
        language?: string;
};

export class CommandProfilesUpdate {
        static async run(options: ProfilesUpdateOptions): Promise<void> {
                const encodedId = encodeURIComponent(options.profileId);
                const url = `${options.baseUrl.replace(/\/+$/, '')}/profiles/${encodedId}`;

                const body: VoiceProfileUpdateBody = {
                        name: options.name,
                };
                if (options.description !== undefined) {
                        body.description = options.description;
                }
                if (options.language !== undefined) {
                        body.language = options.language;
                }

                const response = await fetch(url, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(body),
                });
                if (response.ok === false) {
                        const detail = await response.text();
                        throw new Error(`Profiles update request failed: ${response.status} ${response.statusText} ${detail}`);
                }

                const data = await response.json() as VoiceProfileResponse;
                console.log(JSON.stringify(data, null, 2));
        }
}
