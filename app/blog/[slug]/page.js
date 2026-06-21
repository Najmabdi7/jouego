import { notFound } from 'next/navigation'
import Link from 'next/link'
import Header from '../../components/Header'
import posts from '../posts-manifest.json'
import { getAllGames } from '../../lib/games'
import GameCard from '../../components/GameCard'
import styles from './article.module.css'

export async function generateStaticParams() {
  return posts.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }) {
  const post = posts.find(p => p.slug === params.slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `https://novarcade.waaplink.com/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      locale: 'fr_FR',
      publishedTime: post.date,
      authors: [post.author],
    },
    twitter: {
      card: 'summary',
      title: post.title,
      description: post.description,
    },
  }
}

function ArticleJsonLd({ post }) {
  const jsonld = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.dateModified,
    author: { '@type': 'Organization', name: post.author },
    publisher: {
      '@type': 'Organization',
      name: 'NovArcade',
      url: 'https://novarcade.waaplink.com',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://novarcade.waaplink.com/blog/${post.slug}`,
    },
    keywords: post.tags.join(', '),
    inLanguage: 'fr',
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonld) }}
    />
  )
}

export default function BlogArticlePage({ params }) {
  const post = posts.find(p => p.slug === params.slug)
  if (!post) notFound()

  // Get related games from same category
  const relatedGames = getAllGames()
    .filter(g => g.category === post.category)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 6)

  // Get the article content component
  const ArticleContent = getArticleContent(post.slug)

  return (
    <>
      <Header />
      <ArticleJsonLd post={post} />
      <div className={styles.page}>
        <div className={styles.inner}>
          <nav className={styles.breadcrumb}>
            <Link href="/">Accueil</Link>
            <span>/</span>
            <Link href="/blog">Blog</Link>
            <span>/</span>
            <span>{post.title}</span>
          </nav>

          <article>
            <span className={styles.cat}>{post.category}</span>
            <h1 className={styles.articleTitle}>{post.title}</h1>
            <div className={styles.meta}>
              <span>{post.date}</span>
              <span>·</span>
              <span>{post.readTime} min de lecture</span>
            </div>

            <div className={styles.content}>
              <ArticleContent />
            </div>
          </article>

          {relatedGames.length > 0 && (
            <section className={styles.related}>
              <h2 className={styles.relatedTitle}>Jeux à essayer</h2>
              <div className={styles.relatedGrid}>
                {relatedGames.map(g => (
                  <GameCard key={g.id} game={g} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  )
}

// Map slug to article content component
function getArticleContent(slug) {
  const articles = {
    'meilleurs-jeux-course-2026': () => (
      <>
        <p>
          Les jeux de course font partie des genres les plus populaires sur navigateur.
          Accessibles, addictifs et sans téléchargement, ils offrent des sensations
          fortes en quelques secondes. Voici notre sélection des 10 meilleurs jeux
          de course gratuits à jouer en ligne en 2026.
        </p>
        <h2>1. Slope Racing 3D</h2>
        <p>
          Un jeu de course à haute vitesse sur une piste en 3D qui se déforme
          en temps réel. Le but : survivre le plus longtemps possible sans tomber.
          Simple à prendre en main, difficile à maîtriser.
        </p>
        <p>
          <a href="/game/slope-racing-3d">Jouer à Slope Racing 3D →</a>
        </p>
        <h2>2. Moto X3M: Spooky Land</h2>
        <p>
          La saga Moto X3M est une référence du moto trial sur navigateur. Ce
          volet propose 22 niveaux à thème Halloween avec des obstacles mortels.
          Les figures acrobatiques réduisent votre temps et boostent votre score.
        </p>
        <p>
          <a href="/game/moto-x3m-spooky-land">Jouer à Moto X3M Spooky Land →</a>
        </p>
        <h2>3. Fractal Combat X</h2>
        <p>
          Un jeu de combat aérien avec des graphismes 3D impressionnants pour un
          jeu navigateur. Pilotez des chasseurs dans des combats frénétiques avec
          un système d'armes varié.
        </p>
        <p>
          <a href="/game/fractal-combat-x">Jouer à Fractal Combat X →</a>
        </p>
        <h2>4. Grand Prix Hero</h2>
        <p>
          Un jeu de course de Formule 1 vue de dessus, simple et efficace.
          Parfait pour les courtes sessions de jeu sur mobile comme sur desktop.
        </p>
        <h2>5. Drift Racing</h2>
        <p>
          Maîtrisez l'art du drift dans ce jeu de course au style arcade.
          Les contrôles sont simples mais la prise en main demande du doigté.
        </p>
        <h2>6. Moto Fury</h2>
        <p>
          Un jeu de moto sur autoroute où il faut slalomer entre les voitures
          à pleine vitesse. L'adrenaline montante garantie.
        </p>
        <h2>7. Cycle Extreme</h2>
        <p>
          Du vélo extrême sur des parcours accidentés. La physique réaliste
          rend chaque saut spectaculaire.
        </p>
        <h2>8. Street Driver</h2>
        <p>
          Conduite urbaine avec dérapages contrôlés et courses-poursuites.
          Un bon compromis entre simulation et arcade.
        </p>
        <h2>9. Hill Racing</h2>
        <p>
          Gravissez des collines avec différents véhicules tout en gérant
          votre essence et votre moteur. Un classique indémodable.
        </p>
        <h2>10. Super Drive</h2>
        <p>
          Un jeu de conduite libre où vous pouvez explorer la ville à votre rythme.
          Idéal pour les débutants.
        </p>
        <h2>Pourquoi jouer aux jeux de course sur navigateur ?</h2>
        <p>
          Les jeux de course HTML5 ont l'avantage d'être accessibles partout :
          sur ordinateur, tablette ou smartphone, sans installer d'application.
          Ils se lancent en quelques secondes et offrent des sessions courtes
          parfaites pour les pauses.
        </p>
        <p>
          Sur NovArcade, tous nos jeux de course sont gratuits et jouables
          en plein écran. N'hésitez pas à tester plusieurs titres pour trouver
          celui qui vous correspond le mieux !
        </p>
      </>
    ),
    'jeux-puzzle-reflexion-gratuits': () => (
      <>
        <p>
          Les jeux de puzzle et de réflexion sont parfaits pour stimuler
          votre cerveau tout en vous divertissant. Voici 8 des meilleurs jeux
          de puzzle gratuits à jouer en ligne sur NovArcade.
        </p>
        <h2>1. Cut the Rope 2</h2>
        <p>
          La suite du célèbre jeu de physique où il faut couper des cordes
          pour faire parvenir un bonbon à la bouche d'Om Nom. ingénieux et addictif.
        </p>
        <p><a href="/game/cut-the-rope-2">Jouer à Cut the Rope 2 →</a></p>
        <h2>2. 2048 Merge Blocks</h2>
        <p>
          Le jeu de fusion de chiffres qui a fait fureur. Combinez les tuiles
          pour atteindre 2048 (et au-delà !). Un classique de la réflexion.
        </p>
        <h2>3. Mahjong Master 2</h2>
        <p>
          Le mahjong traditionnel adapté en HTML5. Retirez les tuiles par paires
          pour vider le plateau. Idéal pour les moments calmes.
        </p>
        <h2>4. Flow Mania</h2>
        <p>
          Connectez les points de même couleur sans croiser les lignes.
          Des centaines de niveaux de difficulté croissante.
        </p>
        <h2>5. Water Sort Puzzle</h2>
        <p>
          Triez les liquides colorés dans des éprouvettes. Simple en apparence,
          redoutable en pratique. Un puzzle parfait pour mobile.
        </p>
        <h2>6. Jigsaw Collections</h2>
        <p>
          Des puzzles à reconstituer avec de magnifiques images.
          Plusieurs niveaux de difficulté pour tous les âges.
        </p>
        <h2>7. Lipuzz Water Sort Puzzle</h2>
        <p>
          Une variante du water sort avec des mécaniques supplémentaires.
          Idéal si vous avez aimé le premier.
        </p>
        <h2>8. Creative Puzzle</h2>
        <p>
          Un puzzle créatif où vous assemblez des formes pour reproduire
          des modèles. Parfait pour les enfants et les adultes créatifs.
        </p>
        <h2>Les bienfaits des jeux de puzzle</h2>
        <p>
          Les jeux de réflexion améliorent la concentration, la logique spatiale
          et la mémoire de travail. Ils sont recommandés pour maintenir une bonne
          agilité mentale, quel que soit votre âge.
        </p>
        <p>
          Sur NovArcade, tous nos jeux de puzzle sont gratuits, sans inscription
          et jouables sur tous vos appareils. Bonne réflexion !
        </p>
      </>
    ),
    'jeux-action-gratuits-navigateur': () => (
      <>
        <p>
          Les jeux d'action sont le cœur du jeu vidéo : combat, tir, adrenaline.
          Sur navigateur, le genre a explosé grâce à HTML5. Voici les incontournables
          à tester absolument.
        </p>
        <h2>1. Alpha Guns</h2>
        <p>
          Un run-and-gun classique dans la tradition des grands jeux d'arcade.
          Des graphismes pixel art soignés et une action frénétique.
        </p>
        <p><a href="/game/alpha-guns">Jouer à Alpha Guns →</a></p>
        <h2>2. Drunken Boxing 2</h2>
        <p>
          Un jeu de combat hilarant où les combattants sont ivres. La physique
          bancal rend chaque match imprévisible et hilarant.
        </p>
        <p><a href="/game/drunken-boxing-2">Jouer à Drunken Boxing 2 →</a></p>
        <h2>3. Battle Simulator - Counter Stickman</h2>
        <p>
          Un simulateur de bataille tactique où vous commandez des stickmen
          contre des hordes d'ennemis. Strategy et action combinées.
        </p>
        <h2>4. Pixel on Titan</h2>
        <p>
          Un beat'em all pixel art où vous affrontez des titans. L'inspiration
          Attack on Titan est claire, l'action est intense.
        </p>
        <h2>5. Red Impostor vs Crew</h2>
        <p>
          Un jeu d'infiltration inspiré de Among Us. Éliminez l'équipage sans
          vous faire repérer. Tension et stratégie garanties.
        </p>
        <h2>6. Among at Easter</h2>
        <p>
          Un autre titre inspiré de Among Us mais dans une ambiance de Pâques.
          Le but : accomplir vos tâches tout en évitant l'imposteur.
        </p>
        <h2>7. Funny Shooter - Destroy All Enemies</h2>
        <p>
          Un shooter en vue FPS où vous éliminez des vagues d'ennemis.
          L'humour est omniprésent et le gameplay est nerveux.
        </p>
        <h2>8. LOL Surprise Insta Party Divas</h2>
        <p>
          Un jeu d'action sur le thème des poupées LOL. Idéal pour un jeune
          public qui veut de l'action accessible.
        </p>
        <h2>Pourquoi les jeux d'action sur navigateur sont-ils si populaires ?</h2>
        <p>
          Les jeux d'action HTML5 offrent un access immédiat : pas de téléchargement,
          pas de compte, pas d'installation. Vous cliquez, vous jouez.
          Les sessions courtes (5-15 minutes) correspondent parfaitement aux usages
          modernes : pause au bureau, attente de bus, file d'attente...
        </p>
        <p>
          Sur NovArcade, tous nos jeux d'action sont optimisés pour le mobile
          avec support du plein écran. Testez-les tous et trouvez votre favori !
        </p>
      </>
    ),
  }

  return articles[slug] || (() => <p>Article en cours de rédaction...</p>)
}