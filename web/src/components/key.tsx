import { cn } from "@/lib/utils";

export default function Key({ letter, functional }: { letter: string, functional?: boolean }) {
    return (
        <div className={cn('w-5 h-5 shadow-lg border rounded-sm bg-gray-200 flex items-center justify-center', { 'w-max': functional })}>
            <span className={cn("text-xs font-semibold text-black", { 'px-2': functional })}>{letter}</span>
        </div>
    )
}
