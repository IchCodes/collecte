import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Routes from "./routes/AppRoutes";
import Header from "./components/Header";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

function App() {

    const theme = createTheme(); // Thème par défaut
    return (
        <ThemeProvider theme={theme}>
      <CssBaseline />
        <BrowserRouter>
            <AuthProvider>
                <Header />
                <Routes />
            </AuthProvider>
        </BrowserRouter>
        </ThemeProvider>

    );
}

export default App;