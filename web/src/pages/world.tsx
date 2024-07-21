import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { item } from "@/lib/framer";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState } from "react";
import { v4 } from "uuid";

interface Preset {
    id: string;
    name: string;
    visible: boolean;
    modelId: number;
    objectList: { id: string, modelName: string, visible: boolean }[];
}

export default function WorldPage() {
    const [editingPreset, setEditingPreset] = useState<Preset | null>(null);
    const [presets, setPresets] = useState<Preset[]>([
        {
            id: v4(),
            name: "Random named preset #1",
            visible: true,
            modelId: 1328121893,
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
            modelId: 1328121893,
            objectList: [
                { id: v4(), modelName: "vw_prop_casino_slot_06a", visible: true },
                { id: v4(), modelName: "vw_prop_casino_slot_06a", visible: false },
                { id: v4(), modelName: "vw_prop_casino_slot_06a", visible: true },
                { id: v4(), modelName: "vw_prop_casino_slot_06a", visible: false },
                { id: v4(), modelName: "vw_prop_casino_slot_06a", visible: true },
            ]
        }
    ]);

    if (editingPreset) {
        return <EditingPage preset={editingPreset} setEditingPreset={setEditingPreset} />
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
                    {presets.map(preset => {
                        const handleChangeVisibility = () => {
                            setPresets(prev => prev.map(p => {
                                if (p.id === preset.id) {
                                    return { ...p, visible: !p.visible };
                                }
                                return p;
                            }));
                        }

                        const handleDeletePreset = () => {
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
                    motionBtn
                    className="rounded-none h-14 justify-start"
                >
                    <Icons.Add className="w-4 h-4 mr-2" />
                    Create new preset
                </Button>
            </div>
        </div>
    )
}

export function EditingPage({ preset, setEditingPreset }: { preset: Preset, setEditingPreset: React.Dispatch<React.SetStateAction<Preset | null>> }) {
    const handleSave = () => {
        setEditingPreset(null)
    }

    const handleCancel = () => {
        setEditingPreset(null)
    }

    return (
        <div className="flex flex-col h-full">
            <div className="bg-zinc-900 px-4 py-4">
                <motion.div variants={item} className='flex items-center gap-5'>
                    <Icons.Globe className='w-5 h-5 text-logo' />
                    <span className='font-semibold text-sm text-zinc-100'>Editing "{preset.name}"</span>
                </motion.div>
            </div>
            <div className="grow flex flex-col">
                <div className="grow">
                    <div className="p-4 space-y-4">
                        <Input placeholder="Enter model ID" defaultValue={preset.modelId} className="w-full" />
                        <Separator />
                        <h1 className="text-md font-semibold">Object list</h1>
                        <div className="space-y-2">
                            {preset.objectList.map(obj => (
                                <div key={obj.id} className="flex items-center justify-between bg-white/5 rounded-sm p-1">
                                    <Input placeholder="Enter model name" defaultValue={obj.modelName} className="w-full bg-transparent border-none" />
                                    <div className="flex items-center gap-2">
                                        <Button motionBtn variant="outline" className="rounded-none h-10 w-10" size={"icon"}>
                                            <Icons.Copy className={"w-5 h-5 text-zinc-300"} />
                                        </Button>
                                        <Button motionBtn variant="outline" className="rounded-none h-10 w-10" size={"icon"}>
                                            <Icons.Eye className={cn("w-5 h-5", { 'text-logo': obj.visible, 'text-zinc-300': !obj.visible })} />
                                        </Button>
                                        <Button motionBtn variant="outline" className="rounded-none h-10 w-10" size={"icon"}>
                                            <Icons.Edit className={"w-5 h-5 text-zinc-300"} />
                                        </Button>
                                        <Button motionBtn variant="outline" className="rounded-none h-10 w-10" size={"icon"}>
                                            <Icons.Trash className={"w-5 h-5 text-zinc-300"} />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex items-center">
                    <Button onClick={handleSave} motionBtn className="rounded-none h-14 w-full">
                        <div className="grid grid-cols-3 w-full">
                            <Icons.Save className="w-5 h-5" />
                            <span className="text-md font-medium">Save</span>
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
