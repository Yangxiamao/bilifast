// 测试用：取一个真实视频的 DASH 流链接（第一个分P）。规则和 bilidl 的 pick_streams 一样：不超过 qn 的最高画质、优先 AVC、码率最高的音频。
// 仓库根目录有 sessdata.txt 时带上登录 cookie，才拿得到 4K。
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { FAST_HOSTS } from "../shared/hosts.js";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36";
const AVC = 7;

async function api(url) {
  const file = path.join(ROOT, "sessdata.txt");
  const sess = fs.existsSync(file) ? fs.readFileSync(file, "utf8").trim() : "";
  const r = await fetch(url, { headers: { "user-agent": UA, referer: "https://www.bilibili.com/", ...(sess && { cookie: `SESSDATA=${sess}` }) } });
  const j = await r.json();
  if (j.code !== 0) throw new Error(`${url} 返回 ${j.code} ${j.message}`);
  return j.data;
}

export async function streamInfo(bvid, qn = 120) {
  const [{ cid }] = await api(`https://api.bilibili.com/x/player/pagelist?bvid=${bvid}`);
  const { dash } = await api(`https://api.bilibili.com/x/player/playurl?bvid=${bvid}&cid=${cid}&fnval=4048&fourk=1&qn=127`);
  const ids = [...new Set(dash.video.map(v => v.id))];
  const below = ids.filter(i => i <= qn);
  const id = below.length ? Math.max(...below) : Math.min(...ids);
  const cands = dash.video.filter(v => v.id === id);
  const v = cands.find(x => x.codecid === AVC) || cands[0];
  const a = (dash.audio || []).reduce((best, x) => (!best || x.bandwidth > best.bandwidth ? x : best), null);
  return { video: [v.baseUrl, ...(v.backupUrl || [])], audio: a?.baseUrl, qn: v.id, bandwidth: v.bandwidth,
           duration: dash.duration, fast: FAST_HOSTS };
}

export function onHost(url, host) {
  const u = new URL(url);
  u.hostname = host;
  return u.href;
}
