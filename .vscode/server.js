const express = require("express");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname));

app.get("/api/km", async (req, res) => {
  try {
    const clubId = process.env.STRAVA_CLUB_ID;
    const token = process.env.STRAVA_ACCESS_TOKEN;

    const response = await fetch(
      `https://www.strava.com/api/v3/clubs/${clubId}/activities`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        error: "Erreur API Strava",
        details: errorText,
      });
    }

    const activities = await response.json();

    const totalMeters = Array.isArray(activities)
      ? activities.reduce((sum, activity) => sum + (activity.distance || 0), 0)
      : 0;

    const km = Math.round(totalMeters / 1000);

    res.json({ km });
  } catch (error) {
    console.error("Erreur backend :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});