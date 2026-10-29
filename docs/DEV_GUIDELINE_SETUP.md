# Hướng dẫn cài đặt môi trường (Dev Guideline Setup)

Dự án dùng [Remotion](https://www.remotion.dev) để dựng video bằng code React. Mọi video được xem và chỉnh trong **Remotion Studio**, một trang web chạy ngay trên máy tại `http://localhost:3000`.

| Video | Composition | Mô tả |
|---|---|---|
| Quảng cáo bình nước Kita Boo | `KitaBooPromo` | 45 giây, dọc 9:16, nhạc + giọng đọc |
| Video đọc bài "làm nội dung bằng AI" | `AiContentReading` | ~70 giây, dọc 9:16, phụ đề nhảy theo từng chữ |

---

## 1. Yêu cầu

- **Windows 10 (bản 1809 trở lên) hoặc Windows 11**, có **winget** (thường có sẵn; nếu thiếu, cài [App Installer](https://apps.microsoft.com/detail/9NBLGGH4NNS1) từ Microsoft Store).
- **Kết nối Internet**: lần đầu tải khoảng 2 GB (thư viện npm, trình duyệt render, Python, VieNeu-TTS và model giọng đọc).
- **Ổ đĩa trống ≥ 5 GB.**
- Không cần card đồ họa rời: VieNeu-TTS chạy bằng CPU.

## 2. Cài đặt nhanh: chỉ một bước

1. Lấy thư mục dự án về máy (xem [mục 8](#8-chia-sẻ-dự-án-cho-người-khác)). Không cần chép `node_modules` hay `.venv`.
2. **Bấm đúp vào `setup.bat`** ở thư mục gốc của dự án.
3. Nếu Windows hỏi quyền cài đặt, bấm **Yes**.
4. Chờ đến khi hiện **"Cài đặt xong!"**. Remotion Studio tự mở tại `http://localhost:3000`.

`setup.bat` gọi [`scripts/setup.ps1`](../scripts/setup.ps1). Script kiểm tra từng phần, **chỉ cài những gì còn thiếu**, nên chạy lại bao nhiêu lần cũng an toàn:

| Bước | Nội dung | Cách cài | Lần đầu |
|---|---|---|---|
| 1 | Node.js ≥ 18 | `winget install OpenJS.NodeJS.LTS` | 1–2 phút |
| 2 | Thư viện npm (Remotion, phụ đề, font...) | `npm install` theo `package-lock.json` | 1–3 phút |
| 3 | Trình duyệt render (Chrome Headless Shell) | `npx remotion browser ensure` | ~1 phút |
| 4 | Python 3.12 + `.venv` + VieNeu-TTS + model giọng (~580 MB) | `winget` (cài cho tài khoản hiện tại) + `pip install vieneu` | 5–10 phút |
| 5 | File cấu hình mẫu `.env.elevenlabs` | Tạo mới nếu chưa có, **không ghi đè** | tức thì |

### Tùy chọn khi chạy từ terminal

```powershell
.\setup.bat -SkipVoice   # bỏ qua Python + VieNeu-TTS (chỉ xem/render video, không tạo giọng mới)
.\setup.bat -NoStart     # cài xong không mở Studio
```

## 3. Làm việc hằng ngày

```powershell
npm run dev                  # mở Remotion Studio -> http://localhost:3000
npm run lint                 # kiểm tra ESLint + TypeScript
```

**Xuất video MP4** (hoặc bấm nút **Render** trong Studio):

```powershell
npx remotion render KitaBooPromo out/kita-boo.mp4
npx remotion render AiContentReading out/ai-content-reading.mp4
```

Thư mục `out/` không được đưa vào git.

## 4. Giọng đọc (không bắt buộc)

Các file giọng đọc đã có sẵn trong `public/voiceover/`, nên **chỉ cần làm phần này khi muốn tạo lại giọng hoặc đổi lời đọc**.

### 4.1. Cấu hình `.env.elevenlabs`

```ini
ELEVENLABS_API_KEY=sk_...              # bắt buộc để có phụ đề từng chữ (kể cả khi dùng VieNeu)
ELEVENLABS_VOICE_ID=...                # giọng video Kita Boo
ELEVENLABS_READING_VOICE_ID=...        # giọng nam cho video đọc bài (nếu dùng ElevenLabs)
```

- Tạo key tại <https://elevenlabs.io/app/settings/api-keys> (bật quyền **Text to Speech** và **Speech to Text**). Key đúng dài 51 ký tự, bắt đầu bằng `sk_`.
- ⚠️ **Không đặt key vào `.env`**: Remotion đưa *mọi* biến trong `.env` vào trang Studio trên trình duyệt. File `.env.elevenlabs` đã được đưa vào `.gitignore`.
- Giọng trong Voice Library chỉ dùng được qua API khi tài khoản có **gói trả phí**; gói miễn phí cũng không được dùng thương mại.

### 4.2. VieNeu-TTS: miễn phí, chạy offline (mặc định cho video đọc bài)

```powershell
node scripts/generate-reading-vieneu.mjs                       # tạo lại cả 9 đoạn
node scripts/generate-reading-vieneu.mjs hook cta              # chỉ vài đoạn
node scripts/generate-reading-vieneu.mjs --voice="Thiện Minh"  # đổi giọng (phải tạo lại cả 9 đoạn)
```

- Có 25 giọng có sẵn. Giọng nam miền Bắc: *Hải Đăng* (mặc định), *Thiện Minh*, *Quốc Tuấn*. Giọng nữ: *Trúc Ly*, *Mai Anh*, *Ngọc Huyền*… Xem đủ danh sách:
  ```powershell
  .\.venv\Scripts\python.exe -c "from vieneu import Vieneu; [print(v[0]) for v in Vieneu().list_preset_voices()]"
  ```
- Script in ra **"script"** (lời gốc) và **"heard"** (bộ nhận dạng giọng nghe được) cho từng đoạn. Hãy so hai dòng này để phát hiện chỗ đọc sai.
- Từ nào VieNeu đọc sai, thêm cách đọc vào trường `vieneuSay` trong [`scripts/reading-script.mjs`](../scripts/reading-script.mjs). Ví dụ "CapCut" được viết thành `cáp cắt,` để đọc rõ. Phụ đề vẫn hiện đúng chữ gốc.

### 4.3. ElevenLabs: trả phí

```powershell
node scripts/generate-voiceover.mjs                 # video Kita Boo
node scripts/generate-reading-voiceover.mjs         # video đọc bài
```

### 4.4. Chọn bộ giọng cho video đọc bài

Sửa hằng `ENGINE` trong [`src/reading/timeline.ts`](../src/reading/timeline.ts): `'vieneu'` (mặc định) hoặc `'elevenlabs'`. Cả hai bộ giọng đều được giữ lại.

### 4.5. Lời đọc

Kịch bản video đọc bài nằm trong [`scripts/reading-script.mjs`](../scripts/reading-script.mjs). Sửa lời ở đó rồi tạo lại giọng. Thời lượng cảnh và phụ đề tự khớp theo giọng mới.

## 5. Nhạc nền (tự soạn, không lo bản quyền)

```powershell
node scripts/generate-music.mjs        # nhạc ukulele 45s cho Kita Boo -> public/music/kita-boo-theme.wav
node scripts/generate-lofi.mjs 100     # nhạc lo-fi 100s cho video đọc bài -> public/music/lofi-reading.wav

# Video dùng bản MP3, nên chuyển đổi sau khi tạo:
npx remotion ffmpeg -y -i public/music/kita-boo-theme.wav -codec:a libmp3lame -b:a 192k public/music/kita-boo-theme.mp3
npx remotion ffmpeg -y -i public/music/lofi-reading.wav -codec:a libmp3lame -b:a 160k public/music/lofi-reading.mp3
```

## 6. Cấu trúc thư mục

```
remotion/
├─ setup.bat                     # bấm đúp để cài đặt
├─ docs/DEV_GUIDELINE_SETUP.md   # tài liệu này
├─ remotion.config.ts            # cấu hình render (concurrency = 4)
├─ public/                       # ảnh sản phẩm, nhạc, hiệu ứng âm thanh, giọng đọc
├─ scripts/
│  ├─ setup.ps1                        # script cài đặt
│  ├─ reading-script.mjs               # lời đọc video đọc bài + hàm dùng chung
│  ├─ generate-reading-vieneu.mjs      # giọng VieNeu + phụ đề
│  ├─ vieneu_synth.py                  # gọi VieNeu-TTS (Python)
│  ├─ generate-reading-voiceover.mjs   # giọng ElevenLabs cho video đọc bài
│  ├─ generate-voiceover.mjs           # giọng ElevenLabs cho Kita Boo
│  └─ generate-music.mjs / generate-lofi.mjs
├─ src/
│  ├─ Root.tsx                   # đăng ký các composition
│  ├─ kitaboo/                   # video Kita Boo (cảnh, thành phần)
│  └─ reading/                   # video đọc bài (cảnh, phụ đề, voiceover.*.json)
├─ .venv/                        # Python + VieNeu (do setup tạo, không commit)
└─ .env.elevenlabs               # API key (không commit)
```

## 7. Xử lý sự cố

| Hiện tượng | Cách xử lý |
|---|---|
| `pip` / `python` *is not recognized* | Python vừa cài nên cửa sổ cũ chưa nhận. Mở cửa sổ PowerShell mới, hoặc dùng thẳng `.\.venv\Scripts\python.exe`. |
| `python` mở Microsoft Store | Đó chỉ là lối tắt của Windows. Chạy `setup.bat` để cài Python thật. |
| *Không tìm thấy winget* | Cài **App Installer** từ Microsoft Store rồi chạy lại `setup.bat`. |
| *running scripts is disabled on this system* | Đừng chạy trực tiếp `setup.ps1`. Hãy dùng `setup.bat` (đã kèm `-ExecutionPolicy Bypass`). |
| Cài Node.js xong nhưng script báo chưa nhận | Đóng cửa sổ, mở lại rồi chạy `setup.bat` lần nữa. |
| Render báo `Page crashed!` | Máy thiếu RAM. Đóng bớt tab Chrome, hoặc giảm số tab render: `npx remotion render ... --concurrency=2`. |
| Cổng 3000 đang bận | `npx remotion studio --port=3001` |
| Cảnh báo *symlinks* của Hugging Face | Vô hại, model vẫn được lưu bình thường (chỉ tốn thêm chút dung lượng). |
| ElevenLabs báo `401 missing the permission ...` | Sửa key, bật đúng quyền được nêu trong thông báo. |
| ElevenLabs báo `402 paid_plan_required` | Giọng Voice Library cần gói trả phí, hoặc dùng VieNeu-TTS. |
| `heard:` khác lời gốc ở một từ | Thêm cách đọc vào `vieneuSay` (mục 4.2) rồi tạo lại đúng đoạn đó. |

## 8. Chia sẻ dự án cho người khác

Cần đưa vào git (hoặc chép kèm thư mục): `public/`, `src/`, `scripts/`, `docs/`, `setup.bat`, `package.json`, `package-lock.json`, `remotion.config.ts`, `tsconfig.json`.

**Không** đưa vào: `node_modules/`, `.venv/`, `out/`, `.env.elevenlabs` (đã có trong `.gitignore`). Người nhận chỉ cần chạy `setup.bat` là đủ.
