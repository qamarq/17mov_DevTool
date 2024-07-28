RegisterNUICallback('GetPedBones', function(data, cb)
    SendNUIMessage({
        app = '17mov_DevTool',
        method = 'GetPedBonesSuccess',
        data = Client.data.pedBones
    })
end)

RegisterNUICallback('GetOffsetPropGizmo', function(data, cb)
    local model = data.model
    local animDict = data.animDict
    local animClip = data.animClip
    local boneId = data.boneId

    if not HasModelLoaded(model) then RequestModel(model) while not HasModelLoaded(model) do Wait(1) end end
    if animDict and animDict ~= "" then if not HasAnimDictLoaded(animDict) then RequestAnimDict(animDict) while not HasAnimDictLoaded(animDict) do Wait(1) end end end

    local playerPed = PlayerPedId()
    local playerCoords = GetEntityCoords(playerPed)
    local object = CreateObject(model, playerCoords.x, playerCoords.y, playerCoords.z, false, false, false)
    local bone = GetPedBoneIndex(playerPed, boneId)
    local objectPositionData = useGizmoAttach(object, bone, animDict, animClip)
    SendNUIMessage({
        app = '17mov_DevTool',
        method = 'setOffsetPropGizmo',
        data = {
            raw = objectPositionData[2],
            native = objectPositionData[1]
        }
    })
    
    SetNuiFocus(true, true)
    SendNUIMessage({
        app = '17mov_DevTool', 
        method = 'toggleUI',
        data = true
    })
    Client.isMenuOpen = true
    cb()
end)
