import { Canvas, ImageData, loadImage } from "skia-canvas";

const SPACE_GLYPH = {
  empty: true,
  advance: 4,
  render() {},
};
const MISSING_GLYPH = {
  width: 5,
  height: 8,
  advance: 6,
  render(context, x, y, color) {
    const { width, height } = this;
    const bufferCanvas = new Canvas(width, height);
    const bufferContext = bufferCanvas.getContext("2d");

    bufferContext.imageSmoothingEnabled = false;
    bufferContext.fillStyle = color;
    bufferContext.fillRect(0, 0, width, height);
    bufferContext.globalCompositeOperation = "destination-in";
    bufferContext.drawImage(this.image, 0, 0);

    context.drawImage(bufferCanvas, x, y);
  },
};

await (async () => {
  const { width, height } = MISSING_GLYPH;
  const data = [];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = (x + y * width) * 4;
      const value = x == 0 || x + 1 == width || y == 0 || y + 1 == height ? 255 : 0;

      data[index + 0] = value; // r
      data[index + 1] = value; // g
      data[index + 2] = value; // b
      data[index + 3] = value; // a
    }
  }

  const imageData = new ImageData(width, height, Uint8ClampedArray.from(data));
  const canvas = new Canvas(width, height);
  const context = canvas.getContext("2d");

  context.putImageData(imageData, 0, 0);

  MISSING_GLYPH.image = await loadImage(await canvas.toBuffer());
})();

export function create(providers) {
  return {
    getGlyph(char) {
      if (char === " ") {
        return SPACE_GLYPH;
      }

      let glyph;

      for (const provider of providers) {
        glyph = provider.getGlyph(char);

        if (glyph) {
          return glyph;
        }
      }

      return MISSING_GLYPH;
    },
  };
}
