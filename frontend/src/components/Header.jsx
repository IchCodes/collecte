import React, { useContext, useState } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Typography,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  useMediaQuery,
} from "@mui/material";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";
import { Logout, Login, Menu as MenuIcon } from "@mui/icons-material";
import AuthContext from "../context/AuthContext";

// Styles
const GlassAppBar = styled(AppBar)({
  background: "rgba(138, 170, 229, 0.9)",
  backdropFilter: "blur(12px)",
  borderRadius: "12px",
  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
  padding: "8px 0",
  margin: "10px",
  width: "calc(100% - 20px)",
});

const StyledButton = styled(Button)({
  textTransform: "none",
  fontSize: "16px",
  padding: "8px 16px",
  borderRadius: "8px",
  backgroundColor: "#F7CAC9",
  color: "white",
  "&:hover": {
    backgroundColor: "#E6A6B2",
  },
});

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const getNavigationItems = () => {
    const navItems = [];

    if (user?.role === "ADMINISTRATEUR") {
      navItems.push(
        { label: "Tableau de bord", path: "/admin" },
        { label: "Collecte", path: "/don" },
        { label: "Animation", path: "/animateur" }
      );
    }

    if (user) {
      navItems.push({ label: "Déconnexion", action: () => logout(navigate) });
    } else {
      navItems.push({ label: "Connexion", path: "/login" });
    }

    return navItems;
  };

  const renderButtons = () =>
    getNavigationItems().map((item, index) =>
      item.path ? (
        <StyledButton key={index} onClick={() => navigate(item.path)} sx={{ mr: 1 }}>
          {item.label}
        </StyledButton>
      ) : (
        <StyledButton key={index} onClick={item.action} sx={{ mr: 1 }}>
          {item.label}
        </StyledButton>
      )
    );

  const renderDrawer = () => (
    <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
      <Box sx={{ width: 250, p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Menu
        </Typography>
        <Divider />
        <List>
          {getNavigationItems().map((item, index) => (
            <ListItem
              button
              key={index}
              onClick={() => {
                setDrawerOpen(false);
                item.path ? navigate(item.path) : item.action();
              }}
            >
              <ListItemText primary={item.label} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );

  return (
    <>
      <GlassAppBar position="static" elevation={0}>
        <Toolbar sx={{ px: 3 }} className="flex justify-between w-full">
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
            {!isMobile ? (
              renderButtons()
            ) : (
              <>
                <IconButton color="inherit" onClick={() => setDrawerOpen(true)}>
                  <MenuIcon />
                </IconButton>
              </>
            )}
          </Box>
        </Toolbar>
      </GlassAppBar>

      {isMobile && renderDrawer()}
    </>
  );
};

export default Header;
