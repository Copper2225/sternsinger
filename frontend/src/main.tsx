import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from 'App';
import Admin from 'Admin';
import {RecoilRoot} from "recoil";

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <RecoilRoot>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/admin" element={<Admin />} />
            </Routes>
        </BrowserRouter>
        </RecoilRoot>
    </React.StrictMode>
);
