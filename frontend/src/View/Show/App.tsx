import React, { useEffect, useState } from 'react';
import bgImage from "@/assets/background.png";
import DonationSum from "@/View/Show/DonationSum";

const App: React.FC = () => {
    const [districtValues, setDistrictValues] = useState<number[]>([]);
    const backendURL = import.meta.env.VITE_BACKEND_URL; // Get the backend URL from env variable
    const [viewIndex, setViewIndex] = useState<number>(0);

    useEffect(() => {
        // Fetch district values
        fetch(`${backendURL}/districts`)
            .then((response) => response.json())
            .then((data) => setDistrictValues(data || []))
            .catch((error) => console.error('Error fetching districts:', error));

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

    useEffect(() => {
        const intervall = setInterval(() => {
            setViewIndex((prevState) => (prevState + 1) % 2)
        }, 10000);

        return () => clearInterval(intervall);
    }, []);

    const total = districtValues.reduce((sum, value) => sum + value, 0).toLocaleString('de', {
        style: "currency",
        currency: 'EUR'
    });

    return (
        <div>
            {
                viewIndex === 0 ? <DonationSum total={total}/> :
                viewIndex === 1 ? <div>Fortschritt</div> :
                null
            }
            <img
                style={{position: "absolute", bottom: 15, right: 15}}
                src={bgImage}
                alt="Background"
            />

        </div>
    );

};

export default App;
