#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""生成视频开场卡 + 结尾 CTA 卡（1920x1080），复用 DNA 霓虹风格。"""
from PIL import Image, ImageDraw, ImageFilter, ImageFont
import math, random

S = 1920
H = 1080

def gradient_bg(w, h):
    img = Image.new("RGB", (w, h), (0, 0, 0))
    d = ImageDraw.Draw(img)
    top = (5, 5, 16); bot = (13, 18, 58)
    for y in range(h):
        t = y / (h - 1)
        c = tuple(int(top[i] + (bot[i] - top[i]) * t) for i in range(3))
        d.line([(0, y), (w, y)], fill=c)
    return img

def draw_dna(img, cx, cy, amp, rung_h, period, scale=1.0):
    """在 RGBA 图层上画 DNA 双螺旋（teal x purple），返回合成后的图。"""
    layer = Image.new("RGBA", (S, H), (0, 0, 0, 0))
    g = ImageDraw.Draw(layer)
    TEAL = (45, 212, 191, 255)
    PURPLE = (168, 85, 247, 255)
    BAR = (120, 180, 255, 170)
    w_s = int(30 * scale); b_s = int(14 * scale)
    def strand(phase, color, width):
        pts = []
        for yy in range(int(cy - rung_h), int(cy + rung_h) + 1, 2):
            x = cx + amp * math.sin((yy - cy) / period * 2 * math.pi + phase)
            pts.append((x, yy))
        if len(pts) > 1:
            g.line(pts, fill=color, width=width, joint="curve")
    def rungs(phase, color, width):
        k = 0
        while True:
            yy = cy + k * period * 0.45
            if abs(yy - cy) > rung_h: break
            x1 = cx + amp * math.sin((yy - cy) / period * 2 * math.pi + phase)
            x2 = cx + amp * math.sin((yy - cy) / period * 2 * math.pi + phase + math.pi)
            g.line([(x1, yy), (x2, yy)], fill=color, width=width)
            k += 1
        k = -1
        while True:
            yy = cy + k * period * 0.45
            if abs(yy - cy) > rung_h: break
            x1 = cx + amp * math.sin((yy - cy) / period * 2 * math.pi + phase)
            x2 = cx + amp * math.sin((yy - cy) / period * 2 * math.pi + phase + math.pi)
            g.line([(x1, yy), (x2, yy)], fill=color, width=width)
            k -= 1
    rungs(0, BAR, b_s)
    strand(0, TEAL, w_s)
    strand(math.pi, PURPLE, w_s)
    # 光晕
    glow = layer.filter(ImageFilter.GaussianBlur(18))
    img.alpha_composite(glow)
    img.alpha_composite(layer)
    return img

def stars(img, n=160, seed=11):
    layer = Image.new("RGBA", (S, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    random.seed(seed)
    for _ in range(n):
        x = random.randint(0, S); y = random.randint(0, H)
        r = random.choice([2, 3, 3, 4])
        a = random.randint(35, 120)
        d.ellipse([x - r, y - r, x + r, y + r], fill=(180, 220, 255, a))
    img.alpha_composite(layer)

def text_layer(img, text, y, size, fill, font_path, glow=True, tracking=0):
    """居中绘制文字（带光晕）。"""
    f = ImageFont.truetype(font_path, size)
    layer = Image.new("RGBA", (S, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    # 手动字距
    widths = []
    total = 0
    for ch in text:
        w = d.textlength(ch, font=f)
        widths.append(w); total += w + tracking
    total -= tracking
    x = (S - total) / 2
    for ch, w in zip(text, widths):
        d.text((x, y), ch, font=f, fill=fill)
        x += w + tracking
    if glow:
        g = layer.filter(ImageFilter.GaussianBlur(size // 6))
        img.alpha_composite(g)
    img.alpha_composite(layer)

FONT_BOLD = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
FONT_REG = "/System/Library/Fonts/Supplemental/Arial.ttf"
TEAL = (45, 212, 191, 255)
WHITE = (245, 248, 255, 255)
GRAY = (170, 185, 215, 255)

# ── 开场卡 ──
img = gradient_bg(S, H).convert("RGBA")
stars(img)
# DNA 位于上部
img = draw_dna(img, cx=S//2, cy=390, amp=230, rung_h=210, period=420, scale=1.6)
# 标题
text_layer(img, "Evolutionary Prophecy", 640, 104, WHITE, FONT_BOLD)
text_layer(img, "Predict the future through evolution", 780, 44, TEAL, FONT_REG)
img.convert("RGB").save("intro.png", "PNG")
print("intro.png 1920x1080")

# ── 结尾 CTA 卡 ──
img2 = gradient_bg(S, H).convert("RGBA")
stars(img2, seed=23)
img2 = draw_dna(img2, cx=S//2, cy=340, amp=210, rung_h=185, period=400, scale=1.4)
text_layer(img2, "Predict the future,", 560, 100, WHITE, FONT_BOLD)
text_layer(img2, "one branch at a time.", 690, 100, TEAL, FONT_BOLD)
text_layer(img2, "prophet.lifelong-growth.com", 860, 48, GRAY, FONT_REG)
text_layer(img2, "No account required · Free forever", 940, 34, GRAY, FONT_REG)
img2.convert("RGB").save("endcard.png", "PNG")
print("endcard.png 1920x1080")
