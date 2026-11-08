import markdownIt from "markdown-it";

const md = markdownIt({ html: false, linkify: true, typographer: false });

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/admin");

  // Propriétés visibles (tout sauf « masqué »), les plus récentes d'abord.
  eleventyConfig.addCollection("proprietes", (api) =>
    api
      .getFilteredByGlob("src/proprietes/*.md")
      .filter((p) => p.data.statut !== "masque")
      .sort((a, b) => b.date - a.date)
  );

  eleventyConfig.addCollection("vedettes", (api) =>
    api
      .getFilteredByGlob("src/proprietes/*.md")
      .filter((p) => p.data.statut !== "masque" && p.data.vedette)
      .sort((a, b) => b.date - a.date)
      .slice(0, 6)
  );

  eleventyConfig.addFilter("prix", (n) =>
    typeof n === "number"
      ? new Intl.NumberFormat("fr-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 }).format(n)
      : "Prix sur demande"
  );

  eleventyConfig.addFilter("statutLabel", (s) =>
    ({ a_vendre: "À vendre", vendu: "Vendu", achete: "Acheté", masque: "Masqué" })[s] || ""
  );

  eleventyConfig.addFilter("md", (texte) => md.render(texte || ""));

  eleventyConfig.addFilter("youtubeId", (url) => {
    if (!url) return "";
    const m = String(url).match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
    return m ? m[1] : "";
  });

  return {
    dir: { input: "src", includes: "_includes", data: "_data", output: "_site" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
