import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { Dispatch, SetStateAction } from "react";

type Props = {
    show: boolean;
    onSubmit: () => void;
    passcode: string;
    setPasscode: Dispatch<SetStateAction<string>>;
    onCancel?: () => void;
};

const DistrictLoginModal = ({
    show,
    onSubmit,
    passcode,
    setPasscode,
    onCancel,
}: Props) => {
    return (
        <Modal show={show} centered backdrop="static" keyboard={false}>
            <Modal.Header>
                <Modal.Title>
                    <FontAwesomeIcon icon={faLock} className="me-2" />
                    District Login
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form
                    onSubmit={(e) => {
                        e.preventDefault();
                        onSubmit();
                    }}
                >
                    <Form.Group>
                        <Form.Label>Passcode</Form.Label>
                        <InputGroup>
                            <Form.Control
                                type="password"
                                value={passcode}
                                autoFocus
                                onChange={(e) => setPasscode(e.target.value)}
                                placeholder="6-stelliger Code"
                            />
                        </InputGroup>
                    </Form.Group>
                </Form>
            </Modal.Body>

            <Modal.Footer>
                {onCancel && (
                    <Button variant="secondary" onClick={onCancel}>
                        Abbrechen
                    </Button>
                )}
                <Button
                    variant="primary"
                    onClick={onSubmit}
                    disabled={!passcode}
                >
                    Login
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DistrictLoginModal;
