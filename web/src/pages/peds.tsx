import { Icons } from '@/components/icons'
import { item } from '@/lib/framer'
import { motion } from 'framer-motion'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { AccordionLayout, AccordionTitle } from '@/components/accordion-layout';
import CopyCode from '@/components/copy-code';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import { v4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { debugData } from '@/lib/debugData';
import { useNuiCallback, useNuiEvent, useNuiRequest } from 'fivem-nui-react-lib';
import { Dialog, DialogFooter, DialogHeader, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { debugJson } from '@/lib/utils';
import { DialogDescription } from '@radix-ui/react-dialog';

debugData([
    {
        method: 'LoadPedsDataSuccess',
        data: [
            { id: v4(), model: "mp_f_freemode_01", name: 'My ped 1', coords: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, animation: { dict: '', clip: '' } },
            { id: v4(), model: "mp_m_freemode_01", name: 'My ped 2', coords: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, animation: { dict: '', clip: '' } },
            { id: v4(), model: "mp_f_freemode_01", name: 'My ped 3', coords: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, animation: { dict: '', clip: '' } },
            { id: v4(), model: "mp_m_freemode_01", name: 'My ped 4', coords: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, animation: { dict: '', clip: '' } },
        ]
    }
], 500)

export default function PedsPage() {
    const [peds, setPeds] = useState<Ped[]>([])
    const [addPedDialogShowed, setAddPedDialogShowed] = useState(false)
    const [newPedName, setNewPedName] = useState('Pedro Duarte')
    const [newPedModel, setNewPedModel] = useState('mp_m_freemode_01')
    const { send } = useNuiRequest()

    const [loadPedsData, { loading }] = useNuiCallback("17mov_DevTool", "LoadPedsData", setPeds);
    const [fetchCreateNewPed, { loading: createLoading }] = useNuiCallback("17mov_DevTool", "CreateNewPed", (data: Ped[]) => {
        setPeds(data)
        setAddPedDialogShowed(false)
        setNewPedName('Pedro Duarte')
        setNewPedModel('mp_m_freemode_01')
    });
    const [fetchDeletePed, { loading: deleteLoading }] = useNuiCallback("17mov_DevTool", "DeletePed", setPeds);

    useEffect(() => {
        loadPedsData()
    }, [loadPedsData])

    const handleDeletePed = (pedId: string) => fetchDeletePed({ id: pedId })

    const handleCreateNewPed = () => setAddPedDialogShowed(true)
    const handleDialogAddPed = () => {
        fetchCreateNewPed({ id: v4(), name: newPedName, model: newPedModel })
    }

    const handleEnablePedGizmo = (pedId: string) => {
        send('CloseUIFromUI')
        send('EnablePedGizmo', { id: pedId })
    }

    useNuiEvent('17mov_DevTool', 'UpdatePeds', (data: Ped[]) => {
        console.log('UpdatePeds', debugJson(data))
        setPeds(data)
    })

    return (
        <div className="flex flex-col h-full">
            <div className="bg-zinc-900 px-4 py-4">
                <motion.div variants={item} className='flex items-center gap-5'>
                    <Icons.Peds className='w-5 h-5 text-logo' />
                    <span className='font-semibold text-sm text-zinc-100'>Peds spawner</span>
                </motion.div>
            </div>
            <Dialog open={addPedDialogShowed} onOpenChange={setAddPedDialogShowed}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Set name for the new ped</DialogTitle>
                        <DialogDescription>Set the name and model for the new ped</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Name
                            </Label>
                            <Input
                                id="name"
                                defaultValue="Pedro Duarte"
                                value={newPedName}
                                onChange={(e) => setNewPedName(e.target.value)}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="username" className="text-right">
                                Model
                            </Label>
                            <Input
                                id="username"
                                defaultValue="mp_f_freemode_01"
                                value={newPedModel}
                                onChange={(e) => setNewPedModel(e.target.value)}
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" disabled={createLoading} onClick={handleDialogAddPed}>{createLoading && <Icons.Loading className='w-4 h-4 mr-2 animate-spin' />}Add new ped</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            {loading && (
                <div className="w-full min-h-24 flex flex-col items-center justify-center">
                    <Icons.Loading className="w-10 h-10 animate-spin text-logo" />
                    <p className="mt-2 text-xs text-gray-300">Loading peds</p>
                </div>
            )}
            <Accordion
                type="multiple"
                className="w-full mt-2 space-y-2 grow">
                {peds.map((ped) => (
                    <PedComponent 
                        key={ped.id} 
                        ped={ped} 
                        deleteLoading={deleteLoading}
                        handleDeletePed={handleDeletePed}
                        handleEnablePedGizmo={handleEnablePedGizmo}
                        setPeds={setPeds}
                    />
                ))}
            </Accordion>
            <Button disabled={createLoading} motionBtn className="rounded-none h-14 justify-start" onClick={handleCreateNewPed}>
                {createLoading ? <Icons.Loading className="w-4 h-4 mr-2 animate-spin" /> : <Icons.Add className="w-4 h-4 mr-2" />}
                Create a new one
            </Button>
        </div>
    )
}

const PedComponent = ({ ped, deleteLoading, handleDeletePed, handleEnablePedGizmo, setPeds }: { 
    ped: Ped,
    deleteLoading: boolean,
    handleDeletePed: (pedId: string) => void,
    handleEnablePedGizmo: (pedId: string) => void,
    setPeds: (data: Ped[]) => void
}) => {
    const [pedModel, setPedModel] = useState(ped.model)
    const [animDict, setAnimDict] = useState(ped.animation.dict)
    const [animClip, setAnimClip] = useState(ped.animation.clip)

    const [fetchApplyChanges, { loading }] = useNuiCallback("17mov_DevTool", "ApplyChangesToPed", setPeds);

    const handleApplyChanges = () => {
        fetchApplyChanges({ id: ped.id, model: pedModel, animation: { dict: animDict, clip: animClip } })
    }

    return (
        <AccordionItem value={ped.id} className='border'>
            <AccordionTrigger className='px-4 py-4 bg-transparent' deleteLoading={deleteLoading} handleDelete={() => handleDeletePed(ped.id)}>
                <motion.div variants={item} className='flex items-center gap-5'>
                    <span className='font-semibold text-sm text-zinc-100'>{ped.name}</span>
                </motion.div>
            </AccordionTrigger>
            <AccordionContent>
                <div className='flex flex-col px-4'>
                    <AccordionLayout>
                        <AccordionTitle>Model ID</AccordionTitle>
                        <Input className='w-full rounded-sm' value={pedModel} onChange={(e) => setPedModel(e.target.value)} />
                    </AccordionLayout>
                    <AccordionLayout>
                        <AccordionTitle className='w-auto'>Coordinates</AccordionTitle>
                        <div className='flex items-center gap-1'>
                            <CopyCode value={JSON.stringify(ped.coords)} />
                        </div>
                    </AccordionLayout>
                    <AccordionLayout>
                        <AccordionTitle className='w-auto'>Rotation</AccordionTitle>
                        <div className='flex items-center gap-1'>
                            {/* <CopyCode value={ped.rotation.x} label={`X: ${ped.rotation.x}°`} />
                            <CopyCode value={ped.rotation.y} label={`Y: ${ped.rotation.y}°`} />
                            <CopyCode value={ped.rotation.z} label={`Z: ${ped.rotation.z}°`} /> */}
                            <CopyCode value={JSON.stringify(ped.rotation)} />
                        </div>
                    </AccordionLayout>
                    <AccordionLayout>
                        <AccordionTitle>Animation</AccordionTitle>
                        <Input placeholder='Animation dict' className='w-full' value={animDict} onChange={(e) => setAnimDict(e.target.value)} />
                        <Input placeholder='Animation clip' className='w-full' value={animClip} onChange={(e) => setAnimClip(e.target.value)} />
                    </AccordionLayout>
                    <div className="flex items-center mt-2">
                        <Button motionBtn className="rounded-none h-12 w-full" onClick={handleApplyChanges} disabled={loading}>
                            <div className="grid grid-cols-3 w-full">
                                {loading ? <Icons.Loading className="w-5 h-5 animate-spin" /> : <Icons.Save className="w-5 h-5" />}
                                <span className="text-md font-medium">Apply changes</span>
                                <span></span>
                            </div>
                        </Button>
                        <Button motionBtn className="rounded-none h-12 w-full" variant={"secondary"} onClick={() => handleEnablePedGizmo(ped.id)}>
                            <div className="grid grid-cols-3 w-full">
                                <Icons.Gizmo className="w-5 h-5" />
                                <span className="text-md font-medium">Show Gizmo</span>
                                <span></span>
                            </div>
                        </Button>
                    </div>
                </div>
            </AccordionContent>
        </AccordionItem>
    )
}