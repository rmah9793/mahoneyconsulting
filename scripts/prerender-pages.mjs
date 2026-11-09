import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import worker from "../.output/server/index.mjs";

const out = ".output/public";
const origin = "https://mahoney.consulting";
const routes = ["/", "/brand"];

for (const path of routes) {
  const response = await worker.fetch(new Request(origin + path), {}, { waitUntil() {} });
  if (!response.ok) {
    throw new Error(`${path} rendered ${response.status}`);
  }
  const file = path === "/" ? join(out, "index.html") : join(out, path.slice(1), "index.html");
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, await response.text());
  console.log("wrote", file);
}

const missing = await worker.fetch(new Request(origin + "/404"), {}, { waitUntil() {} });
await writeFile(join(out, "404.html"), await missing.text());
await writeFile(join(out, "CNAME"), "mahoney.consulting\n");
await writeFile(join(out, ".nojekyll"), "");
console.log("wrote 404, CNAME");
