export interface CLIArguments {
    /**
     * Chooses which version of the provider to run against. Will default to building and running a local version
     * of the provider.
     *
     * - "local"
     *   Starts a local version of the provider, built from the code in 'src/provider'
     * - "stable"
     *   Runs the latest public release of the service from the OpenFin CDN
     * - "staging"
     *   Runs the latest internal build of the service from the OpenFin CDN. May be unstable.
     * - <version number>
     *   Specifiying a "x.y.z" version number will load that version of the service from the OpenFin CDN.
     */
    providerVersion: string;

    /**
     * The mode to use for webpack, either 'development' (default) or 'production'.
     */
    mode: WebpackMode;

    /**
     * If the demo application should be launched after building (default: true).
     *
     * Otherwise will build and start the local server, but not automatically launch any applications.
     */
    noDemo: boolean;

    /**
     * Rather than building the application via webpack (and then watching for any source file changes), will launch the
     * provider from pre-built code within the 'dist' directory.
     *
     * You should first build the provider using either 'npm run build' or 'npm run build:dev'.
     * This option has no effect if '--version' is set to anything other than 'local'.
     */
    static: boolean;

    /**
     * By default, webpack-dev-server builds and serves files from memory without writing to disk.
     * Using this option will also write the output to the 'dist' folder, as if running one of the 'build' scripts.
     */
    writeToDisk: boolean;

    /**
     * Sets the runtime version to be used in place of values in loaded app.json files.
     */
    runtime?: string;
}

export interface BuildCommandArgs {
    mode: WebpackMode;
}

/**
 * Available modes for webpack to run against.
 */
export type WebpackMode = 'development'|'production'|'none';

/**
 * Acceptable arguments to use when running integration tests (test:int)
 */
export interface CLITestArguments extends CLIArguments {
    /**
     * Only runs tests whose names match the given pattern.
     */
    filter?: string;

    /**
     * Runs all tests in the given file.
     */
    fileNames?: string[];

    /**
     * Disables color for terminal output.
     */
    noColor?: boolean;

    /**
     * Any extra arguments which will be passed on to Jest/runner but not processed by any methods of this service.
     */
    extraArgs?: string[];
}

/**
 * The possibilities for type of test Jest is running.  Unit or Integration.
 */
export type JestMode = 'int'|'unit';
