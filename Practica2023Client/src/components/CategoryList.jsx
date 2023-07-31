import React, { useEffect, useState } from "react";
import { Table, Form, Modal, Button, Col } from "react-bootstrap";
import CategoryService from "../services/categoryService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactPaginate from "react-paginate";

function CategoryList() {
    const [categories, setCategories] = useState([]);
    const [categoryName, setCategoryName] = useState("");
    const [categoryDescription, setCategoryDescription] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const [totalCategories, setTotalCategories] = useState(0);
    const categoriesPerPage = 5;

    useEffect(() => {
        fetchCategoriesCount();
        fetchCategories(currentPage);
        setPageCount(Math.ceil(totalCategories / categoriesPerPage));
    }, [currentPage, categories]);

    const fetchCategories = (page) => {
        const offset = page * categoriesPerPage;

        CategoryService()
            .getCategories(offset, categoriesPerPage)
            .then((res) => {
                setCategories(res.data);
            })
            .catch((error) => {
                console.error("Error fetching categories:", error);
            });
    };

    const fetchCategoriesCount = () => {
        CategoryService()
            .getCount()
            .then((res) => {
                setTotalCategories(res.data);
            })
            .catch((error) => {
                console.error("Error fetching number of categories:", error);
            });
    };

    const handleAddCategory = (event) => {
        event.preventDefault();

        CategoryService()
            .addCategory({
                name: categoryName,
                description: categoryDescription,
            })
            .then((res) => {
                if (res.status === 200) {
                    toast.success("Category added successfully!");
                    fetchCategories();
                    setCategoryName("");
                    setCategoryDescription("");
                } else {
                    toast.error("Error adding category!");
                }
            })
            .catch((error) => {
                console.error("Error adding category:", error);
            });
    };

    const handleOpenModal = (category) => {
        setEditingCategory(category);
        setShowModal(true);
    };

    const handleUpdateCategory = (event) => {
        event.preventDefault();

        CategoryService()
            .updateCategory(editingCategory.categoryId, {
                name: editingCategory.name,
                description: editingCategory.description,
            })
            .then((res) => {
                if (res.status === 200) {
                    toast.success("Category updated successfully!");
                    fetchCategories();
                } else {
                    toast.error("Error updating category!");
                }
            })
            .catch((error) => {
                console.error("Error updating category:", error);
            });

        setShowModal(false);
    };

    const handleDeleteCategory = (categoryId) => {
        CategoryService()
            .deleteCategory(categoryId)
            .then((res) => {
                if (res.status === 200) {
                    toast.success("Category deleted successfully!");
                    fetchCategories();
                } else {
                    toast.error("Error deleting category!");
                }
            })
            .catch((error) => {
                console.error("Error deleting category:", error);
            });
    };

    const handlePageClick = (data) => {
        setCurrentPage(data.selected);
    };

    return (
        <>
            <h1 className="py-4">Category List</h1>
            <Table bordered hover className="align-middle">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map((category) => (
                        <tr key={category.categoryId}>
                            <td>{category.categoryId}</td>
                            <td className="name">{category.name}</td>
                            <td className="description">
                                {category.description}
                            </td>
                            <td>
                                <Button
                                    variant="warning"
                                    onClick={() => handleOpenModal(category)}
                                >
                                    Update
                                </Button>{" "}
                                <Button
                                    variant="danger"
                                    onClick={() =>
                                        handleDeleteCategory(
                                            category.categoryId
                                        )
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
                <h3>No categories found!</h3>
            )}

            <div className="container-fluid py-3">
                <Col lg={5}>
                    <h2 className="py-3">Add Category</h2>
                    <Form onSubmit={handleAddCategory}>
                        <Form.Group className="mb-3" controlId="name">
                            <Form.Label>Category Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={categoryName}
                                onChange={(e) =>
                                    setCategoryName(e.target.value)
                                }
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="description">
                            <Form.Label>Category Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={categoryDescription}
                                onChange={(e) =>
                                    setCategoryDescription(e.target.value)
                                }
                                required
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
                    <Modal.Title>Edit Category</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="nameModal">
                            <Form.Label>Category Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={editingCategory?.name}
                                onChange={(e) =>
                                    setEditingCategory({
                                        ...editingCategory,
                                        name: e.target.value,
                                    })
                                }
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="descModal">
                            <Form.Label>Category Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={editingCategory?.description}
                                onChange={(e) =>
                                    setEditingCategory({
                                        ...editingCategory,
                                        description: e.target.value,
                                    })
                                }
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
                    <Button variant="primary" onClick={handleUpdateCategory}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

            <ToastContainer />
        </>
    );
}

export default CategoryList;
