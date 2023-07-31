import axios from "axios";

const AuthService = () => {
    const host = "https://localhost:7289";

    async function register(userData) {
        const response = await axios.post(
            `${host}/api/auth/register`,
            userData
        );

        return response;
    }

    async function login(userData) {
        const response = await axios.post(`${host}/api/auth/login`, userData);

        return response;
    }

    return {
        register: register,
        login: login,
    };
};

export default AuthService;
