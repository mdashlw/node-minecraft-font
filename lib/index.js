import { loadFontSets, getFontSet } from "./font-manager.js";

const COLORS = {
  0: 0,
  1: 170,
  2: 43520,
  3: 43690,
  4: 11141120,
  5: 11141290,
  6: 16755200,
  7: 11184810,
  8: 5592405,
  9: 5592575,
  a: 5635925,
  b: 5636095,
  c: 16733525,
  d: 16733695,
  e: 16777045,
  f: 16777215,
};

await loadFontSets();

export function fetchMinecraftAssets() {
  // TODO remove assets from the repo and fetch them from https://launchermeta.mojang.com/mc/game/version_manifest.json
}

export function width({ font }, text) {
  const fontSet = getFontSet(font);
  let width = 0;

  for (let index = 0; index < text.length; index++) {
    const char = text[index];

    if (char === "§") {
      if (++index === text.length) {
        break;
      }
    } else {
      width += fontSet.getGlyph(char).advance;
    }
  }

  return width;
}

export function renderText({ font, context, x = 0, y = 0 }, text) {
  const fontSet = getFontSet(font);
  let color = COLORS.f;

  for (let index = 0; index < text.length; index++) {
    const char = text[index];

    if (char === "§") {
      if (++index === text.length) {
        break;
      }

      color = COLORS[text[index]] ?? color;
    } else {
      const glyph = fontSet.getGlyph(char);

      if (!glyph.empty) {
        const { shadowOffset = 1 } = glyph;

        glyph.render(context, x + shadowOffset, y + shadowOffset, (color * (63 / 255)).toString(16));
        glyph.render(context, x, y, color.toString(16));
      }

      x += glyph.advance;
    }
  }
}
