async function charger() {
  try {
    const res = await fetch('/api/data');
    const data = await res.json();
    
    const conteneur = document.getElementById('contenu');
    if (!data.ok) throw new Error(data.erreur);

    if (!data.matchs.length) {
      conteneur.innerHTML = `<p style="color:#666">⚽ Aucun match en direct pour le moment. Reviens plus tard !</p>`;
      return;
    }

    conteneur.innerHTML = data.matchs.map(m => `
      <div class="match-card">
        <h4>${m.home_team.name} vs ${m.away_team.name}</h4>
        <p>Score : ${m.score?.home ?? 0} - ${m.score?.away ?? 0} | Statut : ${m.status}</p>
        <div class="prono">
          🤖 Pronostic IA : <strong>${m.pronostic.conseil}</strong> (Confiance : ${m.pronostic.confiance}%)<br>
          📊 Conseil buteur : ${m.pronostic.plusMoins}
        </div>
      </div>
    `).join('');
  } catch (e) {
    document.getElementById('contenu').innerHTML = `
      <div style="background:#fff3cd;border:1px solid #ffeeba;padding:1rem;border-radius:8px;color:#856404">
        ⚠️ <strong>Données en attente :</strong> Vérifie que ta clé AnySport est bien configurée sur Render (Environment Variables).<br>
        Ceci arrive souvent quand on vient de déployer.
      </div>`;
  }
}
