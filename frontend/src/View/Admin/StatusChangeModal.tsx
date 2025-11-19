import {
    Button,
    Modal,
    ModalBody,
    ModalHeader,
    ModalTitle,
} from "react-bootstrap";
import React, { Dispatch, SetStateAction, useCallback, useMemo } from "react";
import { District, DistrictStatusText } from "src/requests/adminStore";
import StatusIcon from "src/View/Show/DIstrictStatus/StatusIcon";

interface Props {
    district: District;
    showModal: boolean;
    setShowModal: Dispatch<SetStateAction<boolean>>;
    handleSubmit: (value: District, index: number) => void;
    index: number;
}

interface ButtonProps {
    status: DistrictStatusText;
    handleButtonSubmit: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const StatusChangeButton = ({ handleButtonSubmit, status }: ButtonProps) => {
    const buttonVariant = useMemo(() => {
        switch (status) {
            case DistrictStatusText.finished:
                return "success";
            case DistrictStatusText.planned:
                return "warning";
            case DistrictStatusText.walking:
                return "primary";
            case DistrictStatusText.calculating:
                return "secondary";
            case DistrictStatusText.notPlanned:
            default:
                return "danger";
        }
    }, [status]);

    return (
        <Button
            value={status}
            variant={buttonVariant}
            onClick={handleButtonSubmit}
            className={"justify-content-center"}
            style={{ width: "100px" }}
        >
            <StatusIcon colored={false} status={status} />
        </Button>
    );
};

const StatusChangeModal = ({
    district,
    showModal,
    setShowModal,
    handleSubmit,
    index,
}: Props) => {
    const handleClose = useCallback(() => {
        setShowModal(false);
    }, [setShowModal]);

    const handleButtonSubmit = useCallback(
        (event: React.MouseEvent<HTMLButtonElement>) => {
            handleSubmit(
                {
                    ...district,
                    status: event.currentTarget.value as DistrictStatusText,
                },
                index,
            );
            setShowModal(false);
        },
        [district, handleSubmit, index, setShowModal],
    );

    return (
        <Modal centered show={showModal} onHide={handleClose}>
            <ModalHeader closeButton>
                <ModalTitle>Bezirks Status Update</ModalTitle>
            </ModalHeader>
            <ModalBody>
                <div className={"d-flex w-100 justify-content-around gap-3"}>
                    <StatusChangeButton
                        status={DistrictStatusText.notPlanned}
                        handleButtonSubmit={handleButtonSubmit}
                    />
                    <StatusChangeButton
                        status={DistrictStatusText.planned}
                        handleButtonSubmit={handleButtonSubmit}
                    />
                    <StatusChangeButton
                        status={DistrictStatusText.walking}
                        handleButtonSubmit={handleButtonSubmit}
                    />
                    <StatusChangeButton
                        status={DistrictStatusText.calculating}
                        handleButtonSubmit={handleButtonSubmit}
                    />
                    <StatusChangeButton
                        status={DistrictStatusText.finished}
                        handleButtonSubmit={handleButtonSubmit}
                    />
                </div>
            </ModalBody>
        </Modal>
    );
};

export default StatusChangeModal;
