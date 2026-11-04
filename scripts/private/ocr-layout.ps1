# Reads every scanned paper again with the OCR built into Windows, this time keeping where each word sits on
# the page. Labels such as (a) and marks such as [3] then land on the same row as their text, which plain OCR
# order loses. Input and output are gitignored. Usage: powershell -File ocr-layout.ps1
$ErrorActionPreference = 'Stop'
$null = [Windows.Data.Pdf.PdfDocument, Windows.Data.Pdf, ContentType = WindowsRuntime]
$null = [Windows.Storage.StorageFile, Windows.Storage, ContentType = WindowsRuntime]
$null = [Windows.Storage.Streams.InMemoryRandomAccessStream, Windows.Storage.Streams, ContentType = WindowsRuntime]
$null = [Windows.Graphics.Imaging.BitmapDecoder, Windows.Graphics.Imaging, ContentType = WindowsRuntime]
$null = [Windows.Media.Ocr.OcrEngine, Windows.Foundation, ContentType = WindowsRuntime]
Add-Type -AssemblyName System.Runtime.WindowsRuntime

$asTask = ([System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object {
    $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation`1'
  })[0]
function Await($op, [type]$result) {
  $task = $asTask.MakeGenericMethod($result).Invoke($null, @($op))
  $task.Wait() | Out-Null
  $task.Result
}
$asAction = ([System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object {
    $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncAction'
  })[0]
function AwaitAction($op) { $asAction.Invoke($null, @($op)).Wait() | Out-Null }

$engine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromUserProfileLanguages()
if (-not $engine) { throw 'No OCR language is installed.' }

$index = Get-Content -Raw -Encoding UTF8 'data-private/papers-index.json' | ConvertFrom-Json
foreach ($row in $index) {
  if ($row.readable -eq 'text') { continue }
  $out = $row.ocr -replace '^data-private/ocr/', 'data-private/ocr-layout/'
  if (Test-Path -LiteralPath $out) { continue }
  New-Item -ItemType Directory -Force -Path (Split-Path $out) | Out-Null
  $full = (Resolve-Path -LiteralPath (Join-Path 'papers' $row.file)).Path
  $file = Await ([Windows.Storage.StorageFile]::GetFileFromPathAsync($full)) ([Windows.Storage.StorageFile])
  $doc = Await ([Windows.Data.Pdf.PdfDocument]::LoadFromFileAsync($file)) ([Windows.Data.Pdf.PdfDocument])
  $builder = New-Object System.Text.StringBuilder
  for ($i = 0; $i -lt $doc.PageCount; $i++) {
    $page = $doc.GetPage($i)
    $stream = New-Object Windows.Storage.Streams.InMemoryRandomAccessStream
    $options = New-Object Windows.Data.Pdf.PdfPageRenderOptions
    $options.DestinationWidth = 2200
    AwaitAction ($page.RenderToStreamAsync($stream, $options))
    $decoder = Await ([Windows.Graphics.Imaging.BitmapDecoder]::CreateAsync($stream)) ([Windows.Graphics.Imaging.BitmapDecoder])
    $bitmap = Await ($decoder.GetSoftwareBitmapAsync()) ([Windows.Graphics.Imaging.SoftwareBitmap])
    $result = Await ($engine.RecognizeAsync($bitmap)) ([Windows.Media.Ocr.OcrResult])
    $items = foreach ($line in $result.Lines) {
      $first = ($line.Words | Select-Object -First 1).BoundingRect
      [pscustomobject]@{ Y = $first.Y; H = $first.Height; X = $first.X; Text = $line.Text }
    }
    # Lines whose middles are within half a line of each other are one row, read left to right.
    $rows = New-Object System.Collections.ArrayList
    foreach ($item in ($items | Sort-Object Y)) {
      $mid = $item.Y + $item.H / 2
      $placed = $false
      foreach ($r in $rows) {
        if ([Math]::Abs($r.Mid - $mid) -lt [Math]::Max(10, $item.H * 0.6)) {
          [void]$r.Items.Add($item)
          $placed = $true
          break
        }
      }
      if (-not $placed) { [void]$rows.Add([pscustomobject]@{ Mid = $mid; Items = (New-Object System.Collections.ArrayList(, @($item))) }) }
    }
    foreach ($r in ($rows | Sort-Object Mid)) {
      $text = ($r.Items | Sort-Object X | ForEach-Object { $_.Text }) -join '  '
      [void]$builder.AppendLine($text)
    }
    [void]$builder.Append([char]12)
    $page.Dispose()
  }
  [System.IO.File]::WriteAllText($out, $builder.ToString(), [System.Text.Encoding]::UTF8)
  Write-Output "$($doc.PageCount) pages -> $out"
}
Write-Output 'done'
