const fse = require('fs-extra');

fse.emptyDirSync('dist');
fse.outputFile('dist/cyber.less', `@import '../lib/index.less';`);
