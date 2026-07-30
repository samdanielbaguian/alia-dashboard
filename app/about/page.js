import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Divider,
} from '@mui/material';
import {
  Business as BusinessIcon,
  Handshake as HandshakeIcon,
  Lightbulb as LightbulbIcon,
  Group as GroupIcon,
  Gavel as GavelIcon,
  People as PeopleIcon,
} from '@mui/icons-material';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'À propos d\'Alia Marketplace - Nous connaître',
  description: 'Découvrez la mission, les valeurs et l\'équipe d\'Alia, la marketplace leader en Afrique de l\'Ouest.',
};

export default function AboutPage() {
  const values = [
    {
      icon: <HandshakeIcon sx={{ fontSize: 40, color: '#4ecdc4' }} />,
      title: 'Confiance',
      description: 'Nous mettons en place les plus hauts standards de sécurité et de vérification pour nos utilisateurs.',
    },
    {
      icon: <LightbulbIcon sx={{ fontSize: 40, color: '#ffd166' }} />,
      title: 'Transparence',
      description: 'Nos prix, nos frais et nos processus sont clairs et explicites. Pas de frais cachés.',
    },
    {
      icon: <LightbulbIcon sx={{ fontSize: 40, color: '#ff6b6b' }} />,
      title: 'Innovation',
      description: 'Nous innovons continuellement pour offrir la meilleure expérience de shopping en ligne.',
    },
    {
      icon: <GroupIcon sx={{ fontSize: 40, color: '#06ffa5' }} />,
      title: 'Inclusion',
      description: 'Nous donnons une plateforme à tous les commercants, grands et petits, urbains et ruraux.',
    },
  ];

  const teamMembers = [
    {
      name: 'Aminata Sow',
      role: 'Directrice Générale & Co-fondatrice',
      icon: '👩‍💼',
    },
    {
      name: 'Moussa Diallo',
      role: 'CTO & Co-fondateur',
      icon: '👨‍💻',
    },
    {
      name: 'Fatima Ba',
      role: 'Responsable Opérations',
      icon: '👩‍🔬',
    },
    {
      name: 'Olivier Koné',
      role: 'Responsable Partenariats Marchands',
      icon: '👨‍💼',
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <Box sx={{ flex: 1 }}>
        <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
      {/* Hero Section */}
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
          À propos d'Alia Marketplace
        </Typography>
        <Typography
          variant="h5"
          sx={{ color: 'text.secondary', mb: 4, fontWeight: 500 }}
        >
          Le leader du commerce électronique en Afrique de l'Ouest
        </Typography>
      </Box>

      {/* Présentation */}
      <Paper elevation={2} sx={{ p: { xs: 3, md: 4 }, mb: { xs: 6, md: 8 }, bgcolor: 'background.paper' }}>
        <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
          <BusinessIcon sx={{ fontSize: 50, color: '#4ecdc4', flexShrink: 0 }} />
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
              Qui sommes-nous ?
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary' }}>
              Alia est une marketplace africaine moderne qui connecte des millions d'acheteurs avec des milliers
              de marchands vérifiés. Depuis 2023, nous transformons la façon dont les Africains font leurs courses
              en ligne en offrant une plateforme sécurisée, fiable et innovante.
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', mt: 2 }}>
              Notre vision est de devenir la plateforme de commerce électronique incontournable pour tous les
              pays d'Afrique de l'Ouest, en mettant l'accent sur la qualité, la sécurité et l'inclusion.
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Mission */}
      <Box sx={{ mb: { xs: 6, md: 8 } }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 4, textAlign: 'center' }}>
          Notre Mission
        </Typography>
        <Grid container spacing={3}>
          {[
            {
              title: 'Faciliter le commerce',
              description: 'Rendre le commerce électronique accessible à tous en Afrique de l\'Ouest.',
              icon: <GavelIcon sx={{ fontSize: 35, color: '#1565c0' }} />,
            },
            {
              title: 'Promouvoir les produits locaux',
              description: 'Valoriser et soutenir les entrepreneurs et petits commerces locaux.',
              icon: <PeopleIcon sx={{ fontSize: 35, color: '#4ecdc4' }} />,
            },
            {
              title: 'Réduire les coûts',
              description: 'Diminuer les frais de transport et de logistique pour des prix plus avantageux.',
              icon: <LightbulbIcon sx={{ fontSize: 35, color: '#ffd166' }} />,
            },
          ].map((mission, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              <Paper elevation={1} sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  {mission.icon}
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, textAlign: 'center' }}>
                  {mission.title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', lineHeight: 1.6 }}>
                  {mission.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Divider sx={{ my: { xs: 4, md: 6 } }} />

      {/* Valeurs */}
      <Box sx={{ mb: { xs: 6, md: 8 } }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 4, textAlign: 'center' }}>
          Nos Valeurs Fondamentales
        </Typography>
        <Grid container spacing={3}>
          {values.map((value, idx) => (
            <Grid item xs={12} sm={6} md={6} key={idx}>
              <Paper elevation={1} sx={{ p: 3, display: 'flex', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
                  {value.icon}
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                    {value.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                    {value.description}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Divider sx={{ my: { xs: 4, md: 6 } }} />

      {/* Équipe */}
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 4, textAlign: 'center' }}>
          Notre Équipe de Direction
        </Typography>
        <Grid container spacing={3}>
          {teamMembers.map((member, idx) => (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <Paper elevation={1} sx={{ p: 3, textAlign: 'center' }}>
                <Box
                  sx={{
                    fontSize: 48,
                    mb: 2,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 80,
                    bgcolor: 'action.hover',
                    borderRadius: 2,
                    mb: 2,
                  }}
                >
                  {member.icon}
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                  {member.name}
                </Typography>
                <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 600 }}>
                  {member.role}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Chiffres clés */}
      <Box sx={{ mt: { xs: 8, md: 10 }, pt: { xs: 4, md: 6 }, borderTop: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 4, textAlign: 'center' }}>
          Nos Chiffres Clés
        </Typography>
        <Grid container spacing={3}>
          {[
            { number: '100K+', label: 'Clients actifs' },
            { number: '5K+', label: 'Marchands vérifiés' },
            { number: '50K+', label: 'Produits en ligne' },
            { number: '98%', label: 'Satisfaction client' },
          ].map((stat, idx) => (
            <Grid item xs={6} sm={3} key={idx}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #1565c0, #4ecdc4)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    mb: 1,
                  }}
                >
                  {stat.number}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {stat.label}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
      </Container>
      </Box>
      <Footer />
    </Box>
  );
}
