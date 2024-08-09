local usingGizmo = false
local mode = "Translate"
local extraZ = 1000.0
local spawnedProp, pedBoneId = 0, 0
local lastCoord = nil
local position, rotation = vector3(0.0, 0.0, 0.0), vector3(0.0, 0.0, 0.0)

local function toggleNuiFrame(bool)
    usingGizmo = bool
    SetNuiFocus(bool, bool)
end

function useGizmoAttach(handle, boneid, dict, anim)
    local playerPed = PlayerPedId()
    spawnedProp = handle
    pedBoneId = boneid
    lastCoord = GetEntityCoords(playerPed)

    FreezeEntityPosition(playerPed, true)
    SetEntityCoords(playerPed, 0.0, 0.0, extraZ-1)
    SetEntityHeading(playerPed, 0.0)
    position, rotation = vector3(0.0, 0.0, 0.0), vector3(0.0, 0.0, 0.0)
    -- AttachEntityToEntity(spawnedProp, playerPed, GetPedBoneIndex(playerPed, pedBoneId), position, rotation, true, true, false, true, 1, true)

    SendNUIMessage({
        app = '17mov_DevTool',
        method = 'setGizmoEntity',
        data = {
            handle = spawnedProp,
            position = vector3(0.0, 0.0, extraZ),
            rotation = vector3(0.0, 0.0, 0.0)
        }
    })
    toggleNuiFrame(true)

    if dict and anim then taskPlayAnim(playerPed, dict, anim) end

    while usingGizmo do
        DrawScaleformMovieFullscreen(CreateInstuctionScaleform(), 255, 255, 255, 255, 0)
        SendNUIMessage({
            app = '17mov_DevTool',
            method = 'setCameraPosition',
            data = {
                position = GetFinalRenderedCamCoord(),
                rotation = GetFinalRenderedCamRot()
            }
        })
        if IsControlJustReleased(0, 44) then
            SetNuiFocus(true, true)
        end
        DisableIdleCamera(true)
        Wait(0)
    end

    finish()
    return {
        "AttachEntityToEntity(entity, PlayerPedId(), "..pedBoneId..", "..(extraZ-position.z)..", "..position.y..", "..position.x..", "..rotation.x..", "..rotation.y..", "..rotation.z..", true, true, false, true, 1, true)",
        Utils.round(extraZ-position.z, 3)..", "..Utils.round(position.y, 3)..", "..Utils.round(position.x, 3)..", "..Utils.round(rotation.x, 3)..", "..Utils.round(rotation.y, 3)..", "..Utils.round(rotation.z, 3)
    }
end

RegisterNUICallback('moveEntity', function(data, cb)
    local entity = data.handle
    local globalOffset = vector3(data.position.x, data.position.y, data.position.z - 1000)
    local globalRotation = vector3(data.rotation.x, data.rotation.y, data.rotation.z)

    local ped = PlayerPedId()
    local boneIndex = GetPedBoneIndex(ped, pedBoneId)

    local helperProp = CreateObject(`prop_cuff_keys_01`, 0, 0, 0, true, true, false)
    AttachEntityToEntity(helperProp, ped, boneIndex, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, true, true, false, false, 1, true)

    local forward, right, up, pos = GetEntityMatrix(helperProp)

    DeleteEntity(helperProp)

    local inverseRight = vector3(right.x, forward.x, up.x)
    local inverseForward = vector3(right.y, forward.y, up.y)
    local inverseUp = vector3(right.z, forward.z, up.z)

    local localOffset = vector3(
        inverseRight.x * globalOffset.x + inverseForward.x * globalOffset.y + inverseUp.x * globalOffset.z,
        inverseRight.y * globalOffset.x + inverseForward.y * globalOffset.y + inverseUp.y * globalOffset.z,
        inverseRight.z * globalOffset.x + inverseForward.z * globalOffset.y + inverseUp.z * globalOffset.z
    )

    local localRotation = vector3(
        inverseRight.x * globalRotation.x + inverseForward.x * globalRotation.y + inverseUp.x * globalRotation.z,
        inverseRight.y * globalRotation.x + inverseForward.y * globalRotation.y + inverseUp.y * globalRotation.z,
        inverseRight.z * globalRotation.x + inverseForward.z * globalRotation.y + inverseUp.z * globalRotation.z
    )

    AttachEntityToEntity(entity, ped, boneIndex, localOffset.x, localOffset.y, localOffset.z, localRotation.x, localRotation.y, localRotation.z, true, true, false, true, 1, true)
    cb('ok')
end)

RegisterNUICallback('finishEdit', function(data, cb)
    toggleNuiFrame(false)
    SendNUIMessage({
        app = '17mov_DevTool',
        method = 'setGizmoEntity',
        data = {
            handle = nil,
        }
    })
    cb('ok')
end)

RegisterNUICallback('swapMode', function(data, cb)
    mode = data.mode
    cb('ok')
end)

RegisterNUICallback('cam', function(data, cb)
    SetNuiFocus(false, false)
    cb('ok')
end)

function CreateInstuctionScaleform()
	local scaleform = RequestScaleformMovie("instructional_buttons")
	while not HasScaleformMovieLoaded(scaleform) do Wait(10) end

	PushScaleformMovieFunction(scaleform, "CLEAR_ALL")
	PopScaleformMovieFunctionVoid()

	PushScaleformMovieFunction(scaleform, "SET_CLEAR_SPACE")
	PushScaleformMovieFunctionParameterInt(200)
	PopScaleformMovieFunctionVoid()

    InstructionButtonCreate(scaleform, 203, "Done Editing", 1)
    InstructionButtonCreate(scaleform, 44, "NUI Focus", 2)

    if mode == "Translate" then
        InstructionButtonCreate(scaleform, 45, "Rotate Mode", 3)
    else
        InstructionButtonCreate(scaleform, 32, "Translate Mode", 4)
    end

	PushScaleformMovieFunction(scaleform, "DRAW_INSTRUCTIONAL_BUTTONS")
	PopScaleformMovieFunctionVoid()

	PushScaleformMovieFunction(scaleform, "SET_BACKGROUND_COLOUR")
	PushScaleformMovieFunctionParameterInt(0)
	PushScaleformMovieFunctionParameterInt(0)
	PushScaleformMovieFunctionParameterInt(0)
	PushScaleformMovieFunctionParameterInt(80)
	PopScaleformMovieFunctionVoid()

	return scaleform
end

function InstructionButtonCreate(scaleform, key, text, number)
    PushScaleformMovieFunction(scaleform, "SET_DATA_SLOT")
	PushScaleformMovieFunctionParameterInt(number)
	PushScaleformMovieMethodParameterButtonName(GetControlInstructionalButton(0, key, true))
	InstructionButtonMessage(text)
	PopScaleformMovieFunctionVoid()
end

function InstructionButtonMessage(text)
	BeginTextCommandScaleformString("STRING")
	AddTextComponentScaleform(text)
	EndTextCommandScaleformString()
end

function finish()
    if DoesEntityExist(spawnedProp) then
        DeleteEntity(spawnedProp)
    end
    local playerPed = PlayerPedId()
    FreezeEntityPosition(playerPed, false)
    ClearPedTasks(playerPed)
    if lastCoord then
        SetEntityCoords(playerPed, lastCoord)
        lastCoord = nil
    end
end

function taskPlayAnim(ped, dict, anim, flag)
    CreateThread(function()
        while usingGizmo do
            if not IsEntityPlayingAnim(ped, dict, anim, 1) then
                while not HasAnimDictLoaded(dict) do
                    RequestAnimDict(dict)
                    Wait(10)
                end
                TaskPlayAnim(ped, dict, anim, 5.0, 5.0, -1, (flag or 15), 0, false, false, false)
                RemoveAnimDict(dict)
            end
            Wait(1000)
        end
    end)
end

AddEventHandler('onResourceStop', function(resourceName)
    if GetCurrentResourceName() == resourceName then
        finish()
    end
end)