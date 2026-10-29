# bilifast

**中文** | [English](README.en.md) | [日本語](README.ja.md)

**一个 Chrome 插件，让 B 站网页看 4K、开倍速、拖进度不再卡。** 只装插件就行，不用装 Python 或其他程序，不收集任何数据。

<p align="center"><img src="docs/images/popup.png" alt="插件的弹出页：加速开关、低/中/高三档，当前标签页领先播放位置的秒数、速度、视频和音频用的节点、各节点实测速度" width="360"></p>

## 安装

1. 到 [Releases](https://github.com/Yangxiamao/bilifast/releases/latest) 下载 `bilifast-x.y.z.zip`。
2. 解压到一个固定的文件夹（之后不要删除或移动它）。
3. Chrome 打开 `chrome://extensions`，打开右上角的「开发者模式」，点「加载已解压的扩展程序」，选这个文件夹。
4. 刷新 B 站视频页，照常看视频。

正在申请上架 Chrome 应用商店，上架后可以直接从商店安装。

**更新**：新版 zip 解压覆盖到同一个文件夹，在 `chrome://extensions` 点插件上的刷新按钮。

## 效果

B 站自己的播放器，锁定 4K，同一网络、同一视频（作者实测，2026-10）：

| | 不装插件 | 装了插件 |
|---|---|---|
| 2 倍速 30 秒 | 卡 4 次，共 10.2 秒 | 不卡 |
| 跳到 60% 后 2 倍速 | 一直卡住 | 卡 1 次，0.4 秒 |
| 3 倍速 | 一直卡住 | 不卡 |

原理：B 站视频 CDN 对每个请求单独限速，而播放器一次只发一个请求。插件把请求拆成小块，从多个最快的 B 站节点并发拉取并提前预读。画面、弹幕、评论、播放记录都还是 B 站自己的。网络本来就很快的话，提升不明显。详见 [docs/PLAY_EXTENSION.md](docs/PLAY_EXTENSION.md)。

## 用法

- 支持 www.bilibili.com 的视频页、列表页、番剧页，切换分 P、清晰度、连播都会自动接管。
- 工具栏图标上的数字是缓冲领先播放位置的秒数，显示「关」表示加速已关闭。
- 点图标可以开关加速、选低 / 中 / 高三档（档位越高预读越多、占的内存越多），默认中档就够用。

## 隐私

只申请 `storage` 一个权限（记住开关和档位）。不读 cookie，不收集、不上传任何数据；插件出错时自动退回直连，视频照常播放。见 [PRIVACY.md](extension/store/PRIVACY.md)。

需要 Chrome 111+。嵌入在其他网站里的播放器和直播不加速；大会员、付费内容的限制不变。

## 想下载视频？

播放加速只管在线看，不下载视频。要把视频存成 mp4，请用同作者的 [bilidl](https://github.com/Yangxiamao/bilidl)，两个插件可以同时装。

## 声明

本项目和 B 站官方无关。[MIT License](LICENSE)。
