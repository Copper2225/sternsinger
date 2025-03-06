import React, { useEffect, useState } from "react";
import bgImage from "src/assets/background.png";
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

    useEffect(() => {
        const intervall = setInterval(() => {
            setViewIndex((prevState) => (prevState + 1) % 2);
        }, 10000);

        return () => clearInterval(intervall);
    }, []);

    return (
        <div>
            {viewIndex === 0 ? (
                <DonationSum values={districts.map((e) => e.money ?? 0)} />
            ) : viewIndex === 1 ? (
                <Progress districts={districts} />
            ) : null}
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
