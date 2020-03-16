import {existsSync} from 'fs';
import {join, resolve} from 'path';

import fetch from 'node-fetch';

import {getProjectConfig} from './getProjectConfig';
import {getRootDirectory} from './getRootDirectory';

let url: string|null = null;

/**
 * Returns an absolute path to the provider's manifest.
 *
 * This is the local file within the project codebase, use {@link getProviderUrl} to get a reference to the provider
 * manifest that is usable within a manifest or from a fetch.
 */
export function getProviderPath(): string {
    const {IS_SERVICE} = getProjectConfig();
    const manifestPath = IS_SERVICE ? './res/provider/app.json' : './res/app.json';

    return resolve(getRootDirectory(), manifestPath);
}

/**
 * Returns the URL of the manifest file for the requested version of the service.
 *
 * @param version Version number of the service, or a channel
 * @param manifestUrl The URL that was set in the application manifest (if any). Any querystring arguments will be persisted, but the rest of the URL will be ignored.
 */
export function getProviderUrl(version: string, manifestUrl?: string): string /* | undefined*/ {
    if (url) {
        return url;
    }
    const {PORT, CDN_LOCATION} = getProjectConfig();
    const index = (manifestUrl && manifestUrl.indexOf('?')) || -1;
    const query = manifestUrl && index >= 0 ? manifestUrl.substr(index) : '';

    if (version === 'local') {
        const demoProviderResponse = existsSync(join(getRootDirectory(), 'res/demo/provider.json'));

        if (demoProviderResponse) {
            url = `http://localhost:${PORT}/demo/provider.json${query}`;
            return url;
        } else {
            url = `http://localhost:${PORT}/provider/app.json${query}`;
            return url;
        }
    } else if (version === 'stable') {
        // Use the latest stable version
        url = `${CDN_LOCATION}/app.json${query}`;
        return url;
    } else if (version === 'staging') {
        // Use the latest staging build
        url = `${CDN_LOCATION}/app.staging.json${query}`;
        return url;
    } else if (version === 'testing') {
        // Use the optional testing provider if exists.
        const testingProviderResponse = existsSync(join(getRootDirectory(), 'res/test/provider.json'));

        if (testingProviderResponse) {
            url = `http://localhost:${PORT}/test/provider.json${query}`;
            return url;
        } else {
            url = `http://localhost:${PORT}/provider/app.json${query}`;
            return url;
        }
    } else if (version.indexOf('://') > 0) {
        // Looks like an absolute URL to an app.json file
        url = version;
        return url;
    } else if (/\d+\.\d+\.\d+/.test(version)) {
        // Use a specific public release of the service
        url = `${CDN_LOCATION}/${version}/app.json${query}`;
        return url;
    } else {
        throw new Error(`Not a valid version number or channel: ${version}`);
    }
}

export async function getManifest(manifestUrl: string): Promise<any> {
    const fetchRequest = await fetch(manifestUrl).catch((err: string) => {
        throw new Error(err);
    });

    if (fetchRequest.status === 200) {
        return fetchRequest.json();
    } else {
        throw new Error(`Invalid response from server: Status code: ${fetchRequest.status}`);
    }
}
