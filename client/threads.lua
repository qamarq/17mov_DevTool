-- Draw interior portals
CreateThread(function()
    while true do
        if Client.interiorId > 0 then
            if Client.portalPoly or Client.portalLines or Client.portalCorners or Client.portalInfos then
                local ix, iy, iz = GetInteriorPosition(Client.interiorId)
                local rotX, rotY, rotZ, rotW = GetInteriorRotation(Client.interiorId)
                local interiorPosition = vec3(ix, iy, iz)
                local interiorRotation = quat(rotW, rotX, rotY, rotZ)
                local pedCoords = GetEntityCoords(PlayerPedId())

                for portalId = 0, GetInteriorPortalCount(Client.interiorId) - 1 do
                    local corners = {}
                    local pureCorners = {}

                    for cornerIndex = 0, 3 do
                        local cornerX, cornerY, cornerZ = GetInteriorPortalCornerPosition(Client.interiorId, portalId, cornerIndex)
                        local cornerPosition = interiorPosition + Utils.QMultiply(interiorRotation, vec3(cornerX, cornerY, cornerZ))

                        corners[cornerIndex] = cornerPosition
                        pureCorners[cornerIndex] = vec3(cornerX, cornerY, cornerZ)
                    end

                    local CrossVector = Utils.Lerp(corners[0], corners[2], 0.5)

                    if #(pedCoords - CrossVector) <= 8.0 then
                        if Client.portalPoly then
                            DrawPoly(corners[0].x, corners[0].y, corners[0].z, corners[1].x, corners[1].y, corners[1].z, corners[2].x, corners[2].y, corners[2].z, 230, 7, 70, 150)
                            DrawPoly(corners[0].x, corners[0].y, corners[0].z, corners[2].x, corners[2].y, corners[2].z, corners[3].x, corners[3].y, corners[3].z, 230, 7, 70, 150)
                            DrawPoly(corners[3].x, corners[3].y, corners[3].z, corners[2].x, corners[2].y, corners[2].z, corners[1].x, corners[1].y, corners[1].z, 230, 7, 70, 150)
                            DrawPoly(corners[3].x, corners[3].y, corners[3].z, corners[1].x, corners[1].y, corners[1].z, corners[0].x, corners[0].y, corners[0].z, 230, 7, 70, 150)
                        end

                        if Client.portalLines then
                            -- Borders oultine
                            DrawLine(corners[0].x, corners[0].y, corners[0].z, corners[1].x, corners[1].y, corners[1].z, 0, 255, 0, 255)
                            DrawLine(corners[1].x, corners[1].y, corners[1].z, corners[2].x, corners[2].y, corners[2].z, 0, 255, 0, 255)
                            DrawLine(corners[2].x, corners[2].y, corners[2].z, corners[3].x, corners[3].y, corners[3].z, 0, 255, 0, 255)
                            DrawLine(corners[3].x, corners[3].y, corners[3].z, corners[0].x, corners[0].y, corners[0].z, 0, 255, 0, 255)

                            -- Middle lines
                            DrawLine(corners[0].x, corners[0].y, corners[0].z, corners[2].x, corners[2].y, corners[2].z, 0, 255, 0, 255)
                            DrawLine(corners[1].x, corners[1].y, corners[1].z, corners[3].x, corners[3].y, corners[3].z, 0, 255, 0, 255)
                        end

                        if Client.portalCorners then
                            Utils.Draw3DText(corners[0], ('~r~C0:~w~ %s %s %s'):format(math.round(pureCorners[0].x, 2), math.round(pureCorners[0].y, 2), math.round(pureCorners[0].z, 2)))
                            Utils.Draw3DText(corners[1], ('~r~C1:~w~ %s %s %s'):format(math.round(pureCorners[1].x, 2), math.round(pureCorners[1].y, 2), math.round(pureCorners[1].z, 2)))
                            Utils.Draw3DText(corners[2], ('~r~C2:~w~ %s %s %s'):format(math.round(pureCorners[2].x, 2), math.round(pureCorners[2].y, 2), math.round(pureCorners[2].z, 2)))
                            Utils.Draw3DText(corners[3], ('~r~C3:~w~ %s %s %s'):format(math.round(pureCorners[3].x, 2), math.round(pureCorners[3].y, 2), math.round(pureCorners[3].z, 2)))
                        end

                        if Client.portalInfos then
                            local portalFlags = GetInteriorPortalFlag(Client.interiorId, portalId)
                            local portalRoomTo = GetInteriorPortalRoomTo(Client.interiorId, portalId)
                            local portalRoomFrom = GetInteriorPortalRoomFrom(Client.interiorId, portalId)

                            Utils.Draw3DText(vec3(CrossVector.x, CrossVector.y, CrossVector.z + 0.2), ('~r~Portal ~w~%s'):format(portalId))
                            Utils.Draw3DText(vec3(CrossVector.x, CrossVector.y, CrossVector.z + 0.05), ('~r~From ~w~%s~r~ To ~w~%s'):format(portalRoomFrom, portalRoomTo))
                            Utils.Draw3DText(vec3(CrossVector.x, CrossVector.y, CrossVector.z - 0.1), ('~r~Flags ~w~%s'):format(portalFlags))
                        end
                    end
                end
            end
        else
            Wait(500)
        end
        Wait(0)
    end
end)

-- DATA LOOP
Citizen.CreateThread(function()
    while true do
        Citizen.Wait(Config.RefreshDataTime)
        if Client.isMenuOpen then
            SendNUIMessage({
                app = '17mov_DevTool', 
                method = 'refreshCoords',
                data = {
                    coords = GetEntityCoords(PlayerPedId()),
                    heading = GetEntityHeading(PlayerPedId())
                }
            })
        end
    end
end)

local CameraRotationKeys = {1,2,3,4,5,6}

-- DISABLE ESCAPE KEY WHEN MENU IS OPEN
Citizen.CreateThread(function()
    while Client.isMenuOpen do
        DisableControlAction(0, 202, true)
        DisableControlAction(0, 142, true)

        if not Client.cameraRotation then
            for _, key in ipairs(CameraRotationKeys) do
                DisableControlAction(0, key, true)
            end
        end
        Citizen.Wait(0)
    end
end)