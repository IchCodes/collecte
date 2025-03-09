import { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Vérifier si un utilisateur est déjà stocké dans localStorage
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = async (email, password) => {
        const res = await axios.get(`http://localhost:3001/users?email=${email}&mot_de_passe=${password}`);
        if (res.data.length > 0) {
            localStorage.setItem("token", "mock-token"); // Simule un token
            setUser(res.data[0]);
        } else {
            throw new Error("Utilisateur introuvable");
        }
    };
    

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;