# Falling Sand

[Demo](https://sandfall.netlify.app/)

## Recordings

Press `r` to start recording, `r` again to stop recording. The recording will be saved as `sand.webm`. MediaRecorder is used to record the canvas.

⚠️ The recording is not _ready_ to play, you should run it through `ffmpeg` to fix it.

For example I like to scale it up:

```bash
# Change -r to the framerate you want
ffmpeg -i "sand.webm" -vf scale=1024:576:flags=neighbor -r 120 sand-output.webm
```
