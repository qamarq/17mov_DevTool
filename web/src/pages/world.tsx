import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { debugData } from "@/lib/debugData";
import { item } from "@/lib/framer";
import { cn } from "@/lib/utils";
import { useNuiCallback, useNuiEvent, useNuiRequest } from "fivem-nui-react-lib";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { v4 } from "uuid";

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

debugData([
    {
        method: 'LoadWorldPresets',
        data: [
            {
                id: v4(),
                name: "Random named preset #1",
                visible: true,
                objectList: [
                    { id: v4(), modelName: "vw_prop_casino_slot_06a", visible: true },
                    { id: v4(), modelName: "vw_prop_casino_slot_06a", visible: false },
                    { id: v4(), modelName: "vw_prop_casino_slot_06a", visible: true },
                    { id: v4(), modelName: "vw_prop_casino_slot_06a", visible: false },
                    { id: v4(), modelName: "vw_prop_casino_slot_06a", visible: true },
                ]
            },
            {
                id: v4(),
                name: "Random named preset #2",
                visible: false,
                objectList: [
                    { id: v4(), modelName: "vw_prop_casino_slot_06a", visible: true },
                    { id: v4(), modelName: "vw_prop_casino_slot_06a", visible: false },
                    { id: v4(), modelName: "vw_prop_casino_slot_06a", visible: true },
                    { id: v4(), modelName: "vw_prop_casino_slot_06a", visible: false },
                    { id: v4(), modelName: "vw_prop_casino_slot_06a", visible: true },
                ]
            }
        ]
    }
], 10)

export default function WorldPage() {
    const [editingPreset, setEditingPreset] = useState<Preset | null>(null);
    const [presets, setPresets] = useState<Preset[]>([]);
    const { send } = useNuiRequest();
    const firstTimeRef = useRef(true);

    const [loadWorldPresets, { loading }] = useNuiCallback("17mov_DevTool", "LoadWorldPresets", setPresets);

    const handleAddingSuccess = (newPreset: Preset) => {
        setPresets(prev => [...prev, newPreset]);
    }
    const [fetchCreateWorldPreset, { loading: loadingCreateWorldPreset }] = useNuiCallback("17mov_DevTool", "CreateWorldPreset", handleAddingSuccess);

    useEffect(() => {
        if (firstTimeRef.current) {
            loadWorldPresets({});
            firstTimeRef.current = false;
        }
    }, [loadWorldPresets])

    const handleAddNewPreset = () => {
        fetchCreateWorldPreset({
            id: v4(),
            name: "New preset",
            visible: true,
            objectList: []
        })
    }

    const [ fetchSavePresets, { loading: loadingSavePresets }] = useNuiCallback("17mov_DevTool", "SavePresets", () => {
        setEditingPreset(null);
        toast.success("Saved presets to JSON")
    });

    const handleSavePresets = () => {
        fetchSavePresets({});
    }


    if (editingPreset) {
        return <EditingPage preset={editingPreset} setEditingPreset={setEditingPreset} loadWorldPresets={loadWorldPresets} handleSavePresets={handleSavePresets} loadingSave={loadingSavePresets} setPresets={setPresets} />
    }

    return (
        <div className="flex flex-col h-full">
            <div className="bg-zinc-900 px-4 py-4">
                <motion.div variants={item} className='flex items-center gap-5'>
                    <Icons.Globe className='w-5 h-5 text-logo' />
                    <span className='font-semibold text-sm text-zinc-100'>World editor</span>
                </motion.div>
            </div>
            <div className="grow flex flex-col">
                <div className="grow">
                    {loading && (
                        <div className="w-full min-h-24 flex flex-col items-center justify-center">
                            <Icons.Loading className="w-10 h-10 animate-spin text-logo" />
                            <p className="mt-2 text-xs text-gray-300">Loading world presets</p>
                        </div>
                    )}
                    {presets.map(preset => {
                        const handleChangeVisibility = () => {
                            setPresets(prev => prev.map(p => {
                                if (p.id === preset.id) {
                                    send("ChangeWorldPresetVisibility", { id: preset.id, visible: !preset.visible });
                                    return { ...p, visible: !p.visible };
                                }
                                return p;
                            }));
                        }

                        const handleDeletePreset = () => {
                            send("DeleteWorldPreset", { id: preset.id });
                            setPresets(prev => prev.filter(p => p.id !== preset.id));
                        }

                        return (
                            <div key={preset.id} className="px-4 py-4">
                                <motion.div variants={item} className='flex items-center gap-5'>
                                    <h1 className='font-semibold text-sm text-zinc-100 w-full'>{preset.name}</h1>
                                    <div className="min-w-max flex items-center gap-3">
                                        <TooltipProvider delayDuration={1}>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button onClick={handleChangeVisibility} motionBtn variant="outline" className="rounded-none" size="icon"><Icons.Eye className={cn("w-5 h-5", { 'text-logo': preset.visible })} /></Button>
                                                </TooltipTrigger>
                                                <TooltipContent>Change visibility</TooltipContent>
                                            </Tooltip>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button onClick={() => setEditingPreset(preset)} motionBtn variant="outline" className="rounded-none" size="icon"><Icons.Edit className="w-5 h-5" /></Button>
                                                </TooltipTrigger>
                                                <TooltipContent>Edit objects</TooltipContent>
                                            </Tooltip>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button onClick={handleDeletePreset} motionBtn variant="outline" className="rounded-none" size="icon"><Icons.Trash className="w-5 h-5" /></Button>
                                                </TooltipTrigger>
                                                <TooltipContent>Delete preset</TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                </motion.div>
                            </div>
                        )
                    })}
                </div>
                <Button 
                    onClick={handleAddNewPreset}
                    disabled={loadingCreateWorldPreset}
                    className="rounded-none h-14 justify-start"
                >
                    {loadingCreateWorldPreset ? <Icons.Loading className="w-4 h-4 mr-2 animate-spin" /> : <Icons.Add className="w-4 h-4 mr-2" />}
                    Create new preset
                </Button>
            </div>
        </div>
    )
}

export function EditingPage({ preset, setEditingPreset, loadWorldPresets, handleSavePresets, loadingSave, setPresets }: { 
    preset: Preset, 
    setEditingPreset: React.Dispatch<React.SetStateAction<Preset | null>>, 
    loadWorldPresets: (data: any) => void, 
    handleSavePresets: () => void, 
    loadingSave: boolean,
    setPresets: React.Dispatch<React.SetStateAction<Preset[]>>
}) {
    const [presetName, setPresetName] = useState(preset.name);
    const { send } = useNuiRequest();

    const handleCancel = () => {
        setEditingPreset(null)
    }

    const handleAddingSuccess = (newObject: Preset["objectList"][0]) => {
        setEditingPreset(prev => {
            if (!prev) return null;
            return {
                ...prev,
                objectList: [...prev.objectList, newObject]
            }
        })
        loadWorldPresets({});
    }

    const [fetchCreateNewObject, { loading: loadingCreatingNewObject }] = useNuiCallback("17mov_DevTool", "CreateNewObject", handleAddingSuccess);
    const handleAddNewObject = () => {
        fetchCreateNewObject({
            id: v4(),
            presetId: preset.id,
            modelName: "prop_mp_cone_02",
            visible: true,
        })
    }

    const handleChangeObjectVisibility = (objId: string, visible: boolean) => {
        setEditingPreset(prev => {
            if (!prev) return null;
            return {
                ...prev,
                objectList: prev.objectList.map(obj => {
                    if (obj.id === objId) {
                        return {
                            ...obj,
                            visible
                        }
                    }
                    return obj;
                })
            }
        })
        send("ChangeObjectVisibility", { objId, visible, presetId: preset.id });
        wait(200).then(() => loadWorldPresets({}));
    }

    const handleEnableGizmoToObject = (objId: string) => {
        send('CloseUIFromUI')
        send("EnableGizmoToObject", { objId, presetId: preset.id });
    }

    useNuiEvent("17mov_DevTool", "EnableGizmoToObjectSuccess", (data: {objId: string, presetId: string, position: Preset["objectList"][0]["position"], rotation: Preset["objectList"][0]["rotation"]}) => {
        setEditingPreset(prev => {
            if (!prev) return null;
            return {
                ...prev,
                objectList: prev.objectList.map(obj => {
                    if (obj.id === data.objId) {
                        return {
                            ...obj,
                            position: data.position,
                            rotation: data.rotation
                        }
                    }
                    return obj;
                })
            }
        })
        toast.success("Updated object position and rotation")
        wait(200).then(() => loadWorldPresets({}));
    })

    const toggleSelectedObject = (objId: string, selected: boolean) => {
        send("ToggleSelectedObject", { objId, selected });
    }

    const handleDeleteObject = (objId: string) => {
        send("DeleteObject", { objId, presetId: preset.id });
        setEditingPreset(prev => {
            if (!prev) return null;
            return {
                ...prev,
                objectList: prev.objectList.filter(obj => obj.id !== objId)
            }
        })
        wait(200).then(() => loadWorldPresets({}));
    }

    const handleSave = async () => {
        send("SavePresetName", { id: preset.id, name: presetName });
        setPresets(prev => prev.map(p => {
            if (p.id === preset.id) {
                return {
                    ...p,
                    name: presetName
                }
            }
            return p;
        }))
        await wait(200)
        handleSavePresets();
    }

    return (
        <div className="flex flex-col h-full">
            <div className="bg-zinc-900 px-4 py-4">
                <motion.div variants={item} className='flex items-center gap-5'>
                    <Icons.Globe className='w-5 h-5 text-logo' />
                    <span className='font-semibold text-sm text-zinc-100 w-full'>Editing "{preset.name}"</span>
                </motion.div>
            </div>
            <div className="grow flex flex-col">
                <div className="grow">
                    <div className="p-4 space-y-4">
                        <Input placeholder="Enter preset name" value={presetName} onChange={(e) => setPresetName(e.target.value)} className="w-full" />
                        <Separator />
                        <div className="flex items-center justify-between">
                            <h1 className="text-md font-semibold">Object list</h1>
                            <TooltipProvider delayDuration={1}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button disabled={loadingCreatingNewObject} motionBtn variant="outline" className="rounded-none h-10 w-10" size={"icon"} onClick={handleAddNewObject}>
                                            {loadingCreatingNewObject ? <Icons.Loading className="w-5 h-5 animate-spin" /> : <Icons.Add className="w-5 h-5" />}
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Add new object</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <div className="space-y-2">
                            {preset.objectList.map(obj => (
                                <div key={obj.id} className="flex items-center justify-between bg-white/5 rounded-sm p-1" onMouseEnter={() => toggleSelectedObject(obj.id, true)} onMouseLeave={() => toggleSelectedObject(obj.id, false)}>
                                    <Input placeholder="Enter model name" defaultValue={obj.name} className="w-full bg-transparent border-none" />
                                    <div className="flex items-center gap-2">
                                        <Button motionBtn variant="outline" className="rounded-none h-10 w-10" size={"icon"}>
                                            <Icons.Copy className={"w-5 h-5 text-zinc-300"} />
                                        </Button>
                                        <Button 
                                            motionBtn 
                                            variant="outline" 
                                            className="rounded-none h-10 w-10" 
                                            size={"icon"}
                                            onClick={() => handleChangeObjectVisibility(obj.id, !obj.visible)}
                                        >
                                            <Icons.Eye className={cn("w-5 h-5", { 'text-logo': obj.visible, 'text-zinc-300': !obj.visible })} />
                                        </Button>
                                        <Button motionBtn variant="outline" className="rounded-none h-10 w-10" size={"icon"} onClick={() => handleEnableGizmoToObject(obj.id)}>
                                            <Icons.Gizmo className={"w-5 h-5 text-zinc-300"} />
                                        </Button>
                                        <Button motionBtn variant="outline" className="rounded-none h-10 w-10" size={"icon"} onClick={() => handleDeleteObject(obj.id)}>
                                            <Icons.Trash className={"w-5 h-5 text-zinc-300"} />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex items-center">
                    <Button onClick={handleSave} motionBtn className="rounded-none h-14 w-full" disabled={loadingSave}>
                        <div className="grid grid-cols-3 w-full">
                            {loadingSave ? <Icons.Loading className="w-5 h-5 animate-spin" /> : <Icons.Save className="w-5 h-5" />}
                            <span className="text-md font-medium">Save to JSON</span>
                            <span></span>
                        </div>
                    </Button>
                    <Button onClick={handleCancel} motionBtn className="rounded-none h-14 w-full" variant={"secondary"}>
                        <div className="grid grid-cols-3 w-full">
                            <Icons.Cancel className="w-5 h-5" />
                            <span className="text-md font-medium">Cancel</span>
                            <span></span>
                        </div>
                    </Button>
                </div>
            </div>
        </div>
    )
}
