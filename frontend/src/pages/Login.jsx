import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { 
    Container, 
    Box, 
    TextField, 
    Button, 
    Typography, 
    Paper 
} from "@mui/material";

const Login = () => {
    const { login, user } = useContext(AuthContext);
    const navigate = useNavigate(); // Ajoutez ceci
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    if (user) {
        switch (user.role) {
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
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, navigate);
        } catch (err) {
            alert("Erreur de connexion");
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ 
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
                    <Typography component="h1" variant="h5" align="center" gutterBottom>
                        Connexion
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                        {/* <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Mot de passe"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        /> */}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Se connecter
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default Login;