import { Canvas } from "skia-canvas";
import { loadFontSets } from "./lib/font-manager.js";
import { renderText } from "./lib/index.js";

async function main() {
  await loadFontSets();

  const canvas = new Canvas(80, 20);
  const context = canvas.getContext("2d");

  renderText({ context }, "§cHello world!");
  await canvas.saveAs("out.png");
}

main();
