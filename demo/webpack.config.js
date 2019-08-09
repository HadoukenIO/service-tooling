const tooling = require('../dist/index').webpackTools;
const outputDir = __dirname + '/dist';

module.exports = [
    tooling.createConfig(`${outputDir}/provider`, {
        client: './src/client.ts',
        styles: './src/client.scss'
    },
        {
            extractStyles: {
                name: 'stylesheet'
            }
        }
    ),
    // tooling.createConfig(`${outputDir}/demo`, './src/client.ts', undefined, tooling.versionPlugin),
    // tooling.createConfig(`${outputDir}/provider`, './src/index.ts', undefined, tooling.versionPlugin)
];
