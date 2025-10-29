import React, { useEffect, useState } from "react";
import bgImage from "src/assets/background26.png";
import DonationSum from "src/View/Show/DonationSum";
import { useRecoilState } from "recoil";
import { districtsState } from "src/requests/adminStore";
import { useLoadDistricts } from "src/requests/useLoadDistricts";
import Progress from "src/View/Show/Progress";

const App: React.FC = () => {
    const [districts, setDistricts] = useRecoilState(districtsState);
    const loadDistricts = useLoadDistricts();
    const backendURL = import.meta.env.VITE_BACKEND_URL; // Get the backend URL from env variable
    const [viewIndex, setViewIndex] = useState<number>(0);
    const [leavingIndex, setLeavingIndex] = useState<number>(-1);

    // This effect handles the view change and animation
    useEffect(() => {
        const interval = setInterval(() => {
            setLeavingIndex(viewIndex); // Mark the current view as 'leaving'
            setTimeout(() => {
                setViewIndex(prevState => (prevState + 1) % 2);
                setLeavingIndex(-1); // Reset leaving state after animation
            }, 1000); // This delay should match your CSS animation duration
        }, 10000); // 10-second interval

        return () => clearInterval(interval);
    }, [viewIndex]); // Add viewIndex to dependencies to ensure effect re-runs

    useEffect(() => {
        // Fetch district values
        fetch(`${backendURL}/districts`)
            .then((response) => response.json())
            .then((data) => setDistricts(data || []))
            .catch((error) =>
                console.error("Error fetching districts:", error),
            );

        setDistricts(loadDistricts);

        // WebSocket connection
        const ws = new WebSocket(`${backendURL.replace(/^http/, "ws")}`);
        ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.type === "districtUpdate") {
                setDistricts(message.districtValues);
            }
        };

        return () => {
            ws.close();
        };
    }, [backendURL, loadDistricts, setDistricts]);

    return (
        <div style={{ position: 'relative', overflow: 'hidden', height: '100vh' }}>
            <div className={`donation-wrapper page-wrapper ${viewIndex === 0 ? 'page-active' : ''} ${leavingIndex === 0 ? 'page-transition-exit' : ''} ${viewIndex === 0 ? 'page-transition-enter' : ''}`}>
                <DonationSum values={districts.map(e => e.money ?? 0)} />
            </div>

            <div className={`page-wrapper ${viewIndex === 1 ? 'page-active' : ''} ${leavingIndex === 1 ? 'page-transition-exit' : ''} ${viewIndex === 1 ? 'page-transition-enter' : ''}`}>
                <Progress districts={districts} />
            </div>

            <a href="/admin">
                <img
                    style={{ position: "absolute", bottom: 15, right: 15 }}
                    src={bgImage}
                    alt="Background"
                />
            </a>
        </div>
    );
};

export default App;
