#!/bin/bash
# 组装 5 段视频：Ken Burns 运镜 + 配音 → 拼接成片（v2：去掉 apad/-shortest）
set -e
cd "$(dirname "$0")"
FF=/Users/pony/bin/ffmpeg
FPS=30

build() {
  local img=$1 audio=$2 dur=$3 zexpr=$4 xexpr=$5 yexpr=$6 out=$7
  "$FF" -y -loop 1 -framerate "$FPS" -t "$dur" -i "$img" \
    -i "$audio" \
    -vf "scale=2880:1620:force_original_aspect_ratio=increase,crop=2880:1620,zoompan=z='$zexpr':x='$xexpr':y='$yexpr':d=1:s=1920x1080:fps=$FPS,format=yuv420p" \
    -af "adelay=350|350" \
    -c:v libx264 -preset veryfast -crf 19 -c:a aac -b:a 160k \
    -t "$dur" "$out"
  echo "built $out (${dur}s)"
}

C='(iw-iw/zoom)/2'

build intro.png    seg1_intro.mp3 4.5  "min(1+0.0008*on,1.08)" "$C" "$C" seg1.mp4
build ../gallery-1-home.png  seg2_home.mp3 8.6  "max(1.10-0.0012*on,1.0)"  "$C" "$C" seg2.mp4
build ../gallery-2-topic.png seg3_topic.mp3 13.0 "min(1+0.0006*on,1.10)"  "$C" "$C" seg3.mp4
build ../gallery-3-create.png seg4_create.mp3 9.7 "min(1+0.0010*on,1.14)"  "$C" "$C" seg4.mp4
build endcard.png  seg5_cta.mp3 9.2  "max(1.12-0.0012*on,1.0)"  "$C" "$C" seg5.mp4

# 拼接
: > list.txt
for i in 1 2 3 4 5; do echo "file 'seg$i.mp4'" >> list.txt; done
"$FF" -y -f concat -safe 0 -i list.txt -c copy ../evolutionary-prophecy-promo.mp4
echo "=== DONE: ../evolutionary-prophecy-promo.mp4 ==="
