import { AccordionLayout, AccordionTitle } from "@/components/accordion-layout";
import CopyCode from "@/components/copy-code";
import { Icons } from "@/components/icons";
import { Switch } from "@/components/ui/switch";
import { useData } from "@/hooks/use-data";
import { item } from "@/lib/framer";
import { useNuiCallback, useNuiRequest } from "fivem-nui-react-lib";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button";

export default function InteriorPage() {
    const { send } = useNuiRequest();
    const { data, timecyclesData, interiorData } = useData();
    const [portalsChecked, setPortalsChecked] = useState({
        portalPoly: false,
        portalLines: false,
        portalCorners: false,
        portalInfos: false,
    });
    const [timecycle, setTimecycle] = useState<string | null>(null)
    const [timecycleList] = useState<TimecyclesData[]>(timecyclesData!)

    const handleSuccessReset = (resp: TimecyclesData | number) => {
        if (resp !== 0 && typeof resp !== "number") {
            const currentIndex = timecycleList.findIndex((option) => option.label === resp.label)
    
            if (currentIndex === -1) {
                setTimecycle(resp.value)
            } else {
                setTimecycle(timecycleList[currentIndex].value)
            }
        }
    }

    const [executeResetingTimecycle] = useNuiCallback("17mov_DevTool", "resetTimecycle", handleSuccessReset);

    const firstTimeRef = useRef(true);

    useEffect(() => {
        if (!data || !firstTimeRef.current) return;
        setPortalsChecked(data.portals)
        firstTimeRef.current = false
    }, [data])

    useEffect(() => {
        if (!interiorData) return;

        const data = {
            portalPoly: portalsChecked.portalPoly,
            portalLines: portalsChecked.portalLines,
            portalCorners: portalsChecked.portalCorners,
            portalInfos: portalsChecked.portalInfos,
        };

        send('setPortals', data);
    })



    // timecycles
    const handlePrevClick = () => {
        const currentIndex = timecycleList.findIndex((option) => option.value === timecycle)
        const prevIndex = currentIndex === 0 ? timecycleList.length - 1 : currentIndex - 1
        setTimecycle(timecycleList[prevIndex].value)
    }
    
    const handleNextClick = () => {
        const currentIndex = timecycleList.findIndex((option) => option.value === timecycle)
        const nextIndex = (currentIndex + 1) % timecycleList.length
        setTimecycle(timecycleList[nextIndex].value)
    }
    
    const handleResetClick = () => {
        if (interiorData) executeResetingTimecycle({ roomId: interiorData.currentRoom?.index })
    }
    
    useEffect(() => {
        if (timecycle! && interiorData!) send('setTimecycle', { value: timecycle, roomId: interiorData.currentRoom?.index })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timecycle])

    return (
        <div className="flex flex-col h-full">
            <div className="bg-zinc-900 px-4 py-4">
                <motion.div variants={item} className='flex items-center gap-5'>
                    <Icons.Sofa className='w-5 h-5 text-logo' />
                    <span className='font-semibold text-sm text-zinc-100'>Interior debugger</span>
                </motion.div>
            </div>
            <div className="grow flex flex-col">
                <div className='grow flex flex-col px-4'>
                    {(interiorData && interiorData.interiorId > 0) ? (
                        <>
                            <AccordionLayout>
                                <AccordionTitle>Current interior ID</AccordionTitle>
                                <CopyCode value={interiorData.interiorId} />
                            </AccordionLayout>
                            <AccordionLayout>
                                <AccordionTitle>Current room ID</AccordionTitle>
                                <CopyCode value={`${interiorData.currentRoom?.index} - ${interiorData.currentRoom?.name}`} className="w-max min-w-max" />
                            </AccordionLayout>

                            <p className="mt-10 mb-4 text-sm font-semibold">Portals Debbuging</p>
                            <div className="flex flex-col gap-4">
                                <AccordionLayout className="min-h-0">
                                    <AccordionTitle>Infos</AccordionTitle>
                                    <Switch 
                                        checked={portalsChecked.portalInfos}
                                        onCheckedChange={(checked) => setPortalsChecked({ ...portalsChecked, portalInfos: checked })}
                                    />
                                </AccordionLayout>
                                <AccordionLayout className="min-h-0">
                                    <AccordionTitle>Fill</AccordionTitle>
                                    <Switch 
                                        checked={portalsChecked.portalPoly}
                                        onCheckedChange={(checked) => setPortalsChecked({ ...portalsChecked, portalPoly: checked })}
                                    />
                                </AccordionLayout>
                                <AccordionLayout className="min-h-0">
                                    <AccordionTitle>Outline</AccordionTitle>
                                    <Switch
                                        checked={portalsChecked.portalLines}
                                        onCheckedChange={(checked) => setPortalsChecked({ ...portalsChecked, portalLines: checked })}
                                    />
                                </AccordionLayout>
                                <AccordionLayout className="min-h-0">
                                    <AccordionTitle>Corners</AccordionTitle>
                                    <Switch 
                                        checked={portalsChecked.portalCorners}
                                        onCheckedChange={(checked) => setPortalsChecked({ ...portalsChecked, portalCorners: checked })}
                                    />
                                </AccordionLayout>
                            </div>

                            <p className="mt-10 mb-4 text-sm font-semibold">Room Timecycle</p>
                            <div className="flex items-center gap-2">
                                <Select value={timecycle || ""} onValueChange={setTimecycle}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a timecycle" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {timecyclesData?.map((item, index) => (
                                                <SelectItem key={index} value={item.value}>{item.label}</SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <Button size={"icon"} onClick={handlePrevClick} className="min-w-10"><Icons.Left className="w-4 h-4" /></Button>
                                <Button size={"icon"} onClick={handleNextClick} className="min-w-10"><Icons.Right className="w-4 h-4" /></Button>
                                <Button size={"icon"} onClick={handleResetClick} className="min-w-10"><Icons.Cancel className="w-4 h-4" /></Button>
                            </div>
                        </>
                    ) : (
                        <p className="w-full text-center text-rose-500 font-semibold text-lg mt-2">No interior has been detected!</p>
                    )}
                </div>
                {/* <Button motionBtn className="rounded-none h-14 justify-start"><Icons.Save className="w-4 h-4 mr-2" />Save changes</Button> */}
            </div>
        </div>
    )
}
