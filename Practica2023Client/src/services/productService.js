import axios from "axios";

const ProductService = () => {
    const host = "https://localhost:7289";

    async function getProducts(offset, limit) {
        if (!offset) offset = 0;
        if (!limit) limit = 100;
        const response = await axios.get(
            `${host}/api/products/${offset}/${limit}`
        );

        return response;
    }

    async function getCount() {
        const response = await axios.get(`${host}/api/products/count`);
        return response;
    }

    async function getById(id) {
        const response = await axios.get(`${host}/api/products/${id}`);
        return response;
    }

    async function getProductsByCategory(
        categoryId,
        searchTerm,
        orderType,
        offset,
        limit
    ) {
        if (!offset) offset = 0;
        if (!limit) limit = 100;
        if (!searchTerm) searchTerm = " ";
        if (!orderType) orderType = " ";
        const response = await axios.get(
            `${host}/api/products/${categoryId}/${searchTerm}/${orderType}/${offset}/${limit}`
        );

        return response;
    }

    async function getCountByCategory(categoryId, searchTerm) {
        if (!searchTerm) searchTerm = " ";
        const response = await axios.get(
            `${host}/api/products/count/${categoryId}/${searchTerm}`
        );
        return response;
    }

    async function addProduct(productData) {
        const response = await axios.post(`${host}/api/products`, productData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return response;
    }

    async function updateProduct(id, productData) {
        const response = await axios.put(
            `${host}/api/products/${id}`,
            productData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return response;
    }

    async function deleteProduct(id) {
        const response = await axios.delete(`${host}/api/products/${id}`);

        return response;
    }

    return {
        getProducts: getProducts,
        getCount: getCount,
        getById: getById,
        getProductsByCategory: getProductsByCategory,
        getCountByCategory: getCountByCategory,
        addProduct: addProduct,
        updateProduct: updateProduct,
        deleteProduct: deleteProduct,
    };
};

export default ProductService;
