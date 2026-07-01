import { Navigate } from "react-router-dom";

import { useAuth }
from "../context/AuthContext";

export default function ProtectedRoute({

    children

}) {

    const { token } = useAuth();
     console.log("TOKEN =", token);

    if (!token) {

        return (
            <Navigate to="/" />
        );

    }

    return children;

}