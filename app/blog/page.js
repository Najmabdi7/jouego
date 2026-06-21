import Header from '../components/Header'
import Link from 'next/link'
import posts from './posts-manifest.json'
import styles from './blog.module.css'

export const metadata = {
  title: 'Blog Jouego — Guides, classements et astuces jeux',
  description: 'Le blog Jouego : guides, classements, astuces et actualités sur les jeux HTML5 gratuits. Découvrez les meilleurs jeux par catégorie.',
  alternates: { canonical: 'https://jouego.waaplink.com/blog' },
}

export default function BlogPage() {
  const sortedPosts = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date))

  return (
    <>
      <Header />
      <div className={styles.page}>
        <div className={styles.inner}>
          <h1 className={styles.blogH1}>Blog Jouego</h1>
          <p className={styles.subtitle}>
            Guides, classements et astuces pour les meilleurs jeux gratuits en ligne.
          </p>

          <div className={styles.grid}>
            {sortedPosts.map(post => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className={styles.card}
              >
                <span className={styles.cat}>{post.category}</span>
                <h2 className={styles.title}>{post.title}</h2>
                <p className={styles.desc}>{post.description}</p>
                <div className={styles.meta}>
                  <span>{post.date}</span>
                  <span>·</span>
                  <span>{post.readTime} min de lecture</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}