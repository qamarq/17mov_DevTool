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