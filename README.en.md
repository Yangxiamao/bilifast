# bilifast

[中文](README.md) | **English** | [日本語](README.ja.md)

**A Chrome extension that stops bilibili's web player from stalling on 4K, fast playback speeds and seeking.** Just the extension: no Python or other programs to install, and no data collected.

<p align="center"><img src="docs/images/popup.png" alt="The extension popup: on/off switch, low/medium/high presets, seconds buffered ahead in the current tab, speed, the CDN nodes used for video and audio, and measured speed of each node" width="360"></p>

## Install

1. Download `bilifast-x.y.z.zip` from [Releases](https://github.com/Yangxiamao/bilifast/releases/latest).
2. Unzip it into a permanent folder (don't delete or move it afterwards).
3. In Chrome, open `chrome://extensions`, turn on **Developer mode** (top right), click **Load unpacked** and pick that folder.
4. Reload the bilibili video page and watch as usual.

A Chrome Web Store listing is under review; once it's approved you can install it from the store instead.

**Update**: unzip the new version over the same folder, then click the reload button on the extension in `chrome://extensions`.

## Results

bilibili's own player locked to 4K, same network, same video (author's test, 2026-10):

| | Without extension | With extension |
|---|---|---|
| 2x speed for 30 s | 4 stalls, 10.2 s total | No stalls |
| Seek to 60%, then 2x | Stuck the whole time | 1 stall, 0.4 s |
| 3x speed | Stuck the whole time | No stalls |

How it works: bilibili's video CDN throttles each request separately, and the player sends only one request at a time. The extension splits requests into small chunks, fetches them in parallel from the fastest bilibili nodes and reads ahead. The video, danmaku, comments and watch history are all still bilibili's own. If your connection is already fast, you may not notice much difference. Details (in Chinese): [docs/PLAY_EXTENSION.md](docs/PLAY_EXTENSION.md).

## Usage

- Works on www.bilibili.com video, list and bangumi pages, including switching parts, switching quality and autoplay.
- The number on the toolbar icon is how many seconds are buffered ahead of the playhead; "关" means acceleration is off.
- Click the icon to turn acceleration on or off and choose a low / medium / high preset (higher reads further ahead and uses more memory). The default, medium, is enough for most people.

## Privacy

The only permission requested is `storage` (to remember the switch and preset). It doesn't read cookies and collects or uploads no data. If anything goes wrong, it falls back to a direct connection and the video keeps playing. See [PRIVACY.md](extension/store/PRIVACY.md).

Requires Chrome 111+. Players embedded on other sites and live streams are not accelerated. Premium and paid content restrictions are unchanged.

## Want to download videos?

This extension only speeds up online playback; it doesn't download anything. To save videos as mp4, use [bilidl](https://github.com/Yangxiamao/bilidl) by the same author. Both extensions can be installed side by side.

## Disclaimer

This project is not affiliated with bilibili. [MIT License](LICENSE).
