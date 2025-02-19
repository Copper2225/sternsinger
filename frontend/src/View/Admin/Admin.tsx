import React, {useCallback, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import {bauernschaftenState, District, districtsState, dorfBezirkeState} from "@/adminStore";
import DistrictLine from "@/View/Admin/DistrictLine";

const Admin: React.FC = () => {
    const [dorfBezirke] = useRecoilState(dorfBezirkeState);
    const [bauernschaften] = useRecoilState(bauernschaftenState);
    const [districts, setDistricts] = useRecoilState(districtsState);
    const backendURL = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        fetch(`${backendURL}/districts`)
            .then((response) => response.json())
            .then((data) => {
                setDistricts((prevDistricts) => {
                    return prevDistricts.map((district, index) => ({
                        ...district,
                        money: data[index]
                    }));
                });
            })
            .catch((error) => console.error('Error fetching districts:', error));
    }, [backendURL]);

    useEffect(() => {
        const newDistricts = Array.from({ length: dorfBezirke }, (_, index) => ({
            name: `Bezirk ${index + 1}`,
            counting: true,
        }));

        const newDistricts2 = bauernschaften.flatMap((b) => {
            return Array.from({ length: b.amount }, (_, index) => ({
                name: `${b.name}${b.amount > 1 ? ` ${index + 1}` : ""}`,
                counting: true,
            }));
        });

        setDistricts([...newDistricts, ...newDistricts2]);
    }, [dorfBezirke, bauernschaften]);

    const handleSubmit = useCallback((value: number, index: number) => {
        fetch(`${backendURL}/districts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ index, value }),
        })
            .then((response) => response.json())
            .then((data) => console.log(`Updated district ${index + 1}`, data))
            .catch((error) => console.error('Error updating district:', error));

        setDistricts((prevValues) => {
            const newValues = [...prevValues];
            newValues[index] = { ...newValues[index], money: value };
            return newValues;
        });
    }, []);


    return (
        <div>
            <h1>Admin Page</h1>
            <table style={{maxWidth: "40%", marginTop: "20px"}}>
                <tbody>
                {districts.map((district, index) => (
                    <DistrictLine key={index} name={district.name} value={district.money ?? ''}
                                  handleSubmit={handleSubmit} index={index}/>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default Admin;
