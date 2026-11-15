import markdownIt from "markdown-it";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";

const md = markdownIt({ html: false, linkify: true, typographer: false });

export default function (eleventyConfig) {
  // Photos allégées automatiquement à la construction du site : chaque <img>
  // reçoit des versions WebP et JPEG en 400, 800 et 1200 px, et le navigateur
  // télécharge la plus petite qui suffit (téléphone, carte, grande photo).
  // Les photos ajoutées dans l'admin en profitent aussi, sans rien faire.
  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    extensions: "html",
    formats: ["webp", "jpeg"],
    widths: [400, 800, 1200],
    sharpJpegOptions: { quality: 78, progressive: true },
    sharpWebpOptions: { quality: 75 },
    failOnError: false,
    defaultAttributes: { loading: "lazy", decoding: "async", sizes: "(max-width: 760px) 100vw, 50vw" },
  });

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
      // Les propriétés à vendre d'abord, puis les plus récentes.
      .sort((a, b) => (a.data.statut === "a_vendre" ? 0 : 1) - (b.data.statut === "a_vendre" ? 0 : 1) || b.date - a.date)
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
