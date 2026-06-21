import Header from '../components/Header'
import styles from '../privacy/privacy.module.css'

export const metadata = {
  title: 'Conditions d\'utilisation',
  description: 'Conditions d\'utilisation du site Jouego — règles d\'usage des jeux gratuits.',
  alternates: { canonical: '/terms' },
  robots: { index: true, follow: true },
}

export default function TermsPage() {
  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={styles.content}>
          <h1>Conditions d'utilisation</h1>
          <p className={styles.updated}>Dernière mise à jour : 21 juin 2026</p>

          <h2>1. Objet</h2>
          <p>
            Les présentes conditions d'utilisation régissent l'accès et l'utilisation du site
            <strong> jouego.waaplink.com</strong>, édité par Jouego (« nous », « notre »).
            En utilisant le site, vous acceptez les présentes conditions dans leur intégralité.
          </p>

          <h2>2. Accès au service</h2>
          <p>
            Le site est accessible gratuitement à tout utilisateur disposant d'un navigateur
            compatible HTML5. Nous nous efforçons d'assurer une disponibilité 24h/24, mais ne
            pouvons garantir un accès ininterrompu. Le service peut être modifié ou interrompu
            sans préavis.
          </p>

          <h2>3. Utilisation</h2>
          <p>
            L'utilisateur s'engage à utiliser le site dans le respect des lois en vigueur et des
            présentes conditions. Sont interdits notamment :
          </p>
          <ul>
            <li>Toute tentative de perturbation du fonctionnement du site</li>
            <li>L'extraction automatisée massive des données sans autorisation</li>
            <li>L'utilisation du site à des fins illégales ou frauduleuses</li>
          </ul>

          <h2>4. Propriété intellectuelle</h2>
          <p>
            Les jeux hébergés sur le site proviennent de partenaires tiers (GamePix, etc.) et
            restent la propriété de leurs auteurs respectifs. Les éléments du site (design,
            logo, textes) sont la propriété de Jouego. Toute reproduction sans autorisation est
            interdite.
          </p>

          <h2>5. Publicité</h2>
          <p>
            Le site affiche des publicités via Google AdSense et Monetag afin d'assurer la
            gratuité du service. Ces partenaires peuvent utiliser des cookies. Pour plus
            d'informations, consultez notre <a href="/privacy">politique de confidentialité</a>.
          </p>

          <h2>6. Limitation de responsabilité</h2>
          <p>
            Les jeux sont fournis « tels quels » sans garantie de fonctionnement. Jouego ne saurait
            être tenu responsable des éventuels dysfonctionnements, pertes de données ou dommages
            directs ou indirects résultant de l'utilisation du site.
          </p>

          <h2>7. Liens externes</h2>
          <p>
            Le site peut contenir des liens vers des sites tiers. Jouego n'exerce aucun contrôle
            sur ces sites et décline toute responsabilité quant à leur contenu ou leurs pratiques.
          </p>

          <h2>8. Données personnelles</h2>
          <p>
            Le traitement des données personnelles est détaillé dans notre
            <a href="/privacy"> politique de confidentialité</a>, conforme au RGPD.
          </p>

          <h2>9. Modifications</h2>
          <p>
            Nous nous réservons le droit de modifier les présentes conditions à tout moment. Les
            modifications entrent en vigueur dès leur publication sur le site.
          </p>

          <h2>10. Droit applicable</h2>
          <p>
            Les présentes conditions sont soumises au droit français. En cas de litige, les
            tribunaux français seront seuls compétents.
          </p>

          <h2>11. Contact</h2>
          <p>
            Pour toute question relative aux présentes conditions :
            <a href="mailto:contact@waaplink.com">contact@waaplink.com</a> ou via notre
            <a href="/contact"> page de contact</a>.
          </p>
        </div>
      </div>
    </>
  )
}