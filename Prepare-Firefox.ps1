$script_path =  (Split-Path -Parent $MyInvocation.MyCommand.Path)

#New-Item ./lib -ItemType "directory" -Force | Out-Null
#Copy-Item ./node_modules/webextension-polyfill/dist/browser-polyfill.min.js ./firefox/lib/

New-Item firefox -ItemType "directory" -Force | Out-Null
New-Item firefox/background -ItemType "directory" -Force | Out-Null
New-Item firefox/content_scripts -ItemType "directory" -Force | Out-Null
New-Item firefox/icons -ItemType "directory" -Force | Out-Null
New-Item firefox/options_ui -ItemType "directory" -Force | Out-Null
New-Item firefox/popup -ItemType "directory" -Force | Out-Null

Copy-Item src/background/background.js firefox/background/background.js
Copy-Item src/content_scripts/textPicker.js firefox/content_scripts/textPicker.js
Copy-Item src/icons/icon-48_0.png firefox/icons/icon-48_0.png
Copy-Item src/icons/icon-48_1.png firefox/icons/icon-48_1.png
Copy-Item src/icons/icon-48_app.png firefox/icons/icon-48_app.png
Copy-Item src/options_ui/options.css firefox/options_ui/options.css
Copy-Item src/options_ui/options.html firefox/options_ui/options.html
Copy-Item src/options_ui/options.js firefox/options_ui/options.js
Copy-Item src/popup/menu.css firefox/popup/menu.css
Copy-Item src/popup/menu.html firefox/popup/menu.html
Copy-Item src/popup/menu.js firefox/popup/menu.js
