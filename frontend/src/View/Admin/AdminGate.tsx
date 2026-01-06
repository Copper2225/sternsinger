import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { authState } from "src/requests/adminStore";
import { Spinner } from "react-bootstrap";

const AdminGate = ({ children }: { children: JSX.Element }) => {
    const [isAuthenticated, setIsAuthenticated] = useRecoilState(authState);
    const [password, setPassword] = useState("");
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

    // 🔒 BLOCK RENDERING UNTIL AUTH CHECK IS DONE
    if (isCheckingAuth) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <Spinner animation="border" />
            </div>
        );
    }

    if (isAuthenticated) {
        return children;
    }

    return (
        <div style={{ padding: "20px", textAlign: "center" }}>
            <h2>Admin Bereich</h2>
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Passwort eingeben"
            />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
};

export default AdminGate;
