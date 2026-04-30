export type ProfilesListOptions = {
        baseUrl: string;
};

export type VoiceProfileResponse = {
        id: string;
        name: string;
        description: string | null;
        language: string;
        created_at: string;
        updated_at: string;
};

export class CommandProfilesList {
        static async run(options: ProfilesListOptions): Promise<void> {
                const url = `${options.baseUrl.replace(/\/+$/, '')}/profiles`;

                const response = await fetch(url);
                if (response.ok === false) {
                        const detail = await response.text();
                        throw new Error(`Profiles list request failed: ${response.status} ${response.statusText} ${detail}`);
                }

                const data = await response.json() as VoiceProfileResponse[];
                console.log(JSON.stringify(data, null, 2));
        }
}
