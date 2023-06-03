import { SEP } from "https://deno.land/std/path/mod.ts";
import { expandGlobSync } from "https://deno.land/std/fs/expand_glob.ts";
import { extname } from "https://deno.land/std/path/mod.ts";
import { parse } from "https://esm.sh/node-html-parser@6.1.5";
import Denomander from "https://deno.land/x/denomander/mod.ts";
import $ from "https://deno.land/x/dax/mod.ts";

const batchSize = 1000;

// https://github.com/sera1mu/deno_mecab
// deno_mecab style Mecab + IPADic parser, but 30x faster
async function parseMecab(filepath) {
  const result = [];
  const stdout = await $`mecab ${filepath}`.text();
  stdout.slice(0, -4).split("\nEOS\n").forEach((sentence) => {
    const morphemes = [];
    sentence.replace(/\t/g, ",").split("\n").forEach((line) => {
      const cols = line.split(",");
      const morpheme = {
        surface: cols[0],
        feature: cols[1],
        featureDetails: [cols[2], cols[3], cols[4]],
        conjugationForms: [cols[5], cols[6]],
        originalForm: cols[7],
        reading: cols[8],
        pronunciation: cols[9],
      };
      morphemes.push(morpheme);
    });
    result.push(morphemes);
  });
  return result;
}

async function parseText(text) {
  const tmpfileName = await Deno.makeTempFile();
  await Deno.writeTextFile(tmpfileName, text);
  const result = await parseMecab(tmpfileName);
  Deno.remove(tmpfileName);
  return result;
}

function kanaToHira(str) {
  return str.replace(/[\u30a1-\u30f6]/g, function (match) {
    const chr = match.charCodeAt(0) - 0x60;
    return String.fromCharCode(chr);
  });
}

function getYomis(morpheme) {
  const surface = morpheme.surface;
  const reading = kanaToHira(morpheme.reading);
  const arr = surface.match(/([ぁ-んァ-ヴー]+|[一-龠々ヵヶ]+)/g);
  if (arr.length == 1) return [[surface, reading]];

  const targets = arr.map((x) => {
    return (/[ぁ-んァ-ヴー]/.test(x)) ? false : true;
  });
  const pattern = arr.map((x) => {
    return (/[ぁ-んァ-ヴー]/.test(x)) ? `(${x})` : "(.+)";
  }).join("");
  const matched = reading.match(new RegExp(pattern));
  const result = matched.slice(1)
    .map((x, i) => [arr[i], x])
    .filter((_, i) => targets[i]);
  return result;
}

async function build(text, outputPath) {
  const result = [];
  const sentences = text.replace(/^\s*[\r\n]/gm, "").split("\n");
  const kanjiRegexp = /^[一-龠々ヵヶ]/;
  for (let i = 0; i < sentences.length; i += batchSize) {
    const batchSentences = sentences.slice(i, i + batchSize);
    const parsed = await parseText(batchSentences.join("\n"));
    for (const morphemes of parsed) {
      for (const morpheme of morphemes) {
        if (!kanjiRegexp.test(morpheme.surface)) continue;
        getYomis(morpheme).forEach((data) => {
          const [kanji, yomi] = data;
          result.push(`${kanji},${yomi}`);
        });
      }
    }
  }
  Deno.writeTextFileSync(outputPath, result.join("\n"));
}

function globHtml(dir, recursive) {
  if (recursive) {
    return expandGlobSync(`${dir}${SEP}**${SEP}*.htm?(l)`);
  } else {
    return expandGlobSync(`${dir}${SEP}*.htm?(l)`);
  }
}

function getYomiPath(path) {
  const extName = extname(path);
  const extPos = path.length - extName.length;
  const basePath = path.slice(0, extPos);
  return basePath + ".yomi";
}

const program = new Denomander({
  app_name: "Yomico",
  app_description: "半手動でふりがなのルビを振るためのライブラリです。",
  app_version: "0.0.1",
});

program
  .defaultCommand("[input]")
  .argDescription("input", "Path of HTML file/directory")
  .option("-r, --recursive", "Recursively inline directories")
  .parse(Deno.args);

if (Deno.statSync(program.input).isFile) {
  const outputPath = getYomiPath(program.input);
  const html = Deno.readTextFileSync(program.input);
  const root = parse(html);
  const text = root.innerText;
  build(text, outputPath);
} else {
  for (const file of globHtml(program.input, program.recursive)) {
    const outputPath = getYomiPath(file.path);
    const html = Deno.readTextFileSync(file.path);
    const root = parse(html);
    const text = root.innerText;
    build(text, outputPath);
  }
}
