import { Metadata } from 'next'
import Header from '../components/Header'
import styles from '../privacy/privacy.module.css'

export const metadata = {
  title: 'Contact',
  description: 'Contacter Jouego — questions, partenariats, signalement de bug.',
  alternates: { canonical: '/contact' },
  robots: { index: true, follow: true },
}

export default function ContactPage() {
  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={styles.content}>
          <h1>Contact</h1>
          <p>
            Pour toute question, suggestion de jeu, partenariat ou signalement de bug,
            écrivez-nous à :
          </p>
          <p style={{ fontSize: '18px' }}>
            <a href="mailto:contact@waaplink.com">contact@waaplink.com</a>
          </p>
          <h2>Questions fréquentes</h2>
          <h3>Comment proposer un jeu ?</h3>
          <p>
            Envoyez-nous l'URL du jeu ou le code source HTML5 par email. Nous l'intégrerons
            après validation.
          </p>
          <h3>Un jeu ne fonctionne pas</h3>
          <p>
            Indiquez-nous le titre du jeu et votre navigateur. Nous corrigerons ou retirerons
            le jeu si nécessaire.
          </p>
          <h3>Demande de retrait de données (RGPD)</h3>
          <p>
            Consultez notre <a href="/privacy">politique de confidentialité</a> pour exercer
            vos droits RGPD.
          </p>
        </div>
      </div>
    </>
  )
}