# Chat Mate 華語 icon notes

## Colors

- Background and character: `#101c22`
- Speech bubble: `#e8553e` (warm vermilion)

Using the WCAG relative-luminance formula, `#101c22` has luminance `0.01056160` and `#e8553e` has luminance `0.24000605`. Their contrast ratio is `(0.24000605 + 0.05) / (0.01056160 + 0.05) = 4.7886:1`, rounded to **4.79:1**.

## Character construction

The Traditional character 華 is the U+83EF glyph extracted from the bundled `NotoSansTC-Bold.otf` (Noto Sans TC Bold) with Python fontTools. The font is licensed under the SIL Open Font License, Version 1.1. Its glyph outline was converted directly to a filled compound SVG path; there is no `<text>` element, runtime font reference, linked asset, stroke, or raster image in any SVG.

The glyph is scaled to 156.23 px in the 512-coordinate design, about 58.29% of the speech bubble's full 268 px height, and optically centered in its rectangular body. At 192 px output size the glyph is 58.59 px tall, retaining the font's Bold weight for small-size legibility.

The 512 px icon uses the supplied bubble silhouette at the supplied position. The 1024 px artwork is an exact 2× scaling of that foreground on a square full-bleed background; the 192 px artwork is an exact 0.375× scaling, with its background corner radius rounded to 40 px.
