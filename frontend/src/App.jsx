import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "./routes/PrivateRoute";
import Login from "./pages/Login";
import DonForm from "./pages/DonForm";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/don" element={<PrivateRoute><DonForm /></PrivateRoute>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
