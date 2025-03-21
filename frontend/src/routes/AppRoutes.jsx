import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import Login from "../pages/Login";
import DonForm from "../pages/DonForm";
import Animateur from "../pages/Animateur";
import Admin from "../pages/Admin";
import Stats from "../components/Stats";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/don" element={<PrivateRoute><DonForm /></PrivateRoute>} />
            <Route path="/animateur" element={<PrivateRoute><Animateur /></PrivateRoute>} />
            <Route path="/admin" element={<PrivateRoute><Admin /></PrivateRoute>} />
            <Route path="/stats" element={<PrivateRoute><Stats /></PrivateRoute>} />
        </Routes>
    );
};

export default AppRoutes;