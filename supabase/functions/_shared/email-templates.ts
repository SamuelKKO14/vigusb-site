// ─── Vigus'B Email Templates ───
// Charte : violet #7B2D8B, vert #8DB542, Poppins, mobile-first, ton Gen Z

const BASE_STYLE = `
<style>
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Poppins', sans-serif; background: #f5f5f5; color: #1a1a1a; }
  .container { max-width: 480px; margin: 0 auto; background: #ffffff; }
  .header { background: #7B2D8B; padding: 24px 20px; text-align: center; }
  .header h1 { color: #ffffff; font-size: 20px; font-weight: 700; }
  .header .logo { font-size: 24px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px; }
  .accent { color: #8DB542; }
  .body { padding: 24px 20px; }
  .body h2 { font-size: 18px; font-weight: 700; color: #7B2D8B; margin-bottom: 16px; }
  .body p { font-size: 14px; line-height: 1.6; margin-bottom: 12px; }
  .card { background: #f9f5fb; border-left: 4px solid #7B2D8B; padding: 16px; border-radius: 0 8px 8px 0; margin: 16px 0; }
  .card .label { font-size: 11px; text-transform: uppercase; color: #888; font-weight: 600; }
  .card .value { font-size: 14px; font-weight: 600; color: #1a1a1a; }
  .ticket { display: inline-block; background: #7B2D8B; color: #fff; padding: 8px 16px; border-radius: 20px; font-size: 16px; font-weight: 700; letter-spacing: 1px; }
  .btn { display: inline-block; background: #8DB542; color: #ffffff; text-decoration: none; padding: 12px 32px; border-radius: 25px; font-weight: 700; font-size: 14px; margin-top: 16px; }
  .footer { background: #1a1a1a; padding: 20px; text-align: center; }
  .footer p { color: #999; font-size: 11px; line-height: 1.5; }
  .footer a { color: #8DB542; text-decoration: none; }
  .reparation-list { list-style: none; padding: 0; }
  .reparation-list li { padding: 6px 0; border-bottom: 1px solid #eee; font-size: 13px; }
  .reparation-list li:last-child { border-bottom: none; }
  .total { font-size: 18px; font-weight: 700; color: #8DB542; }
</style>`;

function layout(content: string): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">${BASE_STYLE}</head>
<body>
<div class="container">
  <div class="header">
    <div class="logo">Vigus<span class="accent">'</span>B</div>
  </div>
  ${content}
  <div class="footer">
    <p>Vigus'B — Experts en téléphonie<br>
    <a href="https://vigusb.fr">vigusb.fr</a></p>
  </div>
</div>
</body>
</html>`;
}

interface ReparationData {
  ticket_number: string;
  prenom: string;
  marque: string;
  modele: string;
  reparations: { label: string; prix: number }[];
  total_estime: number;
  rdv_date: string;
  rdv_heure: string;
  magasin_nom: string;
  magasin_adresse: string;
  magasin_telephone?: string;
}

// 1. Confirmation réservation
export function confirmationReservation(data: ReparationData): string {
  const reparationsList = data.reparations
    .map((r) => `<li>${r.label} — <strong>${r.prix}€</strong></li>`)
    .join("");

  return layout(`
  <div class="body">
    <h2>Ta réservation est confirmée 🎉</h2>
    <p>Hey ${data.prenom} ! On a bien enregistré ta demande de réparation. Voici le récap :</p>

    <div style="text-align:center;margin:20px 0">
      <span class="ticket">${data.ticket_number}</span>
    </div>

    <div class="card">
      <div class="label">Appareil</div>
      <div class="value">${data.marque} ${data.modele}</div>
    </div>

    <div class="card">
      <div class="label">Réparations</div>
      <ul class="reparation-list">${reparationsList}</ul>
      <div style="margin-top:8px" class="label">Total estimé</div>
      <div class="total">${data.total_estime}€</div>
    </div>

    <div class="card">
      <div class="label">Rendez-vous</div>
      <div class="value">📅 ${data.rdv_date} à ${data.rdv_heure}</div>
      <div style="margin-top:8px" class="label">Magasin</div>
      <div class="value">${data.magasin_nom}</div>
      <div style="font-size:13px;color:#666">${data.magasin_adresse}</div>
      ${data.magasin_telephone ? `<div style="font-size:13px;color:#666">📞 ${data.magasin_telephone}</div>` : ""}
    </div>

    <p>Présente-toi au magasin avec ton téléphone à l'heure du RDV. On s'occupe du reste !</p>
  </div>`);
}

// 2. Téléphone reçu
export function telephoneRecu(data: {
  ticket_number: string;
  prenom: string;
  marque: string;
  modele: string;
}): string {
  return layout(`
  <div class="body">
    <h2>On a bien reçu ton tel 📱</h2>
    <p>Hey ${data.prenom} ! Ton ${data.marque} ${data.modele} est entre de bonnes mains.</p>

    <div style="text-align:center;margin:20px 0">
      <span class="ticket">${data.ticket_number}</span>
    </div>

    <div class="card">
      <div class="label">Statut</div>
      <div class="value" style="color:#8DB542">✅ Réceptionné — diagnostic en cours</div>
    </div>

    <p>On te tient au courant dès que la réparation est terminée. En général, ça prend entre 30 min et 2h selon la réparation.</p>
    <p>D'ici là, relax 😎</p>
  </div>`);
}

// 3. Réparation terminée
export function reparationTerminee(data: {
  ticket_number: string;
  prenom: string;
  marque: string;
  modele: string;
  magasin_nom: string;
  magasin_adresse: string;
}): string {
  return layout(`
  <div class="body">
    <h2>Ton tel est prêt ! 🎉</h2>
    <p>Hey ${data.prenom} ! La réparation de ton ${data.marque} ${data.modele} est terminée.</p>

    <div style="text-align:center;margin:20px 0">
      <span class="ticket">${data.ticket_number}</span>
    </div>

    <div class="card">
      <div class="label">Statut</div>
      <div class="value" style="color:#8DB542">✅ Réparation terminée</div>
      <div style="margin-top:8px" class="label">Viens le récupérer à</div>
      <div class="value">${data.magasin_nom}</div>
      <div style="font-size:13px;color:#666">${data.magasin_adresse}</div>
    </div>

    <p>Passe au magasin quand tu veux pendant nos horaires d'ouverture. Pense à te munir d'une pièce d'identité 🪪</p>
  </div>`);
}

// 4. Réservation annulée
export function reservationAnnulee(data: {
  ticket_number: string;
  prenom: string;
  raison?: string;
}): string {
  return layout(`
  <div class="body">
    <h2>Ta réservation a été annulée</h2>
    <p>Hey ${data.prenom}, ta réservation <strong>${data.ticket_number}</strong> a été annulée.</p>

    ${data.raison ? `<div class="card"><div class="label">Raison</div><div class="value">${data.raison}</div></div>` : ""}

    <p>Pas de stress, tu peux reprendre un RDV à tout moment :</p>
    <div style="text-align:center">
      <a class="btn" href="https://6prjgd-4j.myshopify.com/pages/reparation">Reprendre un RDV</a>
    </div>
  </div>`);
}
