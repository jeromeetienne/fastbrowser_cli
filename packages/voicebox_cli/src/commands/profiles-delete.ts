export type ProfilesDeleteOptions = {
        baseUrl: string;
        profileId: string;
};

export class CommandProfilesDelete {
        static async run(options: ProfilesDeleteOptions): Promise<void> {
                const encodedId = encodeURIComponent(options.profileId);
                const url = `${options.baseUrl.replace(/\/+$/, '')}/profiles/${encodedId}`;

                const response = await fetch(url, { method: 'DELETE' });
                if (response.ok === false) {
                        const detail = await response.text();
                        throw new Error(`Profiles delete request failed: ${response.status} ${response.statusText} ${detail}`);
                }

                const data = await response.json() as unknown;
                console.log(JSON.stringify(data, null, 2));
        }
}
