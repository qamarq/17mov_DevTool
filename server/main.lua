RegisterNetEvent('17mov_DevTool:setTime')
AddEventHandler('17mov_DevTool:setTime', function(data)
    ExecuteCommand("time " .. data.hour .. " " .. data.minute)
end)

RegisterNetEvent('17mov_DevTool:setWeather')
AddEventHandler('17mov_DevTool:setWeather', function(data)
    ExecuteCommand("weather " .. data.weather)
end)