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
import { useState } from 'react';
import { v4 } from 'uuid';
import { Button } from '@/components/ui/button';

interface Ped {
    id: string;
    model: string;
    name: string;
    coords: { x: number, y: number, z: number };
    rotation: { x: number, y: number, z: number };
    animation: { dict: string, clip: string };
}

export default function PedsPage() {
    const [peds] = useState<Ped[]>([
        { id: v4(), model: "mp_f_freemode_01", name: 'My ped 1', coords: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, animation: { dict: '', clip: '' } },
        { id: v4(), model: "mp_m_freemode_01", name: 'My ped 2', coords: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, animation: { dict: '', clip: '' } },
        { id: v4(), model: "mp_f_freemode_01", name: 'My ped 3', coords: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, animation: { dict: '', clip: '' } },
        { id: v4(), model: "mp_m_freemode_01", name: 'My ped 4', coords: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, animation: { dict: '', clip: '' } },
    ])

    const testFunction = () => {
        console.log("dhasjkdhksajdjshad")
    }

    return (
        <div className="flex flex-col h-full">
            <div className="bg-zinc-900 px-4 py-4">
                <motion.div variants={item} className='flex items-center gap-5'>
                    <Icons.Peds className='w-5 h-5 text-logo' />
                    <span className='font-semibold text-sm text-zinc-100'>Peds spawner</span>
                </motion.div>
            </div>
            <Accordion
                type="multiple"
                className="w-full mt-2 space-y-2 grow">
                {peds.map((ped) => (
                    <AccordionItem value={ped.id} className='border' key={ped.id}>
                        <AccordionTrigger className='px-4 py-4 bg-transparent' handleDelete={testFunction}>
                            <motion.div variants={item} className='flex items-center gap-5'>
                                <span className='font-semibold text-sm text-zinc-100'>{ped.name}</span>
                            </motion.div>
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className='flex flex-col px-4'>
                                <AccordionLayout>
                                    <AccordionTitle>Model ID</AccordionTitle>
                                    <Input className='w-full rounded-sm' value={ped.model} />
                                </AccordionLayout>
                                <AccordionLayout>
                                    <AccordionTitle className='w-auto'>Coordinates</AccordionTitle>
                                    <div className='flex items-center gap-1'>
                                        <CopyCode value={ped.coords.x} label={`X: ${ped.coords.x}°`} />
                                        <CopyCode value={ped.coords.y} label={`Y: ${ped.coords.y}°`} />
                                        <CopyCode value={ped.coords.z} label={`Z: ${ped.coords.z}°`} />
                                    </div>
                                </AccordionLayout>
                                <AccordionLayout>
                                    <AccordionTitle className='w-auto'>Rotation</AccordionTitle>
                                    <div className='flex items-center gap-1'>
                                        <CopyCode value={ped.rotation.x} label={`X: ${ped.rotation.x}°`} />
                                        <CopyCode value={ped.rotation.y} label={`Y: ${ped.rotation.y}°`} />
                                        <CopyCode value={ped.rotation.z} label={`Z: ${ped.rotation.z}°`} />
                                    </div>
                                </AccordionLayout>
                                <AccordionLayout>
                                    <AccordionTitle>Animation</AccordionTitle>
                                    <Input placeholder='Animation dict' className='w-full' />
                                    <Input placeholder='Animation clip' className='w-full' />
                                </AccordionLayout>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
            <Button motionBtn className="rounded-none h-14 justify-start"><Icons.Add className="w-4 h-4 mr-2" />Create a new one</Button>
        </div>
    )
}
