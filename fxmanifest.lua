fx_version 'cerulean'
game 'gta5'
lua54 'yes'
version '1.0'
description '17movement devtool'
author 'qamarq'

shared_scripts {'@es_extended/imports.lua'}

ui_page 'web/build/index.html'

files {
	'web/build/index.html',
	'web/build/assets/*.js',
	'web/build/assets/*.css',
    'web/build/assets/*.svg',
    'web/build/assets/*.png',
    'web/build/assets/*.jpg'
}

shared_scripts {
    'config.lua'
}

client_scripts {
    'client/main.lua',
    'client/functions.lua'
}

server_scripts {
    '@mysql-async/lib/MySQL.lua',
    'server/functions.lua',
    'server/main.lua'
}