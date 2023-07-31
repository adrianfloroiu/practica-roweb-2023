import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import AuthService from "../services/authService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Register() {
    const [usernameInput, setUsernameInput] = useState("");
    const [passwordInput, setPasswordInput] = useState("");
    const [repeatedPasswordInput, setRepeatedPasswordInput] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();

        if (passwordInput != repeatedPasswordInput) {
            toast.error("Passwords don't match!");
            return;
        }

        AuthService()
            .register({
                username: usernameInput,
                password: passwordInput,
            })
            .then((res) => {
                toast.success("Account successfully created!");
                setUsernameInput("");
                setPasswordInput("");
                setRepeatedPasswordInput("");
            })
            .catch((error) => {
                toast.error("Error creating account: " + error.response.data);
            });
    };

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col lg={4} md={6}>
                    <h1 className="mt-4 mb-4 text-center">
                        <strong>Register</strong>
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

                        <Form.Group
                            className="mb-4"
                            controlId="PasswordRepeated"
                        >
                            <Form.Label>Repeat Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter password"
                                value={repeatedPasswordInput}
                                onChange={(e) =>
                                    setRepeatedPasswordInput(e.target.value)
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
                                Register
                            </Button>
                        </div>
                    </Form>
                </Col>
            </Row>
            <ToastContainer />
        </Container>
    );
}

export default Register;
