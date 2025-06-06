const puppeteer = require("puppeteer");
const { DateTime } = require("luxon");
const axios = require("axios");

// 下の三行は自分で入力
const username = "あなたのIDをここに入力(半角)";
const password = "あなたのパスワード(半角)";
const location = "あなたの居住地(全角or半角)";

//あなたのSlack Webhook URLに置き換え
const webhookUrl = "https://hooks.slack.com/services/YOUR_URL_HERE/EXAMPLE/EXAMPLE";



// Slack通知関数
async function sendSlackNotification(message) {
  try {
    await axios.post(webhookUrl, { text: message });
  } catch (err) {
    console.error("Slack通知エラー:", err);
  }
}

//Puppeteer
(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    protocolTimeout: 60000,
  });

  
//ここから先(try関数内)のエラーを判定
try {
  const page = await browser.newPage();
  const targetUrl = "https://kenko:kenko-cac@ems4.kouku-dai.ac.jp/~take/kenko/";
  await page.goto(targetUrl, { waitUntil: "networkidle2", timeout: 60000 });

  // ログインフォーム入力
  await page.type("#gno", username);
  await page.type("#pass", password);
  await page.click("#loginButton");
  
  // 新規入力ボタンが表示されるのを待機してクリック
　// ボタン操作（安全なスクロール）
　await page.waitForSelector("#k01Button", { visible: true });
　const inputButton = await page.$("#k01Button");
　await inputButton.evaluate(el => el.scrollIntoView({ behavior: "auto", block: "center" }));
　await inputButton.click();

  // JSTの日付を取得
  const jstDate = DateTime.now().setZone("Asia/Tokyo");
  const formattedDate = jstDate.toISODate();

  // 日付入力欄に今日の日付を入力（形式: yyyy-mm-dd）
  await page.evaluate((date) => {
    const dateInput = document.querySelector('#nichiji');
    if (dateInput) {
      dateInput.value = date;
      dateInput.dispatchEvent(new Event("input", { bubbles: true }));
    }
  }, formattedDate);
  
  // '体温計測あり'を選択
  await page.click('input[name="toi0"][value="1"]');

  // 体温入力（inputイベント発火付き）
  const temp = (Math.floor(Math.random() * 5) + 2) / 10 + 36.0;
  const [intPart, decimalPart] = temp.toFixed(1).split(".");
  await page.evaluate((intPart, decimalPart) => {
    const temp1 = document.querySelector("#temp1");
    temp1.value = intPart;
    temp1.dispatchEvent(new Event("input", { bubbles: true }));

    const temp2 = document.querySelector("#temp2");
    temp2.value = decimalPart;
    temp2.dispatchEvent(new Event("input", { bubbles: true }));
  }, intPart, decimalPart);

  // 居住地入力（inputイベント発火付き）
  await page.evaluate((location) => {
    const tf2 = document.querySelector("#tf2");
    tf2.value = location;
    tf2.dispatchEvent(new Event("input", { bubbles: true }));
  }, location);
  
  // 送信ボタンをクリック
  await page.click("#sendButton");
　await new Promise(r => setTimeout(r, 5000));

  await sendSlackNotification(`提出完了！\n体温: ${temp.toFixed(1)}℃\n居住地: ${location}`);
} catch (err) {
  console.error("スクリプトエラー:", err);
  await sendSlackNotification("健康日誌を提出できませんでした。");
} finally {
  await browser.close();
  }
})();
