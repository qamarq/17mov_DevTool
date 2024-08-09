
-- OPEN/CLOSE MENU

RegisterCommand("17movdevtool_open", function()
    SendNUIMessage({
        app = '17mov_DevTool', 
        method = 'refreshData',
        data = {
            coords = GetEntityCoords(PlayerPedId()),
            heading = GetEntityHeading(PlayerPedId()),
            time = {
                hour = GetClockHours(),
                minute = GetClockMinutes()
            },
            weather = Utils.weatherHashMap[GetWeatherTypeTransition()],
            freezeTime = Client.freezeTime,
            freezeWeather = Client.freezeWeather,
            portals = {
                portalPoly = Client.portalPoly,
                portalLines = Client.portalLines,
                portalCorners = Client.portalCorners,
                portalInfos = Client.portalInfos
            }
        }
    })
    if not Client.timecyclesLoaded then
        SendNUIMessage({
            app = '17mov_DevTool',
            method = 'setTimecycleList',
            data = Client.data.timecycles
        })
        Client.timecyclesLoaded = true
    end
    Client.GetInteriorData()
    SetNuiFocus(true, true)
    SendNUIMessage({
        app = '17mov_DevTool', 
        method = 'toggleUI',
        data = true
    })
    Client.isMenuOpen = true
end)

RegisterNUICallback("CloseUI", function(data, cb)
    SetNuiFocus(false,false)
    Client.isMenuOpen = false
    cb("ok")
end)

RegisterNUICallback("CloseUIFromUI", function(data, cb)
    SetNuiFocus(false,false)
    SendNUIMessage({
        app = '17mov_DevTool', 
        method = 'toggleUI',
        data = false
    })
    Client.isMenuOpen = false
    cb("ok")
end)

RegisterNUICallback("KeepInput", function(data)
    SetNuiFocusKeepInput(data)
    Client.isKeepInput = data
end)

RegisterNUICallback('ToggleCameraRotation', function(data, cb)
    -- print("Camera rotation toggled: " .. json.encode(data))
    Client.cameraRotation = data
end)

RegisterKeyMapping('17movdevtool_open', 'Open 17Movement Devtool', 'keyboard', 'OEM_3')

-- CALLBACKS
RegisterNUICallback('setTime', function(data, cb)
    print("Setting time to: " .. data.hour .. ":" .. data.minute)
    NetworkOverrideClockTime(data.hour, data.minute, 0)
    TriggerServerEvent('17mov_DevTool:setTime', data)
end)

RegisterNUICallback('setWeather', function(data, cb)
    print("Setting weather to: " .. data.weather)
    SetWeatherTypeNowPersist(data.weather)
    SetWeatherTypePersist(data.weather)
    TriggerServerEvent('17mov_DevTool:setWeather', data)
end)

RegisterNUICallback('setFreezeTime', function(data, cb)
    print("Freezing time: " .. json.encode(data))
    Client.freezeTime = data.state
    TriggerServerEvent('17mov_DevTool:freezeTime', data.state)
end)

RegisterNUICallback('setFreezeWeather', function(data, cb)
    print("Freezing weather: " .. json.encode(data))
    Client.freezeWeather = data.state
    TriggerServerEvent('17mov_DevTool:freezeWeather', data.state)
end)



-- Delete all entitied on script stop
AddEventHandler('onResourceStop', function(resourceName)
    if (GetCurrentResourceName() ~= resourceName) then
        return
    end
    for k, v in pairs(Client.spawnedEntities) do
        DeleteEntity(v.handle)
    end
end)