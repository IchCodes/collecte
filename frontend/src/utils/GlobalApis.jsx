import axios from "axios";

export async function getAllDonateurs() {
    const url = `${import.meta.env.VITE_BASE_URl}/donateurs`;
    const config = {headers: { "X-API-KEY": "bismillah" }};
    console.log(url);

    try {
        const res = await axios.get(url, config);
        console.log("Donateurs chargés", res.data);
        return res.data;
    }
    catch (error) {
        console.error("Erreur de chargement des donateurs", error);
    }
}