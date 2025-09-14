# PowerShell script to move all Markdown files to the docs folder
# This script moves all .md files from subdirectories to the docs folder
# and prefixes the folder name to avoid naming conflicts

Write-Host "Starting to move Markdown files to docs folder..." -ForegroundColor Green

# Define the root path
$rootPath = "d:\KODEON"
$docsPath = "$rootPath\docs"

# List of folders to process
$folders = @("community", "compiler", "ecosystem", "examples", "ide", "research", "scripts", "stdlib", "tests")

# Process each folder
foreach ($folder in $folders) {
    $folderPath = "$rootPath\$folder"

    # Check if folder exists
    if (Test-Path $folderPath) {
        Write-Host "Processing folder: $folder" -ForegroundColor Yellow

        # Get all .md files in the folder (including subdirectories)
        $mdFiles = Get-ChildItem -Path $folderPath -Filter "*.md" -File -Recurse

        foreach ($file in $mdFiles) {
            # Create new filename with folder prefix to avoid conflicts
            $relativePath = Resolve-Path -Path $file.DirectoryName -Relative
            # Clean up the relative path to create a proper prefix
            $folderPrefix = $relativePath -replace "\.\\", "" -replace "\\", "-" -replace " ", "_"
            # Remove any leading dots or special characters
            $folderPrefix = $folderPrefix -replace "^\.*", ""
            # If folderPrefix is empty, use the folder name
            if ([string]::IsNullOrEmpty($folderPrefix)) {
                $folderPrefix = $folder
            }

            $newFileName = "$folderPrefix-$($file.Name)"
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
                Write-Host "  Moved: $($file.Name) -> $newFileName" -ForegroundColor Cyan
            } catch {
                Write-Host "  Error moving $($file.Name): $($_.Exception.Message)" -ForegroundColor Red
            }
        }
    } else {
        Write-Host "Folder not found: $folder" -ForegroundColor Red
    }
}

# Also move root Markdown files (except those that should stay in root)
$rootMdFiles = Get-ChildItem -Path $rootPath -Filter "*.md" -File
$filesToMove = @("CHANGELOG.md", "CODE_OF_CONDUCT.md", "CONTRIBUTING.md", "ROADMAP.md")

foreach ($file in $rootMdFiles) {
    if ($filesToMove -contains $file.Name) {
        $destinationPath = "$docsPath\$($file.Name)"

        # If file already exists in docs, add a number suffix
        $counter = 1
        $baseName = [System.IO.Path]::GetFileNameWithoutExtension($file.Name)
        $extension = [System.IO.Path]::GetExtension($file.Name)

        while (Test-Path $destinationPath) {
            $newFileName = "$baseName-$counter$extension"
            $destinationPath = "$docsPath\$newFileName"
            $counter++
        }

        try {
            Move-Item -Path $file.FullName -Destination $destinationPath -Force
            Write-Host "  Moved root file: $($file.Name) -> $($file.Name)" -ForegroundColor Cyan
        } catch {
            Write-Host "  Error moving root file $($file.Name): $($_.Exception.Message)" -ForegroundColor Red
        }
    }
}

Write-Host "Finished moving Markdown files to docs folder." -ForegroundColor Green
