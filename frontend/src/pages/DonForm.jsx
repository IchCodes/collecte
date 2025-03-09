import { useState } from "react";
import axios from "axios";

const DonForm = () => {
    const [montant, setMontant] = useState("");
    const [typeDon, setTypeDon] = useState("Unique");
    const [modePaiement, setModePaiement] = useState("CB");
    const token = localStorage.getItem("token");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("/api/dons", { montant, type_don: typeDon, mode_paiement: modePaiement }, 
                { headers: { Authorization: `Bearer ${token}` } });
            alert("Don enregistré !");
        } catch (err) {
            alert("Erreur lors de l'enregistrement");
        }
    };

    return (
        <div>
            <h2>Faire un Don</h2>
            <form onSubmit={handleSubmit}>
                <input type="number" value={montant} onChange={e => setMontant(e.target.value)} placeholder="Montant" required />
                <select value={typeDon} onChange={e => setTypeDon(e.target.value)}>
                    <option value="Unique">Unique</option>
                    <option value="Promesse">Promesse</option>
                    <option value="Récurrent">Récurrent</option>
                </select>
                <select value={modePaiement} onChange={e => setModePaiement(e.target.value)}>
                    <option value="CB">Carte Bancaire</option>
                    <option value="Espèces">Espèces</option>
                    <option value="Chèque">Chèque</option>
                    <option value="Virement">Virement</option>
                </select>
                <button type="submit">Envoyer</button>
            </form>
        </div>
    );
};

export default DonForm;
