import copy from 'rollup-plugin-copy';
import fse from 'fs-extra';

export default () => {
  return {
    name: 'less-build',
    buildEnd: () => {
      let copyInstance = copy({
        targets: [
          { src: 'components/**/*.less', dest: 'lib' },
        ],
        hook: 'buildEnd',
        flatten: false,
      });
      fse.emptyDirSync('lib');
      copyInstance.buildEnd();
      fse.outputFile('dist/cyber.less', `@import '../lib/index.less';`);
    },
  }
}