local lastInteriorId = 0
local lastRoomId = 0

Client = {
    isMenuOpen = false, --using
    isKeepInput = false, --using
    portalPoly = false, --using
    portalLines = false, --using 
    portalCorners = false,  --using
    portalInfos = false, --using
    interiorId = GetInteriorFromEntity(PlayerPedId()), --using
    spawnedEntities = {},
    freezeTime = false,
    freezeWeather = false,
    data = {}, -- using
    defaultTimecycles = {}, --using
    cameraRotation = false, --using
    spawnedOffsetProp = false, --using
    GetInteriorId = function() end
}

local function LoadWorldPresetsObjects()
    for k, v in pairs(Client.data.worldPresets) do
        if (v.objectList) then
            for i=1, #v.objectList do
                local obj = v.objectList[i]
                local model = GetHashKey(obj.name)
                local pos = obj.position
                local rot = obj.rotation
                local entity = CreateObject(model, pos.x, pos.y, pos.z, false, false, false)
                SetEntityRotation(entity, rot.x, rot.y, rot.z, 2, true)
                SetEntityVisible(entity, obj.visible)
                FreezeEntityPosition(entity, true)
                SetEntityCollision(entity, false, false)
                Client.spawnedEntities[obj.id] = {
                    handle = entity,
                    position = pos,
                    rotation = rot
                }
            end
        end
    end
end

TriggerServerEvent('17mov_DevTool:getData')
RegisterNetEvent('17mov_DevTool:setData')
AddEventHandler('17mov_DevTool:setData', function(data)
    Client.data = data

    if (data.worldPresets) then
        LoadWorldPresetsObjects()
    end
end)

CreateThread(function()
    while true do
        Wait(150)
        Client.interiorId = GetInteriorFromEntity(PlayerPedId())

        if (Client.isKeepInput) then
            if (lastInteriorId ~= Client.interiorId and Client.isMenuOpen) then
                lastInteriorId = Client.interiorId
                Client.GetInteriorData()
            end
    
            if (Client.interiorId ~= 0 and lastRoomId ~= GetRoomKeyFromEntity(PlayerPedId()) and Client.isMenuOpen) then
                lastRoomId = GetRoomKeyFromEntity(PlayerPedId())
                Client.GetInteriorData()
            end
        end
    end
end)