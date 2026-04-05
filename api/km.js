export default async function handler(req, res) {
  try {
    const response = await fetch(
      `https://www.strava.com/api/v3/clubs/${process.env.STRAVA_CLUB_ID}/activities`,
      {
        headers: {
          Authorization: `Bearer ${process.env.STRAVA_ACCESS_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: errorText });
    }

    const activities = await response.json();

    const totalMeters = Array.isArray(activities)
      ? activities.reduce((sum, activity) => sum + (activity.distance || 0), 0)
      : 0;

    const km = Math.round(totalMeters / 1000);

    return res.status(200).json({ km });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}