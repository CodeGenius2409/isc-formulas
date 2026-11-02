# Reads scanned papers with the OCR built into Windows, so topics can be counted. OCR is
# used for words only: equations, structures and diagrams must be read from the page image.
# Input and output are gitignored. Usage: powershell -File ocr-scans.ps1 <pdf> <out.txt> [maxPages]
param([string]$Pdf, [string]$Out, [int]$MaxPages = 0)

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

$full = (Resolve-Path -LiteralPath $Pdf).Path
$file = Await ([Windows.Storage.StorageFile]::GetFileFromPathAsync($full)) ([Windows.Storage.StorageFile])
$doc = Await ([Windows.Data.Pdf.PdfDocument]::LoadFromFileAsync($file)) ([Windows.Data.Pdf.PdfDocument])
$count = $doc.PageCount
if ($MaxPages -gt 0 -and $MaxPages -lt $count) { $count = $MaxPages }

$builder = New-Object System.Text.StringBuilder
for ($i = 0; $i -lt $count; $i++) {
  $page = $doc.GetPage($i)
  $stream = New-Object Windows.Storage.Streams.InMemoryRandomAccessStream
  $options = New-Object Windows.Data.Pdf.PdfPageRenderOptions
  $options.DestinationWidth = 2000
  AwaitAction ($page.RenderToStreamAsync($stream, $options))
  $decoder = Await ([Windows.Graphics.Imaging.BitmapDecoder]::CreateAsync($stream)) ([Windows.Graphics.Imaging.BitmapDecoder])
  $bitmap = Await ($decoder.GetSoftwareBitmapAsync()) ([Windows.Graphics.Imaging.SoftwareBitmap])
  $result = Await ($engine.RecognizeAsync($bitmap)) ([Windows.Media.Ocr.OcrResult])
  foreach ($line in $result.Lines) { [void]$builder.AppendLine($line.Text) }
  [void]$builder.Append([char]12)
  $page.Dispose()
}
[System.IO.File]::WriteAllText($Out, $builder.ToString(), [System.Text.Encoding]::UTF8)
Write-Output "$count pages, $($builder.Length) chars -> $Out"
