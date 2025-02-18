import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const App: React.FC = () => {
    const [districtValues, setDistrictValues] = useState<number[]>([]);
    const backendURL = import.meta.env.VITE_BACKEND_URL; // Get the backend URL from env variable

    console.log(backendURL);

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

    const total = districtValues.reduce((sum, value) => sum + value, 0);

    return (
        <div>
            <h1>Total Money (€): {total}</h1>
            <br />
            <Link to="/admin">Go to Admin Page</Link>
        </div>
    );
};

export default App;
