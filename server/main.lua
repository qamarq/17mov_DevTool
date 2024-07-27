RegisterNetEvent('17mov_DevTool:setTime')
AddEventHandler('17mov_DevTool:setTime', function(data)
    ExecuteCommand("time " .. data.hour .. " " .. data.minute)
end)

RegisterNetEvent('17mov_DevTool:setWeather')
AddEventHandler('17mov_DevTool:setWeather', function(data)
    ExecuteCommand("weather " .. data.weather)
end)

local function getFileData(path, file)
    return json.decode(LoadResourceFile(GetCurrentResourceName(), path .. '/' .. file))
end

local function formatTimecycles(timecycles)
    local formatedTimecycles = {}

    for i=1, #timecycles do
        local v = timecycles[i]
        local found
        for j=1, #formatedTimecycles do
            if formatedTimecycles[j].label == v.Name then
                found = true
                break
            end
        end
        if not found then
            table.insert(formatedTimecycles, { label = v.Name, value = tostring(joaat(v.Name)) })
        end
    end

    table.sort(formatedTimecycles, function(a, b) return a.label < b.label end)

    return formatedTimecycles
end

RegisterNetEvent('17mov_DevTool:getData')
AddEventHandler('17mov_DevTool:getData', function()
    local returnData = {
        timecycles = formatTimecycles(getFileData('shared/data', 'timecycleModifiers.json')),
        pedBones = getFileData('shared/data', 'pedBones.json'),
        worldPresets = getFileData('shared/data', 'worldPresets.json')
    }

    TriggerClientEvent('17mov_DevTool:setData', source, returnData)
end)

RegisterNetEvent('17mov_DevTool:savePresets')
AddEventHandler('17mov_DevTool:savePresets', function(data)
    SaveResourceFile(GetCurrentResourceName(), 'shared/data/worldPresets.json', data, -1)
end)