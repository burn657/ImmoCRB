export default {
  layout: "propriete.njk",
  tags: [],
  eleventyComputed: {
    title: (data) => data.titre,
    permalink: (data) => (data.statut === "masque" ? false : `/proprietes/${data.page.fileSlug}/`),
  },
};
