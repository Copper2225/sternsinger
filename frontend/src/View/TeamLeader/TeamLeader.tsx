import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import {
    District,
    districtsState,
    DistrictStatusText,
} from "src/requests/adminStore";
import { useLoadDistricts } from "src/requests/useLoadDistricts";
import { Button, FormSelect } from "react-bootstrap";
import "./teamLeader.css";
import StatusIcon from "src/View/Show/DIstrictStatus/StatusIcon";

const TeamLeader = () => {
    const loadDistricts = useLoadDistricts();
    const [districts, setDistricts] = useRecoilState(districtsState);
    const [selectedDistrict, setSelectedDistrict] = useState<District>();
    const [selectedIndex, setSelectedIndex] = useState<number>();
    const backendURL = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        fetch(`${backendURL}/districts`)
            .then((response) => response.json())
            .then((data) => {
                setDistricts(data);
            })
            .catch((error) =>
                console.error("Error fetching districts:", error),
            );
    }, [backendURL, loadDistricts, setDistricts]);

    const handleSubmit = useCallback(
        (value: DistrictStatusText) => {
            console.log(value);
            if (selectedIndex !== undefined && selectedDistrict) {
                fetch(`${backendURL}/district`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ index: selectedIndex, value: {...selectedDistrict, status: value} }),
                })
                    .then((response) => response.json())
                    .then((data) =>
                        console.log(`Updated district ${selectedIndex + 1}`, data),
                    )
                    .catch((error) =>
                        console.error("Error updating district:", error),
                    );

                setDistricts((prevValues) => {
                    const newValues = [...prevValues];
                    const updatedDistrict = {...selectedDistrict, status: value };
                    newValues[selectedIndex] = updatedDistrict;

                    setSelectedDistrict(updatedDistrict);

                    return newValues;
                });


            }
        },
        [backendURL, selectedDistrict, selectedIndex, setDistricts],
    );

    const handleChangeDistrict = useCallback(
        (event: ChangeEvent<HTMLSelectElement>) => {
            const index = Number(event.currentTarget.value);
            if (!isNaN(index)) {
                const dist = districts[index];
                if (dist.status === undefined) {
                    setSelectedDistrict({
                        ...dist,
                        status: DistrictStatusText.notPlanned,
                    });
                } else {
                    setSelectedDistrict(dist)
                }
                setSelectedIndex(index)
            }
        },
        [districts],
    );

    return (
        <div className={"h-100 d-flex flex-column p-2"}>
            <FormSelect className={"fs-2"} name={"districtIndex"} onChange={handleChangeDistrict}>
                <option value={-1}></option>
                {districts.map((district, index) => (
                    <option value={index} key={district.name}>
                        {district.name}
                    </option>
                ))}
            </FormSelect>
            <h3 className={"py-2"}>Status</h3>
            {selectedIndex !== undefined && <div className={"d-flex flex-column gap-3 flex-grow-1"}>
                {Object.values(DistrictStatusText).map((value) => {
                    return (
                        <Button
                            variant={
                                selectedDistrict?.status === value
                                    ? "secondary"
                                    : "primary"
                            }
                            className={"w-100 h-100"}
                            key={value}
                            onClick={() => handleSubmit(value)}
                        >
                            <StatusIcon
                                colored={false}
                                status={value}
                                size={"4x"}
                            />
                        </Button>
                    );
                })}
            </div>}
        </div>
    );
};

export default TeamLeader;
