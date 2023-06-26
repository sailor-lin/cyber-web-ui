const gulp = require('gulp');
const babel = require('gulp-babel');
const fse = require('fs-extra');
const replace = require('gulp-replace');

function compile(modules) {
  fse.emptyDirSync(modules === false ? 'es' : 'lib');
  gulp.src(['components/style/iconfont/*'])
    .pipe(gulp.dest(`${modules === false ? 'es' : 'lib'}/style/iconfont`));
  gulp.src(['components/**/*.less'])
    .pipe(gulp.dest(modules === false ? 'es' : 'lib'));
  gulp.src(['components/**/*.jsx', 'components/**/*.js',])
    .pipe(babel({
      presets: [
        [
          require.resolve('@babel/preset-env'),
          {
            modules: modules,
            targets: {
              browsers: ['last 2 versions', 'Firefox ESR', '> 1%', 'ie >= 11'],
            },
          },
        ],
      ],
      plugins: [
        [require.resolve('@vue/babel-plugin-jsx'), { mergeProps: false, enableObjectSlots: false }],
        '@babel/plugin-transform-object-assign',
      ],
    }))
    .pipe(replace('import.meta', modules === false ? 'import.meta' : 'process'))
    .pipe(replace('ant-design-vue/es', modules === false ? 'ant-design-vue/es' : 'ant-design-vue/lib'))
    .pipe(gulp.dest(modules === false ? 'es' : 'lib'));
};

gulp.task('compile', function() {
  compile(false);
  compile();
});
