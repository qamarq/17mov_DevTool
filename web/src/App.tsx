import { useEffect, useState } from "react";
import Logo from "./assets/logo.svg";
import LogoOutline from "./assets/logo_outline.svg";
import { Icons } from './components/icons';
import NavigationButton from "./components/nav-btn";
import HomePage from "./pages/home";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster } from "sonner";
import PropPage from "./pages/prop";
import { container } from "./lib/framer";
import WorldPage from "./pages/world";
import InteriorPage from "./pages/interior";
import PedsPage from "./pages/peds";
import { cn, isInBrowser } from "./lib/utils";
import { useNuiEvent, useNuiRequest } from "fivem-nui-react-lib";
import { useData } from "./hooks/use-data";
import { Switch } from "./components/ui/switch";

const PAGES = [
    { icon: 'Home', label: 'Home', page: 'home' },
    { icon: 'Tools', label: 'Props tool', page: 'prop' },
    { icon: 'Globe', label: 'World editor', page: 'world' },
    { icon: 'Sofa', label: 'Interior debugger', page: 'interior'},
    { icon: 'Peds', label: 'Ped spawner', page: 'peds' },
] as const

function App() {
    const [currentPage, setCurrentPage] = useState('home');
    const [openedUI, setOpenedUI] = useState(isInBrowser());
    const [keepInput, setKeepInput] = useState(false);
    const { send } = useNuiRequest();
    const { setData, setInteriorData, setTimecyclesData } = useData();

    useNuiEvent('17mov_DevTool', 'toggleUI', (data: boolean)  => {
        setOpenedUI(data);
    })

    useNuiEvent('17mov_DevTool', 'refreshData', (data: IncomingData)  => setData(data))
    useNuiEvent('17mov_DevTool', 'refreshCoords', (data: { coords: IncomingData["coords"], heading: IncomingData["heading"] }) => setData(prev => {
        if (!prev) return prev;
        return { ...prev, coords: data.coords, heading: data.heading }
    }))

    useNuiEvent('17mov_DevTool', 'setIntData', (data: InteriorData) => {
        setInteriorData(data)
    })

    useNuiEvent('17mov_DevTool', 'setTimecycleList', (data: TimecyclesData[]) => {
        setTimecyclesData(data)
    })

    useEffect(() => {
        const down = (e: KeyboardEvent) => { if (e.key === "Escape") closeUI() }
     
        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    useEffect(() => {
        send('KeepInput', keepInput)
    }, [keepInput])

    const closeUI = () => {
        if (isInBrowser()) {
            return
        }

        setOpenedUI(false);
        send('CloseUI');
    }

    const onMouseEnter = () => {
        send('ToggleCameraRotation', false)
    }

    const onMouseLeave = () => {
        send('ToggleCameraRotation', true)
    }

    return (
        <div className={cn('h-screen w-screen py-10', { 'hidden': !openedUI })}>
            <div className='h-full mx-10'>
                <div className='bg-[#090A0E] max-w-[600px] h-full rounded-md relative overflow-hidden flex flex-col z-20' onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
                    <header className='flex items-center relative'>
                        <div className='h-64 w-64 bg-radient-circle-c from-[#FF1A35] from-0% to-transparent to-70% opacity-30 absolute -top-16 -left-16'></div>
                        <img src={Logo} className='w-24 h-24 -z-0' />
                        <img src={LogoOutline} className='absolute w-40 h-40 -top-8 -left-8 aspect-square' />
                        <div className='z-10'>
                            <h1 className='text-lg font-bold uppercase leading-none text-white'>17 movement</h1>
                            <h2 className='text-zinc-400 font-medium leading-tight text-sm'>Development Tools</h2>
                        </div>
                        <div className='grow'></div>
                        <div className='flex items-center justify-center gap-5 mr-4 text-zinc-400 z-10'>
                            <a href="#"><Icons.Globe className='w-5 h-5' /></a>
                            <a href="#"><Icons.Discord className='w-5 h-5' /></a>
                            <button onClick={closeUI}><Icons.LogOut className='w-5 h-5' /></button>
                        </div>
                        <div className='absolute bottom-0 inset-0 bg-gradient-to-b from-transparent to-[#090A0E] from-70%'></div>
                    </header>
                    <main className='bg-[#090A0E] w-full grow z-10 relative flex flex-col overflow-hidden'>
                        <div className="flex items-center justify-between mb-4">
                            <AnimatePresence>
                                <motion.div layout className="flex items-center gap-4 p-4">
                                    {PAGES.map((item, index) => (
                                        <NavigationButton key={index} icon={item.icon} page={item.page} label={item.label} setPage={setCurrentPage} active={currentPage === item.page} />
                                    ))}
                                </motion.div>
                            </AnimatePresence>

                            <div className="flex items-center gap-2 pr-4">
                                <p className="text-sm font-semibold">Keep Input</p>
                                <Switch checked={keepInput} onCheckedChange={setKeepInput} />
                            </div>
                        </div>
                        <>
                            {currentPage === 'home' && <motion.div variants={container} initial="hidden" animate="visible" className="text-white grow overflow-y-auto overflow-x-hidden"><HomePage /></motion.div>}
                            {currentPage === 'prop' && <motion.div variants={container} initial="hidden" animate="visible" className="text-white grow overflow-y-auto overflow-x-hidden"><PropPage /></motion.div>}
                            {currentPage === 'world' && <motion.div variants={container} initial="hidden" animate="visible" className="text-white grow overflow-y-auto overflow-x-hidden"><WorldPage /></motion.div>}
                            {currentPage === 'interior' && <motion.div variants={container} initial="hidden" animate="visible" className="text-white grow overflow-y-auto overflow-x-hidden"><InteriorPage /></motion.div>}
                            {currentPage === 'peds' && <motion.div variants={container} initial="hidden" animate="visible" className="text-white grow overflow-y-auto overflow-x-hidden"><PedsPage /></motion.div>}
                        </>
                    </main>
                </div>
            </div>
            <Toaster />
        </div>
    );
}

export default App;
