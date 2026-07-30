import {
  Container,
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ShoppingBag as ShoppingBagIcon,
  Store as StoreIcon,
  LocalShipping as LocalShippingIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'FAQ - Foire aux Questions | Alia Marketplace',
  description: 'Trouvez les réponses aux questions fréquemment posées sur Alia Marketplace.',
};

export default function FAQPage() {
  const sections = [
    {
      title: 'Acheteurs',
      icon: <ShoppingBagIcon sx={{ fontSize: 28, color: '#4ecdc4' }} />,
      faqs: [
        {
          question: 'Comment créer un compte ?',
          answer: 'Rendez-vous sur notre site, cliquez sur "S\'inscrire", entrez votre email et un mot de passe sécurisé (au moins 8 caractères), complétez votre profil et confirmez votre email.',
        },
        {
          question: 'Quels moyens de paiement sont acceptés ?',
          answer: 'Nous acceptons les cartes de crédit (Visa, Mastercard, American Express), les portefeuilles numériques (PayPal, Apple Pay) et les virements bancaires.',
        },
        {
          question: 'Comment suivre ma commande ?',
          answer: 'Vous recevrez un email avec un lien de suivi après confirmation de votre commande. Vous pouvez aussi consulter l\'historique de vos commandes dans votre compte.',
        },
        {
          question: 'Quelle est la politique de retour ?',
          answer: 'Vous avez 30 jours pour retourner un produit non endommagé dans son emballage d\'origine pour un remboursement complet.',
        },
        {
          question: 'Que faire si ma commande n\'arrive pas ?',
          answer: 'Contactez notre support avec votre numéro de commande. Si le colis est perdu, nous vous enverrons un remplacement gratuitement.',
        },
      ],
    },
    {
      title: 'Vendeurs',
      icon: <StoreIcon sx={{ fontSize: 28, color: '#ffd700' }} />,
      faqs: [
        {
          question: 'Comment devenir vendeur sur Alia ?',
          answer: 'Créez un compte, allez à "Devenir vendeur", remplissez vos informations professionnelles, validez votre identité et vos documents bancaires.',
        },
        {
          question: 'Quels sont les frais ?',
          answer: 'Nous prélevons une commission de 5 à 15% selon la catégorie, plus 2% pour les frais de traitement des paiements.',
        },
        {
          question: 'Comment gérer mon inventaire ?',
          answer: 'Via votre tableau de bord vendeur, ajoutez, modifiez ou supprimez des produits, gérez les stocks et suivez les ventes en temps réel.',
        },
        {
          question: 'Quand reçois-je mes paiements ?',
          answer: 'Les paiements sont traités tous les jeudis et arrivent sur votre compte en 2-3 jours ouvrables.',
        },
        {
          question: 'Comment gérer les retours ?',
          answer: 'Vous recevez une notification de retour. Acceptez-la ou refusez-la selon votre politique. Une fois acceptée, arrangez la livraison avec le client.',
        },
      ],
    },
    {
      title: 'Livraison',
      icon: <LocalShippingIcon sx={{ fontSize: 28, color: '#06ffa5' }} />,
      faqs: [
        {
          question: 'Combien de temps prend une livraison ?',
          answer: 'La livraison standard prend 5-7 jours ouvrables. La livraison express prend 1-2 jours ouvrables.',
        },
        {
          question: 'Livrez-vous à l\'international ?',
          answer: 'Oui, nous livrons dans plus de 50 pays. Les frais et délais varient selon la destination.',
        },
        {
          question: 'Puis-je changer mon adresse de livraison ?',
          answer: 'Oui, tant que la commande n\'a pas encore été expédiée. Accédez à votre commande et modifiez l\'adresse.',
        },
        {
          question: 'Que faire si mon colis est perdu ou endommagé ?',
          answer: 'Signalez-le immédiatement via votre compte ou en contactant notre support. Nous vous remboursons ou vous envoyons un nouveau produit sans frais.',
        },
      ],
    },
    {
      title: 'Compte et Sécurité',
      icon: <PersonIcon sx={{ fontSize: 28, color: '#06ffa5' }} />,
      faqs: [
        {
          question: 'Comment créer un compte ?',
          answer: 'Rendez-vous sur notre site, cliquez sur "S\'inscrire", entrez votre email et un mot de passe sécurisé (au moins 8 caractères), complétez votre profil et confirmez votre email.',
        },
        {
          question: 'Comment réinitialiser mon mot de passe ?',
          answer: 'Cliquez sur "Mot de passe oublié" sur la page de connexion, entrez votre email, et vous recevrez un lien de réinitialisation. Suivez le lien et créez un nouveau mot de passe.',
        },
        {
          question: 'Ma donnée personnelle est-elle sécurisée ?',
          answer: 'Oui, nous utilisons le chiffrement SSL et les meilleures pratiques de sécurité. Vos données ne sont jamais partagées sans votre consentement.',
        },
        {
          question: 'Puis-je supprimer mon compte ?',
          answer: 'Oui, vous pouvez demander la suppression de votre compte depuis les paramètres de votre profil. Vos données seront supprimées sous 30 jours.',
        },
        {
          question: 'Comment activer la vérification en deux étapes ?',
          answer: 'Allez dans "Paramètres de sécurité", activez la 2FA, scannez le code QR avec votre application authenticator, et confirmez le code à 6 chiffres.',
        },
      ],
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <Box sx={{ flex: 1 }}>
        <Container maxWidth="md" sx={{ py: { xs: 4, md: 8 } }}>
          {/* Hero */}
          <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
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
              Foire aux Questions
            </Typography>
            <Typography
              variant="h5"
              sx={{ color: 'text.secondary', fontWeight: 500 }}
            >
              Trouvez les réponses à vos questions sur Alia Marketplace
            </Typography>
          </Box>

          {/* Sections FAQ */}
          {sections.map((section, sectionIdx) => (
            <Box key={sectionIdx} sx={{ mb: { xs: 6, md: 8 } }}>
              {/* Titre de section */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                {section.icon}
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {section.title}
                </Typography>
              </Box>

              {/* Accordions */}
              {section.faqs.map((faq, faqIdx) => (
                <Accordion key={faqIdx} sx={{ mb: 1.5 }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {faq.question}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                      {faq.answer}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))}

              {/* Divider entre sections */}
              {sectionIdx < sections.length - 1 && (
                <Divider sx={{ my: 4 }} />
              )}
            </Box>
          ))}

          {/* CTA */}
          <Box sx={{ textAlign: 'center', pt: 4, borderTop: '1px solid', borderColor: 'divider' }}>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>
              Vous ne trouvez pas votre réponse ?
            </Typography>
            <Typography
              component="a"
              href="/contact"
              sx={{
                fontWeight: 600,
                color: '#4ecdc4',
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              Contactez notre équipe d'assistance →
            </Typography>
          </Box>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
}
