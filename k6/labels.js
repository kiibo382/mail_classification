import http from "k6/http";
import { sleep, check } from "k6";
export const options = {
  vus: 100,
  duration: "10s",
};

const SERVER_URL = "http://localhost:8080/labels";

export default function () {
  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const res = http.get(SERVER_URL, params);
  check(res, {
    'is status 200': (r) => r.status === 200,
  });
  sleep(1);
}
