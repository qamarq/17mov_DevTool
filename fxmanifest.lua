fx_version 'cerulean'
game 'gta5'
lua54 'yes'
version '1.0'
description '17movement devtool'
author 'qamarq'

ui_page 'web/build/index.html'

shared_scripts {
    'config.lua'
}

client_scripts {
    'utils.lua',
    'client/init.lua',
    'client/gizmo.lua',
    'client/gizmo2.lua',
    'client/main.lua',
    'client/interiors.lua',
    'client/prop.lua',
    'client/world.lua',
    'client/peds.lua',
    'client/threads.lua'
}

files {
	'web/build/index.html',
	'web/build/assets/*.js',
	'web/build/assets/*.css',
    'web/build/assets/*.svg',
    'web/build/assets/*.png',
    'web/build/assets/*.jpg',
    'client/dataview.lua',
    'shared/data/*.json'
}

server_scripts {
    '@mysql-async/lib/MySQL.lua',
    'server/main.lua'
}