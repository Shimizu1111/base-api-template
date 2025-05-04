# BASE API 商品一覧アプリ

BASE APIを使用して商品一覧を取得する最小限のNode.jsアプリケーションです。

## 準備

1. ngrokのインストール:
```bash
brew install ngrok/ngrok/ngrok
```

2. 必要なパッケージをインストール:
```bash
npm install
```

3. ngrokを起動してURLを取得:
```bash
ngrok http 3000
```
表示された`https://xxxx-xxx-xxx-xxx-xxx.ngrok-free.app`のURLをメモしておきます。

4. BASEデベロッパーページの設定:
- https://developers.thebase.in/ にアクセス
- アプリケーションを登録（または既存のアプリケーションを選択）
- リダイレクトURIに`https://xxxx-xxx-xxx-xxx-xxx.ngrok-free.app/callback`を設定
  （`xxxx-xxx-xxx-xxx-xxx`の部分は、ngrokで表示されたURLに置き換え）
- クライアントIDとクライアントシークレットをコピー

5. `.env`ファイルを設定:
```
CLIENT_ID=（BASEデベロッパーページでコピーしたクライアントID）
CLIENT_SECRET=（BASEデベロッパーページでコピーしたクライアントシークレット）
REDIRECT_URI=https://xxxx-xxx-xxx-xxx-xxx.ngrok-free.app/callback
```

## アプリケーションの起動

1. アプリケーションを起動:
```bash
npm start
```

2. ブラウザでngrokのURL（`https://xxxx-xxx-xxx-xxx-xxx.ngrok-free.app`）にアクセス

## 使用方法

1. 「BASEでログイン」をクリック
2. BASE認証画面でログインして認証を許可
3. 「商品一覧を表示」をクリックして商品一覧を表示

## 注意事項

- ngrokは起動するたびに新しいURLが生成されます
- URLが変更された場合は、以下の手順が必要です：
  1. BASEデベロッパーページでリダイレクトURIを更新
  2. `.env`ファイルの`REDIRECT_URI`を更新
  3. アプリケーションを再起動
- `.env`ファイルはGitにコミットしないでください（セキュリティのため）