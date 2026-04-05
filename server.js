const express = require("express");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname));

async function getAccessToken() {
  const response = await fetch("https://www.strava.com/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      grant_type: "refresh_token",
      refresh_token: process.env.STRAVA_REFRESH_TOKEN,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Erreur refresh token Strava: ${errorText}`);
  }

  const data = await response.json();
  return data.access_token;
}

app.get("/api/km", async (req, res) => {
  try {
    const accessToken = await getAccessToken();
    const clubId = process.env.STRAVA_CLUB_ID;

    const response = await fetch(
      `https://www.strava.com/api/v3/clubs/${clubId}/activities`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erreur API Strava: ${errorText}`);
    }

    const activities = await response.json();

    const totalMeters = Array.isArray(activities)
      ? activities.reduce((sum, activity) => sum + (activity.distance || 0), 0)
      : 0;

    const km = Math.round(totalMeters / 1000);

    res.json({ km });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur backend", details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});