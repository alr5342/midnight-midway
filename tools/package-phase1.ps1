param(
  [Parameter(Mandatory=$true)][string]$SourcePath,
  [Parameter(Mandatory=$true)][string]$ArchivePath,
  [Parameter(Mandatory=$true)][string]$ExtractPath
)
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression.FileSystem
if (Test-Path -LiteralPath $ArchivePath) { throw 'Archive already exists; preserve it and use a new name.' }
if (Test-Path -LiteralPath $ExtractPath) { throw 'Extraction folder already exists; use a new folder.' }
[System.IO.Compression.ZipFile]::CreateFromDirectory($SourcePath, $ArchivePath, [System.IO.Compression.CompressionLevel]::Optimal, $false)
[System.IO.Compression.ZipFile]::ExtractToDirectory($ArchivePath, $ExtractPath)
Write-Output 'ZIP created and extracted into a separate new folder.'
