import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React from "react";

const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
    },
};

export function AccordionLayout({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <motion.div variants={item} className={cn('flex items-center justify-between gap-2 py-1 min-h-[60px]', className)}>
            {children}
        </motion.div>
    )
}

export function AccordionTitle({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <p className={cn('text-sm text-zinc-400 font-medium w-full', className)}>
            {children}
        </p>
    )
}