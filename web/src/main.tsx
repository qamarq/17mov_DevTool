import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { NuiProvider } from "fivem-nui-react-lib";
import { DataProvider } from './hooks/use-data.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <NuiProvider resource="17mov_DevTool">
            <DataProvider>
                <App />
            </DataProvider>
        </NuiProvider>
    </React.StrictMode>,
)
