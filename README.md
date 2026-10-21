# Hayashi Yuto ポートフォリオ(管理サイトつき)

## フォルダの中身

- `public/index.html` … ポートフォリオ本体
- `public/admin/index.html` … 管理サイト(`/admin` で開く)
- `public/img/` … 最初から入っている画像
- `netlify/` … パスワード画面と、保存のしくみ
- `netlify.toml`, `package.json` … Netlifyの設定

## はじめての設定(1回だけ)

1. **GitHubにリポジトリをつくる**
   GitHubで「New repository」をつくる(Privateでも大丈夫)。
   「uploading an existing file」から、このフォルダの中身(`public`、`netlify`、`netlify.toml`、`package.json`、`README.md`)をドラッグして「Commit changes」。

2. **NetlifyとGitHubをつなぐ**
   Netlifyで今のサイト(yutohayashi)を開く → Project configuration → Build & deploy → Continuous deployment → 「Link repository」→ GitHub → さっきのリポジトリを選ぶ。
   - Build command:空のまま
   - Publish directory:`public`

3. **管理者のユーザー名とパスワードを決める**
   Project configuration → Environment variables → 「Add a variable」で2つつくる。
   - `ADMIN_USER` … ユーザー名(半角英数字)
   - `ADMIN_PASSWORD` … パスワード(半角英数字、長めに)

4. **もう一度デプロイする**
   Deploys → 「Trigger deploy」→「Deploy project」。

5. **管理サイトを開く**
   `https://yutohayashi.netlify.app/admin` を開くと、ブラウザのパスワード画面が出ます。

## ふだんの使い方

- 文や作品を変えたいとき → 管理サイトで編集して「保存する」。すぐサイトに反映されます。
- プログラムを変えたいとき → 新しいファイルをGitHubにアップすると、Netlifyが自動で反映します。
- 保存をまちがえたとき → 管理サイトの「プロフィール」タブの下にある「1つ前の保存を読みこむ」→「保存する」で、1つ前にもどせます。
