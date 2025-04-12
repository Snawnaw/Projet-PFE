import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { 
    Button, 
    Typography, 
    Box, 
    Drawer, 
    IconButton, 
    List, 
    ListItem, 
    ListItemIcon, 
    ListItemText,
    AppBar,
    Toolbar
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import ClassIcon from '@mui/icons-material/Class';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import CategoryIcon from '@mui/icons-material/Category';

const User = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [currentView, setCurrentView] = useState('sections');

    // Sample data - replace with your actual data fetching logic
    const sectionsData = [
        { id: 1, nom: 'Section A', filiere: 'Informatique', niveau: '2ème année' },
        { id: 2, nom: 'Section B', filiere: 'Génie Civil', niveau: '1ère année' },
    ];

    const teachersData = [
        { id: 1, nom: 'Doe', prenom: 'John', email: 'john@example.com' },
        { id: 2, nom: 'Smith', prenom: 'Jane', email: 'jane@example.com' },
    ];

    const sallesData = [
        { id: 1, numero: 'A101', type: 'Cours', capacite: 30 },
        { id: 2, numero: 'B202', type: 'TP', capacite: 20 },
    ];

    const sectionsColumns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'nom', headerName: 'Nom', width: 130 },
        { field: 'filiere', headerName: 'Filière', width: 130 },
        { field: 'niveau', headerName: 'Niveau', width: 130 },
    ];

    const teachersColumns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'nom', headerName: 'Nom', width: 130 },
        { field: 'prenom', headerName: 'Prénom', width: 130 },
        { field: 'email', headerName: 'Email', width: 200 },
    ];

    const sallesColumns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'numero', headerName: 'Numéro', width: 130 },
        { field: 'type', headerName: 'Type', width: 130 },
        { field: 'capacite', headerName: 'Capacité', width: 130 },
    ];

    const toggleDrawer = () => {
        setOpen(!open);
    };

    const menuItems = [
        { text: 'Mon Profil', icon: <PersonIcon />, view: 'profile' },
        { text: 'Génerer Examen', icon: <SchoolIcon />, view: 'génerer examen' },
        { text: 'Filières', icon: <CategoryIcon />, view: 'filieres' },
    ];

    const handleMenuClick = (view) => {
        setCurrentView(view);
        setOpen(false);
    };

    return (
        <Box sx={{ display: 'flex', width: '100%' }}>
            {/* App Bar */}
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        onClick={toggleDrawer}
                        edge="start"
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap>
                        Dashboard Enseignant
                    </Typography>
                </Toolbar>
            </AppBar>

            {/* Sidebar */}
            <Drawer
                variant="temporary"
                anchor="left"
                open={open}
                onClose={toggleDrawer}
                sx={{
                    width: 240,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: 240,
                        boxSizing: 'border-box',
                        backgroundColor: '#f5f5f5',
                    },
                }}
            >
                <Toolbar /> {/* This creates space below the AppBar */}
                <List>
                    {menuItems.map((item) => (
                        <ListItem 
                            button 
                            key={item.text}
                            onClick={() => handleMenuClick(item.view)}
                        >
                            <ListItemIcon>
                                {item.icon}
                            </ListItemIcon>
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
                    mt: 8,  // Added margin top
                    backgroundColor: '#fafafa',
                    minHeight: '100vh',
                    width: '100%'
                }}
            >
                
            </Box>
        </Box>
    );
};

export default User;
