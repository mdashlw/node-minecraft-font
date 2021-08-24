import util from "util";
import { join as joinPath } from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";
import { PNG } from "pngjs";
import { Canvas, loadImage } from "skia-canvas";

const BASE_TEXTURES_PATH = joinPath(fileURLToPath(import.meta.url), "..", "..", "..", "assets", "textures");
const parsePNG = util.promisify(PNG.prototype.parse);

function getImageAlpha(image, x, y) {
  const index = (x + y * image.width) * 4 + 3;

  return image.data[index];
}

function getActualGlyphWidth(image, i, j, k, l) {
  let m;

  for (m = i - 1; m >= 0; --m) {
    let n = k * i + m;

    for (let o = 0; o < j; ++o) {
      let p = l * j + o;

      if (getImageAlpha(image, n, p) !== 0) {
        return m + 1;
      }
    }
  }

  return m + 1;
}

export async function create({ height = 8, ascent, chars, file }) {
  if (ascent > height) {
    throw new Error(`Ascent ${ascent} higher than height ${height}`);
  }

  for (const element of chars) {
    const thisCodepoints = Array.from(element);
    const firstCodepoints = Array.from(chars[0]);

    if (thisCodepoints.length !== firstCodepoints.length) {
      throw new Error(
        `Elements of chars have to be the same length (found: ${thisCodepoints.length}, expected: ${firstCodepoints.length}), pad with space or \\u0000`
      );
    }
  }

  if (!chars.length || !chars[0].length) {
    throw new Error("Expected to find data in chars, found none.");
  }

  const path = joinPath(BASE_TEXTURES_PATH, file.slice(file.indexOf(":") + 1));
  const texture = await fs.readFile(path);
  const image = await parsePNG.bind(new PNG())(texture);
  const canvasImage = await loadImage(texture);

  const glyphs = {};
  const imageWidth = image.width;
  const imageHeight = image.height;
  const glyphWidth = imageWidth / chars[0].length;
  const glyphHeight = imageHeight / chars.length;
  const scale = height / glyphHeight;

  for (let rowIndex = 0; rowIndex < chars.length; rowIndex++) {
    const codepoints = Array.from(chars[rowIndex]);

    for (let index = 0; index < codepoints.length; index++) {
      const char = codepoints[index];

      if (char === "\x00" || char === " ") {
        continue;
      }

      const actualWidth = getActualGlyphWidth(image, glyphWidth, glyphHeight, index, rowIndex);

      glyphs[char] = {
        scale,
        offsetX: index * glyphWidth,
        offsetY: rowIndex * glyphHeight,
        width: glyphWidth,
        height: glyphHeight,
        advance: Math.trunc(0.5 + actualWidth * scale) + 1,
        ascent,
        render(context, x, y, color) {
          const { offsetX, offsetY, width, height } = this;
          const bufferCanvas = new Canvas(width, height);
          const bufferContext = bufferCanvas.getContext("2d");

          bufferContext.imageSmoothingEnabled = false;
          bufferContext.fillStyle = color;
          bufferContext.fillRect(0, 0, width, height);
          bufferContext.globalCompositeOperation = "destination-in";
          bufferContext.drawImage(canvasImage, offsetX, offsetY, width, height, 0, 0, width, height);

          context.drawImage(bufferCanvas, x, y);
        },
      };
    }
  }

  return {
    getGlyph(char) {
      return glyphs[char];
    },
  };
}
