import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RecoilRoot } from "recoil";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import App from "src/View/Show/App";
import Admin from "src/View/Admin/Admin";
import Help from "src/View/Help/Help";
import TeamLeader from "src/View/TeamLeader/TeamLeader";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <RecoilRoot>
            <BrowserRouter>
                <Routes>
                    <Route path="/show" element={<App />} />
                    <Route path="/" element={<TeamLeader />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/help" element={<Help />} />
                </Routes>
            </BrowserRouter>
        </RecoilRoot>
    </React.StrictMode>,
);
