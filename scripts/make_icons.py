#!/usr/bin/env python3
"""Generate simple PNG icons without external deps.

Outputs:
  icons/icon16.png
  icons/icon48.png
  icons/icon128.png

Design: dark background with a light 'd'-like glyph made of rectangles.
"""

from __future__ import annotations

import os
import struct
import zlib


def png_bytes(width: int, height: int, rgba_rows: list[bytes]) -> bytes:
    # Each row must be width*4 bytes.
    assert len(rgba_rows) == height
    for r in rgba_rows:
        assert len(r) == width * 4

    def chunk(typ: bytes, data: bytes) -> bytes:
        crc = zlib.crc32(typ)
        crc = zlib.crc32(data, crc) & 0xFFFFFFFF
        return struct.pack(">I", len(data)
        ) + typ + data + struct.pack(">I", crc)

    # PNG signature
    out = [b"\x89PNG\r\n\x1a\n"]

    # IHDR
    ihdr = struct.pack(">IIBBBBB", width, height, 8, 6, 0, 0, 0)
    out.append(chunk(b"IHDR", ihdr))

    # IDAT: zlib-compressed scanlines. Each row: filter byte 0 + pixels.
    raw = b"".join([b"\x00" + row for row in rgba_rows])
    compressed = zlib.compress(raw, level=9)
    out.append(chunk(b"IDAT", compressed))

    # IEND
    out.append(chunk(b"IEND", b""))
    return b"".join(out)


def make_icon(size: int) -> bytes:
    bg = (18, 18, 20, 255)       # near-black
    fg = (235, 235, 240, 255)    # off-white
    ac = (90, 200, 250, 255)     # accent blue

    # Create blank RGBA buffer.
    px = [[bg for _ in range(size)] for _ in range(size)]

    def fill_rect(x0: int, y0: int, w: int, h: int, color):
        for y in range(max(0, y0), min(size, y0 + h)):
            row = px[y]
            for x in range(max(0, x0), min(size, x0 + w)):
                row[x] = color

    # Border (subtle)
    fill_rect(0, 0, size, 1, (40, 40, 44, 255))
    fill_rect(0, size - 1, size, 1, (40, 40, 44, 255))
    fill_rect(0, 0, 1, size, (40, 40, 44, 255))
    fill_rect(size - 1, 0, 1, size, (40, 40, 44, 255))

    # Accent bar
    fill_rect(0, size - max(2, size // 10), size, max(2, size // 10), ac)

    # 'd' glyph built from rectangles
    # Scale positions based on size.
    pad = max(2, size // 8)
    stroke = max(2, size // 10)
    x_left = pad
    y_top = pad
    y_bottom = size - pad - max(2, size // 10)

    # vertical stem
    fill_rect(x_left, y_top, stroke, y_bottom - y_top, fg)

    # bowl
    bowl_w = size - pad * 2
    bowl_h = (y_bottom - y_top) // 2 + stroke
    bowl_x = x_left
    bowl_y = y_top + (y_bottom - y_top) // 4
    fill_rect(bowl_x, bowl_y, bowl_w, stroke, fg)                  # top
    fill_rect(bowl_x, bowl_y + bowl_h - stroke, bowl_w, stroke, fg) # bottom
    fill_rect(bowl_x + bowl_w - stroke, bowl_y, stroke, bowl_h, fg)  # right

    # inner cutout
    inner_pad = stroke + max(1, size // 24)
    fill_rect(bowl_x + inner_pad, bowl_y + inner_pad,
              bowl_w - inner_pad * 2,
              bowl_h - inner_pad * 2,
              bg)

    # dot accent (small)
    dot = max(2, size // 12)
    fill_rect(size - pad - dot, pad, dot, dot, ac)

    rows: list[bytes] = []
    for y in range(size):
        row = bytearray()
        for x in range(size):
            r, g, b, a = px[y][x]
            row += bytes((r, g, b, a))
        rows.append(bytes(row))

    return png_bytes(size, size, rows)


def main() -> None:
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    out_dir = os.path.join(root, "icons")
    os.makedirs(out_dir, exist_ok=True)

    for size in (16, 48, 128):
        p = os.path.join(out_dir, f"icon{size}.png")
        with open(p, "wb") as f:
            f.write(make_icon(size))
        print("wrote", p)


if __name__ == "__main__":
    main()
