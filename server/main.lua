RegisterNetEvent('17mov_DevTool:setTime')
AddEventHandler('17mov_DevTool:setTime', function(data)
    -- ExecuteCommand("time " .. data.hour .. " " .. data.minute)
    exports["qb-weathersync"]:setTime(data.hour, data.minute)
end)

RegisterNetEvent('17mov_DevTool:setWeather')
AddEventHandler('17mov_DevTool:setWeather', function(data)
    -- ExecuteCommand("weather " .. data.weather)
    exports["qb-weathersync"]:setWeather(data.weather);
end)

RegisterNetEvent('17mov_DevTool:freezeTime')
AddEventHandler('17mov_DevTool:freezeTime', function(data)
    exports["qb-weathersync"]:setTimeFreeze(data)
end)

RegisterNetEvent('17mov_DevTool:freezeWeather')
AddEventHandler('17mov_DevTool:freezeWeather', function(data)
    exports["qb-weathersync"]:setDynamicWeather(data)
end)

RegisterNetEvent('17mov_DevTool:savePresets')
AddEventHandler('17mov_DevTool:savePresets', function(data)
    SaveResourceFile(GetCurrentResourceName(), 'shared/data/worldPresets.json', data, -1)
end)