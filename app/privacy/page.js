import {
  Container,
  Typography,
  Box,
  Paper,
  Divider,
} from '@mui/material';
import {
  Security as SecurityIcon,
} from '@mui/icons-material';import Header from '@/components/Header';
import Footer from '@/components/Footer';
export const metadata = {
  title: 'Politique de Confidentialité | Alia Marketplace',
  description: 'Lire la politique de confidentialité d\'Alia Marketplace pour comprendre comment nous protégeons vos données.',
};

export default function PrivacyPage() {
  const sections = [
    {
      title: '1. Collecte des données',
      content: `Alia collecte les informations que vous fournissez volontairement lors de votre inscription, notamment :
      - Nom et prénom
      - Adresse email
      - Numéro de téléphone
      - Adresse postale
      - Informations de paiement
      - Données de localisation (optionnelles)
      
      Nous collectons également automatiquement certaines données techniques lors de votre visite sur notre site :
      - Adresse IP
      - Type et version du navigateur
      - Pages visitées
      - Temps passé sur le site
      - Cookies et technologies de suivi similaires`,
    },
    {
      title: '2. Utilisation des données',
      content: `Vos données sont utilisées pour :
      - Créer et maintenir votre compte
      - Traiter vos commandes et paiements
      - Vous envoyer des confirmations de commande et des mises à jour de livraison
      - Vous contacter pour le support client
      - Améliorer nos services et notre site web
      - Personnaliser votre expérience d'achat
      - Détecter les fraudes et les abus
      - Respecter nos obligations légales
      - Avec votre consentement, vous envoyer des offres promotionnelles`,
    },
    {
      title: '3. Partage des données',
      content: `Nous partagerons vos données uniquement avec :
      - Nos partenaires de paiement (pour traiter vos paiements)
      - Nos prestataires de livraison (pour vous livrer)
      - Nos partenaires de support client
      - Les autorités légales si exigé par la loi
      
      Nous ne vendons jamais vos données personnelles à des tiers.`,
    },
    {
      title: '4. Sécurité des données',
      content: `Nous protégeons vos données avec :
      - Chiffrement SSL/TLS de toutes les connexions
      - Mots de passe hashés et salés
      - Pare-feu et systèmes de détection d'intrusion
      - Audits de sécurité réguliers
      - Conformité aux standards PCI-DSS pour les paiements
      
      Toutefois, aucun système n'est 100% sécurisé. Nous vous recommandons de choisir un mot de passe fort et unique.`,
    },
    {
      title: '5. Cookies et technologies de suivi',
      content: `Nous utilisons des cookies pour :
      - Mémoriser votre connexion
      - Personnaliser votre expérience
      - Analyser l'utilisation du site (Google Analytics)
      - Afficher des publicités pertinentes
      
      Vous pouvez configurer votre navigateur pour refuser les cookies, mais certaines fonctionnalités du site pourraient ne pas fonctionner correctement.`,
    },
    {
      title: '6. Droits des utilisateurs',
      content: `Vous avez le droit de :
      - Accéder à vos données personnelles
      - Corriger ou mettre à jour vos données
      - Demander la suppression de vos données
      - Vous opposer au traitement de vos données
      - Demander la portabilité de vos données
      - Retirer votre consentement au traitement des données
      
      Pour exercer ces droits, contactez-nous à support@alia.com.`,
    },
    {
      title: '7. Conservation des données',
      content: `Nous conservons vos données personnelles :
      - Tant que votre compte est actif
      - Pour 7 ans après la clôture de votre compte (obligations légales)
      - Moins longtemps si la loi l'exige
      
      Vous pouvez demander la suppression de vos données à tout moment.`,
    },
    {
      title: '8. Modifications de cette politique',
      content: `Nous pouvons mettre à jour cette politique de confidentialité à tout moment. Les modifications importantes seront communiquées par email. Votre utilisation continue du site après les modifications constitue votre acceptation de la nouvelle politique.`,
    },
    {
      title: '9. Nous contacter',
      content: `Si vous avez des questions sur cette politique de confidentialité, contactez-nous :
      
      Email: support@alia.com
      Adresse: Dakar, Sénégal
      Téléphone: +221 77 123 45 67
      
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
          <SecurityIcon sx={{ fontSize: 50, color: '#4ecdc4' }} />
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
          Politique de Confidentialité
        </Typography>
        <Typography
          variant="h6"
          sx={{ color: 'text.secondary', fontWeight: 500 }}
        >
          Comprendre comment nous protégeons vos données
        </Typography>
      </Box>

      <Paper elevation={2} sx={{ p: { xs: 3, md: 4 }, bgcolor: 'background.paper' }}>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3, fontStyle: 'italic' }}>
          Cette politique de confidentialité décrit comment Alia Marketplace ("nous", "notre" ou "nos")
          collecte, utilise, divulgue et protège vos informations.
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
            En utilisant notre site et nos services, vous acceptez cette politique de confidentialité.
            Si vous n'acceptez pas cette politique, veuillez ne pas utiliser nos services.
          </Typography>
        </Box>
      </Paper>
    </Container>
      </Box>
      <Footer />
    </Box>
  );
}
