# kintone データを Google スプレッドシートへ出力するプラグイン

**[kintone](https://kintone.cybozu.co.jp)** 用プラグインです。

kintoneアプリのレコード全体を、ボタン一つで指定の Google スプレッドシートへ出力します。  
Google スプレッドシートを用いたデータ集計をおこないたい場合や、kintoneデータをコピーしたバックアップ先としてスプレッドシートを利用したい場合などにお使いいただけます。


## 注意事項

* このプラグインについてセンセイプレイス株式会社へお問い合わせいただいても回答できません。バグ報告として Issue やプルリクエストを立ててくださるのは歓迎です（日本語で大丈夫です）が、お答えできないかもしれません
* このプラグインの Fork および改変は自由におこなってくださってかまいませんが、このプラグインおよび改変したプラグインの販売をおこなうことは固く禁じます


## 使用方法

[Releases](https://github.com/senseiplace/kintone-export-to-google-spreadsheet/releases) から最新の `plugin.zip` をダウンロードしてください。

「[システム管理にプラグインを追加する](https://jp.cybozu.help/k/ja/admin/system_customization/add_plugin/plugin.html)」のページを参考に、ダウンロードした `plugin.zip` を読み込み、プラグインを追加してください。  
その後、「[アプリにプラグインを追加する](https://jp.cybozu.help/k/ja/user/app_settings/plugin.html)」のページを参考に、このプラグインを使用したいアプリに対してプラグインの追加をおこなってください。

プラグインの設定から必須項目の設定をおこないます。  
「[サービス アカウントキーの作成と管理](https://cloud.google.com/iam/docs/creating-managing-service-account-keys)」のページを参考に、  
サービスアカウントの作成およびサービスアカウントキーの発行をおこないます。  
JSON形式のキーを発行しダウンロードしたのち、そこに書かれている `client_email` および `private_key` の値を設定で使います。

出力先となるスプレッドシートの共有設定で、 `client_email` のメールアドレスを編集権限で追加しておくことを忘れないようにしましょう。

あとはアプリ画面（データが並んでいる画面）にある「スプシに出力」ボタンを押せば、出力が開始されます。  
プラグイン設定がうまくいっていないと、『TypeError: Cannot read property '2' of null』などのエラーを見ることになると思います。その際は設定を見直してください。


## 開発するには

kintone の管理者権限のあるアカウントを所有している必要があります。

このリポジトリを clone 後、以下のコマンドを実行します。

```sh
openssl genrsa -out private.ppk
npm install
```

ここで作成する `private.ppk` をもとに PLUGIN ID が決定されるので、  
複数人で開発する場合は `private.ppk` を共有するとよいでしょう。

準備が終わったら、以下のコマンドで開発をスタートします。

```sh
npm start
```

* Input your Kintone subdomain
* Input your username
* Input your password

の三点を聞かれるので、それに答えるとビルドしたプラグインが kintone にアップロードされます。

ファイルの変更があるたびにビルドとアップロードがおこなわれるので、  
実際に kintone でどのように動作するのかを確認しながら開発することが出来ます。


## リリースビルド

`npm start` による開発中でも `dist/plugin.zip` にプラグインファイルは作られますが、  
sourcemap を含むためファイルサイズが大きいです。

リリースビルドは以下のコマンドでおこないましょう。

```sh
npm run build:prod
```
