local isMenuOpened = false

local weatherHashMap = {
    [GetHashKey("CLEAR")] = "CLEAR",
    [GetHashKey("EXTRASUNNY")] = "EXTRASUNNY",
    [GetHashKey("CLOUDS")] = "CLOUDS",
    [GetHashKey("OVERCAST")] = "OVERCAST",
    [GetHashKey("RAIN")] = "RAIN",
    [GetHashKey("CLEARING")] = "CLEARING",
    [GetHashKey("THUNDER")] = "THUNDER",
    [GetHashKey("SMOG")] = "SMOG",
    [GetHashKey("FOGGY")] = "FOGGY",
    [GetHashKey("XMAS")] = "XMAS",
    [GetHashKey("SNOW")] = "SNOW",
    [GetHashKey("SNOWLIGHT")] = "SNOWLIGHT",
    [GetHashKey("BLIZZARD")] = "BLIZZARD",
    [GetHashKey("HALLOWEEN")] = "HALLOWEEN",
    [GetHashKey("NEUTRAL")] = "NEUTRAL"
}

-- OPEN/CLOSE MENU

RegisterCommand("17movdevtool_open", function()
    SendNUIMessage({
        app = '17mov_DevTool', 
        method = 'refreshdata',
        data = {
            coords = GetEntityCoords(PlayerPedId()),
            heading = GetEntityHeading(PlayerPedId()),
            time = {
                hour = GetClockHours(),
                minute = GetClockMinutes()
            },
            weather = weatherHashMap[GetWeatherTypeTransition()]
        }
    })
    SetNuiFocus(true, true)
    SendNUIMessage({
        app = '17mov_DevTool', 
        method = 'toggleui',
        data = true
    })
    isMenuOpened = true
end)

RegisterNUICallback("CloseUI", function(data, cb)
    SetNuiFocus(false,false)
    isMenuOpened = false
    cb("ok")
end)

RegisterKeyMapping('17movdevtool_open', 'Open 17Movement Devtool', 'keyboard', 'OEM_3')

-- CALLBACKS
RegisterNUICallback('setTime', function(data, cb)
    print("Setting time to: " .. data.hour .. ":" .. data.minute)
    TriggerServerEvent('17mov_DevTool:setTime', data)
end)

RegisterNUICallback('setWeather', function(data, cb)
    print("Setting weather to: " .. data.weather)
    TriggerServerEvent('17mov_DevTool:setWeather', data)
end)

-- DATA LOOP
-- Citizen.CreateThread(function()
--     while true do
--         Citizen.Wait(Config.RefreshDataTime)
--         local weather = GetWeatherTypeTransition()
--         local weatherName = weatherHashMap[weather]
--     end
-- end)