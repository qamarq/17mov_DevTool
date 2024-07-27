local lastRoomId = 0

local function GetInteriorData(fromThread)
    local currentRoomHash = GetRoomKeyFromEntity(PlayerPedId())
    local currentRoomId = GetInteriorRoomIndexByHash(Client.interiorId, currentRoomHash)

    if (fromThread and lastRoomId ~= currentRoomId) or not fromThread then
        lastRoomId = currentRoomId
        local roomCount = GetInteriorRoomCount(Client.interiorId) - 1
        local portalCount = GetInteriorPortalCount(Client.interiorId)

        local rooms = {}

        for i = 1, roomCount do
            local totalFlags = GetInteriorRoomFlag(Client.interiorId, i)
            rooms[i] = {
                index = i,
                name = GetInteriorRoomName(Client.interiorId, i),
                timecycle = tostring(GetInteriorRoomTimecycle(Client.interiorId, i)),
                isCurrent = currentRoomId == i and true or nil,
                flags = {
                    list = Utils.listFlags(totalFlags, 'room'),
                    total = totalFlags
                }
            }
        end

        local portals = {}

        for i = 0, portalCount - 1 do
            local totalFlags = GetInteriorPortalFlag(Client.interiorId, i)
            portals[i] = {
                index = i,
                roomFrom = GetInteriorPortalRoomFrom(Client.interiorId, i),
                roomTo = GetInteriorPortalRoomTo(Client.interiorId, i),
                flags = {
                    list = Utils.listFlags(totalFlags, 'portal'),
                    total = totalFlags
                }
            }
        end

        local intData = {
            interiorId = Client.interiorId,
            roomCount = roomCount,
            portalCount = portalCount,
            rooms = rooms,
            portals = portals,
            currentRoom = {
                index = currentRoomId > 0 and currentRoomId or 0,
                name = currentRoomId > 0 and rooms[currentRoomId].name or 'none',
                timecycle = currentRoomId > 0 and rooms[currentRoomId].timecycle or 0,
                flags = currentRoomId > 0 and rooms[currentRoomId].flags or {list = {}, total = 0},
            }
        }

        SendNUIMessage({
            app = '17mov_DevTool', 
            method = 'setIntData',
            data = intData
        })

        Client.intData = intData
    else
        if Client.interiorId == 0 then
            SendNUIMessage({
                app = '17mov_DevTool', 
                method = 'setIntData',
                data = { interiorId = 0 }
            })
        end
        Wait(500)
    end
end
Client.GetInteriorData = GetInteriorData

RegisterNUICallback('setPortals', function(data, cb)
    Client.portalInfos = data.portalInfos
    Client.portalPoly = data.portalPoly
    Client.portalLines = data.portalLines
    Client.portalCorners = data.portalCorners

    cb(1)
end)

RegisterNUICallback('setTimecycle', function(data, cb)
    cb(1)

    if data.roomId and Client.intData.currentRoom.timecycle ~= data.value then
        Utils.setTimecycle(data.value)
    end
end)

RegisterNUICallback('resetTimecycle', function(data, cb)
    if data.roomId then
        if not Client.defaultTimecycles[Client.interiorId] then
            print('No default timecycle for interior ' .. Client.interiorId)
            cb(0)
        elseif not Client.defaultTimecycles[Client.interiorId][data.roomId] then
            print('No default timecycle for room ' .. data.roomId)
            cb(0)
        end

        Utils.setTimecycle(Client.defaultTimecycles[Client.interiorId][data.roomId].value)

        cb(Client.defaultTimecycles[Client.interiorId][data.roomId])
    end
end)
