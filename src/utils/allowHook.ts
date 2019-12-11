import * as fs from 'fs';
import * as path from 'path';

import * as execa from 'execa';
import * as express from 'express';

import {CLIArguments} from '../types';

import {getRootDirectory} from './getRootDirectory';

type HookableFunction = (...args: any[]) => void;
const hooks: {[key: string]: HookableFunction} = {};

export enum Hooks {
    /**
     * Register middleware with the 'npm start' server.
     *
     * Any middleware added via this hook will take precedence over the "built-in" middleware.
     */
    APP_MIDDLEWARE,
    /**
     * Register middleware with the testing server.
     *
     * Any middleware added via this hook will take precedence over the "built-in" middleware.
     */
    TEST_MIDDLEWARE,
    /**
     * Hook to override default values for the `npm start` CLI options.
     *
     * Note that using this hook may make some of the text in `npm start --help` inaccurate.
     */
    DEFAULT_ARGS,
}

export interface HooksAPI {
    [Hooks.DEFAULT_ARGS]: () => Partial<CLIArguments>;
    [Hooks.APP_MIDDLEWARE]: (app: express.Express, command: 'start' | 'test') => void;
    [Hooks.TEST_MIDDLEWARE]: (app: express.Express) => void;
}

type FunctionHook<T extends Hooks> = () => HooksAPI[T];
type ValueHook<T extends Hooks> = () => ReturnType<HooksAPI[T]>;

export function loadHooks(): void {
    const hooksPathSrc = path.resolve(getRootDirectory(), 'hooks.ts');
    const hooksPathOut = path.resolve(getRootDirectory(), 'hooks.js');
    if (fs.existsSync(hooksPathSrc)) {
        // Build hooks if first-run, or source was modified
        if (!fs.existsSync(hooksPathOut) || fs.statSync(hooksPathSrc).mtime > fs.statSync(hooksPathOut).mtime) {
            console.log('Building hooks...');
            try {
                execa.sync('tsc', [hooksPathSrc, '--outDir', path.dirname(hooksPathOut), '--moduleResolution', 'node'], {stdio: 'pipe'});
            } catch (e) {
                console.error(`Error building hooks:\n${e.stdout}`);

                // Ensure we don't attempt to use the malformed output on the next run
                if (fs.existsSync(hooksPathOut)) {
                    fs.unlinkSync(hooksPathOut);
                }

                process.exit(1);
            }
        }

        // Import hooks
        require(hooksPathOut);
        console.log('Loaded custom hooks');
    }
}

export function allowHook<T extends Hooks>(id: T, fallback?: HooksAPI[T]|ReturnType<HooksAPI[T]>): HooksAPI[T] {
    const tmp = (...args: any[]) => {
        const callback: HookableFunction = hooks[id] as HooksAPI[T];

        if (callback) {
            return callback(...args);
        } else if (typeof fallback === 'function') {
            return (fallback as HookableFunction)(...args);
        } else {
            return fallback;
        }
    };
    return tmp as HooksAPI[T];
}

export function registerHook<T extends Hooks>(id: T, callback: HooksAPI[T]): void {
    hooks[id] = callback;
}
