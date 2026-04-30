import { promises as fs } from 'node:fs';
import * as path from 'node:path';

export type ProfilesSamplesAddOptions = {
        baseUrl: string;
        profileId: string;
        file: string;
        referenceText: string;
};

export type ProfileSampleResponse = {
        id: string;
        profile_id: string;
        audio_path: string;
        reference_text: string;
};

export class CommandProfilesSamplesAdd {
        static async run(options: ProfilesSamplesAddOptions): Promise<void> {
                const encodedId = encodeURIComponent(options.profileId);
                const url = `${options.baseUrl.replace(/\/+$/, '')}/profiles/${encodedId}/samples`;

                const bytes = await fs.readFile(options.file);
                const blob = new Blob([new Uint8Array(bytes)]);
                const form = new FormData();
                form.append('file', blob, path.basename(options.file));
                form.append('reference_text', options.referenceText);

                const response = await fetch(url, {
                        method: 'POST',
                        body: form,
                });
                if (response.ok === false) {
                        const detail = await response.text();
                        throw new Error(`Profile sample add request failed: ${response.status} ${response.statusText} ${detail}`);
                }

                const data = await response.json() as ProfileSampleResponse;
                console.log(JSON.stringify(data, null, 2));
        }
}
