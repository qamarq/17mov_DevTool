import { BiSolidTrashAlt } from 'react-icons/bi';
import { FaDiscord } from 'react-icons/fa';
import { FiGlobe } from 'react-icons/fi';
import { GoHomeFill } from 'react-icons/go';
import { HiMiniWrenchScrewdriver } from 'react-icons/hi2';
import { IoMdEye, IoMdPin } from 'react-icons/io';
import { MdAccessTimeFilled, MdCancel, MdOutlineAddCircle, MdPets, MdSave } from 'react-icons/md';
import { PiCopySimple } from 'react-icons/pi';
import { RiEditFill, RiSofaFill } from 'react-icons/ri';
import { TbHexagon3D } from 'react-icons/tb';
// import { cn } from '@/lib/utils';

export type ValidIcon = keyof typeof Icons;

export const Icons = {
    // Logo: ({
    //     className,
    //     ...props
    // }: React.HTMLAttributes<HTMLHeadingElement>) => (
    //     <h1
    //         className={cn('text-xl leading-none font-cal', className)}
    //         {...props}>
    //         hacker
    //         <span className="text-[#3cff87] dark:text-logo font-logo">;</span>um
    //     </h1>
    // ),
    Discord: FaDiscord,
    Globe: FiGlobe,
    Home: GoHomeFill,
    Tools: HiMiniWrenchScrewdriver,
    Sofa: RiSofaFill,
    Peds: MdPets,
    MapPin: IoMdPin,
    Clock: MdAccessTimeFilled,
    Copy: PiCopySimple,
    Gizmo: TbHexagon3D,
    Add: MdOutlineAddCircle,
    Eye: IoMdEye,
    Edit: RiEditFill,
    Trash: BiSolidTrashAlt,
    Save: MdSave,
    Cancel: MdCancel
};
