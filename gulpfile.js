const gulp = require('gulp'), // gulpを使用
      fs = require('fs'), // ファイル操作
      ejs = require('gulp-ejs'), // ejsをhtmlに変換
      sass = require('gulp-sass'), // sassをcssに変換
      plumber = require('gulp-plumber'), // watch中にエラーが起きても停止させない
      notify = require('gulp-notify'), // エラーを通知
      postcss = require('gulp-postcss'), // cssツール用フレームワーク
      autoprefixer = require('autoprefixer'), // cssにベンダープレフィクスを自動付与
      mqpacker = require('css-mqpacker'), // メディアクエリをひとつにまとめる
      sourcemaps = require('gulp-sourcemaps'), // ソースマップの作成
      browserSync = require('browser-sync').create(); // ブラウザ自動更新

// 出力フォルダ
const dir = {
  root: './dist/',
  css: './dist/assets/css/',
  js: './dist/assets/js/',
  img: './dist/assets/img/'
};

// 作業フォルダ
const src = {
  root: './src/',
  scss: './src/assets/scss/',
  js: './src/assets/js/',
  img: './src/assets/img/'
};

// sass
const sassSettings = {
  outputStyle: 'expanded', //cssの変換形式を選択 > expanded, nested, compact, compressed
  // sourceMap: true, //sourceMapを作成
  // sourceComments: true //sassで何行目かをcssに出力
};
const autoprefixerSettings = {
  grid: true //autoprefixerでdisplay: grid のIE対応、その他はpackage.jsonのbrowserslistで定義
};
const postcssSettings = [
  autoprefixer(autoprefixerSettings), //autoprefixerをpostcssで使用
  mqpacker()
];

const plumberSettings = {
  errorHandler: notify.onError("Error: <%= error.message %>")
};

gulp.task('sass', ()=>{ //sassをcssに変換
  return gulp.src(src.scss + '*.scss', { sourcemaps: true })
    .pipe(plumber(plumberSettings))
    .pipe(sass(sassSettings))
    .pipe(postcss(postcssSettings))
    .pipe(gulp.dest(dir.css, { sourcemaps: './maps' }));
});

// ejs
const ejsSettings = { //ejsをhtmlに変換
  ext:'.html'
};
gulp.task('ejs', ()=>{
  const json = JSON.parse(fs.readFileSync(src.root + '_include/meta.json','utf-8')); //ejsでJSONを使用
  return gulp.src([src.root + '**/*.ejs','!' + src.root + '**/_*.ejs','!' + src.root + '_include/*'])
    .pipe(ejs({json:json},{},ejsSettings))
    .pipe(gulp.dest(dir.root))
});

// copy
gulp.task('copySettings', () => { //出力ディレクトリに各ファイルをコピー
  return gulp.src([
      src.img + '**/*',
      src.js + '**/*'
    ],
    {base:'src'}
  )
  .pipe(gulp.dest(dir.root))
});

// server
const browserSyncSettings = { //browserSyncの設定
    server: dir.root //起動ディレクトリの設定
};
gulp.task('server', (done)=>{ //browserSyncの起動
    browserSync.init(browserSyncSettings);
    done();
});
// watch
gulp.task('watch', (done)=>{ //作業ファイルの監視
  gulp.watch(src.img + '**/*', gulp.series('copySettings'));
  gulp.watch(src.js + '**/*', gulp.series('copySettings'));
  gulp.watch(src.scss + '**/*.scss', gulp.series('sass'));
  gulp.watch(src.root + '**/*.ejs', gulp.series('ejs'));

  const browserReload = (done)=>{ //作業ファイルに変更があったらbrowserSyncをリロード
    browserSync.reload();
    done();
  };

  gulp.watch(dir.root + '**/*', browserReload);
});

gulp.task('default', gulp.series('ejs', 'sass', 'copySettings','server','watch')); //タスクの設定
