import { Metadata } from 'next'
import Header from '../components/Header'
import styles from './privacy.module.css'

export const metadata = {
  title: 'Politique de confidentialité',
  description: 'Politique de confidentialité et gestion des cookies de Jouego — conformité RGPD.',
  alternates: { canonical: '/privacy' },
  robots: { index: true, follow: true },
}

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={styles.content}>
          <h1>Politique de confidentialité</h1>
          <p className={styles.updated}>Dernière mise à jour : 21 juin 2026</p>

          <p>
            Jouego (« nous », « notre ») exploite le site <strong>jouego.waaplink.com</strong>.
            Nous respectons votre vie privée et nous conformons au Règlement Général sur la
            Protection des Données (RGPD) et à la loi Informatique et Libertés.
          </p>

          <h2>1. Données collectées</h2>
          <p>
            Nous <strong>ne collectons aucune donnée personnelle directement</strong> (pas de
            formulaire d'inscription, pas de compte utilisateur, pas de newsletter). Le site
            est accessible de manière anonyme.
          </p>

          <h2>2. Cookies et technologies de suivi</h2>
          <p>
            Notre site utilise des cookies et technologies similaires à des fins de mesure
            d'audience et de monétisation publicitaire. Ces partenaires peuvent déposer des
            cookies sur votre terminal et accéder à des données (identifiant de navigateur,
            adresse IP, pages visitées, durée des sessions).
          </p>

          <h3>2.1 Publicité — Google AdSense</h3>
          <ul>
            <li><strong>Fournisseur :</strong> Google LLC</li>
            <li><strong>Finalité :</strong> affichage d'annonces personnalisées ou non</li>
            <li><strong>Cookies :</strong> <code>__gads</code>, <code>__gpi</code>, <code>IDE</code>, <code>NID</code></li>
            <li><strong>Durée :</strong> 13 mois maximum</li>
            <li><strong>Politique :</strong> <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener">policies.google.com/technologies/ads</a></li>
          </ul>

          <h3>2.2 Publicité — Monetag (In-Page Push)</h3>
          <ul>
            <li><strong>Fournisseur :</strong> Monetag / Adsterra</li>
            <li><strong>Finalité :</strong> affichage de bannières publicitaires natives</li>
            <li><strong>Domaines :</strong> nap5k.com, quge5.com</li>
            <li><strong>Politique :</strong> <a href="https://monetag.com/privacy-policy/" target="_blank" rel="noopener">monetag.com/privacy-policy</a></li>
          </ul>

          <h3>2.3 Hébergement des jeux — GamePix</h3>
          <ul>
            <li><strong>Fournisseur :</strong> GamePix</li>
            <li><strong>Finalité :</strong> affichage des jeux HTML5 via iframes</li>
            <li><strong>Politique :</strong> <a href="https://gamepix.com/privacy" target="_blank" rel="noopener">gamepix.com/privacy</a></li>
          </ul>

          <h2>3. Base légale (RGPD — art. 6)</h2>
          <ul>
            <li><strong>Intérêt légitime</strong> (art. 6 §1 f) : mesure d'audience et sécurité du site.</li>
            <li><strong>Consentement</strong> (art. 6 §1 a) : cookies publicitaires personnalisés, déposés uniquement après votre consentement (bannière cookies).</li>
          </ul>

          <h2>4. Durée de conservation</h2>
          <p>
            Les données collectées par nos partenaires sont conservées selon leurs politiques
            respectives, dans la limite de 13 mois pour les cookies publicitaires en Europe.
          </p>

          <h2>5. Vos droits (RGPD)</h2>
          <p>Conformément au RGPD, vous disposez des droits suivants :</p>
          <ul>
            <li><strong>Droit d'accès</strong> à vos données personnelles</li>
            <li><strong>Droit de rectification</strong> de données inexactes</li>
            <li><strong>Droit à l'effacement</strong> (« droit à l'oubli »)</li>
            <li><strong>Droit à la limitation</strong> du traitement</li>
            <li><strong>Droit d'opposition</strong> au traitement</li>
            <li><strong>Droit à la portabilité</strong> de vos données</li>
            <li><strong>Droit de retirer votre consentement</strong> à tout moment</li>
          </ul>
          <p>
            Pour exercer ces droits, contactez-nous à : <a href="mailto:contact@waaplink.com">contact@waaplink.com</a>.
            Vous pouvez aussi déposer une plainte auprès de la <strong>CNIL</strong> (Commission
            Nationale de l'Informatique et des Libertés) : <a href="https://www.cnil.fr" target="_blank" rel="noopener">www.cnil.fr</a>.
          </p>

          <h2>6. Gestion de vos préférences cookies</h2>
          <p>
            Vous pouvez gérer ou refuser les cookies à tout moment via les réglages de votre
            navigateur :
          </p>
          <ul>
            <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener">Chrome</a></li>
            <li><a href="https://support.mozilla.org/fr/kb/protection-renforcee-firefox-cookies-pisteurs" target="_blank" rel="noopener">Firefox</a></li>
            <li><a href="https://support.apple.com/fr-fr/guide/safari/sfri11471/mac" target="_blank" rel="noopener">Safari</a></li>
            <li><a href="https://support.microsoft.com/fr-fr/microsoft-edge/supprimer-les-cookies-dans-microsoft-edge" target="_blank" rel="noopener">Edge</a></li>
          </ul>
          <p>
            Pour les cookies publicitaires Google, vous pouvez utiliser le tableau de bord Google :
            <a href="https://adssettings.google.com" target="_blank" rel="noopener">adssettings.google.com</a>.
          </p>

          <h2>7. Hébergement</h2>
          <p>
            Le site est hébergé par <strong>Vercel Inc.</strong> (USA). Vercel est certifié
            conforme aux boucliers de protection UE-USA. Politique de confidentialité :
            <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener">vercel.com/legal/privacy-policy</a>.
          </p>

          <h2>8. Sécurité</h2>
          <p>
            Le site utilise HTTPS (TLS) pour toutes les communications. Aucune donnée
            bancaire n'est collectée ni stockée.
          </p>

          <h2>9. Mineurs</h2>
          <p>
            Notre site ne collecte pas sciemment de données personnelles d'enfants de moins de
            13 ans. Si vous pensez qu'un enfant nous a transmis des données, contactez-nous pour
            les supprimer immédiatement.
          </p>

          <h2>10. Modifications</h2>
          <p>
            Cette politique peut être mise à jour. La date en haut de page indique la dernière
            révision.
          </p>

          <h2>11. Contact</h2>
          <p>
            Pour toute question relative à cette politique :
            <a href="mailto:contact@waaplink.com">contact@waaplink.com</a>
          </p>
        </div>
      </div>
    </>
  )
}