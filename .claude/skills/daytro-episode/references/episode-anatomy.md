# Anatomy of an episode (code)

All show code lives in `src/daytro/`. Copy patterns from the newest episode (`episodes/ep03/`): it uses every shared piece.

## Contents
1. Folder map
2. lines.json
3. timeline.ts (steps → scenes)
4. Episode files to create
5. Shared building blocks (Stage, Group, Drinkers, Outro, kit)
6. Characters, props and sets
7. Captions that avoid characters
8. Action-beat effects
9. Gotchas

## 1. Folder map

```
src/daytro/
  theme.ts                 INK, OUTLINE, CREAM, fontFamily (Be Vietnam Pro)
  camera.tsx               Cam {x,y,zoom}, World, toScreen, visibleX, mixCam, LIFT (=100)
  characters/<name>/       front views for everyone; side (walk) views for Minh, Bà Tư, Vàng
  characters/shared/       Arm (poses, handPosition), Eye, Leg, walk, Fluff, LaughEye
  props/Props.tsx          BeerGlass, Parcel, PlasticBag, Smoke, NhauTable, Ladder, BreakerBox,
                           Toolbox, Sparks, ChickenFoot, CardboardSign
  props/Effects.tsx        PuffTrail, SweatFlicks, MotionStreaks, SpeedLines, ActionText, shakeAt
  sets/Alley.tsx           Alley, GROUND_Y=960, TILE=1120, windowOf, WindowBars, NightVeil
  sets/Roof.tsx            Roof (outro set)
  ui/                      ThoughtBubble, Subtitle, BarkBurst, Caption ("Hôm sau…"), EpisodeTitle, layout.ts
  episodes/shared/         timeline (makeEpisode), kit, Stage, Group, Drinkers, Outro, Contact
  episodes/epNN/           lines.json, audio.json, timeline.ts, kit.tsx, scenes/, EpNN.tsx, EpNNContact.tsx
  sheets/, scenes/         character sheets, WalkTest, LaughTest
scripts/                   render_episode_voices.py, clone_voices.py, generate_daytro_audio.py
public/daytro/             music/*.wav, sfx/*.wav, <ep>/voice/<id>.wav (rendered lines)
voices/                    the user's samples, refs/, sfx/ (recordings), takes/ (pinned takes) — git-ignored
out/daytro/                renders, contact sheets, voice tests
```

## 2. lines.json

An array, in script order:

```json
{"id": "a3", "speaker": "minh", "kind": "speech", "text": "Một ly thôi nha!"}
```

| field | meaning |
|---|---|
| `id` | short and unique per episode (`a1`, `b2`, `s4-06` …); scenes refer to lines by id |
| `speaker` | a `VOICES` key: vang, tu, minh, sau, hung, thu, shipper, muop, khoa |
| `kind` | `speech` (subtitle), `thought` (pet near humans: cloud + reverb, mouth shut), `bark` (comic burst, no subtitle), `laugh` (no subtitle; the scene animates the laugh) |
| `takes` | `8` = also try extra seeds, for lines Whisper keeps mishearing |
| `clip` | recorded sound instead of TTS: `[{src, start?, end?, at?, gain?, semitones?, speed?, fade?}]`, mixed together |
| `semitones`, `drive` | for TTS lines: pitch shift and soft clipping, to push a line towards a shout |
| `volume` | gain for the finished line |

## 3. timeline.ts

```ts
import {type AudioManifest, type Line, makeEpisode, type Step} from '../shared/timeline';
import audioData from './audio.json';
import lineData from './lines.json';

const SCRIPT: {key: string; steps: Step[]}[] = [
	{key: 'bet', steps: [{wait: 0.5}, {mark: 'title'}, {wait: 2.4}, {line: 'a1'}, {line: 'a2', gap: 0.1}, {mark: 'stand'}, ...]},
	...
	{key: 'outro', steps: [{wait: 1.0}, {line: 'f1'}, {wait: 0.6}, {mark: 'iris'}, {wait: 1.2}, {mark: 'card'}, {line: 'f2'}, {wait: 2.5}]},
];

export const EP = makeEpisode(lineData as Line[], audioData as AudioManifest, SCRIPT);
export const {LINES, SCENES, DURATION, scene, speaking, mouth, mouthOf, thinking, audioFile} = EP;
```

- Steps: `{line, gap?}` plays a line (default gap 0.25 s after it), `{wait: s}` holds, `{mark: name}` names the current frame for animation.
- Scene lengths come from `audio.json` (real durations). Lines without audio yet get an estimate, so you can build scenes before voicing.
- Inside a scene: `S = scene('key')`, `S.marks.x` and `S.cues[id].{from,to}` are scene-local frames; `speaking(S, frame, 'a1', 'a2')`, `mouthOf(S, 'minh', frame)` (lip sync from loudness), `thinking(S, 'vang', frame)`.
- The outro scene needs the marks `iris` and `card`.
- Global frame = `scene(key).from + local`. The `scripts/episode_info.mjs` tool in this skill prints all of these.

## 4. Episode files to create

- `audio.json`: start with `{"fps": 30, "lines": {}}`. The voice script fills it in.
- `kit.tsx`: `export * from '../shared/kit'; export const LineOverlay = makeLineOverlay(LINES);`
- `scenes/*.tsx`: one component per scene key, each using `useCurrentFrame()` (local to its Sequence).
- `EpNN.tsx`: a `COMPONENTS` map of scene key → component, a `<Sequence>` per scene, one `<Audio>` per voiced cue, music with dialogue ducking (`ducked(base, offset)`), an SFX list placed at marks, ambience. Copy `ep03/Ep03.tsx`.
- `EpNNContact.tsx`: 16 frames via `mark(...)`/`mid(...)` into `shared/Contact` (it must be a Composition, not a Still: Freeze clamps to 0 inside a Still).
- `src/Root.tsx`: register `DayTro-EpNN` and `DayTro-EpNN-Contact` (1920×1080, 30 fps, `durationInFrames={DURATION}`).

## 5. Shared building blocks

**Stage** (`episodes/shared/Stage.tsx`) is the front view of the alley, by default at the gate (tile 0). It is the workhorse for dialogue scenes.

```tsx
<Stage frame cam night lit lamp ladder? breaker? gate?
  minh={{x, y, mood, mouth, tilt, armLeft, armRight, held, squash}} tu={...} vang={{x, y, mood, pose, lookX, tilt}}
  sau={{..., coverMouth}} hung={{..., armLeft, speakerOn}} muop={{x, y, s, mood, mouth}}
  behind={<extra set dressing or people drawn behind the cast/>} fx={<drawn on top/>}
  overlay={(avoid) => <LineOverlay scene={S} frame={frame} anchors={{vang: anchorAt(...)}} avoid={avoid} />}
  extraAvoid={[boxes of anyone drawn in behind/fx, e.g. shipperBox(cam, x, y)]} />
```

- `SPOT` holds the standard positions (lamp, ladder, minhGround, tu, vang, sau, hung, speaker, breaker, toolbox, muopToolbox …). `MINH_SCALE = 0.74`, the cast are drawn at about 0.7.
- Arm poses: `ARMS_UP`, `BELLY_HUNG`, `BELLY_MINH`. Poses are `{shoulder, elbow}` in degrees; `minhHand(side, pose)` gives a hand position for aiming at a target.
- Movement (nobody slides): give any front-view character `walk: phase` (strides; e.g. `frame / 8`) while it moves — feet step via `legLift` (`SteppedLegs` in Minh, Tư, Sáu, Hùng, Thư), the body bobs and sways and unposed arms swing. Minh, Tư and Vàng cross the stage in profile with `side: {facing, t, run?}` (side views with the kit's WALK/RUN gaits; RUN.speed ≈ 630 px/s, WALK ≈ 217 px/s, so match the distance to the time). Ladders: `ladderClimb(frame, start, rungs, perRung, fromY, toY)` → `{y, legLift, armLeft, armRight, started, done}` (rungs are 62 px apart; works downwards too). Vàng: `flip` mirrors his front view (e.g. `pose: 'paw'` reaching left to hold the ladder). Characters drawn by hand (e.g. Thư in `behind`) use `frontStep(phase, stride)` → `{lift, bob, sway}` and pass `legLift` themselves.
- Draw order: muop, hung, sau, tu, minh, vang. Keep Vàng at least 80 px right of Mướp, and keep Minh's hand clear of Vàng's head and tail, or they get hidden.

**Group** (`shared/Group.tsx`) is the side-view walking trio (Minh with the leash, Bà Tư a step behind, Vàng in front). It takes `minh`/`tu`/`vang` props (`dx`, `lean`, `leashArm`, `steps` to override the gait, Vàng `fierce`), plus `taut`, `slip`, `showVang`, `showTu`. Helpers: `groupBoxes(cam, x)`, `vangHead(x)`, `minhHandWorld`.

**Drinkers** (`shared/Drinkers.tsx`) is the street nhậu table with Sáu and Hùng seated behind it; `drinkerBoxes(cam, x, sauStand)`.

**Outro** (`shared/Outro.tsx`): Mướp on the roof delivers the verdict, iris out, then the "Còn tiếp…" card with `teaser` and Vàng's head. It takes `muopMood`, `loot` (drawn at Mướp's paws) and `night`.

**kit** (`shared/kit.tsx`): `SCALE` 0.78 (side views), `WALK`/`RUN` gaits, `biped`, `dog`, `swingArm`, `Leash`, `blinkAt`, `ramp(frame, at, frames)`, `clamp`, `laughShake(frame)` → `{squash, tilt}`, `makeLineOverlay`.

## 6. Characters, props and sets

Moods (exported types; add a new one in the head component when a scene needs it):

| Character | moods / options |
|---|---|
| Minh (`Mood`) | neutral, happy (= laughing face), smug, shock, scared, crave, zapped; `held` in the screen-right hand |
| Bà Tư | neutral, counting, happy, yell, suspicious |
| Vàng | neutral, happy, gossip, bark, hungry, scared; poses sit, paw, lie, belly; side view: `fierce` (snarl), `panting`, `lean` |
| Sáu | grin, brag, drunk (shows "hic!", only when actually drunk), wink, laugh; `holdFish`, `coverMouth`, `held` |
| Hùng | sing, cool, hurt, angry, laugh; `mic`, `KaraokeSpeaker` |
| Mướp | judge, smug, shock, annoyed |
| Khoa | zombie, focused, happy, broke |
| Thư | shy, happy, homesick, scared; `cupped` (holds Mochi with `THU_HOLD_POSE`) |
| Ngân / Bông / Mochi | neutral, selfie, excited, cry, angry / snob, yap, scared, selfie / neutral, stuffed, scared, curious |
| Shipper (`ShipperBike`) | rush, panic; `spin`, `lean`, `parcels`, `wobble`; draw at `SHIPPER_SCALE`; `shipperBox` |

Sets: `Alley({left, right, gateTile?, gateOpen?, night, lit, lamp?})` in world coordinates. The ground line is `GROUND_Y` 960; front-view characters stand at y ≈ 1020–1040. `windowOf(tile)` gives a window centre (for faces at windows, or Mướp on a sill at y 656). `NightVeil` darkens the scene and leaves a lamp pool.

Signs and captions: `CardboardSign({lines, fontFamily})`, `Caption` for time cards ("Hôm sau…", "Ba ngày sau…"), `EpisodeTitle({number, title, scale})` for the cold open.

## 7. Captions that avoid characters

- `camera.tsx` raises every shot by `LIFT` = 100 screen px, which keeps a subtitle strip clear in wide shots.
- `LineOverlay` takes `avoid: Box[]` (a body and a face rect per character). Thought clouds search for a free spot near the thinker, and subtitles jump to the top when a face is in the bottom strip.
- Get the boxes from Stage's `overlay` render prop, or build them with `groupBoxes`, `drinkerBoxes`, `shipperBox`, or `boxAt(cam, x, footY, w, h, faceShare)` for anything custom (people drawn in `behind`, characters in hand-built scenes).
- Vàng's lines (thought or speech) render in `DogBubble` (ui/DogBubble.tsx) whenever an anchor for `vang` is passed, so pass his anchor in pets-only scenes too.
- Anchors: `anchors={{vang: {x, y, side, lift}}}` in screen px (from `toScreen(cam, worldX, worldY)`) puts the cloud's dots on the head.

## 8. Action-beat effects (props/Effects.tsx)

| Effect | Use |
|---|---|
| `PuffTrail({frame, from, at: f => point, every, life, drift, size, color})` | dust behind feet and wheels; grey exhaust (`#A7A3A6`) |
| `SweatFlicks({frame, x, y, dir, scale: 1.8})` | sweat flying off panicking heads |
| `MotionStreaks({frame, x, y, length, rows})` | streaks trailing a runner |
| `SpeedLines({frame, dir, opacity})` | screen-space streaks for a tracking camera |
| `ActionText({text, x, y, frame, from, life, rotate, color, size})` | "VÈO!", "BRỪM BRỪM!", "XẸT XẸT!", "PHỤT!" |
| `DizzyStars({frame, x, y, r})` | stars circling a dazed head |
| `shakeAt(frame, amount)` | camera jitter `{dx, dy, roll}`; wrap the World in `rotate(-2 + roll deg) scale(1.06)` for a dutch tilt |

Also available: `Sparks` (zaps), a flying object on a `ramp` arc (Bà Tư's roller, a parcel off the rack), a startled bystander (Mướp hopping on a sill), red vignette close-ups, white flash frames. `episodes/ep01/scenes/ChaseScene.tsx` and `ShipperScene.tsx` are the reference for a full chase.

## 9. Gotchas

- Formatting: run prettier only with `--use-tabs --single-quote --no-bracket-spacing --print-width 120`. The repo `.prettierrc` disagrees with the code style.
- Python with `-I` ignores PYTHONIOENCODING; call `sys.stdout.reconfigure(encoding='utf-8')`.
- To compute frames or times from TS, bundle with `npx esbuild <file.ts> --bundle --platform=node --loader:.json=json` and run it with node (no tsx in the repo). `scripts/episode_info.mjs` does this for you.
- Single-word TTS lines get clipped. Numerals ("17") read fine, but Whisper scores them as errors.
- Front-view Minh can't crouch: his hanging hand reaches about 128 px above the ground at 0.74 scale. Plan dog-level interactions (paw shake, belly rub) around that, or cut to a close-up.
