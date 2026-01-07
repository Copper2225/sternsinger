import { District, DistrictStatusText } from "src/requests/adminStore";
import {
    Button,
    Modal,
    ModalBody,
    ModalHeader,
    ModalTitle,
} from "react-bootstrap";
import StatusIcon from "src/View/Show/DIstrictStatus/StatusIcon";
import React, { Dispatch, SetStateAction, useCallback } from "react";

interface Props {
    district: District | undefined;
    index: number | undefined;
    setDistricts: Dispatch<SetStateAction<District[]>>;
    setSelectedDistrict: (district: District) => void;
    setShow: Dispatch<SetStateAction<boolean>>;
    show: boolean;
}

const StatusModal = ({
    district,
    index,
    setDistricts,
    setSelectedDistrict,
    show,
    setShow,
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
                    credentials: "include"
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
                    const updatedDistrict = {
                        ...district,
                        status: value,
                    };
                    newValues[index] = updatedDistrict;

                    setSelectedDistrict(updatedDistrict);

                    return newValues;
                });
            }
            setShow(false);
        },
        [
            backendURL,
            district,
            index,
            setDistricts,
            setSelectedDistrict,
            setShow,
        ],
    );

    return (
        <Modal show={show} onHide={() => setShow(false)} centered>
            <ModalHeader closeButton>
                <ModalTitle>Change Status</ModalTitle>
            </ModalHeader>
            <ModalBody>
                {index !== undefined && (
                    <div className={"d-flex flex-column gap-3 flex-grow-1"}>
                        {Object.values(DistrictStatusText).map((value) => {
                            return (
                                <Button
                                    variant={
                                        district?.status === value
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
            </ModalBody>
        </Modal>
    );
};

export default StatusModal;
