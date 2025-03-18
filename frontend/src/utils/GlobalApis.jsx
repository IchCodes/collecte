import axios from "axios";

export async function getAllDonateurs() {
    const url = `${import.meta.env.VITE_BASE_URl}/donateurs`;
    const config = {headers: { "X-API-KEY": "bismillah" }};

    try {
        const res = await axios.get(url, config);
        return res.data;
    }
    catch (error) {
        console.error("Erreur de chargement des donateurs", error);
    }
}

export async function getAllDons() {
    const url = `${import.meta.env.VITE_BASE_URl}/dons`;
    const config = {headers: { "X-API-KEY": "bismillah" }};

    try {
        const res = await axios.get(url, config);
        return res.data;
    }
    catch (error) {
        console.error("Erreur de chargement des donateurs", error);
    }
}

export async function createDonateur(donateur) {
    const url = `${import.meta.env.VITE_BASE_URl}/donateurs`;
    const config = {headers: { "X-API-KEY": "bismillah" }};

    try {
        const res = await axios.post(url, donateur, config);
        return res.data;
    }
    catch (error) {
        console.error("Erreur de création du donateur", error);
    }
}

export async function createDon(don) {
    const url = `${import.meta.env.VITE_BASE_URl}/dons`;
    const config = {headers: { "X-API-KEY": "bismillah" }};
    
    try {
        const res = await axios.post(url, {
            montant: parseFloat(don.montant),
            typeDon: don.typeDon.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase(),
            modePaiement: don.modePaiement,
            message: don.message || "string",
            statut: "EN_ATTENTE",
            dateHeureAffichage: new Date().toISOString(),
            userId: don.userId,
            donateurId: don.donateurId,
            donateur: don.donateur
        }, config);
        return res.data;
    }
    catch (error) {
        console.error("Erreur de création du don", error);
        throw error;
    }
}