const fse = require('fs-extra');
const { version } = require('../package.json');

fse.outputFile('components/version/index.js', `export default '${version}';`);
