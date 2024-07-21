import { AccordionLayout, AccordionTitle } from '@/components/accordion-layout';
import CopyCode from '@/components/copy-code';
import { Icons } from '@/components/icons';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { motion } from 'framer-motion';
import { item } from '@/lib/framer';
import { Input } from '@/components/ui/input';

export default function HomePage() {
    return (
        <Accordion
            type="multiple"
            className="w-full space-y-2"
            defaultValue={['coords', 'weather']}>
            <AccordionItem value="coords">
                <AccordionTrigger className='bg-zinc-900 px-4 py-4'>
                    <motion.div variants={item} className='flex items-center gap-5'>
                        <Icons.MapPin className='w-5 h-5 text-logo' />
                        <span className='font-semibold text-sm text-zinc-100'>Current coordinates</span>
                    </motion.div>
                </AccordionTrigger>
                <AccordionContent>
                    <div className='flex flex-col px-4'>
                        <AccordionLayout>
                            <AccordionTitle className='w-auto'>Coordinates</AccordionTitle>
                            <CopyCode value={"X: -803.717 Y: 176.49, Z: 72.841"} />
                        </AccordionLayout>
                        <AccordionLayout>
                            <AccordionTitle className='w-auto'>Heading</AccordionTitle>
                            <CopyCode value={"213.635"} />
                        </AccordionLayout>
                    </div>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="weather">
                <AccordionTrigger className='bg-zinc-900 px-4 py-4'>
                    <motion.div variants={item} className='flex items-center gap-5'>
                        <Icons.Clock className='w-5 h-5 text-logo' />
                        <span className='font-semibold text-sm text-zinc-100'>Time and weathers configuration</span>
                    </motion.div>
                </AccordionTrigger>
                <AccordionContent>
                    <div className='flex flex-col px-4'>
                        <AccordionLayout>
                            <AccordionTitle>Set Time</AccordionTitle>
                            <div className='grid grid-cols-4 gap-2 w-full'>
                                <Input defaultValue={"13"} type='text' className='text-center' />
                                <Input defaultValue={"06"} type='text' className='text-center' />
                                <Button className='col-span-2 rounded-sm' motionBtn>Apply</Button>
                            </div>
                        </AccordionLayout>
                        <AccordionLayout>
                            <AccordionTitle>Weather</AccordionTitle>
                            <div className='grid grid-cols-4 gap-2 w-full'>
                                <Select defaultValue='clear'>
                                    <SelectTrigger className="col-span-2">
                                        <SelectValue placeholder="Select a weather" />
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
                                <Button className='col-span-2 rounded-sm' motionBtn>Apply</Button>
                            </div>
                        </AccordionLayout>
                        <AccordionLayout>
                            <AccordionTitle>Freeze time</AccordionTitle>
                            <Switch />  
                        </AccordionLayout>
                        <AccordionLayout>
                            <AccordionTitle>Freeze weather status</AccordionTitle>
                            <Switch defaultChecked />
                        </AccordionLayout>
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}
