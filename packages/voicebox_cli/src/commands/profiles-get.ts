export type ProfilesGetOptions = {
        baseUrl: string;
        profileId: string;
};

export type VoiceProfileResponse = {
        id: string;
        name: string;
        description: string | null;
        language: string;
        created_at: string;
        updated_at: string;
};

export class CommandProfilesGet {
        static async run(options: ProfilesGetOptions): Promise<void> {
                const encodedId = encodeURIComponent(options.profileId);
                const url = `${options.baseUrl.replace(/\/+$/, '')}/profiles/${encodedId}`;

                const response = await fetch(url);
                if (response.ok === false) {
                        const detail = await response.text();
                        throw new Error(`Profiles get request failed: ${response.status} ${response.statusText} ${detail}`);
                }

                const data = await response.json() as VoiceProfileResponse;
                console.log(JSON.stringify(data, null, 2));
        }
}
