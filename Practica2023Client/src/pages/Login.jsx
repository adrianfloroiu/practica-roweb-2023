import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../providers/authProvider";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import AuthService from "../services/authService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login() {
    const [usernameInput, setUsernameInput] = useState("");
    const [passwordInput, setPasswordInput] = useState("");
    const { setAuthData } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();

        AuthService()
            .login({
                username: usernameInput,
                password: passwordInput,
            })
            .then((res) => {
                setAuthData(res.data.token, res.data.role);
                if (res.data.role == "Admin") {
                    navigate("/admin", { replace: true });
                } else {
                    navigate("/", { replace: true });
                }
            })
            .catch((error) => {
                toast.error("Error logging in: " + error.response.data);
            });
    };

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col lg={4} md={6}>
                    <h1 className="mt-4 mb-4 text-center">
                        <strong>Login</strong>
                    </h1>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-4" controlId="Username">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter username"
                                value={usernameInput}
                                onChange={(e) =>
                                    setUsernameInput(e.target.value)
                                }
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-4" controlId="Password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter password"
                                value={passwordInput}
                                onChange={(e) =>
                                    setPasswordInput(e.target.value)
                                }
                                required
                            />
                        </Form.Group>

                        <div className="text-center">
                            <Button
                                className="px-5"
                                variant="primary"
                                type="submit"
                            >
                                Login
                            </Button>
                        </div>
                    </Form>
                </Col>
            </Row>
            <ToastContainer />
        </Container>
    );
}

export default Login;
