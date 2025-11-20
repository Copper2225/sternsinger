import React, { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { District, districtsState } from "src/requests/adminStore";
import DistrictLine from "src/View/Admin/DistrictLine";
import { useLoadDistricts } from "src/requests/useLoadDistricts";
import ImportButton from "src/View/Admin/ImportButton";
import ExportButton from "src/View/Admin/ExportButton";
import { FormCheck } from "react-bootstrap";

const Admin: React.FC = () => {
    const loadDistricts = useLoadDistricts();
    const [districts, setDistricts] = useRecoilState(districtsState);
    const [showFrame, setShowFrame] = useState(false);
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

        const ws = new WebSocket(`${backendURL.replace(/^http/, "ws")}`);
        ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.type === "districtUpdate") {
                setDistricts(message.districtValues);
            }
        };

        return () => {
            ws.close();
        };
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

    const handleFrameChange = useCallback(() => {
        setShowFrame((prev) => !prev);
    }, []);

    return (
        <div className={"d-flex admin-div"} style={{ padding: 4 }}>
            {showFrame && (
                <div className={"frame-div p-2 align-content-center"}>
                    <iframe
                        style={{ aspectRatio: 16 / 9 }}
                        className={"border-2 border-black border"}
                        src={"/show"}
                    />
                </div>
            )}
            <div className={"w-100"}>
                <h1>Admin Page</h1>
                <div style={{ display: "flex", gap: 10 }}>
                    <ImportButton setState={handleOverwrite} />
                    <ExportButton values={districts} name={"districts"} />
                    <FormCheck
                        className={"text-center align-content-center"}
                        type={"switch"}
                        onChange={handleFrameChange}
                    />
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
        </div>
    );
};

export default Admin;
