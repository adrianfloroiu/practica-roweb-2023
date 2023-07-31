import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductService from "../services/productService";

function Product() {
    const { productId } = useParams();
    const initialState = {
        productId: null,
        categoryId: null,
        name: "",
        description: "",
        price: "",
        imageName: "no_image",
    };

    const [product, setProduct] = useState(initialState);

    const host = "https://localhost:7289";

    useEffect(() => {
        ProductService()
            .getById(productId)
            .then((res) => {
                setProduct(res.data);
            })
            .catch((error) => {
                console.error("Error fetching product:", error);
            });
    }, []);

    return (
        <div className="container px-4 px-lg-5 vh-100 d-flex">
            <div className="row gx-4 gx-lg-5 align-items-center">
                <div className="col-md-6">
                    <img
                        className="card-img-top mb-5 mb-md-0"
                        src={
                            product.imageName === "no_image"
                                ? `${host}/images/no_image.png`
                                : `${host}/images/${product.imageName}`
                        }
                    />
                </div>
                <div className="col-md-6">
                    <h1 className="display-5 fw-bolder">{product.name}</h1>
                    <p className="lead mb-4">{product.description}</p>
                    <div className="d-flex mb-3">
                        <button
                            className="btn btn-outline-dark flex-shrink-0"
                            type="button"
                        >
                            Add to cart
                        </button>
                    </div>
                    <div className="fs-5">
                        <span>Price: ${product.price}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Product;
