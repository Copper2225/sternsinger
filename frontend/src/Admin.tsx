import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { dorfBezirkeState } from 'frontend/src/adminStore';

const Admin: React.FC = () => {
    const [dorfBezirke] = useRecoilState(dorfBezirkeState); // Number of districts
    const [values, setValues] = useState<number[]>([]); // District values
    const backendURL = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        // Fetch initial district values
        fetch(`${backendURL}/districts`)
            .then((response) => response.json())
            .then((data) => setValues(data || []))
            .catch((error) => console.error('Error fetching districts:', error));
    }, []);

    const handleSubmit = (value: number, index: number) => {
        fetch(`${backendURL}/districts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ index, value }),
        })
            .then((response) => response.json())
            .then((data) => console.log(`Updated district ${index + 1}`, data))
            .catch((error) => console.error('Error updating district:', error));
    };

    const handleInputChange = (index: number, newValue: string) => {
        const numericValue = parseFloat(newValue) || 0; // Ensure numeric input
        setValues((prevValues) => {
            const updatedValues = [...prevValues];
            updatedValues[index] = numericValue;
            return updatedValues;
        });
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (event.key === 'Enter') {
            handleSubmit(values[index] || 0, index);
        }
    };

    return (
        <div>
            <h1>Admin Page</h1>
            <div
                style={{
                    display: 'grid',
                    gap: '10px',
                    gridTemplateColumns: 'auto 1fr',
                    alignItems: 'center',
                    maxWidth: '50%',
                }}
            >
                {Array.from({ length: dorfBezirke }, (_, index) => (
                    <React.Fragment key={index}>
                        <label>Bezirk {index + 1} (€):</label>
                        <input
                            type="number"
                            value={values[index] || 0}
                            onChange={(e) => handleInputChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                        />
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default Admin;
