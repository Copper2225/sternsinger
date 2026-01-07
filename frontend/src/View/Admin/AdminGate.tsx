import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { authState } from "src/requests/adminStore";
import {
    Card,
    Button,
    Form,
    InputGroup,
    Container,
    Spinner,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faLock } from "@fortawesome/free-solid-svg-icons";

const AdminGate = ({ children }: { children: JSX.Element }) => {
    const [isAuthenticated, setIsAuthenticated] = useRecoilState(authState);
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const backendURL = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        const checkSession = async () => {
            try {
                const res = await fetch(`${backendURL}/check-auth`, {
                    method: "GET",
                    credentials: "include",
                });
                setIsAuthenticated(res.ok);
            } catch {
                setIsAuthenticated(false);
            } finally {
                setIsCheckingAuth(false);
            }
        };

        checkSession();
    }, [backendURL, setIsAuthenticated]);

    const handleLogin = async () => {
        const response = await fetch(`${backendURL}/pass`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ password }),
        });

        if (response.ok) {
            setIsAuthenticated(true);
        } else {
            alert("Falsches Passwort");
        }
    };

    if (isCheckingAuth) {
        return (
            <Container
                className="d-flex align-items-center justify-content-center"
                style={{ minHeight: "100vh" }}
            >
                <Spinner animation="border" />
            </Container>
        );
    }

    if (isAuthenticated) {
        return children;
    }

    return (
        <Container
            className="d-flex align-items-center justify-content-center"
            style={{ minHeight: "100vh" }}
        >
            <Card
                style={{ width: "100%", maxWidth: 420 }}
                className="shadow-sm"
            >
                <Card.Body>
                    <div className="text-center mb-4">
                        <FontAwesomeIcon
                            icon={faLock}
                            size="2x"
                            className="mb-2"
                        />
                        <h4 className="mb-0">Admin Bereich</h4>
                    </div>

                    <Form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleLogin();
                        }}
                    >
                        <Form.Group className="mb-3">
                            <Form.Label>Passwort</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    placeholder="Passwort eingeben"
                                />
                                <Button
                                    variant="outline-secondary"
                                    onClick={() => setShowPassword((v) => !v)}
                                >
                                    <FontAwesomeIcon
                                        icon={showPassword ? faEyeSlash : faEye}
                                    />
                                </Button>
                            </InputGroup>
                        </Form.Group>

                        <Button
                            variant="primary"
                            type="submit"
                            className="w-100"
                            disabled={!password}
                        >
                            Login
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default AdminGate;
