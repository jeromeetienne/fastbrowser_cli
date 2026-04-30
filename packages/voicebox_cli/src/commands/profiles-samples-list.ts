export type ProfilesSamplesListOptions = {
        baseUrl: string;
        profileId: string;
};

export type ProfileSampleResponse = {
        id: string;
        profile_id: string;
        audio_path: string;
        reference_text: string;
};

export class CommandProfilesSamplesList {
        static async run(options: ProfilesSamplesListOptions): Promise<void> {
                const encodedId = encodeURIComponent(options.profileId);
                const url = `${options.baseUrl.replace(/\/+$/, '')}/profiles/${encodedId}/samples`;

                const response = await fetch(url);
                if (response.ok === false) {
                        const detail = await response.text();
                        throw new Error(`Profile samples list request failed: ${response.status} ${response.statusText} ${detail}`);
                }

                const data = await response.json() as ProfileSampleResponse[];
                console.log(JSON.stringify(data, null, 2));
        }
}
