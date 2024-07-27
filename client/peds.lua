local peds = {}

RegisterNUICallback('LoadPedsData', function(data, cb)
    local preparedPeds = {}
    for i, ped in ipairs(peds) do
        local obj = ped.handle
        local rotation = GetEntityRotation(obj)
        local coords = GetEntityCoords(obj)

        table.insert(preparedPeds, {
            id = ped.id,
            model = ped.model,
            name = ped.name,
            handle = obj,
            coords = {
                x = Utils.round(coords.x, 3),
                y = Utils.round(coords.y, 3),
                z = Utils.round(coords.z, 3)
            },
            rotation = {
                x = Utils.round(rotation.x, 3),
                y = Utils.round(rotation.y, 3),
                z = Utils.round(rotation.z, 3)
            },
            animation = ped.animation
        })
    end
    SendNUIMessage({
        app = '17mov_DevTool',
        method = 'LoadPedsDataSuccess',
        data = preparedPeds
    })
    cb('ok')
end)

RegisterNUICallback('CreateNewPed', function(data, cb)    
    print('Creating new ped...')
    local offset = GetEntityCoords(PlayerPedId()) + GetEntityForwardVector(PlayerPedId()) * 3
    local heading = GetEntityHeading(PlayerPedId()) + 180

    RequestModel(GetHashKey(data.model))
	while not HasModelLoaded(GetHashKey(data.model)) do
		Citizen.Wait(1)
	end

    local obj = CreatePed(4, data.model, offset.x, offset.y, offset.z - 0.98, heading, false, false)
    print('Created object with handle: ' .. obj)
    FreezeEntityPosition(obj, true)
    SetEntityInvincible(obj, true)
    SetBlockingOfNonTemporaryEvents(obj, true)

    local rotation = GetEntityRotation(obj)
    local coords = GetEntityCoords(obj)
    local ped = {
        id = data.id,
        model = data.model,
        name = data.name,
        handle = obj,
        coords = {
            x = Utils.round(coords.x, 3),
            y = Utils.round(coords.y, 3),
            z = Utils.round(coords.z, 3)
        },
        rotation = {
            x = Utils.round(rotation.x, 3),
            y = Utils.round(rotation.y, 3),
            z = Utils.round(rotation.z, 3)
        },
        animation = { dict = '', clip = '' }
    }
    Client.spawnedEntities[data.id] = ped
    table.insert(peds, ped)

    SendNUIMessage({
        app = '17mov_DevTool',
        method = 'CreateNewPedSuccess',
        data = peds
    })
    cb('ok')
end)

RegisterNUICallback('DeletePed', function(data, cb)
    for i, ped in ipairs(peds) do
        if ped.id == data.id then
            table.remove(peds, i)
            break
        end
    end
    DeleteEntity(Client.spawnedEntities[data.id].handle)
    Client.spawnedEntities[data.id] = nil

    SendNUIMessage({
        app = '17mov_DevTool',
        method = 'DeletePedSuccess',
        data = peds
    })
    cb('ok')
end)

RegisterNUICallback('EnablePedGizmo', function(data, cb)
    local ped = Client.spawnedEntities[data.id]
    local obj = ped.handle
    local result = useGizmo(obj)

    Client.spawnedEntities[data.id].coords = {
        x = Utils.round(result.position.x, 3),
        y = Utils.round(result.position.y, 3),
        z = Utils.round(result.position.z, 3)
    }
    Client.spawnedEntities[data.id].rotation = {
        x = Utils.round(result.rotation.x, 3),
        y = Utils.round(result.rotation.y, 3),
        z = Utils.round(result.rotation.z, 3)
    }
    for i, ped in ipairs(peds) do
        if ped.id == data.id then
            peds[i] = Client.spawnedEntities[data.id]
            break
        end
    end

    SendNUIMessage({
        app = '17mov_DevTool',
        method = 'UpdatePeds',
        data = peds
    })

    SetNuiFocus(true, true)
    SendNUIMessage({
        app = '17mov_DevTool', 
        method = 'toggleUI',
        data = true
    })
    Client.isMenuOpen = true

    cb('ok')
end)

RegisterNUICallback('ApplyChangesToPed', function(data, cb)
    local ped = Client.spawnedEntities[data.id]
    local obj = ped.handle

    local model = data.model
    local animDict = data.animation.dict
    local animClip = data.animation.clip

    if model ~= ped.model then
        RequestModel(GetHashKey(model))
        while not HasModelLoaded(GetHashKey(model)) do
            Citizen.Wait(1)
        end
        SetEntityAsMissionEntity(obj, true, true)
        DeleteEntity(obj)
        local offset = GetEntityCoords(PlayerPedId()) + GetEntityForwardVector(PlayerPedId()) * 3
        local heading = GetEntityHeading(PlayerPedId()) + 180
        obj = CreatePed(4, model, offset.x, offset.y, offset.z - 0.98, heading, false, false)
        FreezeEntityPosition(obj, true)
        SetEntityInvincible(obj, true)
        SetBlockingOfNonTemporaryEvents(obj, true)
        ped.handle = obj
        ped.model = model
    end

    if animDict ~= ped.animation.dict or animClip ~= ped.animation.clip then
        if animDict ~= '' and animClip ~= '' then
            RequestAnimDict(animDict)
            while not HasAnimDictLoaded(animDict) do
                Citizen.Wait(1)
            end
            TaskPlayAnim(obj, animDict, animClip, 8.0, 0.0, -1, 1, 0, 0, 0, 0)
        end
        ped.animation = { dict = animDict, clip = animClip }
    end

    local rotation = GetEntityRotation(obj)
    local coords = GetEntityCoords(obj)

    ped.name = data.name
    ped.coords = {
        x = Utils.round(coords.x, 3),
        y = Utils.round(coords.y, 3),
        z = Utils.round(coords.z, 3)
    }
    ped.rotation = {
        x = Utils.round(rotation.x, 3),
        y = Utils.round(rotation.y, 3),
        z = Utils.round(rotation.z, 3)
    }

    for i, ped in ipairs(peds) do
        if ped.id == data.id then
            peds[i] = ped
            break
        end
    end
    Client.spawnedEntities[data.id] = ped

    SendNUIMessage({
        app = '17mov_DevTool',
        method = 'ApplyChangesToPedSuccess',
        data = peds
    })

    cb('ok')
end)