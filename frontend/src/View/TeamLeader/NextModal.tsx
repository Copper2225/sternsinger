import {Button, FormCheck, Modal, ModalBody, ModalHeader, ModalTitle} from "react-bootstrap";
import {Dispatch, SetStateAction, useCallback, useRef} from "react";
import {useNavigate} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRight} from "@fortawesome/free-solid-svg-icons";

interface Props {
    show: boolean;
    setShow: Dispatch<SetStateAction<boolean>>;
}

const NextModal = ({show, setShow}: Props) => {
    const handleClose = useCallback(() => {
        setShow(false);
    }, [setShow]);
    const navigate = useNavigate();
    const sumRef = useRef<HTMLInputElement>(null);
    const progressRef = useRef<HTMLInputElement>(null);
    const statusRef = useRef<HTMLInputElement>(null);

    const handleNavigate = useCallback(() => {
        const searchParams = new URLSearchParams();
        if (sumRef.current?.checked !== true) {
            searchParams.set("summe", "true")
        }
        if (progressRef.current?.checked !== true) {
            searchParams.set("progress", "true")
        }
        if (statusRef.current?.checked !== true) {
            searchParams.set("status", "true")
        }
        console.log(sumRef.current?.value);
        navigate(`/show?${searchParams}`)
    }, [navigate]);

    return (<Modal show={show} onHide={handleClose} centered>
        <ModalHeader closeButton>
            <ModalTitle>Go to Show Screen</ModalTitle>
        </ModalHeader>
        <ModalBody>
            <FormCheck defaultChecked={true} ref={sumRef} label={"Spendensumme"} />
            <FormCheck defaultChecked={true} ref={progressRef} label={"Fortschritt"} />
            <FormCheck defaultChecked={true} ref={statusRef} label={"Status"} />

            <Button className={"w-100 mt-2"} onClick={handleNavigate}><FontAwesomeIcon icon={faArrowRight} /></Button>
        </ModalBody>
    </Modal>)
}

export default NextModal;