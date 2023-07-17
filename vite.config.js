import { defineConfig } from "vite";
import fs from "fs";

export default defineConfig({
  server: {
    // カメラのために開発時にもhttpsを使う
    https: {
      key: fs.readFileSync("./cert_localhost/localhost-key.pem"),
      cert: fs.readFileSync("./cert_localhost/localhost.pem"),
    },
  }
});