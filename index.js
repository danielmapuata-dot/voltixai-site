const express = require('express');
const app = express();
require('dotenv').config();
app.use(express.static('public'));

// 🔑 Clés sécurisées
const ANYSPORT_KEY = process.env.ANYSPORT_API_KEY;
const ANYSPORT_URL = process.env.ANYSPORT_API_URL;

// 🧠 Moteur de pronostic IA (basé sur données AnySport)
function analyserMatch(match) {
  const fDom = match.home_team?.form || 5;
  const fExt = match.away_team?.form || 5;
  const bDom = match.home_team?.avg_goals || 1;
  const bExt = match.away_team?.avg_goals || 1;

  let scoreDom = fDom * 2 + bDom * 1.5;
  let scoreExt = fExt * 2 + bExt * 1.5;

  let conseil, conf;
  if (scoreDom > scoreExt + 0.5) { conseil = `Victoire ${match.home_team.name}`; conf = 90; }
  else if (scoreExt > scoreDom + 0.5) { conseil = `Victoire ${match.away_team.name}`; conf = 90; }
  else { conseil = "Match Nul"; conf = 70; }

  const total = bDom + bExt;
  const plusMoins = total > 2.5 ? "Plus de 2.5 buts" : "Moins de 2.5 buts";

  return { conseil, confiance: conf, plusMoins };
}

// 📡 Route API : Récupère tout depuis AnySport
app.get('/api/data', async (req, res) => {
  try {
    const reponse = await fetch(`${ANYSPORT_URL}/matches`, {
      headers: { 'X-API-Key': ANYSPORT_KEY }
    });
    const data = await reponse.json();

    // Ajouter le pronostic IA à chaque match
    const matchsAvecProno = data.data.map(m => ({
      ...m,
      pronostic: analyserMatch(m)
    }));

    res.json({ ok: true, matchs: matchsAvecProno });
  } catch (err) {
    res.status(500).json({ ok: false, erreur: err.message });
  }
});

// 🚀 Lancer
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("✅ Serveur prêt sur Render !"));
