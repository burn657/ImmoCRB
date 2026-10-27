const $ = (id) => document.getElementById(id);
const argent = (n, dec = 0) =>
  new Intl.NumberFormat("fr-CA", { style: "currency", currency: "CAD", maximumFractionDigits: dec, minimumFractionDigits: dec }).format(n);

// Prime d'assurance prêt (SCHL) selon le ratio prêt-valeur, mise de fonds de moins de 20 %.
function primeAssurance(pret, prix) {
  const ratio = pret / prix;
  if (ratio <= 0.8) return 0;
  if (ratio <= 0.85) return pret * 0.028;
  if (ratio <= 0.9) return pret * 0.031;
  return pret * 0.04;
}

function calculerHypotheque() {
  const prix = +$("h-prix").value || 0;
  const mise = +$("h-mise").value || 0;
  const taux = (+$("h-taux").value || 0) / 100;
  const n = (+$("h-amort").value || 25) * 12;
  if (prix <= 0 || mise >= prix) { $("h-res").textContent = "—"; $("h-detail").textContent = ""; return; }
  const base = prix - mise;
  const prime = primeAssurance(base, prix);
  const pret = base + prime;
  // Au Canada, les taux fixes sont composés semestriellement.
  const i = Math.pow(1 + taux / 2, 1 / 6) - 1;
  const paiement = i === 0 ? pret / n : (pret * i) / (1 - Math.pow(1 + i, -n));
  $("h-res").textContent = argent(paiement, 2);
  $("h-detail").textContent = `Prêt de ${argent(pret)}` + (prime ? `, dont ${argent(prime)} d'assurance prêt (mise de fonds sous 20 %).` : ".");
}

function calculerMutation() {
  const prix = +$("m-prix").value || 0;
  let bas = 0, total = 0;
  for (const t of window.TRANCHES || []) {
    const haut = t.jusqua ?? Infinity;
    const tranche = Math.max(0, Math.min(prix, haut) - bas);
    total += tranche * t.taux;
    bas = haut;
    if (prix <= haut) break;
  }
  $("m-res").textContent = argent(total);
}

["h-prix", "h-mise", "h-taux", "h-amort"].forEach((id) => $(id).addEventListener("input", calculerHypotheque));
$("m-prix").addEventListener("input", calculerMutation);
calculerHypotheque();
calculerMutation();
