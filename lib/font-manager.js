import fs from "fs/promises";
import { create as createFontSet } from "./font-set.js";

const DEFAULT_FONT = "default";

const fontSets = {};

export async function loadFontSets() {
  for (const file of await fs.readdir("./assets/font")) {
    if (!file.endsWith(".json")) {
      continue;
    }

    const { providers } = JSON.parse(await fs.readFile(`./assets/font/${file}`, "utf8"));
    const glyphProviders = [];

    for (const data of providers) {
      const { type } = data;
      let create;

      try {
        ({ create } = await import(`./glyph-providers/${type}.js`));
      } catch (error) {
        if (error.code === "ERR_MODULE_NOT_FOUND") {
          continue;
        }

        throw error;
      }

      const glyphProvider = await create(data);

      glyphProviders.push(glyphProvider);
    }

    fontSets[file.slice(0, -".json".length)] = createFontSet(glyphProviders);
  }
}

export function getFontSet(name = DEFAULT_FONT) {
  return fontSets[name];
}