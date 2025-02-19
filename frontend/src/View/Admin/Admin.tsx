import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import {dorfBezirkeState} from "@/adminStore";
import DistrictLine from "@/View/Admin/DistrictLine";

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

    console.log(values);

    const handleSubmit = (value: number, index: number) => {
        fetch(`${backendURL}/districts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ index, value }),
        })
            .then((response) => response.json())
            .then((data) => console.log(`Updated district ${index + 1}`, data))
            .catch((error) => console.error('Error updating district:', error));
        setValues((prevValues) => {
            const newValues = [...prevValues];
            newValues[index] = value;
            return newValues;
        });
    };

    return (
        <div>
            <h1>Admin Page</h1>
            <table style={{maxWidth: "40%", marginTop: "20px"}}>
                <tbody>
                {Array.from({length: dorfBezirke}, (_, index) => (
                    <DistrictLine key={index} name={"Bezirk " + (index + 1)} value={values[index] || ''}
                                  handleSubmit={handleSubmit} index={index}/>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default Admin;
