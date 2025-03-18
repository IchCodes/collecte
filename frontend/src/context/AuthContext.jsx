import { createContext, useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "/api";
const API_KEY = "bismillah";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        console.log("storedUser", storedUser);
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = async (email, navigate) => {
        try {
            const res = await axios.get(`${API_BASE_URL}/users`, {
                headers: { "X-API-KEY": API_KEY }
            });

            const foundUser = res.data.find(user => user.email === email);
            if (!foundUser) throw new Error("Utilisateur non trouvé");

            localStorage.setItem("user", JSON.stringify(foundUser));
            setUser(foundUser);

            console.log("foundUser", foundUser.role)

            // Redirige en fonction du rôle
            switch (foundUser.role) {
                case "COLLECTEUR":
                    navigate("/don");
                    break;
                case "ANIMATEUR":
                    navigate("/animateur");
                    break;
                case "ADMINISTRATEUR":
                    navigate("/admin");
                    break;
                default:
                    alert("Rôle inconnu");
            }
        } catch (error) {
            alert("Erreur de connexion");
            console.error(error);
        }
    };

    const logout = (navigate) => {
        localStorage.removeItem("user");
        setUser(null);
        navigate("/login");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;