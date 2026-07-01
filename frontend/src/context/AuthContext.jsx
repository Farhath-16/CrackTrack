import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [token, setToken] = useState(
        localStorage.getItem("token")
    );

    const [email, setEmail] = useState(
        localStorage.getItem("email")
    );

    const login = (
        jwtToken,
        userEmail
    ) => {

        localStorage.setItem(
            "token",
            jwtToken
        );

        localStorage.setItem(
            "email",
            userEmail
        );

        setToken(jwtToken);

        setEmail(userEmail);

    };

    const logout = () => {

        localStorage.removeItem(
            "token"
        );

        localStorage.removeItem(
            "email"
        );

        setToken(null);

        setEmail(null);

    };

    return (

        <AuthContext.Provider
            value={{
                token,
                email,
                login,
                logout
            }}
        >

            {children}

        </AuthContext.Provider>

    );

}

export function useAuth() {

    return useContext(
        AuthContext
    );

}