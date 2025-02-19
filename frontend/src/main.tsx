import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {RecoilRoot} from "recoil";
import App from "@/View/Show/App";
import Admin from "@/View/Admin/Admin";

import "bootstrap/dist/css/bootstrap.min.css";
import './index.css';

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
