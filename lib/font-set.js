const SPACE_GLYPH = {
  empty: true,
  advance: 4,
  render() {},
};
// TODO Implement missing glyph
const MISSING_GLYPH = {
  render() {},
};

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
