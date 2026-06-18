# NovArcade 🎮

Portail de jeux HTML5 gratuits. Dark/néon, tout public, en français.

## Stack
- Next.js 14 (App Router)
- CSS Modules (zéro dépendance UI)
- GamePix API pour les jeux
- Vercel pour le déploiement

---

## 1. Lancer en local

```bash
npm install
npm run dev
# → http://localhost:3000
```

Le site démarre avec des jeux de démo dans `public/data/games.json`.

---

## 2. Importer les vrais jeux (GamePix)

### S'inscrire sur GamePix
1. Va sur https://partners.gamepix.com/publishers
2. Crée un compte publisher
3. Ajoute ton site → récupère ton **SID** (Site ID)

### Lancer l'import
```bash
GAMEPIX_SID=ton_sid_ici node scripts/import-games.mjs
```

Ça génère `public/data/games.json` avec tous tes jeux.
Relance `npm run build` ensuite.

---

## 3. Déployer sur Vercel

```bash
# Installer Vercel CLI si pas déjà fait
npm i -g vercel

# Push sur GitHub d'abord
git init
git add .
git commit -m "init NovArcade"
git remote add origin https://github.com/TON_USER/novarcade.git
git push -u origin main

# Puis déployer
vercel --prod
```

Ou connecte directement le repo GitHub sur vercel.com → déploiement automatique à chaque push.

---

## 4. Mettre à jour les jeux automatiquement

Pour Vercel, ajoute un cron job (via GitHub Actions) :

```yaml
# .github/workflows/update-games.yml
name: Update Games
on:
  schedule:
    - cron: '0 3 * * 1'  # Chaque lundi à 3h
  workflow_dispatch:

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with: { node-version: '18' }
      - run: GAMEPIX_SID=${{ secrets.GAMEPIX_SID }} node scripts/import-games.mjs
      - uses: stefanzweifel/git-auto-commit-action@v4
        with:
          commit_message: "chore: update games catalog"
```

Ajoute `GAMEPIX_SID` dans les secrets GitHub → le catalogue se met à jour tout seul.

---

## Structure du projet

```
novarcade/
├── app/
│   ├── components/
│   │   ├── Header.js          # Navbar sticky avec recherche
│   │   ├── GameCard.js        # Carte jeu avec hover néon
│   │   └── HomeClient.js      # Page d'accueil interactive
│   ├── game/[slug]/
│   │   └── page.js            # Page jeu avec iframe
│   ├── lib/
│   │   └── games.js           # Fonctions utilitaires
│   ├── layout.js
│   ├── page.js
│   └── globals.css
├── public/data/
│   └── games.json             # Base de données des jeux
└── scripts/
    └── import-games.mjs       # Script d'import GamePix
```
