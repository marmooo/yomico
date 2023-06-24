# Yomico

半手動でふりがなのルビを振るためのライブラリです。

## Requirements

- [Mecab](https://taku910.github.io/mecab/)
- Mecab Dictionary (mecab-ipadic, mecab-unidic, etc.)

apt を利用すれば以下でインストールできます。

```
sudo apt install mecab mecab-ipadic-utf8
```

## Installation

```
deno install -fr --allow-read --allow-write --allow-run \
https://raw.githubusercontent.com/marmooo/yomico/main/bin/yomico.js
```

## Usage

1. HTML から漢字のふりがな候補を出力

```
yomico index.html  # --> index.yomi
```

2. ふりがな候補 (index.yomi) を編集
3. ふりがなを振るボタンを設置

```
document.getElementById("yomico").addEventListener("click", () => {
  import("./yomico.js").then((module) => {
    module.yomico("/yomico/index.yomi");
  });
  e.target.disabled = true;
}, { once: true });
```

## License

MIT
