# Dãy Trọ — show bible

## Concept

A 2D situational comedy in the deadpan style of Heo Đen Official, for viewers aged 17–35, in Vietnamese. It is set in a boarding house ("Dãy trọ số 17") and the alley outside it. Most of the comedy comes from the four pets gossiping about their owners and the neighbours. The budget is zero: code-drawn art, free TTS, synthesised or free-licence sound. The goal is YouTube Partner Program revenue.

**Visual style:** white eyes with small pupils and heavy lids, thin near-black outlines (`INK #2B2628`), muted real-life colours, and caricature humans with big heads. No blush, except on bé Thư, the only character drawn *cute* (the user asked for this). Learn from Heo Đen's comedy principles, but never copy its characters.

## Cast

| Character | Who | Look | Voice |
|---|---|---|---|
| **Vàng** | Chó ta, the landlord's dog and self-appointed guard. He narrates through thoughts, hates shippers and is a sly gossip. | Muddy-gold, snaggletooth, a plaster on his head, one floppy ear, red collar with a "V" tag | Clone of the user's "Giọng của Vàng 02" (`voices/refs/vang02.wav`) |
| **Bà Tư** | The landlady. Gossip, counts every đồng, bosses Minh. | Perm with pink rollers, glasses on the tip of her nose, purple floral pyjamas, calculator, ledger | Clone (`tu.wav`) |
| **Ông (chú) Minh** | Bà Tư's husband and the fix-it man. Shows off ("ta đây"), afraid of his wife, kind-hearted. | Bald comb-over, belly, blue plaid shirt with glasses and a screwdriver in the pocket, khaki trousers, blue sandals | Clone (`minh.wav`) |
| **Chị Ngân** + **Bông** | 27, office worker, online-shopping addict, never off camera; her Pomeranian is a haughty snob (she) | Ngân: caramel-dyed long hair, lilac blouse, beige wide-legs, chunky white sneakers, pink phone. Bông: orange fluff, pink bow, rhinestone collar, heavy unimpressed lids | no lines yet — pick a preset, then never change it |
| **Anh Khoa** + **Mướp** | 25, night-shift coder living on instant noodles; his tabby (ex-street cat) judges everyone | Khoa: messy black hair, thick glasses, grey oversized hoodie, navy shorts, pale skin, slides. Mướp: grey-brown tabby, white bib and socks, yellow-green narrowed eyes, notched left ear | Khoa: VieNeu preset **"Minh Triết"**. Mướp: preset **"Phạm Tuyên"** (the user loves this delivery) |
| **Bé Thư** + **Mochi** | 18, first-year student up from the countryside, homesick; her hamster | Cute: bigger head, black bob with blunt fringe, flower clip, pastel yellow tee, denim shorts. Mochi: round golden Syrian hamster, cheek pouches, buck teeth, sunflower seed | Clone (`thu.wav`) |
| **Chú Sáu "Xạo"** | 65, Minh's drinking and fishing buddy, Southern, brags about tiny fish | Tall and skinny, bucket hat, handlebar moustache, toothpick, a bag with a tiny fish | Clone (`sau.wav`) |
| **Chú Hùng "Loa"** | 64, neighbour at the alley mouth; sings bolero badly into a karaoke trolley late at night | Short and square, towering dyed pompadour, sunglasses parked on top, leopard shirt, white trousers, mic | Clone (`hung.wav`) |
| **Anh shipper** | Always in a rush, always clumsy, Vàng's sworn enemy | Yellow half-helmet, teal jacket, red step-through scooter with stacked parcels | Preset **"Hải Đăng"** |

Minh, Sáu and Hùng form the round / tall-thin / short-square trio. Presets for characters without a sample never change. Vàng's first clone (`vang.wav`) was dropped because it was flat and too close to the old men. `vang02` is locked and used in every episode.

## The user's standing rules

These are corrections the user made, each with the reason. Apply them to every scene of every episode.

1. **Pets around humans only think.** Whenever a human is present, a pet's lines are thoughts: viewers hear them, but they read as thoughts (cloud bubble, softened "inside the head" reverb, mouth closed). Barks are the only sounds humans hear. Pets truly talk (mouths moving, subtitles) only when the animals are alone together.
2. **Anh Khoa** is taciturn and stiff. He always answers in one word, and that word must actually answer the question: "Lưu bài chưa?" gets "Chưa", not "Không". A single word gets clipped by TTS (it comes out as "Chào/Chú"), so use a two-syllable form such as "Dạ chưa." or "Dạ có." and say so to the user.
3. **The shipper** always arrives in a hurry and is sometimes clumsy: he brakes too hard, drops parcels without noticing, wobbles.
4. **Bà Tư** is nosy and comments on every tenant and neighbour.
5. **Ông Minh** acts the big man and boasts, but he is genuinely good-hearted. Each episode should let that show.
6. **Real animal and human sounds.** Barks are the user's recording. Laughs and screams come from real recordings (Pixabay), never TTS. TTS reading "gâu gâu" or "ha ha ha" sounded fake to the user.
7. **Captions never cover a character.** Neither subtitles nor thought clouds may cover a face (bodies too, where possible).
8. **The shipper is in proportion** with the cast. He used to be drawn tiny: keep `SHIPPER_SCALE`, which includes his bigger head.
9. **Natural delivery.** Write lines the way people speak ("…nhưng mà ông cũng tốt bụng đấy chứ"), with particles and pauses. Mướp's slow, weighty delivery is the benchmark the user liked.
10. **Action beats get the full cartoon treatment**: effects all around, exaggerated expressions on everyone involved, and bystanders reacting. A chase where characters just slide across a still background was rejected.
12. **Nobody slides, nobody fades in.** Every movement is animated: walking (feet stepping, bob, arm swing), running, climbing rung by rung, Vàng trotting. Entrances and exits are walked. Characters with side views (Minh, Bà Tư, Vàng) cross the stage in profile; the others step in front view.
13. **Vàng's text lives in his dog bubble:** his thoughts and his spoken lines appear in the round, chubby, dog-shaped bubble (`DogBubble`: cream, dog ears, curly tail, paw-print trail for thoughts, pointer for speech), never a plain cloud or a bottom subtitle.
11. **When someone laughs**, show it with the body as well: hand over the mouth or shoulders shaking. A laugh track (canned audience laughter) was discussed and not adopted: it clashes with the deadpan style. Use comic stingers sparingly instead.

The user also wants consistency: each character's look, personality and voice stay identical across all scenes and episodes.

## Episodes so far

| Ep | Title | Premise | Teaser it ends on |
|---|---|---|---|
| 01 | Dây chắc lắm! | Minh and Bà Tư walk Vàng. Minh swears his grip is firm, gets distracted by a nhậu table, Vàng bolts after the shipper and everyone chases him. | Will Vàng catch the shipper? |
| 02 | Thợ điện ba mươi năm | Minh fixes the gate lamp, forgets the breaker, gets zapped and blacks out the whole alley. He makes amends, and bé Thư thanks him. | "Chó khôn của xóm" |
| 03 | Chó khôn của xóm | Minh bets Sáu a month of drinks that Vàng can shake hands. Vàng obeys only for chân gà hidden in Minh's pocket, which were Bà Tư's, meant for sick Thư's cháo. Minh pays for the cháo, and Mướp steals the last chân gà. | "Đòi lại chân gà" |

Running gags to reuse: Vàng vs the shipper ("kẻ thù truyền kiếp"), Hùng's karaoke at 11pm, Sáu's tiny fish and bets, Minh's "ba mươi năm" boasts, Bà Tư's rollers and electricity bills, Mướp's verdicts on the roof.

## Voices table (scripts/render_episode_voices.py `VOICES`)

| id | source | rate (syllables/s) |
|---|---|---|
| vang | ref `voices/refs/vang02.wav` | 4.5 |
| tu | ref `tu.wav` | 5.0 |
| minh | ref `minh.wav` | 4.6 |
| sau | ref `sau.wav` | 4.8 |
| hung | ref `hung.wav` | 4.5 |
| thu | ref `thu.wav` | 4.4 |
| shipper | preset Hải Đăng | 5.8 |
| muop | preset Phạm Tuyên | 3.8 |
| khoa | preset Minh Triết | 3.6 |

The voice samples in `voices/` are the user's own (AI-read passages they provided). The folder is git-ignored, so keep it out of commits.
