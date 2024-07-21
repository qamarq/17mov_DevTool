import { AccordionLayout, AccordionTitle } from "@/components/accordion-layout";
import CopyCode from "@/components/copy-code";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { item } from "@/lib/framer";
import { motion } from "framer-motion";

export default function InteriorPage() {
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
                    <AccordionLayout>
                        <AccordionTitle>Current interior ID</AccordionTitle>
                        <CopyCode value="v_garagem" />
                    </AccordionLayout>
                    <AccordionLayout>
                        <AccordionTitle>Current room ID</AccordionTitle>
                        <CopyCode value="v_michael_g_lounge" />
                    </AccordionLayout>
                    <AccordionLayout>
                        <AccordionTitle>Portals Debugging</AccordionTitle>
                        <Switch defaultChecked />
                    </AccordionLayout>
                </div>
                <Button motionBtn className="rounded-none h-14 justify-start"><Icons.Save className="w-4 h-4 mr-2" />Save changes</Button>
            </div>
        </div>
    )
}
