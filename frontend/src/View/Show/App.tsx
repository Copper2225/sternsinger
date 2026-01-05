import React, { useEffect, useMemo, useState } from "react";
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

    const deactivates = useMemo(() => {
        const deacts = [];
        const searchParams = new URLSearchParams(window.location.search);
        if (searchParams.get("summe")) {
            deacts.push(0);
        }
        if (searchParams.get("progress")) {
            deacts.push(1);
        }
        if (searchParams.get("status")) {
            deacts.push(2);
        }
        return deacts;
    }, []);

    const hideLogo = useMemo(() => {
        const searchParams = new URLSearchParams(window.location.search);
        return (searchParams.has("logo"));
    }, []);

    useEffect(() => {
        if (deactivates.length < 2) {
            const interval = setInterval(() => {
                setLeavingIndex(viewIndex);
                setTimeout(() => {
                    setViewIndex(
                        (prevState) => (prevState + 1) % (3 - deactivates.length),
                    );
                    setLeavingIndex(-1);
                }, 1000);
            }, 10000);

            return () => clearInterval(interval);
        }
    }, [deactivates.length, viewIndex]);

    useEffect(() => {
        fetch(`${backendURL}/districts`)
            .then((response) => response.json())
            .then((data) => setDistricts(data || []))
            .catch((error) =>
                console.error("Error fetching districts:", error),
            );

        setDistricts(loadDistricts);

        let ws: WebSocket | null = null;
        let reconnectTimeout: ReturnType<typeof setTimeout>;
        let heartbeatInterval: ReturnType<typeof setInterval>;

        const connect = () => {
            ws = new WebSocket(`${backendURL.replace(/^http/, "ws")}`);

            ws.onopen = () => {
                console.log("WebSocket connected");
                heartbeatInterval = setInterval(() => {
                    if (ws?.readyState === WebSocket.OPEN) {
                        ws.send(JSON.stringify({ type: "ping" }));
                    }
                }, 30000); // 30 seconds
            };

            ws.onmessage = (event) => {
                const message = JSON.parse(event.data);
                if (message.type === "districtUpdate") {
                    setDistricts(message.districtValues);
                }
            };

            ws.onclose = () => {
                console.log("WebSocket disconnected. Reconnecting in 5s...");
                clearInterval(heartbeatInterval);
                reconnectTimeout = setTimeout(connect, 5000);
            };

            ws.onerror = (error) => {
                console.error("WebSocket error:", error);
                ws?.close();
            };
        };

        connect();

        return () => {
            ws?.close();
            clearTimeout(reconnectTimeout);
            clearInterval(heartbeatInterval);
        };
    }, [backendURL, loadDistricts, setDistricts]);

    return (
        <div
            style={{
                position: "relative",
                overflow: "hidden",
                height: "100svh",
            }}
        >
            {!deactivates.includes(0) && (
                <div
                    className={`donation-wrapper page-wrapper ${viewIndex === 0 ? "page-active" : ""} ${leavingIndex === 0 ? "page-transition-exit" : ""} ${viewIndex === 0 ? "page-transition-enter" : ""}`}
                >
                    <DonationSum values={districts.map((e) => e.money ?? 0)} />
                </div>
            )}

            {!deactivates.includes(1) && (
                <div
                    className={`page-wrapper ${viewIndex === 1 - deactivates.filter((e) => e < 1).length ? "page-active" : ""} ${leavingIndex === 1 - deactivates.filter((e) => e < 1).length ? "page-transition-exit" : ""} ${viewIndex === 1 - deactivates.filter((e) => e < 1).length ? "page-transition-enter" : ""}`}
                >
                    <Progress districts={districts} />
                </div>
            )}

            {!deactivates.includes(2) && (
                <div
                    className={`page-wrapper ${viewIndex === 2 - deactivates.filter((e) => e < 2).length ? "page-active" : ""} ${leavingIndex === 2 - deactivates.filter((e) => e < 2).length ? "page-transition-exit" : ""} ${viewIndex === 2 - deactivates.filter((e) => e < 2).length ? "page-transition-enter" : ""}`}
                >
                    <DistrictStatus districts={districts} />
                </div>
            )}

            {!hideLogo && <img src={bgImage} alt="Background" />}
        </div>
    );
};

export default App;
