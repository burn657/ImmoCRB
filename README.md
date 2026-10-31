# ImmoCRB

Site web immobilier d'ImmoCRB : propriétés à vendre, demande d'estimation, calculatrices hypothécaire et de taxe de bienvenue, alerte immobilière, guides acheteur et vendeur.

- Générateur : [Eleventy](https://www.11ty.dev/) (site statique, très rapide)
- Espace admin : [Decap CMS](https://decapcms.org/) à l'adresse `/admin/`
- Hébergement : Netlify (offre gratuite), formulaires gérés par Netlify Forms

## Gérer le site au quotidien

1. Allez sur `https://<votre-site>/admin/` et connectez-vous avec GitHub.
2. **Propriétés** : ajoutez, modifiez ou supprimez une maison. Le statut « Masqué » la garde en réserve sans l'afficher. Cochez « En vedette » pour la montrer sur l'accueil.
3. **Réglages du site** : vos coordonnées, votre photo, le texte « À propos », les témoignages et les tranches de la taxe de bienvenue (à mettre à jour chaque 1er janvier).
4. Cliquez sur **Publier**. Le site se met à jour tout seul en une à deux minutes.

## Mise en ligne (une seule fois)

1. Créez un compte gratuit sur [netlify.com](https://www.netlify.com/) avec votre compte GitHub.
2. **Add new site → Import an existing project → GitHub**, choisissez le dépôt `immocrb`. Les réglages de construction sont lus dans `netlify.toml`.
3. Connexion à l'admin : dans GitHub, **Settings → Developer settings → OAuth Apps → New OAuth App**, avec l'URL de rappel `https://api.netlify.com/auth/done`. Copiez le Client ID et le secret dans Netlify : **Project configuration → Security → OAuth → Install Provider → GitHub**.
4. Formulaires : dans Netlify, **Forms → Enable form detection**, puis redéployez. Ajoutez votre courriel dans **Forms → Form notifications** pour recevoir les demandes (estimation, visite, rappel, alerte, contact).
5. Nom de domaine : **Domain management → Add a domain** (immocrb.ca ou immocrb.com, environ 20 $ par an). Le HTTPS est automatique.

## Développement

```bash
npm install
npm start      # aperçu local sur http://localhost:8080
npm run build  # génère le site dans _site/
```

Les propriétés sont des fichiers Markdown dans `src/proprietes/`, les réglages des fichiers JSON dans `src/_data/`. Les deux fiches « Exemple » peuvent être supprimées depuis l'admin.
