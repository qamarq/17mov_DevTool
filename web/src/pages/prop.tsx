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
import { useNuiEvent, useNuiRequest } from 'fivem-nui-react-lib';
import { useEffect, useState } from 'react';

export default function PropPage() {
    const [selectedBone, setSelectedBone] = useState<string | null>(null);
    const { send } = useNuiRequest();
    const [bones, setBones] = useState<PedBone[]>([]);

    useNuiEvent('17mov_DevTool', 'setPedBones', (data: PedBone[]) => {
        setBones(data)
        setSelectedBone(data[0].boneId)
    })

    useEffect(() => {
        send('changePropBone', selectedBone)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedBone])

    const handleSuccessOffset = (data: any) => {
        console.log("Offset data:")
        console.log(data)
    }

    useNuiEvent('17mov_DevTool', 'setOffsetPropGizmo', handleSuccessOffset)

    const handleClickGetPropOffset = () => {
        send('CloseUIFromUI')
        send('getOffsetPropGizmo', { boneId: selectedBone })
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
                            <Input defaultValue={"vw_prop_casino_slot_06a"} className='w-full' />
                        </AccordionLayout>
                        <AccordionLayout>
                            <AccordionTitle>Target entity</AccordionTitle>
                            <Select value={selectedBone || ""} onValueChange={setSelectedBone}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {bones.map((bone, index) => (
                                            <SelectItem key={index} value={bone.boneId}>{bone.bone}</SelectItem>   
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </AccordionLayout>
                        <AccordionLayout>
                            <AccordionTitle>Animation</AccordionTitle>
                            <Input placeholder='Animation dict' className='w-full' />
                            <Input placeholder='Animation clip' className='w-full' />
                        </AccordionLayout>
                        <AccordionLayout>
                            <AccordionTitle>Bones</AccordionTitle>
                            <Select>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="clear">CLEAR</SelectItem>
                                        <SelectItem value="extrasunny">EXTRASUNNY</SelectItem>
                                        <SelectItem value="clouds">CLOUDS</SelectItem>
                                        <SelectItem value="overcast">OVERCAST</SelectItem>
                                        <SelectItem value="rain">RAIN</SelectItem>
                                        <SelectItem value="clearing">CLEARING</SelectItem>
                                        <SelectItem value="thunder">THUNDER</SelectItem>
                                        <SelectItem value="smog">SMOG</SelectItem>
                                        <SelectItem value="foggy">FOGGY</SelectItem>
                                        <SelectItem value="xmas">XMAS</SelectItem>
                                        <SelectItem value="snow">SNOW</SelectItem>
                                        <SelectItem value="snowlight">SNOWLIGHT</SelectItem>
                                        <SelectItem value="blizzard">BLIZZARD</SelectItem>
                                        <SelectItem value="halloween">HALLOWEEN</SelectItem>
                                        <SelectItem value="neutral">NEUTRAL</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </AccordionLayout>
                    </div>
                </AccordionContent>
            </AccordionItem>

            <div className='flex items-center'>
                <Button motionBtn className='rounded-none w-full h-14'>Copy native</Button>
                <Button motionBtn className='rounded-none w-full h-14' variant={"secondary"} onClick={handleClickGetPropOffset}>Edit offset</Button>
            </div>
        </Accordion>
    )
}
