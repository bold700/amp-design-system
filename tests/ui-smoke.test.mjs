import test from "node:test";
import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import { constants } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");

const pages = [
  "index.html",
  "components-overview.html",
  "demo-dashboard.html",
  "aan-de-slag.html",
  "vuetify-bridge.html",
  "use-case-hub.html"
];

async function readPage(relativePath) {
  const fullPath = path.join(root, relativePath);
  await access(fullPath, constants.R_OK);
  return readFile(fullPath, "utf8");
}

test("belangrijke pagina's bestaan", async () => {
  for (const page of pages) {
    await access(path.join(root, page), constants.R_OK);
  }
});

test("index bevat links naar alle demo's", async () => {
  const index = await readPage("index.html");
  assert.match(index, /href="components-overview\.html"/);
  assert.match(index, /href="demo-dashboard\.html"/);
  assert.match(index, /href="aan-de-slag\.html"/);
});

test("alle pagina's laden AMP tokens en componenten", async () => {
  for (const page of pages) {
    const html = await readPage(page);
    assert.match(html, /href="amp-tokens\.css"/, `${page} mist amp-tokens.css`);
    assert.match(html, /href="amp-components\.css"/, `${page} mist amp-components.css`);
  }
});

test("hoofdpagina's gebruiken Vuetify als basis", async () => {
  for (const page of pages) {
    const html = await readPage(page);
    assert.match(html, /vuetify@3/i, `${page} mist Vuetify include`);
    assert.match(html, /vue@3/i, `${page} mist Vue include`);
    assert.match(html, /amp-vuetify-theme\.js|createVuetify/, `${page} mist Vuetify theme init`);
  }
});

test("aan-de-slag gebruikt geen custom style-blok", async () => {
  const html = await readPage("aan-de-slag.html");
  assert.ok(!html.includes("<style>"), "aan-de-slag.html bevat nog een custom <style>-blok");
});
