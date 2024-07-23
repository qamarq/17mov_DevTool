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
import { useData } from '@/hooks/use-data';
import { useNuiRequest } from 'fivem-nui-react-lib';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function HomePage() {
    const { data } = useData();
    const { send } = useNuiRequest()
    
    const [time, setTime] = useState({ hour: '13', minute: '06' });
    const [weather, setWeather] = useState('clear');

    useEffect(() => {
        if (!data) return;
        setTime(data.time);
        setWeather(data.weather);
    }, [data])

    const setNewTime = () => {
        send('setTime', { hour: time.hour, minute: time.minute });
        toast.success('Setting time to ' + time.hour + ':' + time.minute);
    }

    const setNewWeather = () => {
        send('setWeather', { weather: weather });
        toast.success('Setting weather to ' + weather);
    }

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
                            <CopyCode label={`X: ${data?.coords.x.toFixed(2)}, Y: ${data?.coords.y.toFixed(2)}, Z: ${data?.coords.z.toFixed(2)}`} value={JSON.stringify(data?.coords)} />
                        </AccordionLayout>
                        <AccordionLayout>
                            <AccordionTitle className='w-auto'>Heading</AccordionTitle>
                            <CopyCode value={`${data?.heading.toFixed(3)}`} />
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
                                <Input 
                                    value={time.hour} 
                                    onChange={(e) => setTime(prev => {
                                        return { ...prev, hour: e.target.value }
                                    })}
                                    type='text' 
                                    className='text-center' 
                                />
                                <Input 
                                    value={time.minute} 
                                    onChange={(e) => setTime(prev => {
                                        return { ...prev, minute: e.target.value }
                                    })} 
                                    type='text' 
                                    className='text-center' 
                                />
                                <Button className='col-span-2 rounded-sm' motionBtn onClick={setNewTime}>Apply</Button>
                            </div>
                        </AccordionLayout>
                        <AccordionLayout>
                            <AccordionTitle>Weather</AccordionTitle>
                            <div className='grid grid-cols-4 gap-2 w-full'>
                                <Select value={weather} onValueChange={setWeather}>
                                    <SelectTrigger className="col-span-2">
                                        <SelectValue placeholder="Select a weather" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="CLEAR">CLEAR</SelectItem>
                                            <SelectItem value="EXTRASUNNY">EXTRASUNNY</SelectItem>
                                            <SelectItem value="CLOUDS">CLOUDS</SelectItem>
                                            <SelectItem value="OVERCAST">OVERCAST</SelectItem>
                                            <SelectItem value="RAIN">RAIN</SelectItem>
                                            <SelectItem value="CLEARING">CLEARING</SelectItem>
                                            <SelectItem value="THUNDER">THUNDER</SelectItem>
                                            <SelectItem value="SMOG">SMOG</SelectItem>
                                            <SelectItem value="FOGGY">FOGGY</SelectItem>
                                            <SelectItem value="XMAS">XMAS</SelectItem>
                                            <SelectItem value="SNOW">SNOW</SelectItem>
                                            <SelectItem value="SNOWLIGHT">SNOWLIGHT</SelectItem>
                                            <SelectItem value="BLIZZARD">BLIZZARD</SelectItem>
                                            <SelectItem value="HALLOWEEN">HALLOWEEN</SelectItem>
                                            <SelectItem value="NEUTRAL">NEUTRAL</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <Button className='col-span-2 rounded-sm' motionBtn onClick={setNewWeather}>Apply</Button>
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
