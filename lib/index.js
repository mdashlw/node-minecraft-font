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

function convertColorToHex(color) {
  return `#${color.toString(16).padStart(6, "0")}`;
}

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

export function renderText({ font, context, scale = 1, x = 0, y = 0 }, text) {
  const fontSet = getFontSet(font);
  let color = COLORS.f;

  context.save();
  context.scale(scale, scale);
  context.imageSmoothingEnabled = false;

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

        glyph.render(context, x + shadowOffset, y + shadowOffset, convertColorToHex(color * (63 / 255)));
        glyph.render(context, x, y, convertColorToHex(color));
      }

      x += glyph.advance;
    }
  }

  context.restore();
}
