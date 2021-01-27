$script_path =  (Split-Path -Parent $MyInvocation.MyCommand.Path)

New-Item chrome -ItemType "directory" -Force | Out-Null
New-Item chrome/background -ItemType "directory" -Force | Out-Null
New-Item chrome/content_scripts -ItemType "directory" -Force | Out-Null
New-Item chrome/icons -ItemType "directory" -Force | Out-Null
New-Item chrome/options_ui -ItemType "directory" -Force | Out-Null
New-Item chrome/popup -ItemType "directory" -Force | Out-Null
New-Item chrome/lib -ItemType "directory" -Force | Out-Null

Copy-Item ./node_modules/webextension-polyfill/dist/browser-polyfill.min.js ./chrome/lib/

Copy-Item src/background/background.js chrome/background/background.js
Copy-Item src/content_scripts/textPicker.js chrome/content_scripts/textPicker.js
Copy-Item src/icons/icon-48_0.png chrome/icons/icon-48_0.png
Copy-Item src/icons/icon-48_1.png chrome/icons/icon-48_1.png
Copy-Item src/icons/icon-48_app.png chrome/icons/icon-48_app.png
Copy-Item src/options_ui/options.css chrome/options_ui/options.css
Copy-Item src/options_ui/options.html chrome/options_ui/options.html
Copy-Item src/options_ui/options.js chrome/options_ui/options.js
Copy-Item src/popup/menu.css chrome/popup/menu.css
Copy-Item src/popup/menu.html chrome/popup/menu.html
Copy-Item src/popup/menu.js chrome/popup/menu.js
