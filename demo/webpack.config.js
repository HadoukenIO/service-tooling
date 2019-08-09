const tooling = require('../dist/index').webpackTools;
const outputDir = __dirname + '/dist';

module.exports = [
    tooling.createConfig(`${outputDir}/provider`, './src/client.scss', undefined, tooling.versionPlugin)
    // tooling.createConfig(`${outputDir}/demo`, './src/client.ts', undefined, tooling.versionPlugin)
];
