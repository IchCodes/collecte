import { useState } from "react";
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
    Box 
  } from "@mui/material";

const DonForm = () => {
    const [montant, setMontant] = useState("");
    const [typeDon, setTypeDon] = useState("Unique");
    const [modePaiement, setModePaiement] = useState("CB");
    const token = localStorage.getItem("token");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:3001/dons", {
                montant,
                type_don: typeDon,
                mode_paiement: modePaiement,
                donateur_id: 1,
                user_id: 1,
                statut: "En attente",
                date_heure: new Date().toISOString()
            });
            alert("Don enregistré !");
        } catch (err) {
            alert("Erreur lors de l'enregistrement");
        }
    };
    

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h4" component="h2" gutterBottom>
                    Faire un Don
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <TextField
                            type="number"
                            label="Montant"
                            value={montant}
                            onChange={e => setMontant(e.target.value)}
                            required
                            fullWidth
                        />
                        <FormControl fullWidth>
                            <InputLabel>Type de don</InputLabel>
                            <Select
                                value={typeDon}
                                label="Type de don"
                                onChange={e => setTypeDon(e.target.value)}
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
                                onChange={e => setModePaiement(e.target.value)}
                            >
                                <MenuItem value="CB">Carte Bancaire</MenuItem>
                                <MenuItem value="Espèces">Espèces</MenuItem>
                                <MenuItem value="Chèque">Chèque</MenuItem>
                                <MenuItem value="Virement">Virement</MenuItem>
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
        </Container>
    );
};

export default DonForm;
