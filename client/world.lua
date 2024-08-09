RegisterNUICallback('LoadWorldPresets', function(data, cb)
    local preparedPresets = {}
    for k, v in pairs(Client.data.worldPresets) do
        table.insert(preparedPresets, v)
    end

    SendNUIMessage({
        app = '17mov_DevTool',
        method = 'LoadWorldPresetsSuccess',
        data = preparedPresets
    })
    cb('ok')
end)

RegisterNUICallback('CreateWorldPreset', function(data, cb)
    print('Creating new world preset...')
    local name = "New World Preset " .. math.random(1, 1000)
    local id = data.id

    if not Client.data.worldPresets[id] then
        Client.data.worldPresets[id] = {}
    end

    Client.data.worldPresets[id]["id"] = id
    Client.data.worldPresets[id]["name"] = name
    Client.data.worldPresets[id]["visible"] = data.visible
    Client.data.worldPresets[id]["objectList"] = data.objectList

    SendNUIMessage({
        app = '17mov_DevTool',
        method = 'CreateWorldPresetSuccess',
        data = {
            id = id,
            name = name,
            visible = data.visible,
            objectList = data.objectList
        }
    })

    SaveWorldPresets()
    
    cb('ok')
end)

RegisterNUICallback('ChangeWorldPresetVisibility', function(data, cb)
    print('Changing world preset visibility...')
    local id = data.id

    if Client.data.worldPresets[id] then
        Client.data.worldPresets[id]["visible"] = data.visible
    end

    cb('ok')
end)

RegisterNUICallback('DeleteWorldPreset', function(data, cb)
    print('Deleting world preset...')
    local id = data.id

    -- Delete entities
    if Client.data.worldPresets[id] and Client.data.worldPresets[id]["objectList"] then
        for k, v in pairs(Client.data.worldPresets[id]["objectList"]) do
            if (Client.spawnedEntities[v["id"]]) then
                DeleteEntity(Client.spawnedEntities[v["id"]].handle)
                Client.spawnedEntities[v["id"]] = nil
            end
        end
    end

    if Client.data.worldPresets[id] then
        Client.data.worldPresets[id] = nil
    end

    SaveWorldPresets()

    cb('ok')
end)

RegisterNUICallback('CreateNewObject', function(data, cb)
    print('Creating new object...')
    local id = data.id
    local presetId = data.presetId
    local modelName = data.modelName

    if not Client.data.worldPresets[presetId] then
        Client.data.worldPresets[presetId] = {}
    end

    if not Client.data.worldPresets[presetId]["objectList"] then
        Client.data.worldPresets[presetId]["objectList"] = {}
    end

    if not Client.spawnedEntities[id] then
        local offset = GetEntityCoords(PlayerPedId()) + GetEntityForwardVector(PlayerPedId()) * 3
        RequestModel(modelName)
        while not HasModelLoaded(modelName) do
            RequestModel(modelName)
            Wait(0)
        end
        local obj = CreateObject(modelName, offset.x, offset.y, offset.z, false, false, false)
        FreezeEntityPosition(obj, true)
        SetEntityCollision(obj, false, false)
        local entityCoords = GetEntityCoords(obj)
        local entityRotation = GetEntityRotation(obj)
        Client.spawnedEntities[id] = {
            id = id,
            handle = obj,
            name = modelName,
            position = {
                x = Utils.round(entityCoords.x, 3),
                y = Utils.round(entityCoords.y, 3),
                z = Utils.round(entityCoords.z, 3)
            },
            rotation = {
                x = Utils.round(entityRotation.x, 3),
                y = Utils.round(entityRotation.y, 3),
                z = Utils.round(entityRotation.z, 3)
            },
            visible = true
        }
    end

    table.insert(Client.data.worldPresets[presetId]["objectList"], Client.spawnedEntities[id])

    SendNUIMessage({
        app = '17mov_DevTool',
        method = 'CreateNewObjectSuccess',
        data = Client.spawnedEntities[id]
    })

    cb('ok')
end)

RegisterNUICallback('CloneObject', function(data, cb)
    print('Cloning object...')
    local obj = data.obj
    local presetId = data.presetId
    local newId = data.newId

    if not Client.spawnedEntities[newId] then
        local position = obj.position
        local rotation = obj.rotation
        RequestModel(obj.name)
        while not HasModelLoaded(obj.name) do
            RequestModel(obj.name)
            Wait(0)
        end
        local newObj = CreateObject(obj.name, position.x, position.y, position.z, false, false, false)
        SetEntityRotation(newObj, rotation.x, rotation.y, rotation.z, 2, true)
        FreezeEntityPosition(newObj, true)
        SetEntityCollision(newObj, false, false)
        local entityCoords = GetEntityCoords(newObj)
        local entityRotation = GetEntityRotation(newObj)
        Client.spawnedEntities[newId] = {
            id = newId,
            handle = newObj,
            name = obj.name,
            position = {
                x = Utils.round(entityCoords.x, 3),
                y = Utils.round(entityCoords.y, 3),
                z = Utils.round(entityCoords.z, 3)
            },
            rotation = {
                x = Utils.round(entityRotation.x, 3),
                y = Utils.round(entityRotation.y, 3),
                z = Utils.round(entityRotation.z, 3)
            },
            visible = obj.visible
        }
    end

    table.insert(Client.data.worldPresets[presetId]["objectList"], Client.spawnedEntities[newId])

    cb('ok')
end)

RegisterNUICallback('ChangeObjectVisibility', function(data, cb)
    print('Changing object visibility...')
    local objId = data.objId
    local presetId = data.presetId
    local visible = data.visible

    if Client.data.worldPresets[presetId] and Client.data.worldPresets[presetId]["objectList"] then
        for k, v in pairs(Client.data.worldPresets[presetId]["objectList"]) do
            if v["id"] == objId then
                v["visible"] = data.visible
            end
        end
    end

    if (Client.spawnedEntities[objId]) then
        SetEntityVisible(Client.spawnedEntities[objId].handle, visible)
    end

    cb('ok')
end)

RegisterNUICallback('EnableGizmoToObject', function(data, cb)
    local objId = data.objId
    local presetId = data.presetId
    cb('ok')

    if (Client.spawnedEntities[objId]) then
        local obj = Client.spawnedEntities[objId].handle
        local result = useGizmo(obj)

        Client.spawnedEntities[objId].position = {
            x = Utils.round(result.position.x, 3),
            y = Utils.round(result.position.y, 3),
            z = Utils.round(result.position.z, 3)
        }
        Client.spawnedEntities[objId].rotation = {
            x = Utils.round(result.rotation.x, 3),
            y = Utils.round(result.rotation.y, 3),
            z = Utils.round(result.rotation.z, 3)
        }

        if Client.data.worldPresets[presetId] and Client.data.worldPresets[presetId]["objectList"] then
            for k, v in pairs(Client.data.worldPresets[presetId]["objectList"]) do
                if v["id"] == objId then
                    v = Client.spawnedEntities[objId]
                end
            end
        end

        SetNuiFocus(true, true)
        SendNUIMessage({
            app = '17mov_DevTool', 
            method = 'toggleUI',
            data = true
        })
        Client.isMenuOpen = true

        SendNUIMessage({
            app = '17mov_DevTool',
            method = 'EnableGizmoToObjectSuccess',
            data = {
                objId = objId,
                presetId = presetId,
                position = Client.spawnedEntities[objId].position,
                rotation = Client.spawnedEntities[objId].rotation
            }
        })
    end
end)

RegisterNUICallback('ToggleSelectedObject', function(data, cb)
    local objId = data.objId
    local selected = data.selected

    if (Client.spawnedEntities[objId]) then
        SetEntityDrawOutline(Client.spawnedEntities[objId].handle, selected)
    end

    cb('ok')
end)

RegisterNUICallback('DeleteObject', function(data, cb)
    local objId = data.objId
    local presetId = data.presetId

    if Client.data.worldPresets[presetId] and Client.data.worldPresets[presetId]["objectList"] then
        for k, v in pairs(Client.data.worldPresets[presetId]["objectList"]) do
            if v["id"] == objId then
                table.remove(Client.data.worldPresets[presetId]["objectList"], k)
            end
        end
    end

    if (Client.spawnedEntities[objId]) then
        DeleteEntity(Client.spawnedEntities[objId].handle)
        Client.spawnedEntities[objId] = nil
    end

    cb('ok')
end)

RegisterNUICallback('SavePresetName', function(data, cb)
    local id = data.id
    local name = data.name

    if Client.data.worldPresets[id] then
        Client.data.worldPresets[id]["name"] = name
    end

    cb('ok')
end)

local function SaveWorldPresets()
    print('Saving presets...')
    local jsonData = json.encode(Client.data.worldPresets)
    print(jsonData)
    TriggerServerEvent('17mov_DevTool:savePresets', jsonData)
    SendNUIMessage({
        app = '17mov_DevTool',
        method = 'SavePresetsSuccess'
    })
end

RegisterNUICallback('SavePresets', function(data, cb)
    SaveWorldPresets()
    cb('ok')
end)