# Yomico

半手動でふりがなのルビを振るためのライブラリです。

## Installation

```
deno install --allow-read --allow-write --allow-run \
https://raw.githubusercontent.com/marmooo/yomico/main/src/yomico.js
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
    module.yomico(location.href + "index.yomi");
  });
  e.target.disabled = true;
}, { once: true });
```

## License

MIT
