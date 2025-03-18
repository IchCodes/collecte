import { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Box,
  Autocomplete,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import {
  createDon,
  createDonateur,
  getAllDonateurs,
} from "../utils/GlobalApis";

const DonForm = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [montant, setMontant] = useState("");
  const [typeDon, setTypeDon] = useState("Unique");
  const [modePaiement, setModePaiement] = useState("CB");
  const [donateurs, setDonateurs] = useState([]); // Liste des donateurs récupérés depuis l'API
  const [selectedDonateur, setSelectedDonateur] = useState(null); // Donateur sélectionné
  const [newDonateur, setNewDonateur] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
  });
  const [openDialog, setOpenDialog] = useState(false); // État du pop-up de création

  const API_BASE_URL = "/api"; // Utilisation du proxy

  console.log(user);

  // Charger les donateurs depuis l’API
  useEffect(() => {
    getAllDonateurs().then((data) => setDonateurs(data));
  }, []);

  // Vérifier si le donateur entré est dans la liste
  const handleInputChange = (event, value) => {
    const existingDonateur = donateurs.find(
      (d) => `${d.nom} ${d.prenom}`.toLowerCase() === value.toLowerCase()
    );

    if (existingDonateur) {
      setSelectedDonateur(existingDonateur);
      setNewDonateur({
        nom: existingDonateur.nom,
        prenom: existingDonateur.prenom,
        email: existingDonateur.email,
        telephone: existingDonateur.telephone,
      });
      setOpenDialog(false);
    } else {
      setSelectedDonateur({ nom: value, prenom: "", email: "", telephone: "" });
      setNewDonateur({ nom: value, prenom: "", email: "", telephone: "" });
      if (value.trim().length > 2) {
        setOpenDialog(true);
      }
    }
  };

  // Gestion de la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let donateurId = selectedDonateur ? selectedDonateur.id : null;
      let donateurInfo = null;

      if (!selectedDonateur) {
        // Créer le nouveau donateur
        const nouveauDonateur = await createDonateur(newDonateur);
        donateurId = nouveauDonateur.id;
        donateurInfo = newDonateur;
        setDonateurs([...donateurs, nouveauDonateur]);
      } else {
        donateurInfo = selectedDonateur;
      }

      // Créer le don avec le nouveau format
      await createDon({
        montant: parseFloat(montant),
        typeDon,
        modePaiement,
        message: "",
        donateurId: donateurId,
        userId: user.id,
        donateur: {
          nom: donateurInfo.nom,
          prenom: donateurInfo.prenom,
          email: donateurInfo.email,
          telephone: donateurInfo.telephone,
        },
      });

      alert("Don enregistré !");
      // Réinitialisation des champs
      setMontant("");
      setTypeDon("Unique");
      setModePaiement("CB");
      setSelectedDonateur(null);
      setNewDonateur({ nom: "", prenom: "", email: "", telephone: "" });
      setOpenDialog(false);
    } catch (err) {
      alert("Erreur lors de l'enregistrement");
      console.error(err);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Faire un Don
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Auto-complétion Donateur */}
            <Autocomplete
              options={donateurs}
              getOptionLabel={(option) => `${option.nom} ${option.prenom}`}
              onChange={(event, newValue) => setSelectedDonateur(newValue)}
              freeSolo
              renderInput={(params) => (
                <TextField {...params} label="Nom du Donateur" />
              )}
              onInputChange={handleInputChange} // Vérifie l'entrée utilisateur
            />

            <TextField
              type="number"
              label="Montant"
              value={montant}
              onChange={(e) => setMontant(e.target.value)}
              required
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Type de don</InputLabel>
              <Select
                value={typeDon}
                label="Type de don"
                onChange={(e) => setTypeDon(e.target.value)}
              >
                <MenuItem value="Unique">Unique</MenuItem>
                <MenuItem value="Promesse">Promesse</MenuItem>
                <MenuItem value="Récurrent">Récurrent</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Mode de paiement</InputLabel>
              <Select
                value={modePaiement}
                label="Mode de paiement"
                onChange={(e) => setModePaiement(e.target.value)}
              >
                <MenuItem value="CB">Carte Bancaire</MenuItem>
                <MenuItem value="ESPECES">Espèces</MenuItem>
                <MenuItem value="CHEQUE">Chèque</MenuItem>
                <MenuItem value="VIREMENT">Virement</MenuItem>
              </Select>
            </FormControl>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
            >
              Envoyer
            </Button>
          </Box>
        </form>
      </Box>

      {/* POPUP DE CRÉATION DU DONATEUR */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Créer un nouveau donateur</DialogTitle>
        <DialogContent>
          <TextField
            label="Nom"
            fullWidth
            value={newDonateur.nom}
            onChange={(e) =>
              setNewDonateur({ ...newDonateur, nom: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <TextField
            label="Prénom"
            fullWidth
            value={newDonateur.prenom}
            onChange={(e) =>
              setNewDonateur({ ...newDonateur, prenom: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <TextField
            label="email"
            fullWidth
            value={newDonateur.email}
            onChange={(e) =>
              setNewDonateur({ ...newDonateur, email: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <TextField
            label="Téléphone"
            fullWidth
            value={newDonateur.telephone}
            onChange={(e) =>
              setNewDonateur({ ...newDonateur, telephone: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Annuler</Button>
          <Button
            onClick={() => {
              if (newDonateur.nom && newDonateur.prenom) {
                setSelectedDonateur({ ...newDonateur });
                setDonateurs((prev) => [...prev, newDonateur]); // Ajouter à la liste des donateurs visibles
                setOpenDialog(false);
              } else {
                alert("Veuillez remplir au moins le nom et le prénom");
              }
            }}
            variant="contained"
            color="primary"
          >
            Valider
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DonForm;
