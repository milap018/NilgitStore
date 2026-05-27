import { createReadStream, existsSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, resolve } from "node:path";

const port = Number(process.env.PORT || 5173);
const distDir = resolve("dist");

const contentTypes = {
  ".css": "text/css",
  ".html": "text/html",
  ".js": "text/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp"
};

function getFilePath(url) {
  const requestedPath = url === "/" ? "/index.html" : url;
  const filePath = join(distDir, requestedPath);

  return existsSync(filePath) ? filePath : join(distDir, "index.html");
}

const server = createServer((req, res) => {
  const filePath = getFilePath(req.url.split("?")[0]);
  const contentType = contentTypes[extname(filePath)] || "application/octet-stream";

  res.writeHead(200, { "Content-Type": contentType });
  createReadStream(filePath).pipe(res);
});

server.listen(port, () => {
  console.log(`Static frontend running on http://localhost:${port}`);
});
