# OpenID Connect Code Flow Lambda

OpenID ConnectのCode FlowでIDトークンを取得するLambda関数です。

## 前提条件

- AWS CLI設定済み
- SAM CLI インストール済み
- Node.js 22.x

## デプロイ

### 1. ビルド
```bash
sam build
```

### 2. 初回デプロイ
```bash
sam deploy --guided
```

以下のパラメータを設定：
- `TokenEndpoint`: OIDCプロバイダーのトークンエンドポイント
- `ClientId`: OIDCクライアントID
- `ClientSecret`: OIDCクライアントシークレット
- `RedirectUri`: リダイレクトURI

### 3. 再デプロイ
```bash
sam deploy
```

## 使用方法

### 1. Google認証URL

GoogleでログインするためのURL（CLIENT_IDとREDIRECT_URIを実際の値に置き換えてください）：

```
https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=CLIENT_ID&redirect_uri=REDIRECT_URI&scope=openid%20email%20profile&state=STATE
```

### 2. トークン取得

Google認証後、デプロイされたFunction URLに認可コードをクエリパラメータで送信：

```
https://your-function-url.lambda-url.region.on.aws/?code=AUTHORIZATION_CODE&state=STATE
```

## レスポンス

```json
{
  "id_token": "eyJ...",
  "access_token": "eyJ...",
  "state": "state_value"
}
```