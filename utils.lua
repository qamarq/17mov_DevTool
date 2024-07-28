local loaded = {}
local _require = require

package = {
    path = './?.lua;./?/init.lua',
    preload = {},
    loaded = setmetatable({}, {
        __index = loaded,
        __newindex = noop,
        __metatable = false,
    })
}

Utils = {}

Utils.weatherHashMap = {
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

Utils.listFlags = function(totalFlags, type)
    local all_flags = {
        portal = { 1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192 },
        room = { 1, 2, 4, 8, 16, 32, 64, 128, 256, 512 }
    }

    if not all_flags[type] then return end

    local flags = {}

    for _, flag in ipairs(all_flags[type]) do
        if totalFlags & flag ~= 0 then
            flags[#flags+1] = tostring(flag)
        end
    end

    local result = {}

    for i, flag in ipairs(flags) do
        result[#result+1] = tostring(flag)
    end

    return result
end

Utils.QMultiply = function(a, b)
    local axx = a.x * 2
    local ayy = a.y * 2
    local azz = a.z * 2
    local awxx = a.w * axx
    local awyy = a.w * ayy
    local awzz = a.w * azz
    local axxx = a.x * axx
    local axyy = a.x * ayy
    local axzz = a.x * azz
    local ayyy = a.y * ayy
    local ayzz = a.y * azz
    local azzz = a.z * azz

    return vec3(((b.x * ((1.0 - ayyy) - azzz)) + (b.y * (axyy - awzz))) + (b.z * (axzz + awyy)),
        ((b.x * (axyy + awzz)) + (b.y * ((1.0 - axxx) - azzz))) + (b.z * (ayzz - awxx)),
        ((b.x * (axzz - awyy)) + (b.y * (ayzz + awxx))) + (b.z * ((1.0 - axxx) - ayyy)))
end

Utils.Draw3DText = function(DrawCoords, text)
    local onScreen, _x, _y = GetScreenCoordFromWorldCoord(DrawCoords.x, DrawCoords.y, DrawCoords.z)
    local px, py, pz = table.unpack(GetFinalRenderedCamCoord())
    local dist = #(vec3(px, py, pz) - vec3(DrawCoords.x, DrawCoords.y, DrawCoords.z))
    local fov = (1 / GetGameplayCamFov()) * 100
    local scale = (1 / dist) * fov

    if onScreen then
        SetTextScale(0.0 * scale, 1.1 * scale)
        SetTextFont(0)
        SetTextProportional(1)
        SetTextDropshadow(0, 0, 0, 0, 255)
        SetTextEdge(2, 0, 0, 0, 150)
        SetTextDropShadow()
        SetTextOutline()
        BeginTextCommandDisplayText('STRING')
        SetTextCentre(1)
        AddTextComponentSubstringPlayerName(text)
        EndTextCommandDisplayText(_x, _y)
    end
end

Utils.Lerp = function(a, b, t)
    return a + (b - a) * t
end

Utils.setTimecycle = function(timecycle, roomId)
    if Client.interiorId ~= 0 then
        if not roomId then
            local roomHash = GetRoomKeyFromEntity(PlayerPedId())
            roomId = GetInteriorRoomIndexByHash(Client.interiorId, roomHash)
        end

        if not Client.defaultTimecycles[Client.interiorId] then
            Client.defaultTimecycles[Client.interiorId] = {}
        end

        if not Client.defaultTimecycles[Client.interiorId][roomId] then
            local currentTimecycle = GetInteriorRoomTimecycle(Client.interiorId, roomId)

            local found
            for _, v in pairs(Client.data.timecycles) do
                if v.value == tostring(currentTimecycle) then
                    found = v.label
                    break
                end
            end

            if not found then
                found = 'Unknown'
            end

            Client.defaultTimecycles[Client.interiorId][roomId] = {
                label = found,
                value = currentTimecycle
            }
        end

        SetInteriorRoomTimecycle(Client.interiorId, roomId, tonumber(timecycle))
        RefreshInterior(Client.interiorId)
    else
        SetTimecycleModifier(tonumber(timecycle))
    end
end

Utils.round = function(num, decimals)
    local power = 10 ^ decimals

    return math.floor(num * power) / power
end

Utils.randomString = function(length)
    local charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    local result = ''

    for i = 1, length do
        local random = math.random(1, #charset)
        result = result .. string.sub(charset, random, random)
    end

    return result
end

Utils.randomUUID = function()
    return string.format('%s-%s-%s-%s-%s', Utils.randomString(8), Utils.randomString(4), Utils.randomString(4), Utils.randomString(4), Utils.randomString(12))
end


local keybinds = {}

local IsPauseMenuActive = IsPauseMenuActive
local GetControlInstructionalButton = GetControlInstructionalButton

local keybind_mt = {
    disabled = false,
    defaultKey = '',
    defaultMapper = 'keyboard',
}

function keybind_mt:__index(index)
    return index == 'currentKey' and self:getCurrentKey() or keybind_mt[index]
end

function keybind_mt:getCurrentKey()
    return GetControlInstructionalButton(0, self.hash, true):sub(3)
end

function keybind_mt:disable(toggle)
    self.disabled = toggle
end

Utils.addKeybind = function(data)
    data.hash = joaat('+' .. data.name) | 0x80000000
    keybinds[data.name] = setmetatable(data, keybind_mt)

    RegisterCommand('+' .. data.name, function()
        if not data.onPressed or data.disabled or IsPauseMenuActive() then return end
        data:onPressed()
    end)

    RegisterCommand('-' .. data.name, function()
        if not data.onReleased or data.disabled or IsPauseMenuActive() then return end
        data:onReleased()
    end)

    RegisterKeyMapping('+' .. data.name, data.description, data.defaultMapper, data.defaultKey)

    if data.secondaryKey then
        RegisterKeyMapping('~!+' .. data.name, data.description, data.secondaryMapper or data.defaultMapper, data.secondaryKey)
    end

    SetTimeout(500, function()
        TriggerEvent('chat:removeSuggestion', ('/+%s'):format(data.name))
        TriggerEvent('chat:removeSuggestion', ('/-%s'):format(data.name))
    end)

    return data
end




local function getModuleInfo(modName)
    local resource = modName:match('^@(.-)/.+') --[[@as string?]]

    if resource then
        return resource, modName:sub(#resource + 3)
    end

    local idx = 4 -- call stack depth (kept slightly lower than expected depth "just in case")

    while true do
        local src = debug.getinfo(idx, 'S')?.source

        if not src then
            return cache.resource, modName
        end

        resource = src:match('^@@([^/]+)/.+')

        if resource and not src:find('^@@ox_lib/imports/require') then
            return resource, modName
        end

        idx += 1
    end
end

local tempData = {}
function package.searchpath(name, path)
    local resource, modName = getModuleInfo(name:gsub('%.', '/'))
    local tried = {}

    for template in path:gmatch('[^;]+') do
        local fileName = template:gsub('^%./', ''):gsub('?', modName:gsub('%.', '/') or modName)
        local file = LoadResourceFile(resource, fileName)

        if file then
            tempData[1] = file
            tempData[2] = resource
            return fileName
        end

        tried[#tried + 1] = ("no file '@%s/%s'"):format(resource, fileName)
    end

    return nil, table.concat(tried, "\n\t")
end

local function loadModule(modName, env)
    local fileName, err = package.searchpath(modName, package.path)

    if fileName then
        local file = tempData[1]
        local resource = tempData[2]

        table.wipe(tempData)
        return assert(load(file, ('@@%s/%s'):format(resource, fileName), 't', env or _ENV))
    end

    return nil, err or 'unknown error'
end

package.searchers = {
    function(modName)
        local ok, result = pcall(_require, modName)

        if ok then return result end

        return ok, result
    end,
    function(modName)
        if package.preload[modName] ~= nil then
            return package.preload[modName]
        end

        return nil, ("no field package.preload['%s']"):format(modName)
    end,
    function(modName) return loadModule(modName) end,
}

Utils.require = function(modName)
    if type(modName) ~= 'string' then
        error(("module name must be a string (received '%s')"):format(modName), 3)
    end

    local module = loaded[modName]

    if module == '__loading' then
        error(("^1circular-dependency occurred when loading module '%s'^0"):format(modName), 2)
    end

    if module ~= nil then return module end

    loaded[modName] = '__loading'

    local err = {}

    for i = 1, #package.searchers do
        local result, errMsg = package.searchers[i](modName)

        if result then
            if type(result) == 'function' then result = result() end
            loaded[modName] = result or result == nil

            return loaded[modName]
        end

        err[#err + 1] = errMsg
    end

    error(("%s"):format(table.concat(err, "\n\t")))
end