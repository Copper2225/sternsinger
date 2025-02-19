import React, {useCallback, useEffect} from 'react';
import { useRecoilState } from 'recoil';
import {District, districtsState} from "@/requests/adminStore";
import DistrictLine from "@/View/Admin/DistrictLine";
import {useLoadDistricts} from "@/requests/useLoadDistricts";
import ImportButton from "@/View/Admin/ImportButton";
import ExportButton from "@/View/Admin/ExportButton";

const Admin: React.FC = () => {
    const loadDistricts = useLoadDistricts();
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
        setDistricts(loadDistricts);
    }, []);

    const handleSubmit = useCallback((newVal: number | '', index: number) => {
        fetch(`${backendURL}/district`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ index, value: newVal == '' ? null : newVal }),
        })
            .then((response) => response.json())
            .then((data) => console.log(`Updated district ${index + 1}`, data))
            .catch((error) => console.error('Error updating district:', error));

        setDistricts((prevValues) => {
            const newValues = [...prevValues];
            newValues[index] = { ...newValues[index], money: newVal == '' ? undefined : newVal };
            return newValues;
        });
    }, []);

    const handleOverwrite = useCallback((values: any) => {
        const vals = values.map((b: District) => b.money);
        fetch(`${backendURL}/districts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ value: vals }),
        })
            .then((response) => response.json())
            .then((data) => console.log(`Updated districts`, data))
            .catch((error) => console.error('Error updating district:', error));
        setDistricts(values)
    }, []);

    return (
        <div style={{paddingLeft: 30}}>
            <h1>Admin Page</h1>
            <div style={{display: "flex", gap: 10}}>
                <ImportButton setState={handleOverwrite} />
                <ExportButton values={districts} name={"districts"} />
            </div>
            <table style={{marginTop: "20px"}}>
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
