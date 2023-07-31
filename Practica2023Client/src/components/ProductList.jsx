import React, { useEffect, useState } from "react";
import { Table, Form, Modal, Button, Col } from "react-bootstrap";
import ProductService from "../services/productService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactPaginate from "react-paginate";

function ProductList() {
    const [products, setProducts] = useState([]);
    const [categoryId, setCategoryId] = useState("");
    const [productName, setProductName] = useState("");
    const [productDescription, setProductDescription] = useState("");
    const [productPrice, setProductPrice] = useState("");
    const [productImageName, setProductImageName] = useState("no_image");
    const [productImageFile, setProductImageFile] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const [totalProducts, setTotalProducts] = useState(0);
    const productsPerPage = 5;

    useEffect(() => {
        fetchProductsCount();
        fetchProducts(currentPage);
        setPageCount(Math.ceil(totalProducts / productsPerPage));
    }, [currentPage, products]);

    const fetchProducts = (page) => {
        const offset = page * productsPerPage;

        ProductService()
            .getProducts(offset, productsPerPage)
            .then((res) => {
                setProducts(res.data);
            })
            .catch((error) => {
                console.error("Error fetching products:", error);
            });
    };

    const fetchProductsCount = () => {
        ProductService()
            .getCount()
            .then((res) => {
                setTotalProducts(res.data);
            })
            .catch((error) => {
                console.error("Error fetching number of products:", error);
            });
    };

    const handleAddProduct = (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append("CategoryId", categoryId);
        formData.append("Name", productName);
        formData.append("Description", productDescription);
        formData.append("Price", productPrice);
        formData.append("ImageName", productImageName);
        formData.append("ImageFile", productImageFile);

        ProductService()
            .addProduct(formData)
            .then((res) => {
                if (res.status === 200) {
                    toast.success("Product added successfully!");
                    fetchProducts();
                    setCategoryId("");
                    setProductName("");
                    setProductDescription("");
                    setProductPrice("");
                    setProductImageName("no_image");
                    setProductImageFile(null);
                } else {
                    toast.error("Error adding product!");
                }
            })
            .catch((error) => {
                console.error("Error adding product:", error);
            });
    };

    const handleOpenModal = (product) => {
        setEditingProduct(product);
        setShowModal(true);
    };

    const handleUpdateProduct = (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append("CategoryId", editingProduct.categoryId);
        formData.append("Name", editingProduct.name);
        formData.append("Description", editingProduct.description);
        formData.append("Price", editingProduct.price);
        formData.append("ImageName", editingProduct.imageName);
        formData.append("ImageFile", editingProduct.imageFile);

        ProductService()
            .updateProduct(editingProduct.productId, formData)
            .then((res) => {
                if (res.status === 200) {
                    toast.success("Product updated successfully!");
                    fetchProducts();
                    setEditingProduct(null);
                } else {
                    toast.error("Error updating product!");
                }
            })
            .catch((error) => {
                console.error("Error updating product:", error);
            });

        setShowModal(false);
    };

    const handleDeleteProduct = (productId) => {
        ProductService()
            .deleteProduct(productId)
            .then((res) => {
                if (res.status === 200) {
                    toast.success("Product deleted successfully!");
                    fetchProducts();
                } else {
                    toast.error("Error deleting product!");
                }
            })
            .catch((error) => {
                console.error("Error deleting product:", error);
            });
    };

    const handlePageClick = (data) => {
        setCurrentPage(data.selected);
    };

    return (
        <>
            <h1 className="py-4">Product List</h1>
            <Table bordered hover className="align-middle">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Category Id</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.productId}>
                            <td>{product.productId}</td>
                            <td>{product.categoryId}</td>
                            <td className="name">{product.name}</td>
                            <td className="description">
                                {product.description}
                            </td>
                            <td>{product.price}</td>
                            <td>
                                <Button
                                    variant="warning"
                                    onClick={() => handleOpenModal(product)}
                                >
                                    Update
                                </Button>{" "}
                                <Button
                                    variant="danger"
                                    onClick={() =>
                                        handleDeleteProduct(product.productId)
                                    }
                                >
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            {pageCount ? (
                <ReactPaginate
                    previousLabel={"previous"}
                    nextLabel={"next"}
                    breakLabel={"..."}
                    pageCount={pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={3}
                    onPageChange={handlePageClick}
                    containerClassName={"pagination justify-content-start"}
                    pageClassName={"page-item"}
                    pageLinkClassName={"page-link"}
                    previousClassName={"page-item"}
                    previousLinkClassName={"page-link"}
                    nextClassName={"page-item"}
                    nextLinkClassName={"page-link"}
                    breakClassName={"page-item"}
                    breakLinkClassName={"page-link"}
                    activeClassName={"active"}
                />
            ) : (
                <h3>No products found!</h3>
            )}

            <div className="container-fluid py-3">
                <Col lg={5}>
                    <h2 className="py-3">Add Product</h2>
                    <Form onSubmit={handleAddProduct}>
                        <Form.Group className="mb-3" controlId="categoryId">
                            <Form.Label>Category Id</Form.Label>
                            <Form.Control
                                type="text"
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="name">
                            <Form.Label>Product Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="description">
                            <Form.Label>Product Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={productDescription}
                                onChange={(e) =>
                                    setProductDescription(e.target.value)
                                }
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="price">
                            <Form.Label>Product Price</Form.Label>
                            <Form.Control
                                type="text"
                                value={productPrice}
                                onChange={(e) =>
                                    setProductPrice(e.target.value)
                                }
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="image">
                            <Form.Label>Product Image</Form.Label>
                            <Form.Control
                                type="file"
                                onChange={(e) => {
                                    setProductImageFile(e.target.files[0]);
                                    setProductImageName(e.target.files[0].name);
                                }}
                                accept="image/*"
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                </Col>
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Product</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group
                            className="mb-3"
                            controlId="categoryIdModal"
                        >
                            <Form.Label>Category Id</Form.Label>
                            <Form.Control
                                type="text"
                                value={editingProduct?.categoryId}
                                onChange={(e) =>
                                    setEditingProduct({
                                        ...editingProduct,
                                        categoryId: e.target.value,
                                    })
                                }
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="nameModal">
                            <Form.Label>Product Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={editingProduct?.name}
                                onChange={(e) =>
                                    setEditingProduct({
                                        ...editingProduct,
                                        name: e.target.value,
                                    })
                                }
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="descModal">
                            <Form.Label>Product Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={editingProduct?.description}
                                onChange={(e) =>
                                    setEditingProduct({
                                        ...editingProduct,
                                        description: e.target.value,
                                    })
                                }
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="priceModal">
                            <Form.Label>Product Price</Form.Label>
                            <Form.Control
                                type="text"
                                value={editingProduct?.price}
                                onChange={(e) =>
                                    setEditingProduct({
                                        ...editingProduct,
                                        price: e.target.value,
                                    })
                                }
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="imageModal">
                            <Form.Label>Product Image</Form.Label>
                            <Form.Control
                                type="file"
                                onChange={(e) =>
                                    setEditingProduct({
                                        ...editingProduct,
                                        imageName: e.target.files[0].name,
                                        imageFile: e.target.files[0],
                                    })
                                }
                                accept="image/*"
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => setShowModal(false)}
                    >
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleUpdateProduct}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

            <ToastContainer />
        </>
    );
}

export default ProductList;
