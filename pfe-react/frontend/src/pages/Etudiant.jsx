import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, Button, Box, Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SendIcon from '@mui/icons-material/Send';
import MenuIcon from '@mui/icons-material/Menu';
import Examens from '../pages/Examens';
import AnswerKey from '../pages/AnswerKey';
import EtudiantProfile from '../components/Etudiant/EtudiantProfile';
//import NotificationBell from '../components/NotificationBell';

const drawerWidth = 240;

//const [notifications, setNotifications] = useState([]);

{/*useEffect(() => {
  const fetchNotifications = async () => {
    const res = await axios.get('/api/v1/notifications');
    setNotifications(res.data.notifications);
  };
  fetchNotifications();
}, []);*/}

const menuItems = [
    { text: 'Profile', icon: <CheckCircleIcon />, view: 'profile' },
    { text: 'Examens', icon: <MenuBookIcon />, view: 'examens' },
    { text: 'Corrigés', icon: <SendIcon />, view: 'corriges' },
    { text: 'Résultats', icon: <AssignmentTurnedInIcon />, view: 'resultats' },
    { text: 'Notifications', icon: <CheckCircleIcon />, view: 'notifications' }
];

const Etudiant = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState('examens');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/SignIn');
  };

  const renderMainContent = () => {
    switch (currentView) {
        case 'profile':
            return <EtudiantProfile />;
        case 'examens':
            return <Examens></Examens>;
        case 'resultats':
            return
        case 'notifications':
          return <NotificationBell />;
        default:
            return null;
    }
  };

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      {/* App Bar */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton color="inherit" onClick={() => setSidebarOpen(!sidebarOpen)} edge="start" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
            Dashboard Etudiant
          </Typography>
          <Button color="inherit" startIcon={<LogoutIcon />} onClick={handleLogout}>
            Déconnexion
          </Button>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#f5f5f5',
          },
        }}
      >
        <Toolbar />
        <List>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.text}
              selected={currentView === item.view}
              onClick={() => { setCurrentView(item.view); setSidebarOpen(false); }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          backgroundColor: '#fafafa',
          minHeight: '100vh',
          width: '100%',
        }}
      >
        {renderMainContent()}
      </Box>
    </Box>
  );
};

export default Etudiant;