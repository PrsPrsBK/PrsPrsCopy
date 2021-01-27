New-Item ./testTgt -ItemType "directory" -Force | Out-Null
Copy-Item ./src/content_scripts/textPicker.js ./testTgt/textPicker.js
Get-Content ./resources/textPicker.suffix.js | Add-Content -Path ./testTgt/textPicker.js
