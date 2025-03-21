import React, { useContext } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";
import { AccountCircle, Logout, Login } from "@mui/icons-material";
import AuthContext from "../context/AuthContext";

// Styles avec une palette pastel et du contraste
const GlassAppBar = styled(AppBar)({
  background: "rgba(138, 170, 229, 0.9)",
  backdropFilter: "blur(12px)",
  borderRadius: "12px",
  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
  padding: "8px 0",
  margin: "10px",
  width: "calc(100% - 20px)", // Ajouté pour compenser les marges
});

const StyledButton = styled(Button)({
  textTransform: "none",
  fontSize: "16px",
  padding: "8px 16px",
  borderRadius: "8px",
  backgroundColor: "#F7CAC9", // Rose pastel
  color: "white",
  "&:hover": {
    backgroundColor: "#E6A6B2",
  },
});

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const getNavigationButtons = () => {
    if (user?.role === "ADMINISTRATEUR") {
      return (
        <>
          <StyledButton onClick={() => navigate("/admin")} sx={{ mr: 1 }}>
            Tableau de bord
          </StyledButton>
          <StyledButton onClick={() => navigate("/don")} sx={{ mr: 1 }}>
            Collecte
          </StyledButton>
          <StyledButton onClick={() => navigate("/animateur")} sx={{ mr: 1 }}>
            Animation
          </StyledButton>
        </>
      );
    }
    return null;
  };

  return (
    <GlassAppBar position="static" elevation={0}>
      <Toolbar className="flex justify-between w-full" sx={{ px: 3 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            cursor: "pointer",
            transition: "0.3s",
            color: "#fff",
            "&:hover": { color: "#F5F5F5" },
          }}
          onClick={() => navigate("/")}
        >
          DonaGo
        </Typography>

        <Box ml="auto" display="flex" alignItems="center" gap={2}>
          {user && getNavigationButtons()}
          {user ? (
            <StyledButton
              onClick={() => logout(navigate)}
              startIcon={<Logout />}
            >
              Déconnexion
            </StyledButton>
          ) : (
            <StyledButton
              onClick={() => navigate("/login")}
              startIcon={<Login />}
            >
              Connexion
            </StyledButton>
          )}
        </Box>
      </Toolbar>
    </GlassAppBar>
  );
};

export default Header;
