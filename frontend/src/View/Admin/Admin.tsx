import React, { useCallback, useEffect } from "react";
import { useRecoilState } from "recoil";
import { District, districtsState } from "src/requests/adminStore";
import DistrictLine from "src/View/Admin/DistrictLine";
import { useLoadDistricts } from "src/requests/useLoadDistricts";
import ImportButton from "src/View/Admin/ImportButton";
import ExportButton from "src/View/Admin/ExportButton";

const Admin: React.FC = () => {
    const loadDistricts = useLoadDistricts();
    const [districts, setDistricts] = useRecoilState(districtsState);
    const backendURL = import.meta.env.VITE_BACKEND_URL;

    const handleOverwrite = useCallback(
        (values: District[]) => {
            fetch(`${backendURL}/districts`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ value: values }),
            })
                .then((response) => response.json())
                .then((data) => console.log(`Updated districts`, data))
                .catch((error) =>
                    console.error("Error updating district:", error),
                );
            setDistricts(values);
        },
        [backendURL, setDistricts],
    );

    useEffect(() => {
        fetch(`${backendURL}/districts`)
            .then((response) => response.json())
            .then((data) => {
                if (data == null) {
                    handleOverwrite(loadDistricts());
                } else {
                    setDistricts(data);
                }
            })
            .catch((error) =>
                console.error("Error fetching districts:", error),
            );
    }, [backendURL, handleOverwrite, loadDistricts, setDistricts]);

    const handleSubmit = useCallback(
        (value: District, index: number) => {
            fetch(`${backendURL}/district`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ index, value }),
            })
                .then((response) => response.json())
                .then((data) =>
                    console.log(`Updated district ${index + 1}`, data),
                )
                .catch((error) =>
                    console.error("Error updating district:", error),
                );

            setDistricts((prevValues) => {
                const newValues = [...prevValues];
                newValues[index] = value;
                return newValues;
            });
        },
        [backendURL, setDistricts],
    );

    return (
        <div style={{ paddingLeft: 30 }}>
            <h1>Admin Page</h1>
            <div style={{ display: "flex", gap: 10 }}>
                <ImportButton setState={handleOverwrite} />
                <ExportButton values={districts} name={"districts"} />
            </div>
            <table style={{ marginTop: "20px" }}>
                <tbody>
                    {districts.map((district, index) => (
                        <DistrictLine
                            key={index}
                            district={district}
                            handleSubmit={handleSubmit}
                            index={index}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Admin;
