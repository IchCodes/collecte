import { useState, useEffect } from "react";
import { getAllDons } from "../utils/GlobalApis";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Box,
} from "@mui/material";

const Admin = () => {
  const [dons, setDons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Fonction pour récupérer les dons
  const fetchDons = async () => {
    setLoading(true); // Active le spinner avant la requête
    setRefreshing(true); // Désactive le bouton "Rafraîchir maintenant"

    try {
      const data = await getAllDons();
      setDons(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des dons:", error);
    }

    setTimeout(() => {
      setLoading(false); // Désactive le spinner après un petit délai
      setRefreshing(false);
    }, 500); // Petit délai pour l'animation
  };

  // Chargement initial et mise à jour automatique toutes les 10s
  useEffect(() => {
    fetchDons();
    const interval = setInterval(() => {
      fetchDons();
    }, 10000); // Rafraîchissement auto toutes les 10s

    return () => clearInterval(interval); // Nettoyage du timer
  }, []);

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" sx={{ my: 3, textAlign: "center" }}>
        Liste des Dons Collectés
      </Typography>

      {/* Bouton de rafraîchissement */}
      <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={fetchDons}
          disabled={refreshing}
        >
          {refreshing ? "Mise à jour..." : "Rafraîchir maintenant"}
        </Button>
      </Box>

      {/* Indicateur de rafraîchissement automatique */}
      {/* Indicateur de rafraîchissement automatique */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Tableau des dons */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <b>ID</b>
              </TableCell>
              <TableCell>
                <b>Donateur</b>
              </TableCell>
              <TableCell>
                <b>Montant</b>
              </TableCell>
              <TableCell>
                <b>Type</b>
              </TableCell>
              <TableCell>
                <b>Mode de paiement</b>
              </TableCell>
              <TableCell>
                <b>Date</b>
              </TableCell>
              <TableCell>
                <b>Statut</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dons.map((don) => (
              <TableRow key={don.id}>
                <TableCell>{don.id}</TableCell>
                <TableCell>
                  {don.donateur
                    ? `${don.donateur.nom} ${don.donateur.prenom}`
                    : "Anonyme"}
                </TableCell>
                <TableCell>{don.montant} €</TableCell>
                <TableCell>{don.typeDon}</TableCell>
                <TableCell>{don.modePaiement}</TableCell>
                <TableCell>
                  {new Date(don.dateHeureAffichage).toLocaleString()}
                </TableCell>
                <TableCell>{don.statut}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Admin;
