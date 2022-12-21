import { sleep, check } from "k6";
import http from "k6/http";

export const options = {
  vus: 100,
  duration: "10s",
};

const SERVER_URL = "http://localhost:8080/predict";

export default function () {
  const payload = JSON.stringify({
    content:
      "info@cloudlatex.io[SEP]★12/22 渋谷開催★【3,000円分相当ポイント贈呈あり】金融・コンサルキャリアイベントのご案内 | Cloud LaTeX[SEP]いつも Cloud LaTeX をご利用いただきありがとうございます。Cloud LaTeX を運営するアカリクのイベント事務局より、12月22日夕方に渋谷で開催する「Career Cafe in Acaric ?今、金融・コンサル業界が理系を求める理由とは？?」のご案内です。※ 本メールは、株式会社アカリクが運営しております Cloud LaTeX ( https://cloudlatex.io ) に 2022/12/15 時点でご登録の皆様へ、本サービスの運営維持を目的として送信しております。",
  });

  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const res = http.post(SERVER_URL, payload, params);
  check(res, {
    "is status 200": (r) => r.status === 200,
  });
  sleep(1);
}
