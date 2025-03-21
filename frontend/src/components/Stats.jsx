import React from "react";
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

// Données simulées
const totalDons = 100;
const donsTraites = 43;
const donsParType = [
  { name: "Récurrents", value: 30 },
  { name: "Promesses", value: 40 },
  { name: "Uniques", value: 30 },
];

const COLORS = ["#A3D9A5", "#8AAAE5", "#F4A261"];

const Stats = () => {
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
                  { name: "Traités", value: donsTraites },
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
      </Grid>
    </Box>
  );
};

export default Stats;
