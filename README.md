# kenko-bot ( Slack通知付き )
このバージョンはbotが起動したときにSlackを通じて通知を送信するものです。

送信に成功した場合は体温と居住地を通知します。失敗した場合はエラーを通知します。

Slackの通知先は自分で設定する必要があります。

めんどくさい人は　Settings > Email Notifications からメール通知を設定することもできますが、その場合はこのバージョンを使用しないでください。

---

## 仕組み概要
Slackの「Incoming Webhook」を使って、スクリプト実行後に自動でチャンネルやDMに通知を送ります。

## 手順

0. Slackアカウントを作成 → 適当なチャンネル(例: 健康日誌)を作成

1. SlackのApp管理ページ にアクセス　https://api.slack.com/apps

2. 「Create New App」 → 「From Scratch」 →  名前とワークスペースを入力して作成

3. 「Basic Infomation」  →  「Display Infomation」 を入力

4. 「App Home」  →  「Your App’s Presence in Slack」 を入力

5. 左のメニューから「Incoming Webhooks」→ 「Activate Incoming Webhooks」

6. 「Add New Webhook to Workspace」から送信先チャンネルを選ぶ

7. 表示された Webhook URL（例: https://hooks.slack.com/services/XXXXX/YYYYY/ZZZZZ ）をコピー

8. script.js 内のURLを手順6でコピーしたものに変更

## 注意事項

Slack通知のため、通知無しのバージョンとは異なるモジュールを使用します。".github/workflows
/kenko-auto-submit.yml" はこのパッケージ内のものを使ってください。

ID等を忘れずに記入してください。

---

### 通知無しバージョンはこちら

https://github.com/Syu6432/kenko-bot
