import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const App: React.FC = () => {
    const [districtValues, setDistrictValues] = useState<number[]>([]);

    useEffect(() => {
        // Fetch district values
        fetch('http://localhost:3000/districts')
            .then((response) => response.json())
            .then((data) => setDistrictValues(data || []))
            .catch((error) => console.error('Error fetching districts:', error));

        // WebSocket connection
        const ws = new WebSocket('ws://localhost:3000');
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
