import fs from 'fs'
import path from 'path'
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

// Render markdown to HTML (lightweight, no external deps)
function renderMarkdown(md) {
  let html = md
    // Headers
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    // Bold/italic
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Links [text](url)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    // Lists
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.+<\/li>\n?)+/g, (m) => `<ul>${m}</ul>`)
    // Paragraphs (split by double newline, skip block elements)
    .split('\n\n')
    .map(block => {
      const trimmed = block.trim()
      if (!trimmed) return ''
      if (/^<(h[1-3]|ul|ol|li|p|blockquote)/.test(trimmed)) return trimmed
      return `<p>${trimmed.replace(/\n/g, '<br/>')}</p>`
    })
    .join('\n')
  return html
}

export default function BlogArticlePage({ params }) {
  const post = posts.find(p => p.slug === params.slug)
  if (!post) notFound()

  // Read markdown content from file
  const contentDir = path.join(process.cwd(), 'content', 'blog')
  const mdPath = path.join(contentDir, `${post.slug}.md`)
  let markdown = ''
  try {
    markdown = fs.readFileSync(mdPath, 'utf-8')
  } catch (e) {
    // Fallback: try old hardcoded content
    markdown = getFallbackContent(post.slug)
  }

  const relatedGames = getAllGames()
    .filter(g => g.category === post.category)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 6)

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
              <span>{post.readTime || 5} min de lecture</span>
            </div>

            <div
              className={styles.content}
              dangerouslySetInnerHTML={{ __html: renderMarkdown(markdown) }}
            />
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

function getFallbackContent(slug) {
  return `# Article en cours de rédaction...\n\nCe contenu sera bientôt disponible.`
}