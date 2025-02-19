import React, {useEffect, useMemo, useState} from 'react';
import bgImage from "@/assets/background.png";
import DonationSum from "@/View/Show/DonationSum";
import {useRecoilState, useRecoilValue} from "recoil";
import {districtsState} from "@/requests/adminStore";
import {useLoadDistricts} from "@/requests/useLoadDistricts";
import Progress from "@/View/Show/Progress";

const App: React.FC = () => {
    const [districtValues, setDistrictValues] = useState<number[]>([]);
    const [districts, setDistricts] = useRecoilState(districtsState);
    const loadDistricts = useLoadDistricts();
    const backendURL = import.meta.env.VITE_BACKEND_URL; // Get the backend URL from env variable
    const [viewIndex, setViewIndex] = useState<number>(1);

    useEffect(() => {
        // Fetch district values
        fetch(`${backendURL}/districts`)
            .then((response) => response.json())
            .then((data) => setDistrictValues(data || []))
            .catch((error) => console.error('Error fetching districts:', error));

        setDistricts(loadDistricts);

        // WebSocket connection
        const ws = new WebSocket(`${backendURL.replace(/^http/, 'ws')}`);
        ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.type === 'districtUpdate') {
                setDistrictValues(message.districtValues);
            }
        };

        return () => {
            ws.close();
        };
    }, []);

    // useEffect(() => {
    //     const intervall = setInterval(() => {
    //         setViewIndex((prevState) => (prevState + 1) % 2)
    //     }, 10000);
    //
    //     return () => clearInterval(intervall);
    // }, []);

    return (
        <div>
            {
                viewIndex === 0 ? <DonationSum values={districtValues}/> :
                viewIndex === 1 ? <Progress values={districtValues} districts={districts}/> :
                null
            }
            <a href="/admin">
                <img
                    style={{position: "absolute", bottom: 15, right: 15}}
                    src={bgImage}
                    alt="Background"
                />
            </a>
        </div>
    );

};

export default App;
