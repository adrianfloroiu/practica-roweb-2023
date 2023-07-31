import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
    Container,
    Row,
    Col,
    Card,
    Button,
    Form,
    InputGroup,
    Dropdown,
    DropdownButton,
} from "react-bootstrap";
import CategoryService from "../services/categoryService";
import ProductService from "../services/productService";
import ReactPaginate from "react-paginate";

function Products() {
    const { categoryId } = useParams();
    const [category, setCategory] = useState(Object);
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [orderType, setOrderType] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const [totalProducts, setTotalProducts] = useState(0);
    const productsPerPage = 6;

    const host = "https://localhost:7289";

    useEffect(() => {
        fetchCategory();
        fetchProductsCount(searchTerm);
        fetchProducts(currentPage, searchTerm);
    }, []);

    useEffect(() => {
        fetchProducts(currentPage, searchTerm, orderType);
        setPageCount(Math.ceil(totalProducts / productsPerPage));
    }, [totalProducts, currentPage]);

    const fetchCategory = () => {
        CategoryService()
            .getById(categoryId)
            .then((res) => {
                setCategory(res.data);
            })
            .catch((error) => {
                console.error("Error fetching category:", error);
            });
    };

    const fetchProducts = (page, searchTerm, orderType) => {
        const offset = page * productsPerPage;

        ProductService()
            .getProductsByCategory(
                categoryId,
                searchTerm,
                orderType,
                offset,
                productsPerPage
            )
            .then((res) => {
                setProducts(res.data);
            })
            .catch((error) => {
                console.error("Error fetching products:", error);
            });
    };

    const fetchProductsCount = (searchTerm) => {
        ProductService()
            .getCountByCategory(categoryId, searchTerm)
            .then((res) => {
                setTotalProducts(res.data);
            })
            .catch((error) => {
                console.error("Error fetching number of products:", error);
            });
    };

    const handlePageClick = (data) => {
        setCurrentPage(data.selected);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSearch(e);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(0);
        fetchProductsCount(searchTerm);
        fetchProducts(currentPage, searchTerm);
    };

    const handleSelect = (e) => {
        setOrderType(e);
        fetchProducts(currentPage, searchTerm, e);
    };

    return (
        <Container fluid className="my-5 text-center">
            <h2 className="mt-4 mb-5">
                <strong>Products - {category.name}</strong>
            </h2>
            <div>
                <Form>
                    <InputGroup className="my-3">
                        <Form.Control
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search products"
                            onKeyDown={(e) => handleKeyDown(e)}
                        />
                        <Button
                            onClick={(e) => handleSearch(e)}
                            variant="primary"
                            className="mx-3 px-4"
                        >
                            Search
                        </Button>
                    </InputGroup>
                </Form>
            </div>
            <div className="text-start mb-3">
                <DropdownButton title="Order by" onSelect={handleSelect}>
                    <Dropdown.Item eventKey="">No order</Dropdown.Item>
                    <Dropdown.Item eventKey="asc">
                        Price ascending
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="desc">
                        Price descending
                    </Dropdown.Item>
                </DropdownButton>
            </div>
            <Row lg={3}>
                {products &&
                    products.map((product) => {
                        return (
                            <Col
                                className="d-flex mb-3"
                                key={product.productId}
                            >
                                <Card className="flex-fill">
                                    <Card.Img
                                        variant="top"
                                        src={
                                            product.imageName === "no_image"
                                                ? `${host}/images/no_image.png`
                                                : `${host}/images/${product.imageName}`
                                        }
                                        className="card-img-product"
                                    />
                                    <Card.Body>
                                        <Card.Title
                                            as={Link}
                                            to={`/products/details/${product.productId}`}
                                            className="text-decoration-none product-title"
                                        >
                                            {product.name}
                                        </Card.Title>
                                        <Card.Text className="lead text-secondary">
                                            {product.price} $
                                        </Card.Text>
                                        <Button variant="primary">
                                            Add to cart
                                        </Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        );
                    })}
            </Row>
            <div className="my-4">
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
                    <h2>No products found!</h2>
                )}
            </div>
        </Container>
    );
}

export default Products;
