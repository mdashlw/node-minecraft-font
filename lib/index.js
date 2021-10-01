import { loadFontSets, getFontSet } from "./font-manager.js";

export const MINECRAFT_COLORS = Object.fromEntries(
  Object.entries({
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
  }).map(([code, color]) => [
    code,
    {
      text: convertColorToHex(color),
      shadow: convertColorToHex(color * (63 / 255)),
    },
  ])
);

await loadFontSets();

function convertColorToHex(color) {
  return `#${color.toString(16).padStart(6, "0")}`;
}

export function fetchMinecraftAssets() {
  // TODO remove assets from the repo and fetch them from https://launchermeta.mojang.com/mc/game/version_manifest.json
}

export function measureMinecraftText(text, font) {
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

export function drawMinecraftText(context, text, x, y, scale = 1, font) {
  const fontSet = getFontSet(font);
  let color = MINECRAFT_COLORS.f;

  context.save();
  context.scale(scale, scale);
  context.imageSmoothingEnabled = false;

  for (let index = 0; index < text.length; index++) {
    const char = text[index];

    if (char === "§") {
      if (++index === text.length) {
        break;
      }

      color = MINECRAFT_COLORS[text[index]] ?? color;
    } else {
      const glyph = fontSet.getGlyph(char);

      if (!glyph.empty) {
        const { shadowOffset = 1 } = glyph;

        glyph.render(context, x + shadowOffset, y + shadowOffset, color.shadow);
        glyph.render(context, x, y, color.text);
      }

      x += glyph.advance;
    }
  }

  context.restore();
}
