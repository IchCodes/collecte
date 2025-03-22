import { useState, useEffect } from "react";
import { donEnAttente, getAllDons, updateStatuDon } from "../utils/GlobalApis";
import {
  Container,
  Typography,
  Paper,
  Button,
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import Stats from "../components/Stats";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

// Palette de couleurs
const primaryColor = "#8AAAE5"; // Bleu doux
const accentColor = "#F4A261"; // Orange pastel
const successColor = "#A3D9A5"; // Vert clair
const messageColor = "#B388EB"; // Violet doux

const Animateur = () => {
  const [dons, setDons] = useState([]); // Liste complète des dons
  const [currentIndex, setCurrentIndex] = useState(0); // Index du don affiché
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md")); // Affiche à partir de "md" (>= 960px)

  // Fonction pour récupérer et trier les dons
  const fetchDons = async () => {
    setLoading(true);
    try {
      const data = await donEnAttente();

      // Trier les dons du PLUS ANCIEN au PLUS RÉCENT
      const sortedDons = data.sort(
        (a, b) =>
          new Date(a.dateHeureAffichage) - new Date(b.dateHeureAffichage)
      );

      setDons(sortedDons);
    } catch (error) {
      console.error("Erreur lors de la récupération des dons:", error);
    }
    setLoading(false);
  };

  // Chargement initial + rafraîchissement auto toutes les 10s
  useEffect(() => {
    fetchDons();
    const interval = setInterval(() => fetchDons(), 10000);
    return () => clearInterval(interval);
  }, []);

  // Fonction pour passer au don suivant
  const handleNextDon = () => {
    console.log("Don suivant:", dons[currentIndex]);
    updateStatuDon(dons[currentIndex].id);
    if (currentIndex < dons.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // Don en cours
  const currentDon = dons[currentIndex];

  return (
    <Container maxWidth="md" sx={{ textAlign: "center", mt: 5 }}>
      <Typography
        variant="h4"
        sx={{ mb: 3, fontWeight: "bold", color: primaryColor }}
      >
        🔊 Annonce des Dons
      </Typography>

      {/* Affichage du don en grand */}
      {loading ? (
        <CircularProgress />
      ) : currentDon ? (
        <Paper
          elevation={3}
          sx={{
            p: 4,
            mb: 3,
            borderRadius: "12px",
            backgroundColor: "#FFF5E1", // Fond doux
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography variant="h5" sx={{ color: accentColor }}>
            🎁 Don de{" "}
            <b>
              {currentDon.anonyme
                ? "Anonyme"
                : currentDon.donateur
                ? `${currentDon.donateur.nom} ${currentDon.donateur.prenom}`
                : "Anonyme"}
            </b>
          </Typography>
          <Typography
            variant="h3"
            sx={{ mt: 2, fontWeight: "bold", color: successColor }}
          >
            {currentDon.montant} €
          </Typography>
          {currentDon.douhaEnum && (
            <Typography
              variant="h6"
              sx={{ mt: 2, fontStyle: "italic", color: messageColor }}
            >
              ✨ "Invocation pour {currentDon.douhaEnum}"
            </Typography>
          )}
        </Paper>
      ) : (
        <Typography variant="h6" color="error">
          Aucun don à annoncer.
        </Typography>
      )}

      {/* Bouton pour passer au don suivant */}
      <Button
        variant="contained"
        sx={{
          backgroundColor: primaryColor,
          color: "white",
          fontWeight: "bold",
          px: 3,
          py: 1.5,
          borderRadius: "8px",
          "&:hover": { backgroundColor: "#6C93D6" },
        }}
        onClick={handleNextDon}
        disabled={currentIndex >= dons.length - 1}
      >
        ⏭️ Annoncer le Don Suivant
      </Button>

      {/* Aperçu des prochains dons */}
      {dons.length > 1 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, color: accentColor }}>
            📢 Prochains Dons :
          </Typography>
          <List sx={{ backgroundColor: "#F8F9FA", borderRadius: "8px", p: 2 }}>
            {dons
              .slice(currentIndex + 1, currentIndex + 4)
              .map((don, index) => (
                <ListItem key={don.id} divider>
                  <ListItemText
                    primary={
                      <Typography
                        sx={{ fontWeight: "bold", color: primaryColor }}
                      >
                        {don.anonyme
                          ? "Anonyme"
                          : don.donateur
                          ? don.donateur.nom
                          : "Anonyme"}{" "}
                        - {don.montant} €
                      </Typography>
                    }
                    secondary={
                      don.douhaEnum ? (
                        <Typography sx={{ color: messageColor }}>
                          {" "}
                          "{don.douhaEnum}"{" "}
                        </Typography>
                      ) : (
                        ""
                      )
                    }
                  />
                </ListItem>
              ))}
          </List>
        </Box>
      )}
    </Container>
  );
};

export default Animateur;
