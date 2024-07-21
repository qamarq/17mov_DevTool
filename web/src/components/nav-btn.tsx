import React from 'react'
import { Icons, ValidIcon } from './icons'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

export default function NavigationButton(props: {
    icon: ValidIcon,
    label: string,
    active?: boolean,
    page?: string,
    setPage?: React.Dispatch<React.SetStateAction<string>>
}) {
    const Icon = Icons[props.icon]

    const handleClick = () => {
        if (!props.setPage || !props.page) return
        props.setPage(props.page)
    }

    return (
        <motion.button whileTap={{ scale: 0.9 }} className={"w-10 h-10 rounded-sm flex items-center justify-center relative"} onClick={handleClick}>
            <Icon className={cn('transition-all', { 'text-zinc-700 w-5 h-5': !props.active, 'text-logo w-5 h-5': props.active})} />
            {props.active && <motion.div layoutId='navigation_bg' className="absolute inset-0 bg-zinc-900 -z-10 rounded-sm"></motion.div>}
        </motion.button>
    )
}
