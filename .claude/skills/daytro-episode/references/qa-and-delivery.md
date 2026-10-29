# QA, rendering and reporting

The user judges by watching. Anything wrong that you could have seen in a still costs them a review round, so look at frames yourself before every render.

## Find the frames

```bash
node .claude/skills/daytro-episode/scripts/episode_info.mjs ep01          # scenes, marks, every line with its time
node .claude/skills/daytro-episode/scripts/episode_info.mjs ep01 vang     # only one speaker's lines
```

It prints each scene's global start frame, its duration and marks, then every line as `id | scene | m:ss | global frame | kind | speaker | text`. Use it to map the user's timestamps ("phút 1:49") to line ids, and to pick frames to check.

## Look at the pictures

```bash
npx remotion still src/index.ts DayTro-EpNN-Contact out/daytro/epNN-contact.png --frame=0     # 16-frame grid
npx remotion still src/index.ts DayTro-EpNN <scratch>/f.png --frame=<global frame> --scale=0.5
```

Open the PNGs with Read. For several moments at once, paste stills into one strip with PIL. Check:

- **Captions:** no face is covered by a cloud or subtitle, and the cloud's dots point at the right pet.
- **Occlusion:** nobody is hidden behind someone (Mướp behind Vàng, Thư behind Minh, a hand behind a head).
- **Framing:** heads aren't cut off in wide shots, and there is headroom for someone up a ladder.
- **Scale:** the shipper and props are in proportion with the cast.
- **Expressions:** each face matches its line (no "hic!" drunk face on someone who is just sulking).
- **Action beats:** they have the full effects treatment.
- **Title cards and time cards:** they don't sit on faces.

Update the Contact frames to cover whatever you changed.

## Render and verify

```bash
npx remotion render src/index.ts DayTro-EpNN out/daytro/Tap-NN-<slug-khong-dau>.mp4     # ~3–5 min
.venv/Scripts/python.exe .claude/skills/daytro-episode/scripts/check_video.py out/daytro/Tap-NN-<slug>.mp4
```

- Run long renders in the background. Rendering and TTS can run at the same time, but they slow each other down.
- `check_video.py` prints the duration, video and audio streams, loudness per 10 s (expect about -14 to -22 dB; a silent stretch in the middle means a missing audio file) and the clipped-sample count (a handful is inaudible; hundreds means the mix is too hot).
- Grab one or two frames from the MP4 itself (bundled ffmpeg at `node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe -ss <sec> -i <mp4> -frames:v 1`) to confirm the file, not just the code, shows the change. The bundled ffmpeg has no `volumedetect` or `select` filters, so use Python for audio stats.
- Target length is about 3:00. Report the real number. If it is under about 2:40, offer to add lines or beats.

## Report to the user (Vietnamese)

- Open with the result: file link (`[Tap-01-Day-chac-lam.mp4](out/daytro/Tap-01-Day-chac-lam.mp4)`) and duration.
- List what changed, using their own wording, with timestamps where useful.
- Name anything you interpreted (a typo, a line number that didn't match, a line they attributed to the wrong character) and what you did about it.
- Flag honest caveats: lines Whisper heard oddly, approximations (TTS shout instead of a real scream), anything waiting on them (a sound to supply, a voice to lock, other episodes still on the old version).
- Write no code jargon. Say "giọng AI", "khung hình", "phụ đề", "bóng nghĩ".
- When asked to shut the computer down after a job, schedule it with a grace period (`shutdown.exe /s /t 180 /c "…"`) and tell the user how to cancel (`shutdown /a`). That is a one-off instruction; it doesn't carry over to later jobs.
