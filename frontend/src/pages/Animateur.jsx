import { useState, useEffect } from "react";
import { getAllDons } from "../utils/GlobalApis";
import {
  Container,
  Typography,
  Paper,
  Button,
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemText
} from "@mui/material";

const Animateur = () => {
  const [dons, setDons] = useState([]);  // Liste complète des dons
  const [currentIndex, setCurrentIndex] = useState(0); // Index du don affiché
  const [loading, setLoading] = useState(false);

  // Fonction pour récupérer les dons et les trier
  const fetchDons = async () => {
    setLoading(true);
    try {
      const data = await getAllDons();

      console.log("Dons récupérés:", data);
  
      // Trier les dons du PLUS ANCIEN au PLUS RÉCENT
      const sortedDons = data.sort((a, b) => new Date(a.dateHeureAffichage) - new Date(b.dateHeureAffichage));

      console.log("Dons triés:", sortedDons);
      
      setDons(sortedDons);
    } catch (error) {
      console.error("Erreur lors de la récupération des dons:", error);
    }
    setLoading(false);
  };
  

  // Chargement initial et rafraîchissement automatique
  useEffect(() => {
    fetchDons();
    const interval = setInterval(() => {
      fetchDons();
    }, 10000); // Rafraîchissement toutes les 10 secondes

    return () => clearInterval(interval);
  }, []);

  // Fonction pour passer au don suivant
  const handleNextDon = () => {
    if (currentIndex < dons.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // Don en cours
  const currentDon = dons[currentIndex];

  return (
    <Container maxWidth="md" sx={{ textAlign: "center", mt: 5 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        🔊 Annonce des Dons
      </Typography>

      {/* Affichage du don en grand */}
      {loading ? (
        <CircularProgress />
      ) : currentDon ? (
        <Paper elevation={3} sx={{ p: 4, mb: 3 }}>
          <Typography variant="h5">
            🎁 Don de <b>{currentDon.donateur ? `${currentDon.donateur.nom} ${currentDon.donateur.prenom}` : "Anonyme"}</b>
          </Typography>
          <Typography variant="h3" color="primary" sx={{ mt: 2, fontWeight: "bold" }}>
            {currentDon.montant} €
          </Typography>
          {currentDon.message && (
            <Typography variant="h6" sx={{ mt: 2, fontStyle: "italic", color: "gray" }}>
              ✨ "{currentDon.message}"
            </Typography>
          )}
        </Paper>
      ) : (
        <Typography variant="h6" color="error">Aucun don à annoncer.</Typography>
      )}

      {/* Bouton pour passer au don suivant */}
      <Button
        variant="contained"
        color="secondary"
        onClick={handleNextDon}
        disabled={currentIndex >= dons.length - 1}
      >
        ⏭️ Annoncer le Don Suivant
      </Button>

      {/* Aperçu des prochains dons */}
      {dons.length > 1 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>📢 Prochains Dons :</Typography>
          <List>
            {dons.slice(currentIndex + 1, currentIndex + 4).map((don, index) => (
              <ListItem key={don.id} divider>
                <ListItemText
                  primary={`${don.donateur ? don.donateur.nom : "Anonyme"} - ${don.montant} €`}
                  secondary={don.message ? `"${don.message}"` : ""}
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
