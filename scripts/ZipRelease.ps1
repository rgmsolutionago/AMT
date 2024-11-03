Param(
    [string]$Version
)
$today = Get-Date -Format "yyyyMMddHHmmss"
$FilePath = "../Releases/$today-dist-atm-production-v$Version.zip"
Write-Output "Release file path: " $FilePath
Write-Output "Compressing file..."
Compress-Archive -Path "./dist" -DestinationPath $FilePath