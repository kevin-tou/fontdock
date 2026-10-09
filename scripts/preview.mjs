#!/usr/bin/env node
import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join } from "node:path";
import { PKG_ROOT } from "../src/paths.mjs";

const PORT = Number(process.env.PORT || 4177);
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
};

const toolbar = join(PKG_ROOT, "packages", "toolbar", "fontdock-toolbar.js");
const combos = join(PKG_ROOT, "packages", "registry", "combos.json");
const preview = join(PKG_ROOT, "examples", "preview.html");

const routes = {
  "/": preview,
  "/index.html": preview,
  "/fontdock-toolbar.js": toolbar,
  "/combos.json": combos,
  "/__fontdock/fontdock-toolbar.js": toolbar,
  "/__fontdock/combos.json": combos,
};

const server = createServer((req, res) => {
  const url = decodeURIComponent((req.url ?? "/").split("?")[0]);
  const file = routes[url];
  if (!file || !existsSync(file) || !statSync(file).isFile()) {
    res.writeHead(404, { "content-type": "text/plain" });
    res.end("Not found");
    return;
  }
  res.writeHead(200, { "content-type": MIME[extname(file)] ?? "application/octet-stream" });
  createReadStream(file).pipe(res);
});

server.listen(PORT, () => {
  console.log(`fontdock preview → http://localhost:${PORT}`);
});
