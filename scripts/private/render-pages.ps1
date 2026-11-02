# Renders PDF pages to PNG with the PDF engine built into Windows, so that scans can be read
# as images. Output is gitignored. Usage: render-pages.ps1 <pdf> <outDir> <first> <last> [width]
param([string]$Pdf, [string]$OutDir, [int]$First = 1, [int]$Last = 1, [int]$Width = 1100)

$null = [Windows.Data.Pdf.PdfDocument, Windows.Data.Pdf, ContentType = WindowsRuntime]
$null = [Windows.Storage.StorageFile, Windows.Storage, ContentType = WindowsRuntime]
$null = [Windows.Storage.StorageFolder, Windows.Storage, ContentType = WindowsRuntime]
$null = [Windows.Storage.Streams.IRandomAccessStream, Windows.Storage.Streams, ContentType = WindowsRuntime]
Add-Type -AssemblyName System.Runtime.WindowsRuntime

$methods = [System.WindowsRuntimeSystemExtensions].GetMethods()
$asTask = ($methods | Where-Object { $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation`1' })[0]
$asAction = ($methods | Where-Object { $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncAction' })[0]
function Await($op, [type]$result) { $t = $asTask.MakeGenericMethod($result).Invoke($null, @($op)); $t.Wait() | Out-Null; $t.Result }
function AwaitAction($op) { $asAction.Invoke($null, @($op)).Wait() | Out-Null }

New-Item -ItemType Directory -Force -Path $OutDir | Out-Null
$file = Await ([Windows.Storage.StorageFile]::GetFileFromPathAsync((Resolve-Path -LiteralPath $Pdf).Path)) ([Windows.Storage.StorageFile])
$doc = Await ([Windows.Data.Pdf.PdfDocument]::LoadFromFileAsync($file)) ([Windows.Data.Pdf.PdfDocument])
$folder = Await ([Windows.Storage.StorageFolder]::GetFolderFromPathAsync((Resolve-Path -LiteralPath $OutDir).Path)) ([Windows.Storage.StorageFolder])
$base = [System.IO.Path]::GetFileNameWithoutExtension($Pdf) -replace '[^\w.-]+', '_'
for ($n = $First; $n -le [Math]::Min($Last, $doc.PageCount); $n++) {
  $page = $doc.GetPage($n - 1)
  $target = Await ($folder.CreateFileAsync("$base-p$n.png", [Windows.Storage.CreationCollisionOption]::ReplaceExisting)) ([Windows.Storage.StorageFile])
  $stream = Await ($target.OpenAsync([Windows.Storage.FileAccessMode]::ReadWrite)) ([Windows.Storage.Streams.IRandomAccessStream])
  $options = New-Object Windows.Data.Pdf.PdfPageRenderOptions
  $options.DestinationWidth = $Width
  AwaitAction ($page.RenderToStreamAsync($stream, $options))
  $stream.Dispose()
  $page.Dispose()
  Write-Output "$OutDir/$base-p$n.png"
}
