import React, { useCallback } from 'react';
import { Container, Button, Stack, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  School as SchoolIcon,
  Groups as GroupsIcon
} from '@mui/icons-material';

const NavigationHub: React.FC = () => {
  const navigate = useNavigate();

  const navigationLinks = [
    { 
      path: '/encadrant',
      label: 'Espace Encadrant',
      color: 'primary',
      icon: <SchoolIcon />
    },
    { 
      path: '/etudiant', 
      label: 'Espace Etudiant', 
      color: 'secondary', 
      icon: <GroupsIcon />
    },
    {
      path: '/admin',
      label: 'Administration',
      color: 'error',
      icon: <PeopleIcon />
    },
    {
      path: '/projets',
      label: 'Gestion des Projets',
      color: 'success',
      icon: <AssignmentIcon />
    },
    {
      path: '/dashboard',
      label: 'Tableau de Bord',
      color: 'info',
      icon: <DashboardIcon />
    }
  ];

  const handleNavigation = useCallback((path: string) => {
    navigate(path);
  }, [navigate]);

  return (
    <Container maxWidth="lg">
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center',
        backgroundImage: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        padding: 4,
        borderRadius: 2
      }}>
        <Typography 
          variant="h2" 
          gutterBottom 
          align="center" 
          sx={{ 
            mb: 6,
            fontWeight: 700,
            color: '#1a365d',
            textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          Gestion des Projets Fin d'Études
        </Typography>
        
        <Stack spacing={3} alignItems="center">
          {navigationLinks.map(({ path, label, color, icon }) => (
            <Button
              key={path}
              variant="contained"
              color={color as any}
              onClick={() => handleNavigation(path)}
              startIcon={icon}
              sx={{
                width: '350px',
                height: '60px',
                fontSize: '1.2rem',
                borderRadius: '30px',
                textTransform: 'none',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 8px rgba(0,0,0,0.15)',
                  transition: 'all 0.2s ease-in-out'
                }
              }}
            >
              {label}
            </Button>
          ))}
        </Stack>
      </Box>
    </Container>
  );
};

export default NavigationHub;
