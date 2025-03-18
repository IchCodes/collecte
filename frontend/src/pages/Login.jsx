import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { 
    Container, 
    Box, 
    TextField, 
    Button, 
    Typography, 
    Paper, 
    IconButton, 
    InputAdornment 
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

// Palette de couleurs
const primaryColor = "#A3D9A5"; // Vert clair
const accentColor = "#8AAAE5"; // Bleu pastel
const errorColor = "#FF6B6B"; // Rouge doux

const Login = () => {
    const { login, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    // Redirection si déjà connecté
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
        if (!email) {
            setError("Veuillez remplir tous les champs.");
            return;
        }
        try {
            await login(email, navigate);
        } catch (err) {
            setError("Erreur de connexion, vérifiez vos identifiants.");
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
                <Paper 
                    elevation={3} 
                    sx={{ 
                        p: 4, 
                        width: '100%', 
                        borderRadius: "12px",
                        backgroundColor: "#FFF5E1", // Fond doux
                        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)"
                    }}
                >
                    <Typography 
                        component="h1" 
                        variant="h5" 
                        align="center" 
                        gutterBottom
                        sx={{ color: primaryColor, fontWeight: "bold" }}
                    >
                        🔐 Connexion
                    </Typography>

                    {/* Affichage des erreurs */}
                    {error && (
                        <Typography sx={{ color: errorColor, textAlign: "center", mb: 2 }}>
                            {error}
                        </Typography>
                    )}

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
                            sx={{
                                "& label.Mui-focused": { color: accentColor },
                                "& .MuiOutlinedInput-root": {
                                    "&.Mui-focused fieldset": { borderColor: accentColor }
                                }
                            }}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ 
                                mt: 3, 
                                mb: 2, 
                                backgroundColor: primaryColor, 
                                color: "white",
                                fontWeight: "bold",
                                '&:hover': { backgroundColor: "#8DC58F" }
                            }}
                        >
                            🚀 Se connecter
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default Login;
