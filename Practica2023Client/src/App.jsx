import { Container, Col, Row } from "react-bootstrap";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuth } from "./providers/authProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import Products from "./pages/Products";
import Product from "./pages/Product";
import Sidebar from "./components/Sidebar";
import CategoryList from "./components/CategoryList";
import ProductList from "./components/ProductList";
import Register from "./pages/Register";
import Forbidden from "./pages/Forbidden";

function App() {
    const { token, role } = useAuth();

    return (
        <BrowserRouter>
            <Container fluid>
                <Row>
                    <Col lg={2}>
                        <Sidebar />
                    </Col>
                    <Col lg={10} xs={12}>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/403" element={<Forbidden />} />
                            <Route path="/home" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route
                                path="/products/:categoryId"
                                element={<Products />}
                            />
                            <Route
                                path="/products/details/:productId"
                                element={<Product />}
                            />
                            <Route
                                element={
                                    <ProtectedRoute
                                        isAllowed={token && role == "Admin"}
                                        redirectPath="/403"
                                    />
                                }
                            >
                                <Route path="/admin" element={<Admin />} />
                                <Route
                                    path="/admin/categories"
                                    element={<CategoryList />}
                                />
                                <Route
                                    path="/admin/categories/:categoryId"
                                    element={<CategoryList />}
                                />
                                <Route
                                    path="/admin/products"
                                    element={<ProductList />}
                                />
                                <Route
                                    path="/admin/products/:productId"
                                    element={<ProductList />}
                                />
                            </Route>
                        </Routes>
                    </Col>
                </Row>
            </Container>
        </BrowserRouter>
    );
}

export default App;
