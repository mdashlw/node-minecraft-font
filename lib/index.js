import { loadFontSets, getFontSet } from "./font-manager.js";

/* @deprecated */
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
const CHAT_FORMATTINGS = Object.freeze(
  Object.fromEntries(
    Object.entries({
      0: {
        name: "BLACK",
        color: 0,
      },
      1: {
        name: "DARK_BLUE",
        color: 170,
      },
      2: {
        name: "DARK_GREEN",
        color: 43520,
      },
      3: {
        name: "DARK_AQUA",
        color: 43690,
      },
      4: {
        name: "DARK_RED",
        color: 0xaa0000,
      },
      5: {
        name: "DARK_PURPLE",
        color: 0xaa00aa,
      },
      6: {
        name: "GOLD",
        color: 0xffaa00,
      },
      7: {
        name: "GRAY",
        color: 0xaaaaaa,
      },
      8: {
        name: "DARK_GRAY",
        color: 0x555555,
      },
      9: {
        name: "BLUE",
        color: 0x5555ff,
      },
      a: {
        name: "GREEN",
        color: 0x55ff55,
      },
      b: {
        name: "AQUA",
        color: 0x55ffff,
      },
      c: {
        name: "RED",
        color: 0xff5555,
      },
      d: {
        name: "LIGHT_PURPLE",
        color: 0xff55ff,
      },
      e: {
        name: "YELLOW",
        color: 0xffff55,
      },
      f: {
        name: "WHITE",
        color: 0xffffff,
      },
      l: {
        name: "BOLD",
        apply(style) {
          return {
            ...style,
            bold: true,
          };
        },
      },
      r: {
        name: "RESET",
        apply() {
          return { ...EMPTY_STYLE };
        },
      },
    }).map(([code, { name, color, apply }]) => [
      code,
      {
        name,
        color: color && {
          text: convertColorToHex(color),
          shadow: convertColorToHex(color * (63 / 255)),
        },
        apply:
          apply ??
          function () {
            return {
              ...EMPTY_STYLE,
              color: this.color,
            };
          },
      },
    ])
  )
);
const EMPTY_STYLE = Object.freeze({
  color: CHAT_FORMATTINGS.f.color,
  bold: false,
});

await loadFontSets();

function convertColorToHex(color) {
  return `#${color.toString(16).padStart(6, "0")}`;
}

function iterateFormatted(text, accept) {
  let style = { ...EMPTY_STYLE };

  for (let index = 0; index < text.length; index++) {
    const char = text[index];

    if (char === "§") {
      if (++index === text.length) {
        break;
      }

      const code = text[index];
      const formatting = CHAT_FORMATTINGS[code];

      if (formatting) {
        style = formatting.apply(style);
      }
    } else {
      accept(style, char);
    }
  }
}

export function fetchMinecraftAssets() {
  // TODO remove assets from the repo and fetch them from https://launchermeta.mojang.com/mc/game/version_manifest.json
}

export function measureMinecraftText(text, font) {
  const fontSet = getFontSet(font);
  let width = 0;

  iterateFormatted(text, (style, char) => {
    const glyph = fontSet.getGlyph(char);
    const { advance, boldOffset = 1 } = glyph;

    width += advance + (style.bold ? boldOffset : 0);
  });

  return width;
}

export function drawMinecraftText(context, text, x, y, scale = 1, font) {
  const fontSet = getFontSet(font);

  context.save();
  context.scale(scale, scale);
  context.imageSmoothingEnabled = false;

  iterateFormatted(text, (style, char) => {
    const glyph = fontSet.getGlyph(char);
    const { advance, boldOffset = 1, shadowOffset = 1 } = glyph;

    if (!glyph.empty) {
      glyph.render(context, x + shadowOffset, y + shadowOffset, style.color.shadow);

      if (style.bold) {
        glyph.render(context, x + shadowOffset + boldOffset, y + shadowOffset, style.color.shadow);
      }

      glyph.render(context, x, y, style.color.text);

      if (style.bold) {
        glyph.render(context, x + boldOffset, y, style.color.text);
      }
    }

    x += advance + (style.bold ? boldOffset : 0);
  });

  context.restore();
}
