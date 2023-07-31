import { Nav } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../providers/authProvider";

function Sidebar() {
    const { token, role, setAuthData } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        setAuthData();
        navigate("/login", { replace: true });
    };

    return (
        <>
            <Nav className="col-md-12 d-md-block bg-light sidebar">
                <div className="sidebar-sticky"></div>
                {role && role == "Admin" && (
                    <Nav.Item>
                        <Nav.Link as={Link} to="/admin">
                            Dashboard
                        </Nav.Link>
                    </Nav.Item>
                )}
                <Nav.Item>
                    <Nav.Link as={Link} to="/">
                        Home
                    </Nav.Link>
                </Nav.Item>
                {!token ? (
                    <Nav.Item>
                        <Nav.Link as={Link} to="/login">
                            Login
                        </Nav.Link>
                    </Nav.Item>
                ) : (
                    <Nav.Item>
                        <Nav.Link
                            className="text-danger"
                            onClick={handleLogout}
                        >
                            Logout
                        </Nav.Link>
                    </Nav.Item>
                )}
                <Nav.Item>
                    <Nav.Link as={Link} to="/register">
                        Register
                    </Nav.Link>
                </Nav.Item>
                {role && role == "Admin" && (
                    <>
                        <Nav.Item>
                            <Nav.Link as={Link} to="/admin/categories">
                                Manage categories
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link as={Link} to="/admin/products">
                                Manage products
                            </Nav.Link>
                        </Nav.Item>
                    </>
                )}
            </Nav>
        </>
    );
}

export default Sidebar;
