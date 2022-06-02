# Waveform drawing server for youtube videos

This is not the correct title. The server generates and returns peaks, that you can use for drawing waveform (with lots of tools). Peaks are audio signal level digital values for time spots.

Input (REST API end point):

`http://localhost:3001/waveform/?link=https://www.youtube.com/watch?v=3dqXHHCc5lA`

Output (JSON):

```json
{
	"version": 2,
	"channels": 1,
	"sample_rate": 44100,
	"samples_per_pixel": 4410,
	"bits": 8,
	"length": 10631,
	"data": [0, 0, -1, 1, -28, 23, -56, 45, -72, 67] // and 10531 other numbers
}
```

## Install

You should have installed on your machine (server) :

- [yt-dlp ](https://github.com/yt-dlp/yt-dlp)
- [ffmpeg](https://ffmpeg.org/)
- [audioWaveform](https://github.com/bbc/audiowaveform)

This server (`Express.js`) will use all those apps with `child_process.exec(command)`

Clone this repo and run `npm i`

## Hot it works

1. `yt-dlp` downloads smallest `m4a` audio file from youtube to the server

```bash
yt-dlp -f wa[ext=m4a] youtu.be/3dqXHHCc5lA -o audio.m4a
```

We choose `yt-dlp` over `yt-dl` because it downloads file faster. E.g. 7mb file in 2 sec vs 10 min.

2. `ffmpeg` converts it to `wav` format

```bash
ffmpeg -i audio.m4a audio.wav
```

We don't use `yt-dlp` converter option `--audio-format wav` because on the next step `audiowaveform` can't decode such files.

3. `audiowaveform` extracts audio signal peaks array

```bash
audiowaveform --pixels-per-second 10 -i audio.wav -o peaks.json -b 8
```

We use `wav` over `mp3` (200mb vs 10mb) because it is faster to get peaks from it. After execution we store `peaks.json` file for requests in the future and delete audio files.

On revisiting the same material, the server returns already generated peaks.

## Examples

We use this server for online subtitle editor with the [wavesurfer.js](https://wavesurfer-js.org/) and its [Regions](https://wavesurfer-js.org/plugins/regions.html) plugin.

How does waveform peaks look depending on `--pixels-per-second` param:

`--pixels-per-second 25`
![Screenshot from 2022-06-01 17-58-10](https://user-images.githubusercontent.com/1222611/171491245-23daf902-d477-4b08-88fe-23ea2cf8ec0f.png)

`--pixels-per-second 10`
![Screenshot from 2022-06-01 17-40-31](https://user-images.githubusercontent.com/1222611/171491250-09cdd14e-ffda-4d2e-8d05-3a0108888fd8.png)

`Audiowaveform` default value for `--pixels-per-second` is 100. The table below shows the relationship between file size and `--pixels-per-second` value for 50 min video.

| --pixels-per-second | json file size (kb) |
| ------------------- | ------------------- |
| 100                 | 1600                |
| 50                  | 800                 |
| 25                  | 400                 |
| 10                  | 160                 |
