#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""生成 Product Hunt 240x240 缩略图：DNA 双螺旋 + 深空霓虹，匹配站点品牌。"""
from PIL import Image, ImageDraw, ImageFilter
import math, random

S = 960  # 4x 超采样
OUT = 240

# ── 背景：深空渐变 (#050510 -> #0b1030) ──
bg = Image.new("RGB", (S, S), (0, 0, 0))
top = (5, 5, 16)
bot = (11, 16, 48)
d = ImageDraw.Draw(bg)
for y in range(S):
    t = y / (S - 1)
    c = tuple(int(top[i] + (bot[i] - top[i]) * t) for i in range(3))
    d.line([(0, y), (S, y)], fill=c)

# ── 光晕层（DNA 发光基础）──
glow = Image.new("RGBA", (S, S), (0, 0, 0, 0))
g = ImageDraw.Draw(glow)

cx, cy = S // 2, S // 2
amp = S * 0.16      # 波浪振幅
rung_h = S * 0.42   # 螺旋高度
period = S * 0.34   # 波长

# 两条链：teal 与 purple，相位差 pi
def strand(phase, color, width):
    pts = []
    for yy in range(int(cy - rung_h), int(cy + rung_h) + 1, 2):
        x = cx + amp * math.sin((yy - cy) / period * 2 * math.pi + phase)
        pts.append((x, yy))
    if len(pts) > 1:
        g.line(pts, fill=color, width=width, joint="curve")

# 横档（碱基对）
def rungs(phase, color, width):
    for k in range(-int(rung_h // (period * 0.45)), int(rung_h // (period * 0.45)) + 1):
        yy = cy + k * period * 0.45
        if abs(yy - cy) > rung_h:
            continue
        x1 = cx + amp * math.sin((yy - cy) / period * 2 * math.pi + phase)
        x2 = cx + amp * math.sin((yy - cy) / period * 2 * math.pi + phase + math.pi)
        g.line([(x1, yy), (x2, yy)], fill=color, width=width)

TEAL = (45, 212, 191, 255)     # #2DD4BF
PURPLE = (168, 85, 247, 255)   # #A855F7
BAR = (120, 180, 255, 180)

rungs(0, BAR, 16)
strand(0, TEAL, 34)
strand(math.pi, PURPLE, 34)

# 中心节点光点
for k in range(-int(rung_h // (period * 0.45)), int(rung_h // (period * 0.45)) + 1):
    yy = cy + k * period * 0.45
    if abs(yy - cy) > rung_h:
        continue
    for phase, col in [(0, TEAL), (math.pi, PURPLE)]:
        x = cx + amp * math.sin((yy - cy) / period * 2 * math.pi + phase)
        g.ellipse([x - 10, yy - 10, x + 10, yy + 10], fill=col)

# 星光粒子
random.seed(7)
for _ in range(90):
    x = random.randint(0, S)
    y = random.randint(0, S)
    r = random.choice([2, 2, 3, 3, 4])
    a = random.randint(40, 130)
    g.ellipse([x - r, y - r, x + r, y + r], fill=(180, 220, 255, a))

# 高斯模糊做出霓虹光晕
glow = glow.filter(ImageFilter.GaussianBlur(S * 0.012))

# 合成
out = bg.convert("RGBA")
out.alpha_composite(glow)

# 四角压暗/加柔光边框（可选圆角）
out = out.convert("RGB")
out = out.resize((OUT, OUT), Image.LANCZOS)

# 保存
path = "/Users/pony/Documents/code/evolutionary-prophecy/product-hunt-assets/thumbnail-240x240.png"
out.save(path, "PNG")
print("saved:", path, out.size)
