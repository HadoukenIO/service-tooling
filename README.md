# OpenFin Service Tooling


## Overview

Extracts out common build and server components which can be shared across different service development environments.

### Dependencies
- None.

### Features
* Common build utils
* Common server and demo launching utils

## API
* **svc-tools start [...options]**

    Starts the build and serves the project.

    - Options: 
        - -v, --providerVersion <version>: Sets the runtime version for the provider.  Defaults to "local". Options: local | staging | stable | w.x.y.z'.
        - -m, --mode <mode>: Sets the webpack mode.  Defaults to "development".  Options: development | production | none'
        - -n, --noDemo: Runs the server but will not launch the demo application.
        - -s, --static: Launches the server and application using pre-built files.
        - -w, --writeToDisk: Writes and serves the built files from disk.

* **svc-tools build [...options]**

    Invokes webpack to build the project.

    - Options: 
        - -m, --mode <mode>: Sets the webpack mode.  Defaults to "production".

* **svc-tools zip**


    Zips the project.


* **Exports**

    These are exported by the project and can be used by importing the package.
    
    - webpack
        - createConfig: Creates a webpack configuration
        - versionPlugin: Replaces 'PACKAGE_VERSION' constant in source files with the current version of the service
        - manifestPlugin: Provider temporarily requires an extra plugin to override index.html within provider app.json

## Roadmap
This is a WIP as services continue to evolve.

### Usage
An in-depth usage guide and additional documentation will be published in due course.

## Getting Started

Install as a node module to your existing service project.

### Setup

- After installing, add a script to your projects package.json with the command: `svc-tools start` 
- In your webpack.config.js, import `openfin-service-tooling` - this will expose the common webpack utils to create configurations and export.

You can then invoke `svc-tools start` added previously to build and serve your project.

### Startup
Once dependencies are installed and imported, you can invoke `svc-tools start` to build and serve your project.

## Known Issues
A list of known issues will be here.

## Contributing

1. Fork it (<https://github.com/yourname/yourproject/fork>)
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Read our [contribution guidelines](.github/CONTRIBUTING.md) and [Community Code of Conduct](https://www.finos.org/code-of-conduct)
4. Commit your changes (`git commit -am 'Add some fooBar'`)
5. Push to the branch (`git push origin feature/fooBar`)
6. Create a new Pull Request

_NOTE:_ Commits and pull requests to FINOS repositories will only be accepted from those contributors with an active, executed Individual Contributor License Agreement (ICLA) with FINOS OR who are covered under an existing and active Corporate Contribution License Agreement (CCLA) executed with FINOS. Commits from individuals not covered under an ICLA or CCLA will be flagged and blocked by the FINOS Clabot tool. Please note that some CCLAs require individuals/employees to be explicitly named on the CCLA.

*Need an ICLA? Unsure if you are covered under an existing CCLA? Email [help@finos.org](mailto:help@finos.org)*

## License
This project uses the [Apache2 license](https://www.apache.org/licenses/LICENSE-2.0)

However, if you run this code, it may call on the OpenFin RVM or OpenFin Runtime, which are covered by OpenFin's Developer, Community, and Enterprise licenses. You can learn more about OpenFin licensing at the links listed below or just email us at support@openfin.co with questions.

https://openfin.co/developer-agreement/
https://openfin.co/licensing/

## Support
This is an open source project and all are encouraged to contribute.
Please enter an issue in the repo for any questions or problems. Alternatively, please contact us at support@openfin.co
