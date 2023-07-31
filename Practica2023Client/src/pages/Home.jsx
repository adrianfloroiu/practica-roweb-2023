import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import CategoryService from "../services/categoryService";
import { Link } from "react-router-dom";

function Home() {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        CategoryService()
            .getCategories()
            .then((res) => {
                setCategories(res.data);
            })
            .catch((error) => {
                console.error("Error fetching categories:", error);
            });
    }, []);

    return (
        <Container fluid className="my-5 text-center">
            <h2 className="mt-4 mb-5">
                <strong>Categories</strong>
            </h2>

            <Row lg={3}>
                {categories &&
                    categories.map((category) => {
                        return (
                            <Col
                                className="d-flex mb-3"
                                key={category.categoryId}
                            >
                                <Card className="flex-fill">
                                    <Card.Img
                                        variant="top"
                                        src={`https://source.unsplash.com/random/?${category.name}`}
                                        className="card-img-category"
                                    />
                                    <Card.Body>
                                        <Card.Title>{category.name}</Card.Title>
                                        <Card.Text>
                                            {category.description}
                                        </Card.Text>
                                        <Button
                                            variant="primary"
                                            as={Link}
                                            to={`/products/${category.categoryId}`}
                                        >
                                            See products
                                        </Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        );
                    })}
            </Row>
        </Container>
    );
}

export default Home;
