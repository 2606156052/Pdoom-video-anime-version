#!/bin/zsh
# encode.sh <out.mp4>: frames + exact song -> H.264/AAC (Twitter-friendly)
DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR"
OUT=${1:-video/pdoom_anime.mp4}
mkdir -p "$(dirname "$OUT")"

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

"$FF" -v error -y -framerate 30 -i out/frames/%05d.jpg -i song.mp3 -map 0:v -map 1:a -c:v libx264 -preset slow -crf 19 -maxrate 18M -bufsize 36M -profile:v high -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 256k -ar 48000 -t 156.7 "$OUT" && "$FP" -v error -show_entries format=duration,size -of compact "$OUT"

