const typeNom = { Maison: "Maison", Condo: "Condo", Chalet: "Chalet", Plex: "Plex", Terrain: "Terrain" };
const feminin = (type) => !typeNom[type] || type === "Maison";
const etatDe = (data) =>
  ({ a_vendre: "à vendre", vendu: "vendu", achete: "acheté" })[data.statut] + (data.statut !== "a_vendre" && feminin(data.type) ? "e" : "");

export default {
  layout: "propriete.njk",
  tags: [],
  eleventyComputed: {
    title: (data) => data.titre,
    permalink: (data) => (data.statut === "masque" ? false : `/proprietes/${data.page.fileSlug}/`),
    // Titre Google : « Maison à vendre à Sainte-Anne-des-Plaines | Maison à paliers… | ImmoCRB »
    titreComplet: (data) =>
      `${typeNom[data.type] || "Propriété"} ${etatDe(data)} à ${data.ville} | ${data.titre} | ${data.site.nom}`.replace(/\s+/g, " "),
    // Description propre à chaque fiche ; texte automatique si le champ est laissé vide dans l'admin.
    description: (data) => {
      if (data.description) return data.description;
      const specs = [
        data.chambres && `${data.chambres} chambre${data.chambres > 1 ? "s" : ""}`,
        data.sdb && `${data.sdb} salle${data.sdb > 1 ? "s" : ""} de bain`,
      ].filter(Boolean).join(", ");
      return `${data.titre}. ${typeNom[data.type] || "Propriété"} ${etatDe(data)} à ${data.ville}${specs ? " : " + specs : ""}. ${data.site.courtier}, courtier immobilier.`.replace(/\s+/g, " ");
    },
    image: (data) => data.photo_principale || "",
  },
};
