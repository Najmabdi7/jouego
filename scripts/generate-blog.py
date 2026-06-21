#!/usr/bin/env python3
"""
NovArcade blog auto-generator.
Generates SEO blog articles from game data, commits and pushes to GitHub.
Designed to run as a cron job 3x per week.

Usage:
  python3 generate-blog.py           # generate 1 article
  python3 generate-blog.py --count 3 # generate 3 articles
"""

import json
import os
import re
import subprocess
import sys
from datetime import datetime, timedelta
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
GAMES_JSON = REPO / "public" / "data" / "games.json"
MANIFEST = REPO / "app" / "blog" / "posts-manifest.json"
CONTENT_DIR = REPO / "content" / "blog"

# Article templates by category
TEMPLATES = {
    "Action": {
        "prefix": "top-jeux-action",
        "title": "Top {n} jeux d'action gratuits à jouer en ligne en {year}",
        "intro": "Les jeux d'action sur navigateur offrent adrenaline et fun sans téléchargement. Voici notre sélection des {n} meilleurs jeux d'action gratuits sur NovArcade.",
        "section": "## {idx}. {title}\n\n{description}\n\n[Jouer à {title} →](/game/{slug})",
        "conclusion": "## Pourquoi jouer aux jeux d'action sur NovArcade ?\n\nTous nos jeux d'action sont gratuits, jouables sur mobile et desktop, sans inscription. Le plein écran est supporté pour une expérience immersive. Nouveaux jeux ajoutés régulièrement !",
    },
    "Puzzle": {
        "prefix": "top-jeux-puzzle",
        "title": "Top {n} jeux de puzzle et réflexion gratuits en {year}",
        "intro": "Stimulez votre cerveau avec notre sélection des {n} meilleurs jeux de puzzle gratuits. Logique, match-3, mahjong et plus encore sur NovArcade.",
        "section": "## {idx}. {title}\n\n{description}\n\n[Jouer à {title} →](/game/{slug})",
        "conclusion": "## Les bienfaits des jeux de puzzle\n\nLes jeux de réflexion améliorent la concentration, la logique spatiale et la mémoire de travail. Sur NovArcade, tous nos puzzles sont gratuits et jouables sur tous vos appareils.",
    },
    "Course": {
        "prefix": "top-jeux-course",
        "title": "Top {n} jeux de course gratuits en ligne en {year}",
        "intro": "Vitesse, drift et adrenaline : découvrez les {n} meilleurs jeux de course gratuits à jouer directement dans votre navigateur sur NovArcade.",
        "section": "## {idx}. {title}\n\n{description}\n\n[Jouer à {title} →](/game/{slug})",
        "conclusion": "## Pourquoi les jeux de course sur navigateur ?\n\nLes jeux de course HTML5 sont accessibles partout, sans installation. Sessions courtes parfaites pour les pauses. Sur NovArcade, tous nos jeux de course sont gratuits et jouables en plein écran.",
    },
    "Sport": {
        "prefix": "top-jeux-sport",
        "title": "Top {n} jeux de sport gratuits en ligne en {year}",
        "intro": "Football, basketball, tennis et plus : les {n} meilleurs jeux de sport gratuits à jouer sur navigateur sur NovArcade.",
        "section": "## {idx}. {title}\n\n{description}\n\n[Jouer à {title} →](/game/{slug})",
        "conclusion": "## Jeux de sport : fun gratuit sans téléchargement\n\nSur NovArcade, tous nos jeux de sport sont gratuits et jouables sur mobile et desktop. Parfait pour les pauses entre deux matchs !",
    },
    "Arcade": {
        "prefix": "top-jeux-arcade",
        "title": "Top {n} jeux arcade gratuits à jouer en ligne en {year}",
        "intro": "Runner, clicker, casual : les {n} meilleurs jeux arcade gratuits sur NovArcade. Simple, addictif, accessible à tous.",
        "section": "## {idx}. {title}\n\n{description}\n\n[Jouer à {title} →](/game/{slug})",
        "conclusion": "## L'attrait des jeux arcade\n\nLes jeux arcade HTML5 sont parfaits pour les sessions courtes. Sur NovArcade, tous nos jeux arcade sont gratuits et sans inscription.",
    },
    "Aventure": {
        "prefix": "top-jeux-aventure",
        "title": "Top {n} jeux d'aventure gratuits en ligne en {year}",
        "intro": "Exploration, RPG, mondes ouverts : les {n} meilleurs jeux d'aventure gratuits sur NovArcade. Embarquez pour des aventures épiques sans téléchargement.",
        "section": "## {idx}. {title}\n\n{description}\n\n[Jouer à {title} →](/game/{slug})",
        "conclusion": "## L'aventure sur navigateur\n\nLes jeux d'aventure HTML5 offrent des mondes riches sans installation. Sur NovArcade, découvrez des dizaines d'aventures gratuites jouables partout.",
    },
    "Stratégie": {
        "prefix": "top-jeux-strategie",
        "title": "Top {n} jeux de stratégie gratuits en ligne en {year}",
        "intro": "Tower defense, échecs, gestion : les {n} meilleurs jeux de stratégie gratuits sur NovArcade. Planifiez, construisez et conquérez !",
        "section": "## {idx}. {title}\n\n{description}\n\n[Jouer à {title} →](/game/{slug})",
        "conclusion": "## Stratégie et réflexion sur NovArcade\n\nNos jeux de stratégie sont parfaits pour les joueurs qui aiment planifier. Gratuits, jouables sur tous appareils, sans inscription.",
    },
    "Multijoueur": {
        "prefix": "top-jeux-multijoueur",
        "title": "Top {n} jeux multijoueur gratuits en ligne en {year}",
        "intro": "Affrontez d'autres joueurs du monde entier : les {n} meilleurs jeux multijoueur gratuits sur NovArcade.",
        "section": "## {idx}. {title}\n\n{description}\n\n[Jouer à {title} →](/game/{slug})",
        "conclusion": "## La compétition sur NovArcade\n\nNos jeux multijoueur sont gratuits et accessibles partout. Affrontez des joueurs du monde entier sans téléchargement !",
    },
}

def load_games():
    with open(GAMES_JSON, "r", encoding="utf-8") as f:
        return json.load(f)

def load_manifest():
    with open(MANIFEST, "r", encoding="utf-8") as f:
        return json.load(f)

def save_manifest(posts):
    with open(MANIFEST, "w", encoding="utf-8") as f:
        json.dump(posts, f, ensure_ascii=False, indent=2)
        f.write("\n")

def slugify(s):
    s = s.lower()
    s = re.sub(r"[àâä]", "a", s)
    s = re.sub(r"[éèêë]", "e", s)
    s = re.sub(r"[ïî]", "i", s)
    s = re.sub(r"[ôö]", "o", s)
    s = re.sub(r"[ûü]", "u", s)
    s = re.sub(r"ç", "c", s)
    s = re.sub(r"[^a-z0-9]+", "-", s)
    s = s.strip("-")
    return s

def get_existing_slugs(posts):
    return {p["slug"] for p in posts}

def generate_article(games, posts, used_slugs):
    """Generate one article. Rotate through categories."""
    existing_slugs = get_existing_slugs(posts)
    
    # Count articles per category to rotate
    cat_counts = {}
    for p in posts:
        cat_counts[p["category"]] = cat_counts.get(p["category"], 0) + 1
    
    # Pick the category with fewest articles
    categories = sorted(
        set(TEMPLATES.keys()),
        key=lambda c: cat_counts.get(c, 0)
    )
    
    for cat in categories:
        template = TEMPLATES[cat]
        year = datetime.now().year
        
        # Pick top 10 games in this category (by rating)
        cat_games = [g for g in games if g["category"] == cat]
        if len(cat_games) < 5:
            continue  # Skip if not enough games
        
        top_games = sorted(cat_games, key=lambda g: (-g.get("rating", 0), -g.get("plays", 0)))[:10]
        n = len(top_games)
        
        # Generate slug
        slug = f"{template['prefix']}-{year}-{datetime.now().strftime('%m')}"
        # Ensure uniqueness
        base_slug = slug
        counter = 1
        while slug in existing_slugs or slug in used_slugs:
            slug = f"{base_slug}-{counter}"
            counter += 1
        
        # Build markdown content
        sections = []
        for i, game in enumerate(top_games, 1):
            desc = game.get("description", "")
            # Truncate description to ~200 chars
            if len(desc) > 200:
                desc = desc[:197] + "..."
            sections.append(template["section"].format(
                idx=i,
                title=game["title"],
                description=desc,
                slug=game["slug"],
            ))
        
        markdown = f"{template['intro']}\n\n" + "\n\n".join(sections) + f"\n\n{template['conclusion']}\n"
        
        # Build manifest entry
        post = {
            "slug": slug,
            "title": template["title"].format(n=n, year=year),
            "description": template["intro"][:155] + ("..." if len(template["intro"]) > 155 else ""),
            "date": datetime.now().strftime("%Y-%m-%d"),
            "dateModified": datetime.now().strftime("%Y-%m-%d"),
            "author": "NovArcade",
            "category": cat,
            "tags": [cat.lower(), "top", "classement", "gratuit", "jeux-en-ligne"],
            "readTime": max(3, n // 2),
        }
        
        return post, markdown, slug
    
    return None, None, None

def main():
    count = int(sys.argv[sys.argv.index("--count") + 1]) if "--count" in sys.argv else 1
    
    games = load_games()
    posts = load_manifest()
    used_slugs = set()
    
    generated = 0
    for _ in range(count):
        post, markdown, slug = generate_article(games, posts, used_slugs)
        if not post:
            print("No more articles to generate (all categories exhausted)")
            break
        
        # Write markdown file
        md_path = CONTENT_DIR / f"{slug}.md"
        md_path.parent.mkdir(parents=True, exist_ok=True)
        md_path.write_text(markdown, encoding="utf-8")
        
        # Add to manifest
        posts.append(post)
        used_slugs.add(slug)
        generated += 1
        print(f"Generated: {post['title']} ({slug})")
    
    if generated == 0:
        print("No articles generated. Exiting.")
        return
    
    # Save manifest
    save_manifest(posts)
    print(f"Updated manifest with {generated} new articles")
    
    # Git commit and push
    os.chdir(REPO)
    
    # Set git identity
    subprocess.run(["git", "config", "user.name", "npqrcode"], check=True)
    subprocess.run(["git", "config", "user.email", "najmabdi777@gmail.com"], check=True)
    
    # Add files
    subprocess.run(["git", "add", "-A"], check=True)
    
    # Commit
    commit_msg = f"blog: auto-generate {generated} SEO article(s) ({datetime.now().strftime('%Y-%m-%d')})"
    result = subprocess.run(["git", "commit", "-m", commit_msg], capture_output=True, text=True)
    if result.returncode != 0:
        print(f"Git commit failed: {result.stderr}")
        return
    
    # Push using token
    token = os.environ.get("GITHUB_TOKEN", "")
    if not token:
        # Try loading from hermes env
        env_path = Path.home() / ".hermes" / ".env"
        if env_path.exists():
            for line in env_path.read_text().splitlines():
                if line.startswith("export GITHUB_TOKEN="):
                    token = line.split("=", 1)[1].strip().strip('"')
                    break
    
    if not token:
        print("WARNING: No GITHUB_TOKEN found. Push manually.")
        return
    
    push_url = f"https://npqrcode:{token}@github.com/Najmabdi7/novarcade.git"
    result = subprocess.run(
        ["git", "push", push_url, "main"],
        capture_output=True, text=True
    )
    if result.returncode == 0:
        print(f"Pushed {generated} article(s) to GitHub. Vercel will auto-deploy.")
    else:
        print(f"Push failed: {result.stderr}")
        print("Push manually: git push origin main")

if __name__ == "__main__":
    main()