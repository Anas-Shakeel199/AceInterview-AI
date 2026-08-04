import { useEffect, useState } from "react";
import AuthContext from "./AuthContext.jsx";
import authService from "../services/authService.js";

const AuthProvider = ({ children }) => {

    // useStates
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true)
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    // chechAuth function
    const checkAuth = async () => {

        try {

            const response = await authService.getCurrentUser()

            setUser(response.data)
            setIsAuthenticated(true)

        } catch (error) {

            setUser(null)
            setIsAuthenticated(false)

        } finally {
            setLoading(false)
        }
    }

    // login
    const login = async (credentials) => {

        const response = await authService.login(credentials);
        setUser(response.data)
        setIsAuthenticated(true)

        return response.data
    }

    // logout
    const logout = async () => {

        try {

            await authService.logout()

        } finally {

            setUser(null)
            setIsAuthenticated(false)

        }
    }

    // useEffect
    useEffect(() => {
        checkAuth()
    }, [])



    const value = {
        user,
        loading,
        isAuthenticated,

        login,
        logout,
        checkAuth,

        setUser,
    };

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;