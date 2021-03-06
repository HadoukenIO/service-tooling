import * as path from 'path';
import * as os from 'os';

import * as execa from 'execa';
import {launch} from 'hadouken-js-adapter';

import {createServer, startServer, createDefaultMiddleware} from '../server/server';
import {CLITestArguments} from '../types';
import {Hook, allowHook} from '../utils/allowHook';
import {getModuleRoot} from '../utils/getModuleRoot';
import {getProjectConfig} from '../utils/getProjectConfig';
import {prepareRuntime} from '../utils/runtime';
import {withTimeout} from '../utils/timeout';

let port: number;
let success: boolean = false;

const cleanup = () => {
    if (/^win/.exec(os.platform())) {
        const cmd = 'taskkill /F /IM openfin.exe /T';
        execa.shellSync(cmd);
    } else {
        const cmd = `lsof -n -i4TCP:${port} | grep LISTEN | awk '{ print $2 }' | xargs kill`;
        execa.shellSync(cmd);
    }
};

const exit = () => {
    process.exit(success ? 0 : 1);
};

const run = (processName: string, args?: any[], execaOptions?: execa.Options) => {
    const p = execa(processName, args, execaOptions);
    p.stdout.pipe(process.stdout);
    p.stderr.pipe(process.stderr);
    return p;
};

export function runIntegrationTests(customJestArgs: string[], cliArgs: CLITestArguments) {
    const jestArgs = customJestArgs.concat([
        '--config',
        path.join(getModuleRoot(), '/testing/jest/jest-int.config.js'),
        '--forceExit',
        '--no-cache',
        '--runInBand'
    ]);

    createServer()
        .then(async (app) => {
            await allowHook(Hook.TEST_MIDDLEWARE)(app);
            return createDefaultMiddleware(app, cliArgs);
        })
        .then(startServer)
        .then(async () => {
            const manifestUrl = `http://localhost:${getProjectConfig().PORT}/test/test-app-main.json`;

            await prepareRuntime(cliArgs);

            console.log('Starting test app');
            const startupTimeoutMillis = 2 * 60 * 1000;
            port = await withTimeout(launch({manifestUrl}), startupTimeoutMillis, () => {
                throw new Error(`Test app didn't start after ${startupTimeoutMillis / 1000} seconds`);
            });
            console.log(`Openfin running on port ${port}`);

            return port;
        })
        .catch((error) => {
            console.error(error);
            throw new Error();
        })
        .then((OF_PORT) => run('jest', jestArgs, {env: {
            OF_PORT: (OF_PORT as number).toString(),
            CLI_ARGS: JSON.stringify(cliArgs)
        }}))
        .then((res) => {
            success = !res.failed;
        })
        .then(cleanup)
        .catch(cleanup)
        .then(exit)
        .catch(exit);
}

export function runUnitTests(customJestArgs: string[]) {
    function onComplete(res: any) {
        process.exit((res.failed === true) ? 1 : 0);
    }
    const jestArgs = customJestArgs.concat([
        '--config',
        path.join(getModuleRoot(), '/testing/jest/jest-unit.config.js')
    ]);

    run('jest', jestArgs).then(onComplete, onComplete);
}
