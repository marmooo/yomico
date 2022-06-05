function yomico(url) {
  // https://stackoverflow.com/questions/10730309
  function textNodesUnder(node) {
    let all = [];
    for (node = node.firstChild; node; node = node.nextSibling) {
      if (node.nodeType == 3) all.push(node);
      else all = all.concat(textNodesUnder(node));
    }
    return all;
  }

  function applyAll(yomis, tagFilter) {
    let target = textNodesUnder(document);
    if (tagFilter) target = target.filter(x => tagFilter(x));
    target.forEach((e) => {
      yomis = apply(e, yomis);
    });
  }

  function apply(e, yomis) {
    const root = document.createElement("span");
    let n = 0;
    let substr = e.textContent;
    while (true) {
      if (n >= yomis.length) break;
      const [kanji, yomi] = yomis[n];
      const pos = substr.indexOf(kanji);
      if (pos == -1) break;
      n += 1;
      if (pos != 0) {
        const span = document.createElement("span");
        span.textContent = substr.slice(0, pos);
        root.appendChild(span);
      }
      const ruby = setRubyYomi(kanji, yomi);
      root.appendChild(ruby);
      substr = substr.slice(pos + kanji.length);
    }
    if (n != 0) {
      const span = document.createElement("span");
      span.textContent = substr;
      root.appendChild(span);
      e.replaceWith(root);
    }
    return yomis.slice(n);
  }

  function setRubyYomi(kanji, yomi) {
    const ruby = document.createElement("ruby");
    ruby.textContent = kanji;
    const rt = document.createElement("rt");
    rt.textContent = yomi;
    ruby.appendChild(rt);
    return ruby;
  }

  fetch(url)
    .then((response) => response.text())
    .then((text) => {
      const yomis = [];
      text.trimEnd().split("\n").forEach((line) => {
        const [kanji, yomi, _] = line.split(",");
        yomis.push([kanji, yomi]);
      });
      applyAll(yomis);
    });
}

export { yomico };
