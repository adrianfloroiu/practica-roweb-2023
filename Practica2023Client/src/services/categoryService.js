import axios from "axios";

const CategoryService = () => {
    const host = "https://localhost:7289";

    async function getCategories(offset, limit) {
        if (!offset) offset = 0;
        if (!limit) limit = 100;
        const response = await axios.get(
            `${host}/api/categories/${offset}/${limit}`
        );

        return response;
    }

    async function getCount() {
        const response = await axios.get(`${host}/api/categories/count`);
        return response;
    }

    async function getById(id) {
        const response = await axios.get(`${host}/api/categories/${id}`);
        return response;
    }

    async function addCategory(categoryData) {
        const response = await axios.post(
            `${host}/api/categories`,
            categoryData
        );

        return response;
    }

    async function updateCategory(id, categoryData) {
        const response = await axios.put(
            `${host}/api/categories/${id}`,
            categoryData
        );

        return response;
    }

    async function deleteCategory(id) {
        const response = await axios.delete(`${host}/api/categories/${id}`);

        return response;
    }

    return {
        getCategories: getCategories,
        getCount: getCount,
        getById: getById,
        addCategory: addCategory,
        updateCategory: updateCategory,
        deleteCategory: deleteCategory,
    };
};

export default CategoryService;
