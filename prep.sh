#!/bin/zsh
# prep.sh <S>: delogo + extract 24fps frames to studio/frames/S, make QA tile
DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR"

if [ -x "$DIR/tools/ffmpeg" ]; then
  FF="$DIR/tools/ffmpeg"
  FP="$DIR/tools/ffprobe"
elif command -v ffmpeg >/dev/null 2>&1; then
  FF="ffmpeg"
  FP="ffprobe"
else
  echo "Error: ffmpeg not found in $DIR/tools or PATH" >&2
  exit 1
fi

S=$1
mkdir -p "studio/frames/$S" && rm -rf "studio/frames/$S"/*
"$FF" -v error -y -i "gen/sd$S.mp4" -vf "delogo=x=6:y=6:w=78:h=42,fps=24,scale=1920:1080:flags=lanczos+accurate_rnd" -q:v 2 "studio/frames/$S/%04d.jpg"
n=$(ls "studio/frames/$S" | wc -l | tr -d ' '); echo "$S frames $n"
d=$("$FP" -v error -show_entries format=duration -of csv=p=0 "gen/sd$S.mp4")
mkdir -p qa
"$FF" -v error -y -i "gen/sd$S.mp4" -vf "fps=24/6,scale=384:216,drawtext=text='%{eif\:t*1\:d}.%{eif\:mod(t*10\,10)\:d}':x=4:y=196:fontcolor=yellow:fontsize=16:fontfile=/System/Library/Fonts/Menlo.ttc,tile=6x6" -frames:v 1 "qa/tile_$S.jpg"

