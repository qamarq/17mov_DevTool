import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isInBrowser = (): boolean => !(window as any).invokeNative;

export const setClipboard = (value: string) => {
    const el = document.createElement("textarea");
    el.value = value;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
}
  
export const debugJson = (obj: any) => {
    console.log(JSON.stringify(obj, null, 2))
}