import {
  Container,
  Typography,
  Box,
  Paper,
  Divider,
} from '@mui/material';
import {
  Gavel as GavelIcon,
} from '@mui/icons-material';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Conditions Générales d\'Utilisation | Alia Marketplace',
  description: 'Lire les conditions générales d\'utilisation (CGU) d\'Alia Marketplace.',
};

export default function TermsPage() {
  const sections = [
    {
      title: '1. Acceptation des conditions',
      content: `En accédant et en utilisant Alia Marketplace ("le site"), vous acceptez d'être lié par ces Conditions
      Générales d'Utilisation ("CGU"). Si vous n'acceptez pas ces conditions, vous ne devez pas utiliser le site.
      Nous nous réservons le droit de modifier ces CGU à tout moment. Votre utilisation continue du site après
      les modifications constitue votre acceptation des nouvelles conditions.`,
    },
    {
      title: '2. Inscription et compte utilisateur',
      content: `Pour utiliser Alia Marketplace, vous devez créer un compte. Vous êtes responsable de :
      - Fournir des informations exactes et à jour
      - Protéger votre mot de passe et vos identifiants
      - Toute activité effectuée sous votre compte
      - Notifier immédiatement Alia de tout accès non autorisé
      
      Vous déclarez être âgé d'au moins 18 ans. Alia se réserve le droit de suspendre ou supprimer
      tout compte qui viole ces conditions.`,
    },
    {
      title: '3. Utilisation acceptée du site',
      content: `Vous acceptez d'utiliser le site uniquement à des fins légales et d'une manière qui ne viole pas :
      - Les droits d'autrui
      - Les lois applicables
      - Ces CGU
      
      Vous vous engagez à ne pas :
      - Télécharger de virus ou code malveillant
      - Harceler, menacer ou intimider d'autres utilisateurs
      - Poster du contenu illégal, offensant ou abusif
      - Contourner les systèmes de sécurité
      - Scraper ou automatiser l'accès au site
      - Vendre ou revendre l'accès au site
      - Utiliser le site pour la fraude ou l'escroquerie`,
    },
    {
      title: '4. Responsabilités du marchand',
      content: `Les marchands s'engagent à :
      - Fournir des descriptions exactes et complètes de leurs produits
      - Afficher les prix corrects et transparents
      - Respecter les délais de livraison annoncés
      - Traiter les réclamations des clients de manière équitable
      - Ne pas vendre de produits contrefaits, volés ou interdits
      - Respecter toutes les lois applicables
      
      Alia se réserve le droit de suspendre ou bannir tout marchand qui viole ces obligations.`,
    },
    {
      title: '5. Responsabilités de l\'acheteur',
      content: `Les acheteurs s'engagent à :
      - Payer les produits commandés selon les conditions convenues
      - Fournir des adresses de livraison exactes
      - Ne pas commander de produits à titre de revente
      - Respecter les lois en matière d'importation et de douanes
      - Accepter les conditions d'annulation et de retour
      
      Les acheteurs sont responsables de la vérification des conditions d'annulation avant l'achat.`,
    },
    {
      title: '6. Paiement et facturation',
      content: `- Tous les paiements doivent être effectués via les moyens de paiement approuvés
      - Les prix sont affichés en devises locales (XOF)
      - Alia ne traite pas directement les paiements (via prestataires tiers sécurisés)
      - Vous êtes responsable de tous les frais bancaires
      - Les reçus de paiement sont envoyés par email
      - Alia ne rembourse les frais de paiement que si la transaction a échoué de notre côté`,
    },
    {
      title: '7. Livraison et retours',
      content: `- Les délais de livraison sont estimés et non garantis
      - Le client est responsable de la fourniture d'une adresse de livraison exacte
      - Les produits peuvent être inspectés et refusés à la livraison s'ils ne correspondent pas à la commande
      - Les retours doivent être effectués dans les 30 jours (voir politique de retour détaillée)
      - Les frais de retour peuvent être à la charge du client selon les conditions
      - Alia n'est pas responsable des colis perdus ou endommagés en transit`,
    },
    {
      title: '8. Propriété intellectuelle',
      content: `- Tout le contenu du site (texte, images, logos, design) est la propriété d'Alia ou de ses fournisseurs
      - Vous ne pouvez pas reproduire, modifier, distribuer ou transmettre ce contenu sans autorisation écrite
      - Alia respecte les droits de propriété intellectuelle des tiers et s'attend à ce que les utilisateurs fassent de même
      - Les plaintes concernant les violations de droits d'auteur doivent être envoyées à legal@alia.com`,
    },
    {
      title: '9. Limitation de responsabilité',
      content: `Alia n'est pas responsable de :
      - Les dommages indirects, accessoires, punitifs ou consécutifs
      - Les pertes de données ou d'exploitation
      - Les produits défectueux vendus par les marchands (voir recours des acheteurs)
      - Les retards de livraison (sauf en cas de négligence d'Alia)
      - Les contenus postés par les utilisateurs
      
      La responsabilité maximale d'Alia est limitée au montant total payé par l'utilisateur au cours
      des 12 derniers mois.`,
    },
    {
      title: '10. Règlement des litiges',
      content: `- Les différends entre acheteurs et marchands doivent d'abord être tentés de résoudre à l'amiable
      - Alia proposera une médiation ou un arbitrage si nécessaire
      - Tous les litiges seront régis par la loi du Sénégal
      - Les utilisateurs acceptent de soumettre les litiges à la juridiction compétente au Sénégal
      - Alia se réserve le droit de rejeter les réclamations manifestement infondées`,
    },
    {
      title: '11. Suspension et résiliation',
      content: `Alia peut suspendre ou résilier votre accès au site si :
      - Vous violez ces CGU
      - Vous commettez une fraude ou une activité illégale
      - Vous harcelez d'autres utilisateurs
      - Vous n'avez pas utilisé votre compte pendant 2 ans
      
      La suspension peut être temporaire (jusqu'à 30 jours) ou permanente. Les utilisateurs bannis
      ne peuvent pas créer de nouveaux comptes.`,
    },
    {
      title: '12. Exonération de responsabilité',
      content: `Le site est fourni "tel quel" sans garantie d'aucune sorte. Alia n'offre pas de garantie :
      - De disponibilité ininterrompue
      - De précision des informations
      - D'absence de virus ou de code malveillant
      - De satisfaction quant à la qualité des produits
      
      À utiliser entièrement à vos risques et périls.`,
    },
    {
      title: '13. Modifications du service',
      content: `Alia se réserve le droit de :
      - Modifier, suspendre ou arrêter le service à tout moment
      - Modifier les frais ou les conditions de paiement avec notification préalable
      - Supprimer ou modifier du contenu
      - Restreindre l'accès à certaines fonctionnalités
      
      Les modifications majeures seront communiquées par email si possible.`,
    },
    {
      title: '14. Contact et signalements',
      content: `Pour toute question, signalement ou plainte concernant ces CGU :
      
      Email: support@alia.com
      Adresse: Dakar, Sénégal
      Téléphone: +221 77 123 45 67
      
      Signalements légaux: legal@alia.com
      
      Dernière mise à jour: Janvier 2025`,
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <Box sx={{ flex: 1 }}>
        <Container maxWidth="md" sx={{ py: { xs: 4, md: 8 } }}>
      {/* Hero */}
      <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <GavelIcon sx={{ fontSize: 50, color: '#4ecdc4' }} />
        </Box>
        <Typography
          variant="h2"
          sx={{
            fontWeight: 800,
            mb: 2,
            background: 'linear-gradient(135deg, #1565c0, #4ecdc4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Conditions Générales d'Utilisation
        </Typography>
        <Typography
          variant="h6"
          sx={{ color: 'text.secondary', fontWeight: 500 }}
        >
          Les règles et responsabilités d'utilisation d'Alia Marketplace
        </Typography>
      </Box>

      <Paper elevation={2} sx={{ p: { xs: 3, md: 4 }, bgcolor: 'background.paper' }}>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3, fontStyle: 'italic' }}>
          Ces Conditions Générales d'Utilisation régissent votre accès et votre utilisation d'Alia Marketplace.
          En utilisant le site, vous acceptez intégralement ces conditions.
        </Typography>

        {/* Sections */}
        {sections.map((section, idx) => (
          <Box key={idx}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                mt: idx === 0 ? 0 : 4,
                mb: 2,
                color: '#4ecdc4',
              }}
            >
              {section.title}
            </Typography>

            <Typography
              variant="body1"
              sx={{
                lineHeight: 1.8,
                color: 'text.secondary',
                whiteSpace: 'pre-wrap',
              }}
            >
              {section.content}
            </Typography>

            {idx < sections.length - 1 && (
              <Divider sx={{ my: 3 }} />
            )}
          </Box>
        ))}

        {/* Footer note */}
        <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
            Ces conditions générales d'utilisation constituent l'intégralité de l'accord entre vous et Alia
            concernant l'utilisation du site. Aucune modification ou complément verbal ne s'applique.
          </Typography>
        </Box>
      </Paper>
    </Container>
      </Box>
      <Footer />
    </Box>
  );
}
