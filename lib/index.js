import { getFontSet } from "./font-manager.js";

const colors = {
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

export function fetchMinecraftAssets() {
  // TODO remove "assets" and fetch them from https://launchermeta.mojang.com/mc/game/version_manifest.json
}

export function renderText({ font, context, x = 0, y = 0 }, text) {
  const fontSet = getFontSet(font);
  let color = colors.f;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];

    if (char === "§") {
      if (index + 1 === text.length) {
        break;
      }

      color = colors[text[++index]] ?? color;
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