// 生成介绍页 https://yangxiaomao.com/bilifast/ ：把 site/ 复制到 dist/site/，再把和插件、README 共用的素材复制进去，
// 并替换占位符（__VERSION__ = manifest 里的版本号，__LASTMOD__ = 构建当天的日期）。.github/workflows/pages.yml 部署的就是 dist/site/。
// 用法: node tools/build_site.mjs    本地预览: python -m http.server 8080 -d dist/site
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const SRC = path.join(ROOT, "site");
const OUT = path.join(ROOT, "dist", "site");
// [源文件（相对仓库根目录）, 在介绍页里的路径]
const SHARED = [
  ["extension/store/icon.svg", "icon.svg"],
  ["extension/icons/32.png", "icon-32.png"],
  ["docs/images/popup.png", "popup.png"],
];

export function build() {
  const { version } = JSON.parse(fs.readFileSync(path.join(ROOT, "extension", "manifest.json"), "utf8"));
  const today = new Date().toISOString().slice(0, 10);
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.cpSync(SRC, OUT, { recursive: true });
  for (const [from, to] of SHARED) fs.copyFileSync(path.join(ROOT, from), path.join(OUT, to));
  for (const file of fs.readdirSync(OUT, { recursive: true })) {
    if (!/\.(html|xml)$/.test(file)) continue;
    const p = path.join(OUT, file);
    const src = fs.readFileSync(p, "utf8");
    fs.writeFileSync(p, src.replaceAll("__VERSION__", version).replaceAll("__LASTMOD__", today));
  }
  return { version, today };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { version } = build();
  console.log("已生成", OUT, "插件版本", version);
}
