import { isInBrowser } from './utils';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface DebugEvent<T = any> {
    method: string;
    data: T;
}

/**
 * Emulates dispatching an event using SendNuiMessage in the lua scripts.
 * This is used when developing in browser
 *
 * @param events - The event you want to cover
 * @param timer - How long until it should trigger (ms)
 */
export const debugData = <P>(events: DebugEvent<P>[], timer = 1000): void => {
    if (process.env.NODE_ENV === 'development' && isInBrowser()) {
        for (const event of events) {
            setTimeout(() => {
                window.dispatchEvent(
                    new MessageEvent('message', {
                        data: {
                            app: '17mov_DevTool',
                            method: event.method,
                            data: event.data,
                        },
                    })
                );
            }, timer);
        }
    }
};
