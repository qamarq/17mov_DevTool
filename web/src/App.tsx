import { useState } from "react";
import Logo from "./assets/logo.svg";
import LogoOutline from "./assets/logo_outline.svg";
import { Icons } from './components/icons';
import NavigationButton from "./components/nav-btn";
import HomePage from "./pages/home";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster } from "sonner";
import PropsPage from "./pages/props";
import { container } from "./lib/framer";
import WorldPage from "./pages/world";
import InteriorPage from "./pages/interior";
import PedsPage from "./pages/peds";

const PAGES = [
    { icon: 'Home', label: 'Home', page: 'home' },
    { icon: 'Tools', label: 'Props tool', page: 'props' },
    { icon: 'Globe', label: 'World editor', page: 'world' },
    { icon: 'Sofa', label: 'Interior debugger', page: 'interior'},
    { icon: 'Peds', label: 'Ped spawner', page: 'peds' },
] as const

function App() {
    const [currentPage, setCurrentPage] = useState('home');

    return (
        <div className='h-screen w-screen py-10'>
            <div className='h-full mx-10'>
                <div className='bg-[#090A0E] max-w-[600px] h-full rounded-md relative overflow-hidden flex flex-col'>
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
                        </div>
                        <div className='absolute bottom-0 inset-0 bg-gradient-to-b from-transparent to-[#090A0E] from-70%'></div>
                    </header>
                    <main className='bg-[#090A0E] w-full grow z-10 relative flex flex-col overflow-hidden'>
                        <AnimatePresence>
                            <motion.div layout className="flex items-center gap-4 mb-4 p-4">
                                {PAGES.map((item, index) => (
                                    <NavigationButton key={index} icon={item.icon} page={item.page} label={item.label} setPage={setCurrentPage} active={currentPage === item.page} />
                                ))}
                            </motion.div>
                        </AnimatePresence>
                        <>
                            {currentPage === 'home' && <motion.div variants={container} initial="hidden" animate="visible" className="text-white grow overflow-y-auto overflow-x-hidden"><HomePage /></motion.div>}
                            {currentPage === 'props' && <motion.div variants={container} initial="hidden" animate="visible" className="text-white grow overflow-y-auto overflow-x-hidden"><PropsPage /></motion.div>}
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
