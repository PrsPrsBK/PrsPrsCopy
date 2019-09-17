$script_path =  (Split-Path -Parent $MyInvocation.MyCommand.Path)

New-Item ./lib -ItemType "directory" -Force | Out-Null

Copy-Item ./node_modules/webextension-polyfill/dist/browser-polyfill.min.js ./chrome/lib/

