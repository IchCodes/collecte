import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Box, Typography, Paper, Grid } from "@mui/material";
import { getAllDons, donEnAttente } from "../utils/GlobalApis";

const Stats = () => {
  const COLORS = ["#A3D9A5", "#8AAAE5", "#F4A261"];
  const [totalDons, setTotalDons] = useState(0);
  const [donsEnAttente, setDonsEnAttente] = useState(0);
  const [donsParType, setDonsParType] = useState([]);
  const [donsMontantParType, setDonsMontantParType] = useState([]);
  const [totalMontant, setTotalMontant] = useState(0);

  const fetchData = async () => {
    try {
      const allDons = await getAllDons();
      setTotalDons(allDons.length);

      // Calculer les dons par type
      const typesCount = allDons.reduce((acc, don) => {
        acc[don.typeDon] = (acc[don.typeDon] || 0) + 1;
        return acc;
      }, {});

      // Calculer les montants par type
      const typesMontant = allDons.reduce((acc, don) => {
        acc[don.typeDon] = (acc[don.typeDon] || 0) + don.montant;
        return acc;
      }, {});

      const formattedDonsParType = Object.entries(typesCount).map(([name, value]) => ({
        name,
        value,
      }));
      
      const formattedDonsMontant = Object.entries(typesMontant).map(([type, montant]) => ({
        type,
        montant,
      }));

      setDonsParType(formattedDonsParType);
      setDonsMontantParType(formattedDonsMontant);
      setTotalMontant(allDons.reduce((sum, don) => sum + don.montant, 0));

      const donsNonTraites = await donEnAttente();
      setDonsEnAttente(donsNonTraites.length);
    } catch (error) {
      console.error("Erreur lors de la récupération des données", error);
    }
  };

  useEffect(() => {
    // Première récupération des données
    fetchData();

    // Mettre en place l'intervalle de 10 secondes
    const interval = setInterval(fetchData, 10000);

    // Nettoyer l'intervalle lors du démontage du composant
    return () => clearInterval(interval);
  }, []);

  return (
    <Box sx={{ padding: 4 }}>
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ fontWeight: "bold", color: "#8AAAE5" }}
      >
        📊 Statistiques des Dons
      </Typography>

      <Grid container spacing={4}>
        {/* Graphique 1 : Nombre total de dons vs traités */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            sx={{ padding: 2, borderRadius: 3, backgroundColor: "#FFF5E1" }}
          >
            <Typography variant="h6" gutterBottom align="center">
              Dons récoltés vs traités
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={[
                  { name: "Total", value: totalDons },
                  { name: "Traités", value: totalDons - donsEnAttente },
                ]}
                margin={{ top: 30 }}
              >
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar
                  dataKey="value"
                  fill="#A3D9A5"
                  radius={[4, 4, 0, 0]}
                  label={{
                    position: "top",
                    fill: "#333",
                    fontSize: 14,
                    fontWeight: "bold",
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Graphique 2 : Répartition par type de dons */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            sx={{ padding: 2, borderRadius: 3, backgroundColor: "#FFF5E1" }}
          >
            <Typography variant="h6" gutterBottom align="center">
              Répartition par type de dons
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={donsParType}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {donsParType.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Montant total en euros */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            sx={{ padding: 2, borderRadius: 3, backgroundColor: "#FFF5E1" }}
          >
            <Typography variant="h6" gutterBottom align="center">
              💶 Total collecté en euros
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={[{ name: "Total", montant: totalMontant }]}
                margin={{ top: 30 }}
              >
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip formatter={(value) => `${value} €`} />
                <Bar
                  dataKey="montant"
                  fill="#8AAAE5"
                  radius={[4, 4, 0, 0]}
                  label={{
                    position: "top",
                    fill: "#333",
                    fontSize: 14,
                    fontWeight: "bold",
                    formatter: (val) => `${val} €`,
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Répartition en euros par type de don */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            sx={{ padding: 2, borderRadius: 3, backgroundColor: "#FFF5E1" }}
          >
            <Typography variant="h6" gutterBottom align="center">
              📂 Montants par type de don
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={donsMontantParType}
                  dataKey="montant"
                  nameKey="type"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(0)}%)`
                  }
                >
                  {donsMontantParType.map((entry, index) => (
                    <Cell
                      key={`cell-euro-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value} €`} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Graphique 3 : Montant par type de don */}
        <Grid item xs={12} md={12}>
          <Paper
            elevation={3}
            sx={{ padding: 2, borderRadius: 3, backgroundColor: "#FFF5E1" }}
          >
            <Typography variant="h6" gutterBottom align="center">
              📂 Montants en € par type de don
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={donsMontantParType} margin={{ top: 30 }}>
                <XAxis dataKey="type" />
                <YAxis allowDecimals={false} />
                <Tooltip formatter={(value) => `${value} €`} />
                <Bar
                  dataKey="montant"
                  radius={[4, 4, 0, 0]}
                  label={{
                    position: "top",
                    fill: "#333",
                    fontSize: 14,
                    fontWeight: "bold",
                  }}
                >
                  {donsMontantParType.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Stats;