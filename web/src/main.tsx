import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { NuiProvider } from "fivem-nui-react-lib";
import { DataProvider } from './hooks/use-data.tsx';
import { RecoilRoot } from 'recoil';
import { isInBrowser } from './lib/utils.ts';
import { ThreeComponent } from './components/gizmo/ThreeComponent.tsx';

if (isInBrowser()) {
    const root = document.getElementById('root')
    // https://i.imgur.com/iPTAdYV.png - Night time img
    root!.style.backgroundImage = 'url("https://i.imgur.com/vDGEfYg.jpeg")'
    root!.style.backgroundSize = 'cover'
    root!.style.backgroundRepeat = 'no-repeat'
    root!.style.backgroundPosition = 'center'
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <RecoilRoot>
            <NuiProvider resource="17mov_DevTool">
                <DataProvider>
                    <App />
                    <div className='w-screen h-screen absolute inset-0'>
                        <ThreeComponent />
                    </div>
                </DataProvider>
            </NuiProvider>
        </RecoilRoot>
    </React.StrictMode>,
)
