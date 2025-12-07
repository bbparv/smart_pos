import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Stack,
  Chip
} from '@mui/material';
import {
  PointOfSale as POSIcon,
  Inventory as InventoryIcon,
  Analytics as AnalyticsIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  CheckCircle as CheckIcon,
  ArrowForward as ArrowIcon,
  TrendingUp,
  AutoAwesome
} from '@mui/icons-material';

export const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <POSIcon sx={{ fontSize: 40 }} />,
      title: 'Point of Sale',
      description: 'Lightning-fast checkout with real-time inventory sync',
      color: '#2563EB'
    },
    {
      icon: <InventoryIcon sx={{ fontSize: 40 }} />,
      title: 'Smart Inventory',
      description: 'Automated stock tracking with intelligent alerts',
      color: '#10B981'
    },
    {
      icon: <AnalyticsIcon sx={{ fontSize: 40 }} />,
      title: 'Analytics',
      description: 'Beautiful dashboards with actionable insights',
      color: '#8B5CF6'
    },
    {
      icon: <NotificationsIcon sx={{ fontSize: 40 }} />,
      title: 'Smart Alerts',
      description: 'Email notifications for critical events',
      color: '#F59E0B'
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
      title: 'Secure Access',
      description: 'Role-based permissions and audit logs',
      color: '#EF4444'
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 40 }} />,
      title: 'Fast & Reliable',
      description: 'Built with modern tech for peak performance',
      color: '#06B6D4'
    }
  ];

  const benefits = [
    'Reduce manual inventory counting by 80%',
    'Never run out of stock with smart alerts',
    'Track sales and profits in real-time',
    'Manage multiple users with role-based access',
    'Automated email receipts for customers',
    'Complete audit trail for all transactions'
  ];

  return (
    <Box sx={{ bgcolor: '#FFFFFF', minHeight: '100vh' }}>
      {/* Navigation */}
      <Box
        sx={{
          borderBottom: '1px solid #E5E7EB',
          bgcolor: 'white',
          position: 'sticky',
          top: 0,
          zIndex: 10,
          backdropFilter: 'blur(8px)',
          bgcolor: 'rgba(255,255,255,0.8)'
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              py: 2
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: '#0F172A',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              🛒 Smart POS
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/login')}
              sx={{
                bgcolor: '#2563EB',
                '&:hover': { bgcolor: '#1D4ED8' },
                borderRadius: 2,
                px: 3,
                textTransform: 'none',
                fontWeight: 600
              }}
            >
              Sign In
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ pt: { xs: 8, md: 12 }, pb: { xs: 8, md: 12 } }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Chip
              label="Modern Inventory Management"
              icon={<AutoAwesome sx={{ fontSize: 16 }} />}
              sx={{
                mb: 3,
                bgcolor: '#EFF6FF',
                color: '#2563EB',
                fontWeight: 600,
                border: '1px solid #DBEAFE'
              }}
            />
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
                fontWeight: 800,
                lineHeight: 1.1,
                mb: 3,
                color: '#0F172A',
                letterSpacing: '-0.02em'
              }}
            >
              Inventory Made{' '}
              <Box
                component="span"
                sx={{
                  background: 'linear-gradient(135deg, #2563EB 0%, #10B981 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                Simple
              </Box>
            </Typography>
            <Typography
              variant="h6"
              sx={{
                mb: 4,
                color: '#64748B',
                fontWeight: 400,
                lineHeight: 1.6,
                fontSize: { xs: '1.1rem', md: '1.25rem' }
              }}
            >
              Streamline your retail operations with intelligent inventory tracking,
              automated reordering, and real-time analytics.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/login')}
                endIcon={<ArrowIcon />}
                sx={{
                  bgcolor: '#2563EB',
                  '&:hover': { bgcolor: '#1D4ED8' },
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  borderRadius: 2,
                  boxShadow: '0 4px 14px 0 rgba(37, 99, 235, 0.39)'
                }}
              >
                Get Started
              </Button>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  borderColor: '#E5E7EB',
                  color: '#0F172A',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  borderRadius: 2,
                  borderWidth: 2,
                  '&:hover': {
                    borderWidth: 2,
                    borderColor: '#2563EB',
                    bgcolor: '#F8FAFC'
                  }
                }}
              >
                Learn More
              </Button>
            </Stack>

            {/* Stats */}
            <Grid container spacing={3} sx={{ mt: 4 }}>
              <Grid item xs={4}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#0F172A' }}>
                  100%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Real-time Sync
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#0F172A' }}>
                  3
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  User Roles
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#0F172A' }}>
                  24/7
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Available
                </Typography>
              </Grid>
            </Grid>
          </Grid>

          {/* Hero SVG Illustration */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                height: { xs: 300, md: 500 },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {/* SVG Illustration */}
              <svg
                viewBox="0 0 500 500"
                style={{ width: '100%', height: '100%' }}
              >
                {/* Background circles */}
                <circle cx="250" cy="250" r="200" fill="#EFF6FF" opacity="0.5" />
                <circle cx="250" cy="250" r="150" fill="#DBEAFE" opacity="0.5" />
                
                {/* Main dashboard representation */}
                <rect x="150" y="150" width="200" height="200" rx="12" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="2" />
                
                {/* Chart bars */}
                <rect x="170" y="240" width="30" height="80" rx="4" fill="#2563EB" />
                <rect x="210" y="200" width="30" height="120" rx="4" fill="#10B981" />
                <rect x="250" y="220" width="30" height="100" rx="4" fill="#8B5CF6" />
                <rect x="290" y="180" width="30" height="140" rx="4" fill="#F59E0B" />
                
                {/* Decorative elements */}
                <circle cx="180" cy="180" r="8" fill="#2563EB" />
                <circle cx="220" cy="180" r="8" fill="#10B981" />
                <circle cx="260" cy="180" r="8" fill="#8B5CF6" />
                
                {/* Floating icons */}
                <circle cx="100" cy="150" r="25" fill="#EFF6FF" />
                <text x="100" y="160" textAnchor="middle" fontSize="24">📊</text>
                
                <circle cx="400" cy="200" r="25" fill="#F0FDF4" />
                <text x="400" y="210" textAnchor="middle" fontSize="24">✅</text>
                
                <circle cx="380" cy="350" r="25" fill="#FEF3C7" />
                <text x="380" y="360" textAnchor="middle" fontSize="24">🔔</text>
              </svg>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Features Section */}
      <Box sx={{ bgcolor: '#F8FAFC', py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2rem', md: '2.5rem' },
                fontWeight: 700,
                mb: 2,
                color: '#0F172A'
              }}
            >
              Everything you need
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: '#64748B',
                fontWeight: 400,
                maxWidth: '600px',
                margin: '0 auto'
              }}
            >
              Powerful features to manage your retail business efficiently
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    p: 3,
                    border: '1px solid #E5E7EB',
                    boxShadow: 'none',
                    borderRadius: 3,
                    transition: 'all 0.2s',
                    '&:hover': {
                      boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                      transform: 'translateY(-4px)',
                      borderColor: feature.color
                    }
                  }}
                >
                  <CardContent sx={{ p: 0 }}>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: 2,
                        bgcolor: `${feature.color}15`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2,
                        color: feature.color
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{ mb: 1, fontWeight: 600, color: '#0F172A' }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Benefits Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Grid container spacing={8} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2rem', md: '2.5rem' },
                fontWeight: 700,
                mb: 3,
                color: '#0F172A'
              }}
            >
              Why businesses choose Smart POS
            </Typography>
            <Typography
              variant="body1"
              sx={{
                mb: 4,
                color: '#64748B',
                fontSize: '1.125rem',
                lineHeight: 1.7
              }}
            >
              Save time and money while gaining complete visibility into your
              inventory and sales operations.
            </Typography>
            <Stack spacing={2}>
              {benefits.map((benefit, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <CheckIcon sx={{ color: '#10B981', fontSize: 24, mt: 0.5 }} />
                  <Typography variant="body1" sx={{ color: '#0F172A', fontSize: '1.05rem' }}>
                    {benefit}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Grid>

          {/* Benefits SVG */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                height: 400,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <svg viewBox="0 0 400 400" style={{ width: '100%', height: '100%' }}>
                {/* Growth chart */}
                <rect x="50" y="50" width="300" height="300" rx="12" fill="#F8FAFC" stroke="#E5E7EB" strokeWidth="2" />
                
                {/* Trend line */}
                <polyline
                  points="80,280 120,240 160,260 200,200 240,180 280,140 320,120"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                
                {/* Data points */}
                <circle cx="80" cy="280" r="6" fill="#10B981" />
                <circle cx="120" cy="240" r="6" fill="#10B981" />
                <circle cx="160" cy="260" r="6" fill="#10B981" />
                <circle cx="200" cy="200" r="6" fill="#10B981" />
                <circle cx="240" cy="180" r="6" fill="#10B981" />
                <circle cx="280" cy="140" r="6" fill="#10B981" />
                <circle cx="320" cy="120" r="6" fill="#10B981" />
                
                {/* Trend up icon */}
                <circle cx="340" cy="80" r="30" fill="#10B981" opacity="0.1" />
                <text x="340" y="92" textAnchor="middle" fontSize="28">📈</text>
              </svg>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box sx={{ bgcolor: '#0F172A', py: { xs: 8, md: 12 } }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2rem', md: '2.5rem' },
                fontWeight: 700,
                mb: 2,
                color: 'white'
              }}
            >
              Ready to get started?
            </Typography>
            <Typography
              variant="h6"
              sx={{
                mb: 4,
                color: '#94A3B8',
                fontWeight: 400
              }}
            >
              Join modern businesses using Smart POS to manage their inventory
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/login')}
              endIcon={<ArrowIcon />}
              sx={{
                bgcolor: '#2563EB',
                '&:hover': { bgcolor: '#1D4ED8' },
                px: 5,
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: 2,
                boxShadow: '0 4px 14px 0 rgba(37, 99, 235, 0.39)'
              }}
            >
              Sign In Now
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: '#FFFFFF', borderTop: '1px solid #E5E7EB', py: 6 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#0F172A', mb: 1 }}>
              🛒 Smart POS
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748B', mb: 2 }}>
              Inventory & Replenishment Management System
            </Typography>
            <Typography variant="body2" sx={{ color: '#94A3B8' }}>
              © 2024 Smart POS. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};
