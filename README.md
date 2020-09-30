# kintone データを Google スプレッドシートへ出力するプラグイン

kintoneプラグインです。  
kintoneアプリのレコード全体を、ボタン一つで指定の Google スプレッドシートへ出力します。  
Google スプレッドシートを用いたデータ集計をおこないたい場合や、バックアップを作成したい場合などにお使いいただけます。

プラグインの設定方法が少し難しいので、利用者向けに追々書く予定。


## 開発するには

kintone の管理者権限のあるアカウントを所有している必要があります。

このリポジトリを clone 後、 `npm install` したら `npm start` します。  

* Input your Kintone subdomain
* Input your username
* Input your password

の三点を聞かれるので、それに答えるとビルドしたプラグインが kintone にアップロードされます。

ファイルの変更があるたびに、ビルドとアップロードがおこなわれるので、  
実際に kintone でどのように動作するのかを確認しながら開発することが出来ます。


## リリースビルド

`npm start` による開発中でも dist/plugin.zip にプラグインファイルは作られますが、  
sourcemap を含むためファイルサイズが大きいです。

リリースビルドは以下のコマンドでおこないましょう。

```sh
npm run build:prod
```
