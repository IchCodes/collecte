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
  Paper,
  Checkbox
} from "@mui/material";
import {
  createDon,
  createDonateur,
  getAllDonateurs,
  updateDonateur,
} from "../utils/GlobalApis";
import { useNavigate } from "react-router-dom";

const primaryColor = "#A3D9A5"; // Vert pastel
const accentColor = "#8AAAE5"; // Bleu clair
const alertColor = "#F4A261"; // Orange doux
const backgroundColor = "#FFF5E1"; // Fond doux

const DonForm = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [montant, setMontant] = useState("");
  const [message, setMessage] = useState("");
  const [typeDon, setTypeDon] = useState("Unique");
  const [modePaiement, setModePaiement] = useState("CB");
  const [donateurs, setDonateurs] = useState([]); // Liste des donateurs récupérés depuis l'API
  const [selectedDonateur, setSelectedDonateur] = useState(null); // Donateur sélectionné
  const [inputValue, setInputValue] = useState(""); // Gère la valeur affichée dans l'Autocomplete
  const [newDonateur, setNewDonateur] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
  });
  const [openDialog, setOpenDialog] = useState(false); // État du pop-up de création
  const [douhaEnum, setDouhaEnum] = useState("");
  const [anonyme, setAnonyme] = useState(false);

  const API_BASE_URL = "/api"; // Utilisation du proxy

  // Charger les donateurs depuis l’API
  useEffect(() => {
    getAllDonateurs().then((data) => setDonateurs(data));
  }, []);

  const isContactValid = () => {
    if (typeDon === "Unique") return true;
    return email.trim() !== "" || telephone.trim() !== "";
  };

  // Vérifier si le donateur entré est dans la liste
  const handleInputChange = (event, value) => {
    setInputValue(value); // Mettre à jour ce qui s'affiche immédiatement

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
      setEmail(existingDonateur.email);
      setTelephone(existingDonateur.telephone);
      setOpenDialog(false);
    } else {
      setSelectedDonateur(null);
      setNewDonateur({ nom: value, prenom: "", email: "", telephone: "" });
      if (value.trim().length > 2) {
        setOpenDialog(true);
      }
    }
  };

  // Gestion de la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isContactValid()) {
      alert(
        "Pour une promesse ou un don récurrent, veuillez fournir au moins un email ou un numéro de téléphone."
      );
      return;
    }

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
        douhaEnum: douhaEnum,
        anonyme: anonyme,
        userId: user.id,
        donateur: {
          nom: donateurInfo.nom,
          prenom: donateurInfo.prenom,
          email: email.trim() !== "" ? email : donateurInfo.email,
          telephone:
            telephone.trim() !== "" ? telephone : donateurInfo.telephone,
        },
      });

      alert("Don enregistré !");

      await updateDonateur({
        id: donateurId,
        nom: donateurInfo.nom,
        prenom: donateurInfo.prenom,
        email: email.trim() !== "" ? email : donateurInfo.email,
        telephone: telephone.trim() !== "" ? telephone : donateurInfo.telephone,
      });

      // Réinitialisation des champs
      setMontant("");
      setTypeDon("Unique");
      setModePaiement("CB");
      setSelectedDonateur(null);
      setNewDonateur({ nom: "", prenom: "", email: "", telephone: "" });
      setOpenDialog(false);
      navigate(0);
    } catch (err) {
      alert("Erreur lors de l'enregistrement");
      console.error(err);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: "12px",
            backgroundColor: backgroundColor,
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography
            variant="h4"
            component="h2"
            align="center"
            sx={{ color: primaryColor, fontWeight: "bold", mb: 3 }}
          >
            🎁 Faire un Don
          </Typography>

          <form onSubmit={handleSubmit}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <Autocomplete
                options={donateurs}
                getOptionLabel={(option) => `${option.nom} ${option.prenom}`}
                onChange={(event, newValue) => setSelectedDonateur(newValue)}
                freeSolo
                inputValue={inputValue}
                onInputChange={handleInputChange}
                renderInput={(params) => (
                  <TextField {...params} label="Nom du Donateur" />
                )}
              />
              <TextField
                type="number"
                label="Montant"
                value={montant}
                onChange={(e) => setMontant(e.target.value)}
                required
                fullWidth
                sx={{
                  "& label.Mui-focused": { color: accentColor },
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": { borderColor: accentColor },
                  },
                }}
              />
              {/* <TextField
                type="text"
                label="Message / Invocations"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                fullWidth
                sx={{
                  "& label.Mui-focused": { color: accentColor },
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": { borderColor: accentColor },
                  },
                }}
              /> */}
              <FormControl fullWidth>
                <InputLabel>Type de don</InputLabel>
                <Select
                  value={typeDon}
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
                  onChange={(e) => setModePaiement(e.target.value)}
                >
                  <MenuItem value="CB">Carte Bancaire</MenuItem>
                  <MenuItem value="ESPECES">Espèces</MenuItem>
                  <MenuItem value="CHEQUE">Chèque</MenuItem>
                  <MenuItem value="VIREMENT">Virement</MenuItem>
                </Select>
              </FormControl>

              {(typeDon === "Promesse" || typeDon === "Récurrent") && (
                <>
                  <TextField
                    type="email"
                    label="Email *"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    sx={{
                      "& label.Mui-focused": { color: accentColor },
                      "& .MuiOutlinedInput-root": {
                        "&.Mui-focused fieldset": { borderColor: accentColor },
                      },
                    }}
                  />
                  <TextField
                    type="tel"
                    label="Téléphone *"
                    value={telephone}
                    onChange={(e) => setTelephone(e.target.value)}
                    fullWidth
                    sx={{
                      "& label.Mui-focused": { color: accentColor },
                      "& .MuiOutlinedInput-root": {
                        "&.Mui-focused fieldset": { borderColor: accentColor },
                      },
                    }}
                  />
                </>
              )}

              <FormControl fullWidth>
                <InputLabel>Type de douha</InputLabel>
                <Select
                  value={douhaEnum}
                  onChange={(e) => setDouhaEnum(e.target.value)}
                  required
                >
                  <MenuItem value="DECES">Décès</MenuItem>
                  <MenuItem value="MALADIE">Maladie</MenuItem>
                  <MenuItem value="SANTE">Santé</MenuItem>
                  <MenuItem value="EPREUVE">Épreuve</MenuItem>
                  <MenuItem value="GUIDANCE">Guidance</MenuItem>
                  <MenuItem value="RIZQ">Rizq</MenuItem>
                  <MenuItem value="ETUDE">Étude</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Checkbox
                    checked={anonyme}
                    onChange={(e) => setAnonyme(e.target.checked)}
                    sx={{ "&.Mui-checked": { color: accentColor } }}
                  />
                  <Typography>Don anonyme</Typography>
                </Box>
              </FormControl>

              <Button
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: primaryColor,
                  color: "white",
                  "&:hover": { backgroundColor: "#8DC58F" },
                  fontWeight: "bold",
                }}
                fullWidth
              >
                🚀 Envoyer
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: 4,
            backgroundColor: "#FFF5E1", // Fond doux
            padding: 2,
            boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)",
          },
        }}
      >
        <DialogTitle
          sx={{ fontWeight: "bold", color: primaryColor, textAlign: "center" }}
        >
          ✨ Créer un nouveau donateur
        </DialogTitle>

        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Nom"
            fullWidth
            value={newDonateur.nom}
            onChange={(e) =>
              setNewDonateur({ ...newDonateur, nom: e.target.value })
            }
            sx={{
              "& label.Mui-focused": { color: accentColor },
              "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                borderColor: accentColor,
              },
              "& .MuiInputLabel-root": {
                lineHeight: "1.2em",
                marginTop: "4px",
              },
              "& .MuiInputLabel-shrink": {
                transform: "translate(14px, -6px) scale(0.75)",
              },
            }}
          />
          <TextField
            label="Prénom"
            fullWidth
            value={newDonateur.prenom}
            onChange={(e) =>
              setNewDonateur({ ...newDonateur, prenom: e.target.value })
            }
            sx={{
              "& label.Mui-focused": { color: accentColor },
              "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                borderColor: accentColor,
              },
            }}
          />
          <TextField
            label="Email"
            fullWidth
            value={newDonateur.email}
            onChange={(e) =>
              setNewDonateur({ ...newDonateur, email: e.target.value })
            }
            sx={{
              "& label.Mui-focused": { color: accentColor },
              "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                borderColor: accentColor,
              },
            }}
          />
          <TextField
            label="Téléphone"
            fullWidth
            value={newDonateur.telephone}
            onChange={(e) =>
              setNewDonateur({ ...newDonateur, telephone: e.target.value })
            }
            sx={{
              "& label.Mui-focused": { color: accentColor },
              "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                borderColor: accentColor,
              },
            }}
          />
        </DialogContent>

        <DialogActions sx={{ justifyContent: "space-between", px: 3, pb: 2 }}>
          <Button
            onClick={() => setOpenDialog(false)}
            sx={{
              textTransform: "none",
              color: "#666",
              fontWeight: "bold",
              "&:hover": { backgroundColor: "#eee" },
            }}
          >
            Annuler
          </Button>
          <Button
            onClick={() => {
              if (newDonateur.nom && newDonateur.prenom) {
                const newEntry = { ...newDonateur };
                setSelectedDonateur(newEntry);
                setDonateurs((prev) => [...prev, newEntry]);
                setInputValue(`${newEntry.nom} ${newEntry.prenom}`);
                setOpenDialog(false);
              } else {
                alert("Veuillez remplir au moins le nom et le prénom");
              }
            }}
            variant="contained"
            sx={{
              backgroundColor: primaryColor,
              color: "white",
              textTransform: "none",
              fontWeight: "bold",
              "&:hover": { backgroundColor: "#8DC58F" },
            }}
          >
            Valider
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DonForm;
