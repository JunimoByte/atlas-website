# Assembles partials + CSS + JS into a single index.html.
# Usage: powershell -File build.ps1

$ErrorActionPreference = "Stop"
$Root = $PSScriptRoot

# Ordered list of partials

$Partials = @(
    "nav",
    "hero",
    "ticker",
    "features",
    "pipeline",
    "scan",
    "trust",
    "changelog",
    "details",
    "footer",
    "modal"
)

# Read file helper

function Read-Source($RelPath) {
    $abs = Join-Path $Root $RelPath
    if (-not (Test-Path $abs)) {
        Write-Error "[ERROR] Missing file: $abs"
        exit 1
    }
    return [System.IO.File]::ReadAllText($abs, [System.Text.Encoding]::UTF8)
}

# Build body from partials

function Build-Body {
    $sections = @()
    foreach ($name in $Partials) {
        $file = "partials/$name.html"
        $html = (Read-Source $file).Trim()
        $indented = ($html -split "`n" | ForEach-Object { "  $_" }) -join "`n"
        $sections += $indented
    }
    return $sections -join "`n`n"
}

# Assemble full page

$css  = Read-Source "css/style.css"
$js   = Read-Source "js/main.js"
$body = Build-Body

$html = @"
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Atlas</title>
  <meta name="description" content="Atlas backs up profiles from 250+ browsers. Cross-platform, fully offline, fully yours." />
  <style>
$css
  </style>
</head>
<body>

$body

  <script>
$js
  </script>
</body>
</html>
"@

$outPath = Join-Path $Root "index.html"
[System.IO.File]::WriteAllText($outPath, $html, [System.Text.Encoding]::UTF8)

$sizeKB = [math]::Round((Get-Item $outPath).Length / 1024, 1)
Write-Host "[OK] Built index.html ($sizeKB KB)"
Write-Host "     $($Partials.Count) partials assembled"
