# 测试

除了 `play_engine_test.mjs`，这些脚本都会**真实访问 B 站**。仓库根目录有 `sessdata.txt`（B 站登录 cookie 里 `SESSDATA` 的值，已写进 `.gitignore`）时会带上登录状态，才拿得到 4K。需要 Node 22+；用到浏览器的需要装 Chrome。

| 脚本 | 测什么 | 大概流量 |
|---|---|---|
| `node chrome_spike.mjs [BV号] [每组秒数] [--takeover]` | 用临时 profile 启动无头 Chrome（游客），记录播放器从哪里发 m4s 请求；`--takeover` 时在页面里接管这些请求、拆成并发 fetch 交还给播放器，看视频能否照常播放；再在页面里测并发 fetch 的速度和实际连接数。需要 Node 22+ 和 Chrome | 约 1 GB |
| `node play_engine_test.mjs` | 播放加速插件（`extension/`）的缓存和调度，用假的 CDN 离线测：各种 Range、同一块只拉一次、只给 akamai 链接时换节点、慢节点对冲、全部出错时抛异常（退回直连）、取消、预读和跳转、内存上限 | 不联网 |
| `node play_ext_test.mjs [correct\|bench\|player\|nav\|all] [BV号] [low\|mid\|high] [--only-on]` | 无头 Chrome 加载打包好的播放加速插件（会先运行 `tools/build_ext.mjs`），打开真实视频页。`correct`：接管的 XHR 和直连逐字节比较、认不出的请求原样放行、插件的请求全部失败时退回直连；`bench`：在页面里模拟播放器（一次取一个约 2 秒的分段，缓冲到 72 秒停；1x → 2x → 跳到 60% → 3x），比较插件关闭和开启的卡顿；`player`：真实播放器按同样的阶段变速、跳转，统计 `waiting`。`nav`：番剧页、列表页、切换分P、切换清晰度（用播放器自己的 `next()`、`requestQuality()`），检查都被接管、不退回直连、切换后不卡、旧的流不再继续预读。会把 `sessdata.txt` 写进临时 profile 以拿到 4K，测完删除。需要 Node 22+ 和 Chrome | correct 约 50 MB，bench 约 1~1.5 GB，player 视画质而定，nav 约 1 GB |

`stream_info.mjs` 是给测试取视频流链接的辅助模块。CDN 限速粒度的测速脚本 `h2_bench.mjs` 需要 bilidl.py，留在 [bilidl](https://github.com/Yangxiamao/bilidl/tree/main/tests) 仓库里。

在 PowerShell 里中文输出可能会乱码，可以把输出重定向到文件再查看。
