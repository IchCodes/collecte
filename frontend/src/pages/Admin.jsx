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

  const fetchDons = async () => {
    setLoading(true);
    setRefreshing(true);
    try {
      const data = await getAllDons();
      setDons(data.sort((a, b) => new Date(b.dateHeureAffichage) - new Date(a.dateHeureAffichage)));
    } catch (error) {
      console.error("Erreur lors de la récupération des dons:", error);
    }
    setTimeout(() => {
      setLoading(false);
      setRefreshing(false);
    }, 500);
  };

  useEffect(() => {
    fetchDons();
    const interval = setInterval(() => fetchDons(), 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" sx={{ my: 3, textAlign: "center", color: "#333" }}>
        Liste des Dons Collectés
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
        <Button
          variant="contained"
          sx={{ backgroundColor: "#A3D9A5", color: "white", '&:hover': { backgroundColor: "#8DC58F" } }}
          onClick={fetchDons}
          disabled={refreshing}
        >
          {refreshing ? "Mise à jour..." : "Rafraîchir maintenant"}
        </Button>
      </Box>

      {loading && <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}><CircularProgress /></Box>}

      <TableContainer component={Paper} sx={{ borderRadius: "12px", overflow: "hidden", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#8AAAE5" }}>
            <TableRow>
              {["ID", "Donateur", "Montant", "Type", "Paiement", "Date", "Statut"].map((head) => (
                <TableCell key={head} sx={{ color: "white", fontWeight: "bold" }}>{head}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {dons.map((don) => (
              <TableRow key={don.id}>
                <TableCell>{don.id}</TableCell>
                <TableCell>{don.donateur ? `${don.donateur.nom} ${don.donateur.prenom}` : "Anonyme"}</TableCell>
                <TableCell sx={{ color: "#A3D9A5", fontWeight: "bold" }}>{don.montant} €</TableCell>
                <TableCell>{don.typeDon}</TableCell>
                <TableCell>{don.modePaiement}</TableCell>
                <TableCell>{new Date(don.dateHeureAffichage).toLocaleString()}</TableCell>
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
