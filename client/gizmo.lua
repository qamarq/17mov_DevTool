local dataview = require 'client.dataview'

local enableScale = false -- allow scaling mode. doesnt scale collisions and resets when physics are applied it seems

local gizmoEnabled = false
local currentMode = 'translate'
local isRelative = false
local currentEntity

-- FUNCTIONS

local function normalize(x, y, z)
    local length = math.sqrt(x * x + y * y + z * z)
    if length == 0 then
        return 0, 0, 0
    end
    return x / length, y / length, z / length
end

local function makeEntityMatrix(entity)
    local f, r, u, a = GetEntityMatrix(entity)
    local view = dataview.ArrayBuffer(60)

    view:SetFloat32(0, r[1])
        :SetFloat32(4, r[2])
        :SetFloat32(8, r[3])
        :SetFloat32(12, 0)
        :SetFloat32(16, f[1])
        :SetFloat32(20, f[2])
        :SetFloat32(24, f[3])
        :SetFloat32(28, 0)
        :SetFloat32(32, u[1])
        :SetFloat32(36, u[2])
        :SetFloat32(40, u[3])
        :SetFloat32(44, 0)
        :SetFloat32(48, a[1])
        :SetFloat32(52, a[2])
        :SetFloat32(56, a[3])
        :SetFloat32(60, 1)

    return view
end

local function applyEntityMatrix(entity, view)
    local x1, y1, z1 = view:GetFloat32(16), view:GetFloat32(20), view:GetFloat32(24)
    local x2, y2, z2 = view:GetFloat32(0), view:GetFloat32(4), view:GetFloat32(8)
    local x3, y3, z3 = view:GetFloat32(32), view:GetFloat32(36), view:GetFloat32(40)
    local tx, ty, tz = view:GetFloat32(48), view:GetFloat32(52), view:GetFloat32(56)

    if not enableScale then
        x1, y1, z1 = normalize(x1, y1, z1)
        x2, y2, z2 = normalize(x2, y2, z2)
        x3, y3, z3 = normalize(x3, y3, z3)
    end

    SetEntityMatrix(entity,
        x1, y1, z1,
        x2, y2, z2,
        x3, y3, z3,
        tx, ty, tz
    )
end

-- LOOPS

local function gizmoLoop(entity)
    if not gizmoEnabled then
        return LeaveCursorMode()
    end

    EnterCursorMode()

    if IsEntityAPed(entity) then
        SetEntityAlpha(entity, 200)
    else
        SetEntityDrawOutline(entity, true)
    end

    SendNUIMessage({
        app = '17mov_DevTool', 
        method = 'toggleGizmoHelper',
        data = true
    })

    while gizmoEnabled and DoesEntityExist(entity) do
        Wait(0)

        DisableControlAction(0, 24, true)  -- lmb
        DisableControlAction(0, 25, true)  -- rmb
        DisableControlAction(0, 140, true) -- r
        DisablePlayerFiring(PlayerPedId(), true)

        local matrixBuffer = makeEntityMatrix(entity)
        local changed = Citizen.InvokeNative(0xEB2EDCA2, matrixBuffer:Buffer(), 'Editor1',
            Citizen.ReturnResultAnyway())

        if changed then
            applyEntityMatrix(entity, matrixBuffer)
        end
    end

    LeaveCursorMode()

    if DoesEntityExist(entity) then
        if IsEntityAPed(entity) then SetEntityAlpha(entity, 255) end
        SetEntityDrawOutline(entity, false)
    end

    SendNUIMessage({
        app = '17mov_DevTool', 
        method = 'toggleGizmoHelper',
        data = false
    })

    gizmoEnabled = false
    currentEntity = nil
end

-- local function textUILoop()
--     CreateThread(function()
--         while gizmoEnabled do
--             Wait(100)
--             local scaleText = (enableScale and '[S]     - Scale Mode  \n') or ''
--             lib.showTextUI(
--                 ('Currenssst Mode: %s | %s  \n'):format(currentMode, (isRelative and 'Relative') or 'World') ..
--                 '[W]     - Translate Mode  \n' ..
--                 '[R]     - Rotate Mode  \n' ..
--                 scaleText ..
--                 '[Q]     - Relative/World  \n' ..
--                 '[LALT]  - Snap To Ground  \n' ..
--                 '[ENTER] - Done Editing  \n'
--             )
--         end
--         lib.hideTextUI()
--     end)
-- end

-- EXPORTS

function useGizmo(entity)
    gizmoEnabled = true
    currentEntity = entity
    gizmoLoop(entity)

    return {
        handle = entity,
        position = GetEntityCoords(entity),
        rotation = GetEntityRotation(entity)
    }
end

-- CONTROLS these execute the existing gizmo commands but allow me to add additional logic to update the mode display.

Utils.addKeybind({
    name = '_gizmoSelect',
    description = 'Selects the currently highlighted gizmo',
    defaultMapper = 'MOUSE_BUTTON',
    defaultKey = 'MOUSE_LEFT',
    onPressed = function(self)
        if not gizmoEnabled then return end
        ExecuteCommand('+gizmoSelect')
    end,
    onReleased = function (self)
        ExecuteCommand('-gizmoSelect')
    end
})

Utils.addKeybind({
    name = '_gizmoTranslation',
    description = 'Sets mode of the gizmo to translation',
    defaultKey = 'W',
    onPressed = function(self)
        if not gizmoEnabled then return end
        currentMode = 'Translate'
        ExecuteCommand('+gizmoTranslation')
    end,
    onReleased = function (self)
        ExecuteCommand('-gizmoTranslation')
    end
})

Utils.addKeybind({
    name = '_gizmoRotation',
    description = 'Sets mode for the gizmo to rotation',
    defaultKey = 'R',
    onPressed = function(self)
        if not gizmoEnabled then return end
        currentMode = 'Rotate'
        ExecuteCommand('+gizmoRotation')
    end,
    onReleased = function (self)
        ExecuteCommand('-gizmoRotation')
    end
})

Utils.addKeybind({
    name = '_gizmoLocal',
    description = 'toggle gizmo to be local to the entity instead of world',
    defaultKey = 'Q',
    onPressed = function(self)
        if not gizmoEnabled then return end
        isRelative = not isRelative
        ExecuteCommand('+gizmoLocal')
    end,
    onReleased = function (self)
        ExecuteCommand('-gizmoLocal')
    end
})

Utils.addKeybind({
    name = 'gizmoclose',
    description = 'close gizmo',
    defaultKey = 'RETURN',
    onPressed = function(self)
        if not gizmoEnabled then return end
        gizmoEnabled = false
    end,
})

Utils.addKeybind({
    name = 'gizmoSnapToGround',
    description = 'snap current gizmo object to floor/surface',
    defaultKey = 'LMENU',
    onPressed = function(self)
        if not gizmoEnabled then return end
        print("Snapping to ground "..currentEntity)
        PlaceObjectOnGroundProperly_2(currentEntity)
        PlaceObjectOnGroundProperly(currentEntity)

        -- if entity is ped
        if IsEntityAPed(currentEntity) then
            local pedCoords = GetEntityCoords(currentEntity)
            local entityHeight = GetEntityHeightAboveGround(currentEntity)
            SetEntityCoords(currentEntity, pedCoords.x, pedCoords.y, pedCoords.z - entityHeight, false, false, true, false)
        end
    end,
})

if enableScale then
    Utils.addKeybind({
        name = '_gizmoScale',
        description = 'Sets mode for the gizmo to scale',
        defaultKey = 'S',
        onPressed = function(self)
            if not gizmoEnabled then return end
            currentMode = 'Scale'
            ExecuteCommand('+gizmoScale')
        end,
        onReleased = function (self)
            ExecuteCommand('-gizmoScale')
        end
    })
end