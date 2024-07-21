import { toast } from "sonner";
import { Icons } from "./icons";
import { cn } from "@/lib/utils";

export default function CopyCode(props: { value: string | number, label?: string, className?: string }) {
    const handleCopy = () => {
        navigator.clipboard.writeText(props.value.toString())
        toast.success('Copied to clipboard')
    }

    return (
        <div className={cn("flex items-center gap-2 bg-white/5 px-2 py-1 rounded-sm", props.className)}>
            <code>{props.label || props.value}</code>
            <button className="text-zinc-500"><Icons.Copy className="w-4 h-4" onClick={handleCopy} /></button>
        </div>
    )
}
