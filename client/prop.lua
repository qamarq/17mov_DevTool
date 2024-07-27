local offset = { x = 0, y = 0, z = 0 }
local rotation = 0
local defaultModel = `prop_mp_cone_02`

local function CalculateOffset(propCoords, boneId)
    local bone = GetPedBoneIndex(PlayerPedId(), tonumber(boneId))
    local boneCoords = GetWorldPositionOfEntityBone(PlayerPedId(), bone)
    local offset = boneCoords - vector3(propCoords.x, propCoords.y, propCoords.z)
    return offset
end

function SpawnObjectOffset(entity, model, offset, rotation)
    local model = GetHashKey(model)
    local coords = GetOffsetFromEntityInWorldCoords(entity, offset.x, offset.y, offset.z)
    local heading = GetEntityHeading(entity) + rotation
    local obj = CreateObject(model, coords.x, coords.y, coords.z, true, false, false)
    SetEntityHeading(obj, heading)
    SetEntityCollision(obj, false, false)
    return obj
end

local function LoadBones()
    -- if not Client.pedBonesLoaded then
    --     SendNUIMessage({
    --         app = '17mov_DevTool',
    --         method = 'setPedBones',
    --         data = Client.data.pedBones
    --     })
    --     Client.pedBonesLoaded = true
    -- end
    SendNUIMessage({
        app = '17mov_DevTool',
        method = 'setPedBones',
        data = Client.data.pedBones
    })
end

local function UpdateAttachedEntityStatus(entity, offset, rotation, boneId)
    if not Client.spawnedEntities['offsetProp'] then
        local spawned = SpawnObjectOffset(entity, 'prop_alien_egg_01', offset, rotation)
        local entityCoords = GetEntityCoords(spawned)
        local entityRotation = GetEntityRotation(spawned)

        Client.spawnedEntities['offsetProp'] = {
            handle = spawned,
            name = 'prop_alien_egg_01',
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
            invalid = false
        }
    end
    local obj = Client.spawnedEntities['offsetProp'].handle

    if IsEntityAttachedToEntity(obj, PlayerPedId()) then
        print('detaching entity')
        DetachEntity(obj, false, false)
    end
    local boneIndex = GetPedBoneIndex(entity, tonumber(boneId))
    local boneCoords = GetWorldPositionOfEntityBone(entity, boneIndex)
    SetEntityCoords(obj, boneCoords.x, boneCoords.y, boneCoords.z)
    -- AttachEntityToEntity(obj, entity, GetPedBoneIndex(entity, tonumber(boneId)), offset.x, offset.y, offset.z, 0, 0, 0, true, true, false, true, 1, true)

    -- local entityData = {
    --     name = 'prop_alien_egg_01',
    --     hash = GetHashKey('prop_alien_egg_01'),
    --     handle = obj,
    --     position = GetEntityCoords(obj),
    --     rotation = GetEntityRotation(obj),
    -- }

    -- SendNUIMessage({
    --     app = '17mov_DevTool',
    --     method = 'setGizmoEntity',
    --     data = entityData
    -- })
end

local dict = "amb@world_human_stand_impatient@male@no_sign@idle_a"
local anim = "idle_a"
local gizmoActive = false

function startGizmoAnim()
    TaskPlayAnim(PlayerPedId(), dict, anim, 8.0, -8.0, -1, 50, 0, false, false, false)
    gizmoActive = true
end

function stopGizmoAnim()
    StopAnimTask(PlayerPedId(), dict, anim, 1.1)
    gizmoActive = false
end

RegisterCommand('testAnim', function()
    -- check what animation player is playing
    RequestAnimDict(dict)
    while not HasAnimDictLoaded(dict) do
        Wait(0)
    end
    open()
    Wait(5000)
    close()
end)

Citizen.CreateThread(function()
    local wait = 1000
    while true do
        if (gizmoActive and IsEntityPlayingAnim(PlayerPedId(), dict, anim, 3)) then
            wait = 0
            currentTime = GetEntityAnimCurrentTime(PlayerPedId(), dict, anim)
            if currentTime >= 0.01 then
                SetEntityAnimCurrentTime(PlayerPedId(), dict, anim, currentTime)
                SetEntityAnimSpeed(PlayerPedId(), dict, anim, 0.0)
            end
        end
        Citizen.Wait(wait)
    end
end)

RegisterNUICallback('getOffsetPropGizmo', function(data, cb)
    local obj = Client.spawnedEntities['offsetProp'].handle
    RequestAnimDict(dict)
    while not HasAnimDictLoaded(dict) do
        Wait(0)
    end
    -- freeze player ped
    if IsEntityAttachedToEntity(obj, PlayerPedId()) then
        print('detaching entity')
        DetachEntity(obj, false, false)
    end
    FreezeEntityPosition(PlayerPedId(), true)

    startGizmoAnim()
    local result = useGizmo(obj)
    local offset = CalculateOffset(result.position, data.boneId)
    stopGizmoAnim()

    SetNuiFocus(true, true)
    SendNUIMessage({
        app = '17mov_DevTool', 
        method = 'toggleUI',
        data = true
    })
    Client.isMenuOpen = true
    FreezeEntityPosition(PlayerPedId(), false)
    AttachEntityToEntity(obj, PlayerPedId(), GetPedBoneIndex(PlayerPedId(), tonumber(data.boneId)), offset.x, offset.y, offset.z, 0,0,0, true, true, false, true, 1, true)
    local response = {
        offset = offset,
        rotation = result.rotation
    }
    SendNUIMessage({
        app = '17mov_DevTool',
        method = 'setOffsetPropGizmo',
        data = response
    })
end)

RegisterNUICallback('changePropBone', function(data, cb)
    UpdateAttachedEntityStatus(PlayerPedId(), offset, rotation, data)
    cb(1)
end)

RegisterNUICallback('toggleSpawnedOffsetProp', function(data, cb)
    Client.spawnedOffsetProp = data
    
    if data then
        LoadBones()
        UpdateAttachedEntityStatus(PlayerPedId(), offset, rotation, 0)
    else
        if Client.spawnedEntities['offsetProp'] then 
            DeleteEntity(Client.spawnedEntities['offsetProp'].handle)
            Client.spawnedEntities['offsetProp'] = nil
        end
    end
end)