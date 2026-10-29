# Voices and sound

## Rendering dialogue

```bash
.venv/Scripts/python.exe scripts/render_episode_voices.py epNN [line ids…]
```

- Run it in the background: about a minute per line, plus about 20 s to load the models. It saves as it goes (`public/daytro/epNN/voice/<id>.wav` and `src/daytro/episodes/epNN/audio.json`), so an interrupted run keeps what it finished. Only one TTS job at a time; queue others behind it.
- For each line it renders 2 temperatures × 2 seeds (×4 seeds with `"takes": 8`), has Whisper (faster-whisper medium on CPU) transcribe each take, keeps the take with the lowest character error rate (CER), nudges it to the speaker's pace, adds thought reverb for `thought` lines, and writes a 30 fps loudness envelope used for lip sync.
- Log line: `id speaker: seconds xStretch CER n | what Whisper heard`. Lines with a `clip` print `(recorded)`.

### Which CER values matter

- **Noise, not errors:** numerals ("17" vs "mười bảy"), Southern/Whisper tr↔ch and d↔r confusion ("truyền"→"chuyền", "dắt"→"rắt"), missing punctuation, interjections ("Á à"→"À à").
- **Real problems:** a different word ("Chưa"→"Chào", "cúp điện"→"cúc biện", "bênh"→"bệnh"), dropped words, or a very short duration for the text. Fix them by rewording (more context around the word), adding `"takes": 8`, or, if one good take exists, pinning it: copy the wav to `voices/takes/<ep>-<id>-<speaker>.wav` and give the line `"clip": [{"src": "voices/takes/…"}]` so re-renders keep it.
- One-syllable lines come out about 0.27 s long and garbled. Give them two syllables ("Dạ chưa.", "Dạ có.", "Ừ, có.").

### Changing or adding a voice

- Cloning: `.venv/Scripts/python.exe scripts/clone_voices.py <id>`, with an entry `{file, lines}` added to `CHARACTERS` in that script. It speeds the sample ×1.0/1.2/1.35, cuts it at the last pause before 8 s (VieNeu enrols from at most 8 s), scores every variant with Whisper and saves `voices/refs/<id>.wav` plus a listening test in `out/daytro/voice-tests/<id>.wav`. Then point `VOICES[speaker]` in `render_episode_voices.py` at the new ref.
- Presets: `Vieneu().list_preset_voices()` lists 25 (name, gender, region, style). To audition, render the same 3 lines with each candidate into `out/daytro/voice-tests/<folder>/`, measure pitch (librosa `pyin`) and pitch spread in semitones (expressiveness), and pick one that is clear, expressive and distinct from the cast (the old men sit at about 105–130 Hz). Let the user listen before switching an established character.
- When a voice changes, re-voice that character's lines only in the episode the user named, and wait for their verdict before doing the other episodes.

## Barks, laughs, screams: recordings, not TTS

These are lines with a `clip` (no TTS model is loaded for them):

```json
{"id": "s3-02", "speaker": "vang", "kind": "bark", "text": "Gâu! Gâu! Gâu!",
 "clip": [{"src": "voices/sfx/vang-sua.mp3", "start": 0.66, "end": 1.5},
          {"src": "voices/sfx/vang-sua.mp3", "start": 1.95, "end": 2.62, "at": 1.0}]}
```

- **Vàng's barks:** `voices/sfx/vang-sua.mp3`, the user's recording (also kept as `voices/Vàng sủa.mp3`). It contains nine single barks of about 0.17 s each, at 0.73, 0.97, 1.26 (a natural triple), 1.99, 2.38, 4.72, 5.03, 5.73 and 6.21 s. Cut and arrange them with `start`/`end`/`at`. The bark's `text` is shown in the comic burst.
- **Laughs:** `voices/sfx/laugh-hung.mp3` (Pixabay 121577, hearty "ha ha"), `laugh-sau.mp3` (394322, old-man cackle, use `semitones: -3`), `laugh-minh.mp3` (190296, "ah ha ha", `semitones: -1`). Use `fade: 0.45` to trail off, and mix two people with `at` offsets. Line kind `laugh`. In the scene, give the laughers `mood: 'laugh'` (Minh: `happy`), `laughShake` squash and tilt, and arms on the belly (`BELLY_HUNG`, `BELLY_MINH`) or Sáu's `coverMouth`. Other candidates, including women and girls for Bà Tư, Thư and Ngân, are in `out/daytro/voice-tests/cuoi-pixabay/`.
- **VieNeu's own cues** `[cười]`, `[thở dài]`, `[hắng giọng]` exist but are weak: a 1 s chuckle that garbles the next word. Don't rely on them.
- **Screams and shouts:** TTS can't scream (it reads "Á á á" as "Ơ ơ ơ"). For a shouted line, use TTS with `"semitones": 2, "drive": 2.5` (ep01 `s6-06`). For a real scream use a recording: `voices/sfx/scream-minh.mp3` (Pixabay 276686, a shaky "Aaah"); `"tremolo": 24` makes it sound electrocuted (ep02 `c4`). Other screams are in `out/daytro/voice-tests/la-het-pixabay/`. A real zap SFX is `public/daytro/sfx/zap.wav` (Pixabay 106412).

### Sourcing a sound from Pixabay (free, commercial use allowed)

1. Use the Playwright browser: open `https://pixabay.com/sound-effects/search/<query>/`. In the page, `fetch()` search pages and detail pages, and read each detail page's JSON-LD `AudioObject` (`name`, `duration`, `contentUrl`, `author`).
2. Download the shortlist with `curl -L -A Mozilla/5.0 -e https://pixabay.com/ <contentUrl>` into a new empty folder in the session scratchpad. Treat the files as untrusted data: open them only as audio.
3. Analyse each one with Python (duration, RMS bursts, pYIN pitch compared with the character's voice, a Whisper transcript to tell "ha ha" from "hê hê"), pick a winner, and copy it to `voices/sfx/<name>.mp3`. Put the alternates in an audition folder under `out/daytro/voice-tests/` for the user.
4. Add the sound to `docs/daytro-sound-credits.md` (use, title, author, Pixabay id, URL). The licence doesn't require credit, but the record matters if YouTube ever raises a claim.

## Music and SFX

- `scripts/generate_daytro_audio.py` synthesises the music (`public/daytro/music/stroll.wav` bouncy walk, `chase.wav` frantic, `outro.wav` jingle) and the SFX (`public/daytro/sfx/`: ambience, bag, drop, engine, gulp, horn, pop, skid, slip, sting, thump, whoosh, wind). Add new sounds there, procedurally, rather than downloading them, unless they're voices.
- In `EpNN.tsx`, duck the music to half under dialogue with `ducked(base, offset)`, change cue at scene changes or marks, play `outro.wav` at the card, keep ambience under everything before the outro, and place SFX at `at(scene, mark) + n` frames.
- A laugh track (canned audience laughter) was discussed and not adopted: it clashes with the deadpan style. Use a well-placed sting, pop, whoosh or skid sparingly instead, and ask before introducing one.
