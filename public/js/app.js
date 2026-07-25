async function charger() {
  try {
    const res = await fetch('/api/data');
    const data = await res.json();
    if (!data.ok) throw new Error("Erreur API");

    document.getElementById('contenu').innerHTML = data.matchs.map(m => `
      <div class="match">
        <strong>${m.home_team.name} vs ${m.away_team.name}</strong><br>
        Score : ${m.score?.home ?? 0} - ${m.score?.away ?? 0} | ${m.status}<br>
        <div class="prono">🤖 Prono : ${m.pronostic.conseil} (${m.pronostic.confiance}%) | ${m.pronostic.plusMoins}</div>
      </div>
    `).join('');
  } catch (e) {
    document.getElementById('contenu').innerHTML = "⚠️ Vérifie ta clé AnySport ou l'hébergement.";
  }
}

charger();
setInterval(charger, 3 * 60 * 1000); // Toutes les 3min
