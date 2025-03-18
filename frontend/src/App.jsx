import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Routes from "./routes/AppRoutes";
import Header from "./components/Header";

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Header />
                <Routes />
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;