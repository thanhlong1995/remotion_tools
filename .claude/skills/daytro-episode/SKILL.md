---
name: daytro-episode
description: Write, voice, animate, render and revise episodes of "Dãy Trọ" — the Vietnamese Heo Đen-style 2D comedy about four pets (Vàng, Mướp, Bông, Mochi) gossiping about the people in a boarding house — built in this repo with Remotion, VieNeu-TTS voices and Whisper checks. Use it for anything touching this show, even when the user only says "tập mới", "tập 4", "kịch bản", "sửa thoại", "đổi giọng Vàng", "thêm tiếng cười", "làm lại đoạn rượt", "render lại tập 2", or names a character (Vàng, ông Minh, bà Tư, ông Sáu, ông Hùng, anh Khoa, bé Thư, chị Ngân, Mướp, shipper), or pastes a frame from out/daytro/ with notes.
---

# Dãy Trọ episode production

The user (Vietnamese, not a programmer) owns a YouTube channel and delegates the whole production to you: they give an idea or notes in Vietnamese, approve scripts, review the rendered MP4s and send corrections, often with screenshots. Talk to them in Vietnamese, plainly, no code jargon. Everything else (scripts, code, renders, checks) is yours to do.

Read these when the step needs them:

| File | Read it when |
|---|---|
| [references/show-bible.md](references/show-bible.md) | Before writing or changing any script, scene or voice — cast, looks, the user's standing rules, voices |
| [references/episode-anatomy.md](references/episode-anatomy.md) | Before touching code — folder layout, lines.json/timeline format, Stage/Group/effects APIs, captions |
| [references/voices-and-sound.md](references/voices-and-sound.md) | Rendering or fixing voices, barks, laughs, screams, music, SFX, sourcing sounds |
| [references/qa-and-delivery.md](references/qa-and-delivery.md) | Checking frames, rendering, verifying files, reporting back |

## The standing rules (summary — full text in show-bible.md)

These came from the user's corrections; breaking one means redoing work.

1. Pets near humans only **think** (thought cloud, reverb voice, mouth shut); they really talk only when animals are alone together.
2. Anh Khoa answers in **one word that actually answers the question** ("Lưu bài chưa?" → "Dạ chưa.", not "Không.").
3. The shipper always arrives in a rush and is clumsy. Bà Tư gossips. Ông Minh shows off but is kind.
4. Barks, laughs and screams are **real recordings**, never TTS reading "gâu gâu" / "ha ha". Ask the user for a sound, or source one from Pixabay with their go-ahead.
5. Subtitles and thought clouds **never cover a character** (the caption system handles this if you feed it the boxes).
6. Action beats (chases, falls, zaps) get the **full cartoon treatment**: dust, speed lines, sweat, flying objects, camera shake/tilt, onomatopoeia, big expressions, bystanders reacting.
7. Dialogue sounds like people talk: particles, pauses ("…"), no literary parallelism, no rushed pace.
8. Keep every character's look, personality and voice identical across scenes and episodes.
9. **Nobody slides or fades in**: walk, run, trot or climb every move (Stage `walk` / `side`, `ladderClimb`).
10. **Vàng's words and thoughts** always appear in his round dog-shaped bubble (automatic once his anchor is passed to LineOverlay, also in pets-only scenes).

## Workflow

Each stage ends with something the user can judge. Do not skip their approval of the script, and when they review an episode, change only what they asked for, only in the episodes they name (they often want one episode fixed first to "chốt" a decision before the others follow).

### 1. Script (needs the user's approval)

- Aim for ~3 minutes: about 50–55 lines plus a few silent action beats. Durations come from the real audio, so check the estimate later and add beats if short.
- Shape that has worked: title card cold open → setup with the humans (Vàng commenting in thought clouds) → escalation → a pets-only scene where Vàng and Mướp really talk → climax with an action beat → a kind-hearted twist (Minh's good side) → outro on the tin roof with Mướp's dry one-liner, iris out, "Còn tiếp…" card with a teaser for the next episode and Vàng's subscribe line.
- Present it in Vietnamese as a numbered table (scene, speaker, line, kind: nói / nghĩ / sủa / cười) so the user can say "câu 3 sửa thành …".
- Write numbers as words ("mười bảy", not "17"), avoid one-syllable lines (TTS clips them — pad: "Dạ chưa."), and mark every non-speech sound so you know which recordings you need.

### 2. Voices

Write `src/daytro/episodes/epNN/lines.json`, then run the voice renderer in the background (about a minute per line):

```bash
.venv/Scripts/python.exe scripts/render_episode_voices.py epNN            # every line
.venv/Scripts/python.exe scripts/render_episode_voices.py epNN a3 b7      # just these
```

It picks the clearest of several takes with Whisper and logs `CER` per line. Re-take or reword lines with real errors (see voices-and-sound.md for what is a real error and what is Whisper noise). Barks/laughs are `clip` lines mixed from recordings, not TTS.

### 3. Scenes

Build `timeline.ts`, `kit.tsx`, `scenes/`, `EpNN.tsx`, `EpNNContact.tsx`, register both in `src/Root.tsx`. Reuse the shared kit (Stage for front-view scenes at the gate, Group for side-view walks, Drinkers, Outro, effects, captions) — see episode-anatomy.md. Run `npx tsc --noEmit` and eslint; format only with the repo flags (plain `npx prettier` uses the wrong config):

```bash
npx prettier --use-tabs --single-quote --no-bracket-spacing --print-width 120 --write <files>
```

### 4. Look before rendering

Render the 16-frame contact sheet and single frames at half size, and actually look at them: covered faces, someone hidden behind someone else, heads cut off, props out of scale, flat action beats. `scripts/episode_info.mjs` (in this skill) prints every scene's frames, marks and line times so you can pick frames. Fix, re-check.

### 5. Render, verify, report

Render to `out/daytro/Tap-NN-<slug>.mp4`, verify with this skill's `scripts/check_video.py` (duration, streams, loudness per 10 s, clipping), pull a frame or two from the MP4 itself, then report to the user in Vietnamese: file link, duration, what changed, and honest caveats (lines Whisper heard oddly, anything you interpreted, anything still waiting on them). Details in qa-and-delivery.md.

## When the user sends notes

- Map each note to a line id, scene or rule; quote back anything you interpreted (typos like "hẹn" → "hèn", numbering that doesn't match your table, a line they attribute to the wrong character) — then just do it, and say so in the report.
- If a note is a general preference ("from now on…", "cho tất cả các tập sau"), it is a new standing rule: add it to show-bible.md here and to the user's memory, then apply it.
- Re-voice only the changed lines, re-render only the affected episode(s).
