import axios from "axios";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [token, setToken_] = useState(localStorage.getItem("token"));
    const [role, setRole_] = useState(localStorage.getItem("role"));

    const setAuthData = (newToken, newRole) => {
        setToken_(newToken);
        setRole_(newRole);
    };

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common["Authorization"] = "Bearer " + token;
            localStorage.setItem("token", token);
            localStorage.setItem("role", role);
        } else {
            delete axios.defaults.headers.common["Authorization"];
            localStorage.removeItem("token");
            localStorage.removeItem("role");
        }

        const isTokenExpired = () => {
            if (!token) return true;
            const tokenExpiration = getTokenExpirationTime(token);
            return tokenExpiration <= new Date();
        };

        if (isTokenExpired()) {
            logoutUser();
        }
    }, [token, role]);

    const getTokenExpirationTime = (token) => {
        if (!token) return null;
        const tokenPayload = JSON.parse(atob(token.split(".")[1]));
        if (!tokenPayload || !tokenPayload.exp) return null;
        return new Date(tokenPayload.exp * 1000);
    };

    const logoutUser = () => {
        setAuthData();
        delete axios.defaults.headers.common["Authorization"];
        localStorage.removeItem("token");
        localStorage.removeItem("role");
    };

    const contextValue = useMemo(
        () => ({
            token,
            role,
            setAuthData,
        }),
        [token, role]
    );

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};

export default AuthProvider;
