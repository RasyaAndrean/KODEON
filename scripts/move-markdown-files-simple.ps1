# Simple PowerShell script to move all Markdown files to the docs folder
# This script moves all .md files from subdirectories to the docs folder

Write-Host "Starting to move Markdown files to docs folder..." -ForegroundColor Green

# Define the root path
$rootPath = "d:\KODEON"
$docsPath = "$rootPath\docs"

# Get all .md files in the root directory and subdirectories, excluding the docs folder itself
$mdFiles = Get-ChildItem -Path $rootPath -Filter "*.md" -File -Recurse | Where-Object { $_.DirectoryName -notlike "$docsPath*" }

foreach ($file in $mdFiles) {
    # Skip files that should stay in the root directory
    $rootFilesToKeep = @("README.md")
    if ($rootFilesToKeep -contains $file.Name) {
        Write-Host "Skipping root file: $($file.Name)" -ForegroundColor Yellow
        continue
    }

    # Create new filename with folder prefix to avoid conflicts
    $relativePath = $file.DirectoryName.Substring($rootPath.Length + 1)
    $folderPrefix = $relativePath -replace "\\", "-" -replace " ", "_"

    # If we're in the root directory, don't add a prefix
    if ($folderPrefix -eq "") {
        $newFileName = $file.Name
    } else {
        $newFileName = "$folderPrefix-$($file.Name)"
    }

    $destinationPath = "$docsPath\$newFileName"

    # If file already exists in docs, add a number suffix
    $counter = 1
    $baseName = [System.IO.Path]::GetFileNameWithoutExtension($newFileName)
    $extension = [System.IO.Path]::GetExtension($newFileName)

    while (Test-Path $destinationPath) {
        $newFileName = "$baseName-$counter$extension"
        $destinationPath = "$docsPath\$newFileName"
        $counter++
    }

    try {
        # Move the file
        Move-Item -Path $file.FullName -Destination $destinationPath -Force
        Write-Host "Moved: $($file.Name) -> $newFileName" -ForegroundColor Cyan
    } catch {
        Write-Host "Error moving $($file.Name): $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "Finished moving Markdown files to docs folder." -ForegroundColor Green
