
import * as path from 'path';

import {getProjectConfig} from '../utils/getProjectConfig';
import {getRootDirectory} from '../utils/getRootDirectory';

const asar = require('asar');
const fs = require('fs-extra');
const glob = require('glob');
const openfinSign = require('openfin-sign');

/**
 * Creates a zip archive of the service provider.
 */
export async function createAsar() {
    const {SERVICE_NAME} = getProjectConfig();
    const output = path.resolve(getRootDirectory(), 'dist', 'asar');

    fs.emptyDirSync(output);

    [
        path.resolve(getRootDirectory(), 'dist', 'provider'),
        path.resolve(getRootDirectory(), 'res', 'provider')
    ].forEach((file) => {
        fs.copySync(file, output);
    });

    [
        path.resolve(getRootDirectory(), 'dist', 'client', `openfin-${SERVICE_NAME}.js`)
    ].forEach((file) => {
        fs.copyFileSync(file, path.resolve(output, path.basename(file)));
    });

    [
        ...glob.sync(path.resolve(output, '**', '*'), {dot: true})
    ].forEach((file) => {
        if (!fs.statSync(file).isDirectory() && !file.endsWith('.ofds')) {
            console.log(`signing ${file}`);
            openfinSign(file);
        }
    });

    const asarfile = path.resolve(getRootDirectory(), 'dist', 'asar', `${SERVICE_NAME}.asar`);
    await asar.createPackage(output, asarfile);
    openfinSign(asarfile);

    console.log(`Asar file created at '${output}'`);
}
