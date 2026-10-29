<#
.SYNOPSIS
    Cài đặt một lần để chạy dự án video Remotion trên Windows.

.DESCRIPTION
    Kiểm tra và cài những gì còn thiếu, rồi mở Remotion Studio:
      1. Node.js LTS (qua winget)
      2. Thư viện npm của dự án (package-lock.json)
      3. Trình duyệt Chrome Headless của Remotion (dùng để render video)
      4. Python 3.12 + môi trường .venv + VieNeu-TTS (giọng đọc tiếng Việt offline)
      5. File cấu hình mẫu .env.elevenlabs (không ghi đè nếu đã có)
    Chạy lại nhiều lần vẫn an toàn: phần nào đã có sẽ được bỏ qua.

.PARAMETER SkipVoice
    Bỏ qua Python và VieNeu-TTS (chỉ cần khi muốn tạo lại giọng đọc).

.PARAMETER NoStart
    Không mở Remotion Studio sau khi cài xong.

.EXAMPLE
    .\setup.bat
    .\setup.bat -SkipVoice -NoStart
#>
param(
	[switch]$SkipVoice,
	[switch]$NoStart
)

$ErrorActionPreference = 'Stop'
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$ProjectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $ProjectRoot

$MinNodeMajor = 18
$PythonWingetId = 'Python.Python.3.12'
$VenvPython = Join-Path $ProjectRoot '.venv\Scripts\python.exe'
$totalSteps = 5

function Write-Step([int]$n, [string]$text) {
	Write-Host ""
	Write-Host "[$n/$totalSteps] $text" -ForegroundColor Cyan
}
function Write-Ok([string]$text) { Write-Host "      OK  $text" -ForegroundColor Green }
function Write-Note([string]$text) { Write-Host "      $text" -ForegroundColor Yellow }

# winget installs update PATH in the registry, not in this session
function Update-SessionPath {
	$machine = [Environment]::GetEnvironmentVariable('Path', 'Machine')
	$user = [Environment]::GetEnvironmentVariable('Path', 'User')
	$env:Path = "$machine;$user"
}

function Install-WithWinget([string]$Id, [string]$Name, [string[]]$Extra = @()) {
	if (-not (Get-Command winget -ErrorAction SilentlyContinue)) {
		throw "Không tìm thấy winget. Cài 'App Installer' từ Microsoft Store (https://apps.microsoft.com/detail/9NBLGGH4NNS1) rồi chạy lại, hoặc tự cài $Name."
	}
	Write-Note "Đang cài $Name bằng winget. Nếu Windows hỏi quyền, hãy bấm Yes..."
	& winget install --id $Id -e --silent --accept-package-agreements --accept-source-agreements @Extra
	# 0x8A15002B = no newer version, 0x8A150061 = already installed
	$okCodes = @(0, -1978335189, -1978335135)
	if ($okCodes -notcontains $LASTEXITCODE) {
		throw "Cài $Name thất bại (winget trả về mã $LASTEXITCODE)."
	}
	Update-SessionPath
}

# Run a native command with stderr hidden. Windows PowerShell 5.1 turns
# redirected stderr lines into errors, which 'Stop' would treat as fatal even
# when the program succeeds (e.g. Hugging Face warnings). Returns the exit code.
function Invoke-Quiet([scriptblock]$Command) {
	$previous = $ErrorActionPreference
	$ErrorActionPreference = 'Continue'
	try {
		& $Command 2>$null | Out-Null
		return $LASTEXITCODE
	} finally {
		$ErrorActionPreference = $previous
	}
}

function Get-NodeMajor {
	if (-not (Get-Command node -ErrorAction SilentlyContinue)) { return 0 }
	return [int]((& node --version).TrimStart('v').Split('.')[0])
}

# The python.exe in WindowsApps is only a Microsoft Store shortcut, so look
# for a real Python 3.12 install instead of trusting `python` on PATH
function Find-Python312 {
	$candidates = @(
		(Join-Path $env:LOCALAPPDATA 'Programs\Python\Python312\python.exe'),
		(Join-Path $env:ProgramFiles 'Python312\python.exe')
	)
	foreach ($candidate in $candidates) {
		if (Test-Path $candidate) { return $candidate }
	}
	if (Get-Command py -ErrorAction SilentlyContinue) {
		$previous = $ErrorActionPreference
		$ErrorActionPreference = 'Continue'
		try {
			$exe = & py -3.12 -c "import sys; print(sys.executable)" 2>$null
			if ($LASTEXITCODE -eq 0 -and $exe) { return "$exe".Trim() }
		} finally {
			$ErrorActionPreference = $previous
		}
	}
	return $null
}

try {
	Write-Host "Cài đặt dự án video Remotion" -ForegroundColor White
	Write-Host "Thư mục: $ProjectRoot"

	# 1. Node.js
	Write-Step 1 'Node.js'
	if ((Get-NodeMajor) -ge $MinNodeMajor) {
		Write-Ok "Node.js $(& node --version) đã có"
	} else {
		Install-WithWinget -Id 'OpenJS.NodeJS.LTS' -Name 'Node.js LTS'
		if ((Get-NodeMajor) -lt $MinNodeMajor) {
			throw "Đã cài Node.js nhưng chưa nhận được. Đóng cửa sổ này, mở lại rồi chạy setup.bat lần nữa."
		}
		Write-Ok "Node.js $(& node --version)"
	}

	# 2. npm packages (npm.cmd avoids PowerShell's script policy for npm.ps1)
	Write-Step 2 'Thư viện npm (Remotion, phụ đề, font...)'
	& npm.cmd install --no-fund --no-audit --loglevel=error
	if ($LASTEXITCODE -ne 0) { throw 'npm install thất bại. Kiểm tra kết nối mạng rồi chạy lại.' }
	Write-Ok 'Đã cài theo package-lock.json'

	# 3. Headless browser Remotion renders with
	Write-Step 3 'Trình duyệt render của Remotion'
	& npx.cmd remotion browser ensure
	if ($LASTEXITCODE -ne 0) { throw 'Không tải được trình duyệt render của Remotion.' }
	Write-Ok 'Chrome Headless Shell sẵn sàng'

	# 4. Python + VieNeu-TTS
	Write-Step 4 'Python 3.12 + VieNeu-TTS (giọng đọc tiếng Việt offline)'
	if ($SkipVoice) {
		Write-Note 'Bỏ qua (-SkipVoice). Studio và render vẫn chạy bình thường.'
	} else {
		$python = Find-Python312
		if (-not $python) {
			Install-WithWinget -Id $PythonWingetId -Name 'Python 3.12' -Extra @('--scope', 'user')
			$python = Find-Python312
			if (-not $python) { throw 'Đã cài Python 3.12 nhưng không tìm thấy python.exe.' }
		}
		Write-Ok "Python: $python"

		if (-not (Test-Path $VenvPython)) {
			Write-Note 'Tạo môi trường .venv...'
			& $python -m venv (Join-Path $ProjectRoot '.venv')
			if ($LASTEXITCODE -ne 0) { throw 'Không tạo được .venv.' }
		}

		if ((Invoke-Quiet { & $VenvPython -c "import vieneu" }) -eq 0) {
			Write-Ok 'VieNeu-TTS đã có trong .venv'
		} else {
			Write-Note 'Cài VieNeu-TTS (vài phút, khoảng 800 MB)...'
			& $VenvPython -m pip install --upgrade pip --quiet
			& $VenvPython -m pip install vieneu --quiet --progress-bar off
			if ($LASTEXITCODE -ne 0) { throw 'pip install vieneu thất bại.' }
			Write-Ok 'Đã cài VieNeu-TTS'
		}

		# Download the voice model now (~580 MB) so the first voiceover run is quick
		Write-Note 'Tải model giọng đọc (lần đầu khoảng 580 MB, các lần sau bỏ qua)...'
		$env:HF_HUB_DISABLE_SYMLINKS_WARNING = '1'
		$env:PYTHONIOENCODING = 'utf-8'
		if ((Invoke-Quiet { & $VenvPython -c "from vieneu import Vieneu; Vieneu()" }) -ne 0) {
			throw 'Không tải được model VieNeu-TTS. Kiểm tra kết nối mạng rồi chạy lại.'
		}
		Write-Ok 'Model VieNeu-TTS sẵn sàng'
	}

	# 5. Config template for ElevenLabs (paid voice + caption timings)
	Write-Step 5 'File cấu hình .env.elevenlabs'
	$envFile = Join-Path $ProjectRoot '.env.elevenlabs'
	if (Test-Path $envFile) {
		Write-Ok '.env.elevenlabs đã có (giữ nguyên)'
	} else {
		$template = @(
			'# Dán API key ElevenLabs sau dấu = (dùng cho phụ đề từng chữ và giọng ElevenLabs).',
			'# KHÔNG chuyển key sang .env: Remotion đưa mọi biến trong .env vào trang Studio.',
			'ELEVENLABS_API_KEY=',
			'ELEVENLABS_VOICE_ID=',
			'ELEVENLABS_READING_VOICE_ID='
		)
		[System.IO.File]::WriteAllLines($envFile, $template, (New-Object System.Text.UTF8Encoding($false)))
		Write-Ok 'Đã tạo .env.elevenlabs mẫu (điền key nếu cần)'
	}

	Write-Host ""
	Write-Host "Cài đặt xong!" -ForegroundColor Green

	if ($NoStart) {
		Write-Host "Mở Studio bằng lệnh: npm run dev  (rồi vào http://localhost:3000)"
	} else {
		Write-Host "Đang mở Remotion Studio tại http://localhost:3000 ... (đóng cửa sổ này để tắt Studio)"
		& npm.cmd run dev
	}
} catch {
	Write-Host ""
	Write-Host "LỖI: $($_.Exception.Message)" -ForegroundColor Red
	Write-Host "Xem mục 'Xử lý sự cố' trong docs/DEV_GUIDELINE_SETUP.md"
	exit 1
}
