import { District, DistrictStatusText } from "src/requests/adminStore";
import {Button, Modal} from "react-bootstrap";
import StatusIcon from "src/View/Show/DIstrictStatus/StatusIcon";
import React, {Dispatch, SetStateAction, useCallback} from "react";

interface Props {
    district: District;
    index: number;
    setDistricts: Dispatch<SetStateAction<District[]>>;
    setSelectedDistrict: (district: District) => void;
    currentStatus: DistrictStatusText;
}

const StatusModal = ({
    district,
    index,
    setDistricts,
    setSelectedDistrict,
    currentStatus,
}: Props) => {
    const backendURL = import.meta.env.VITE_BACKEND_URL;

    const handleSubmit = useCallback(
        (value: DistrictStatusText) => {
            if (index !== undefined && district) {
                fetch(`${backendURL}/district`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        index: index,
                        value: { ...district, status: value },
                    }),
                })
                    .then((response) => response.json())
                    .then((data) =>
                        console.log(
                            `Updated district ${index + 1}`,
                            data,
                        ),
                    )
                    .catch((error) =>
                        console.error("Error updating district:", error),
                    );

                setDistricts((prevValues) => {
                    const newValues = [...prevValues];
                    const updatedDistrict = {
                        ...district,
                        status: value,
                    };
                    newValues[index] = updatedDistrict;

                    setSelectedDistrict(updatedDistrict);

                    return newValues;
                });
            }
        },
        [backendURL, district, index, setDistricts, setSelectedDistrict],
    );


    return (
        <Modal>
            <h3 className={"py-2"}>Status</h3>
            {index !== undefined && (
                <div className={"d-flex flex-column gap-3 flex-grow-1"}>
                    {Object.values(DistrictStatusText).map((value) => {
                        return (
                            <Button
                                variant={
                                    currentStatus === value
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
                                    size={"3x"}
                                />
                            </Button>
                        );
                    })}
                </div>
            )}
        </Modal>
    );
};

export default StatusModal;
