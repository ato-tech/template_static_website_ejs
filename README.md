# 検証環境
NodeJS [v12.4.0]

# コマンド
## 初回インストール

```
$ npm install
```

## ビルド
`src/`以下のファイルをもとにビルド&監視します。

```
$ npx gulp
```

# 構成
開発は`/src`以下で行い、`/dist`以下に出力されます。

    ├── dist    #出力先ディレクトリ
    ├── gulpfile.js
    ├── package.json
    └── src     #開発用ディレクトリ
        ├── assets
        │   ├── scss
        │   │   ├── _settings.scss   #scssで使用する変数やmixinを設定
        │   │   ├── _reset.scss
        │   │   ├── _base.scss
        │   │   ├── _layout.scss
        │   │   ├── _component.scss
        │   │   ├── _p_top.scss   #トップページ固有のscssを記述
        │   │   └── style.scss   #最終的に出力するscssファイル
        │   ├── img
        │   └── js
        └── _include    #サイト全体の共通html(ejs)コンポーネント
            ├── footer.ejs
            ├── header.ejs
            ├── meta.ejs
            └── meta.json
