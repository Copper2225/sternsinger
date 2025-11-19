import React, { useEffect, useState } from "react";
import bgImage from "src/assets/background26.png";
import DonationSum from "src/View/Show/Donation/DonationSum";
import { useRecoilState } from "recoil";
import { districtsState } from "src/requests/adminStore";
import { useLoadDistricts } from "src/requests/useLoadDistricts";
import Progress from "src/View/Show/Progress/Progress";
import DistrictStatus from "src/View/Show/DIstrictStatus/DistrictStatus";

const App: React.FC = () => {
    const [districts, setDistricts] = useRecoilState(districtsState);
    const loadDistricts = useLoadDistricts();
    const backendURL = import.meta.env.VITE_BACKEND_URL; // Get the backend URL from env variable
    const [viewIndex, setViewIndex] = useState<number>(0);
    const [leavingIndex, setLeavingIndex] = useState<number>(-1);

    useEffect(() => {
        const interval = setInterval(() => {
            setLeavingIndex(viewIndex);
            setTimeout(() => {
                setViewIndex((prevState) => (prevState + 1) % 3);
                setLeavingIndex(-1);
            }, 1000);
        }, 10000);

        return () => clearInterval(interval);
    }, [viewIndex]);

    useEffect(() => {
        fetch(`${backendURL}/districts`)
            .then((response) => response.json())
            .then((data) => setDistricts(data || []))
            .catch((error) =>
                console.error("Error fetching districts:", error),
            );

        setDistricts(loadDistricts);

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
        <div
            style={{
                position: "relative",
                overflow: "hidden",
                height: "100vh",
            }}
        >
            <div
                className={`donation-wrapper page-wrapper ${viewIndex === 0 ? "page-active" : ""} ${leavingIndex === 0 ? "page-transition-exit" : ""} ${viewIndex === 0 ? "page-transition-enter" : ""}`}
            >
                <DonationSum values={districts.map((e) => e.money ?? 0)} />
            </div>

            <div
                className={`page-wrapper ${viewIndex === 1 ? "page-active" : ""} ${leavingIndex === 1 ? "page-transition-exit" : ""} ${viewIndex === 1 ? "page-transition-enter" : ""}`}
            >
                <Progress districts={districts} />
            </div>

            <div
                className={`page-wrapper ${viewIndex === 2 ? "page-active" : ""} ${leavingIndex === 2 ? "page-transition-exit" : ""} ${viewIndex === 2 ? "page-transition-enter" : ""}`}
            >
                <DistrictStatus districts={districts} />
            </div>

            <img
                src={bgImage}
                alt="Background"
            />
        </div>
    );
};

export default App;
