import { AccordionLayout, AccordionTitle } from '@/components/accordion-layout';
import { Icons } from '@/components/icons';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { item } from '@/lib/framer';
import { motion } from 'framer-motion';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button';
import { useNuiCallback, useNuiEvent, useNuiRequest } from 'fivem-nui-react-lib';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import CopyCode from '@/components/copy-code';
import { setClipboard } from '@/lib/utils';

export default function PropPage() {
    const [selectedBone, setSelectedBone] = useState<number | null>(null);
    const [propModel, setPropModel] = useState<string>("prop_tool_fireaxe");
    const [animDict, setAnimDict] = useState<string>("");
    const [animClip, setAnimClip] = useState<string>("");
    const { send } = useNuiRequest();
    const [bones, setBones] = useState<PedBone[]>([]);
    const firstTimeRef = useRef(true);
    const [resultNative, setResultNative] = useState<string>("");
    const [resultRAW, setResultRAW] = useState<string>("");

    const [fetchLoadBones, { loading }] = useNuiCallback('17mov_DevTool', 'GetPedBones', setBones)

    useEffect(() => {
        if (firstTimeRef.current) {
            firstTimeRef.current = false
            fetchLoadBones()
        }
    }, [fetchLoadBones])

    const handleSuccessOffset = (data: { raw: string, native: string }) => {
        toast.success("Offset data has been set. U can copy native now")
        setResultNative(data.native)
        setResultRAW(data.raw)
    }

    useNuiEvent('17mov_DevTool', 'setOffsetPropGizmo', handleSuccessOffset)

    const handleClickGetPropOffset = () => {
        send('CloseUIFromUI')
        send('GetOffsetPropGizmo', { model: propModel, animDict, animClip, boneId: selectedBone })
    }

    return (
        <Accordion
            type="multiple"
            className="w-full space-y-2"
            defaultValue={['props']}>
            <AccordionItem value="props">
                <AccordionTrigger className='bg-zinc-900 px-4 py-4'>
                    <motion.div variants={item} className='flex items-center gap-5'>
                        <Icons.Gizmo className='w-5 h-5 text-logo' />
                        <span className='font-semibold text-sm text-zinc-100'>Prop tool</span>
                    </motion.div>
                </AccordionTrigger>
                <AccordionContent>
                    <div className='flex flex-col px-4'>
                        <AccordionLayout>
                            <AccordionTitle>Prop model</AccordionTitle>
                            <Input value={propModel} onChange={(e) => setPropModel(e.target.value)} className='w-full' />
                        </AccordionLayout>
                        <AccordionLayout>
                            <AccordionTitle>Target entity</AccordionTitle>
                            <Select>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                </SelectContent>
                            </Select>
                        </AccordionLayout>
                        <AccordionLayout>
                            <AccordionTitle>Animation</AccordionTitle>
                            <Input placeholder='Animation dict' value={animDict} onChange={(e) => setAnimDict(e.target.value)} className='w-full' />
                            <Input placeholder='Animation clip' className='w-full' value={animClip} onChange={(e) => setAnimClip(e.target.value)} />
                        </AccordionLayout>
                        <AccordionLayout>
                            <AccordionTitle>Bones</AccordionTitle>
                            <Select value={selectedBone?.toString() || ""} onValueChange={(val) => setSelectedBone(parseInt(val))} disabled={loading}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {bones.map((bone, index) => (
                                            <SelectItem key={index} value={bone.boneId.toString()}>{bone.bone}</SelectItem>   
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </AccordionLayout>
                    </div>
                </AccordionContent>
            </AccordionItem>

            <AccordionLayout className='px-4'>
                <AccordionTitle className='min-w-max'>RAW Results</AccordionTitle>
                <CopyCode value={resultRAW} />
            </AccordionLayout>

            <div className='flex items-center'>
                <Button motionBtn className='rounded-none w-full h-14' onClick={() => {
                    setClipboard(resultNative)
                    toast.success("Native has been copied")
                }}>Copy native</Button>
                <Button motionBtn className='rounded-none w-full h-14' variant={"secondary"} disabled={propModel === "" || selectedBone === null} onClick={handleClickGetPropOffset}>Edit offset</Button>
            </div>
        </Accordion>
    )
}
