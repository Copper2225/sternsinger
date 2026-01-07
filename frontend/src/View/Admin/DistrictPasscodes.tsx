import React, { useCallback, useState } from "react";
import { Button, Modal, Table } from "react-bootstrap";
import { District } from "src/requests/adminStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faCopy, faFilePdf } from "@fortawesome/free-solid-svg-icons";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Props {
    districts: District[];
}

const DistrictPasscodes = ({ districts }: Props): React.ReactElement => {
    const backendURL = import.meta.env.VITE_BACKEND_URL;
    const [passcodes, setPasscodes] = useState<string[]>([]);
    const [showModal, setShowModal] = useState(false);

    const showPasscodes = useCallback(async () => {
        try {
            const response = await fetch(`${backendURL}/district-passcodes`, {
                method: "GET",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            });

            if (!response.ok) {
                throw new Error("Admin not authorized");
            }

            const data = await response.json();
            setPasscodes(data.passcodes);
            setShowModal(true);
        } catch (error) {
            console.error("Error fetching district passcodes:", error);
            alert("Fehler beim Laden der Passcodes");
        }
    }, [backendURL]);

    const handleClose = useCallback(() => {
        setShowModal(false);
    }, []);

    const copyToClipboard = useCallback((text: string) => {
        navigator.clipboard.writeText(text);
        alert(`Passcode kopiert: ${text}`);
    }, []);

    const exportPDF = useCallback(() => {
        const doc = new jsPDF();
        doc.setFontSize(20);

        const tableData = districts.map((d, idx) => [
            d.name,
            passcodes[idx] || "—",
        ]);

        autoTable(doc, {
            head: [["District", "Passcode"]],
            body: tableData,
            theme: "striped",
            headStyles: { fillColor: [41, 128, 185], textColor: 255 },
            styles: { fontSize: 20 },
        });

        doc.save("district-passcodes.pdf");
    }, [districts, passcodes]);

    return (
        <div>
            <Button variant="secondary" onClick={showPasscodes}>
                Passwörter
            </Button>

            <Modal show={showModal} onHide={handleClose} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        <FontAwesomeIcon icon={faLock} className="me-2" />
                        District Passcodes
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>District</th>
                                <th>Passcode</th>
                                <th>Copy</th>
                            </tr>
                        </thead>
                        <tbody>
                            {districts.map((district, idx) => (
                                <tr key={district.name}>
                                    <td>{idx + 1}</td>
                                    <td>{district.name}</td>
                                    <td>{passcodes[idx] || "—"}</td>
                                    <td>
                                        {passcodes[idx] && (
                                            <Button
                                                size="sm"
                                                variant="outline-primary"
                                                onClick={() =>
                                                    copyToClipboard(
                                                        passcodes[idx],
                                                    )
                                                }
                                            >
                                                <FontAwesomeIcon
                                                    icon={faCopy}
                                                />
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Schließen
                    </Button>
                    <Button variant="danger" onClick={exportPDF}>
                        <FontAwesomeIcon icon={faFilePdf} className="me-2" />
                        PDF Export
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default DistrictPasscodes;
