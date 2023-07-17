# 口からリリック
## 前提
- このアプリはカメラを使用します。
- カメラの使用を許可してください。
- カメラを使用するためhttpsでの接続が必要です。
  - [参考](https://qiita.com/zabu/items/efe9c8aea00a449396f0)

## 機能
- 顔検出を行い、口の中から歌詞を表示します。
- 顔検出ができない場合はCanvas全体に歌詞を表示します。
- 再生/一時停止ボタン
- 停止ボタン
- 選曲ボタン

## 使い方
### パッケージのインストール
```
$ yarn
```

### 開発サーバーの起動
```
$ yarn dev
yarn run v1.22.19
$ vite --host

  VITE v4.4.4  ready in 222 ms

  ➜  Local:   https://localhost:5173/
  ➜  Network: https://172.21.214.107:5173/
  ➜  press h to show help
```

### ビルド
```
$ yarn build
```

### ビルド結果をプレビューするサーバーを起動
```
$ yarn preview
```

## TextAlive App API

![TextAlive](https://i.gyazo.com/thumb/1000/5301e6f642d255c5cfff98e049b6d1f3-png.png)

TextAlive App API は、音楽に合わせてタイミングよく歌詞が動くWebアプリケーション（リリックアプリ）を開発できるJavaScript用のライブラリです。

TextAlive App API について詳しくはWebサイト [TextAlive for Developers](https://developer.textalive.jp/) をご覧ください。