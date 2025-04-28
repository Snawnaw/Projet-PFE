import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import GénérateurExamen from './GénérateurExamen';  // adjust the path as needed
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
    Toolbar,
    Card,
    CardContent,
    TextField,
    Divider
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
    const [currentView, setCurrentView] = useState('génerer examen'); // page par défaut

    const sectionsData = [
        { id: 1, nom: 'Section A', filiere: 'Informatique', niveau: '2ème année' },
        { id: 2, nom: 'Section B', filiere: 'Génie Civil', niveau: '1ère année' },
    ];

    const sectionsColumns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'nom', headerName: 'Nom', width: 130 },
        { field: 'filiere', headerName: 'Filière', width: 130 },
        { field: 'niveau', headerName: 'Niveau', width: 130 },
    ];

    const toggleDrawer = () => {
        setOpen(!open);
    };

    const menuItems = [
        { text: 'Mon Profil', icon: <PersonIcon />, view: 'profile' },
        { text: 'Génerer Examen', icon: <SchoolIcon />, view: 'génerer examen' },
        { text: 'Filières', icon: <CategoryIcon />, view: 'filieres' },
        { text: 'Banque de Questions', icon: <ClassIcon />, view: 'banque' },
    ];

    const handleMenuClick = (view) => {
        setCurrentView(view);
        setOpen(false);
    };

    const renderMainContent = () => {
        switch (currentView) {
            case 'génerer examen':
                return (
                    <Box>
                        <Typography variant="h5" gutterBottom>
                            Générateur d'Examen
                        </Typography>
                        <Box display="flex" justifyContent="flex-end" gap={2} mb={2}>
                            <Button 
                                variant="contained" 
                                onClick={() => navigate('/GénérerExamen')} 
                                color="success"
                                sx={{ borderRadius: 2 }}
                            >
                                + Question
                            </Button>
                            <Button 
                                variant="contained" 
                                onClick={() => navigate('/GénérerExamen')}
                                color="info"
                                sx={{ borderRadius: 2 }}
                            >
                                Générer un Examen
                            </Button>
                        </Box>
                        <GénérateurExamen />;
                    </Box>
                );
                                
            case 'filieres':
                return (
                    <Box>
                        <Typography variant="h5" gutterBottom>
                            Filières et Sections
                        </Typography>
                        <Box display="flex" justifyContent="flex-end" gap={2} mb={2}>
                            <Button onClick={() => navigate('/GénérerExamen')} variant="contained" color="success" sx={{ borderRadius: 2 }}>
                            + Question
                            </Button>
                            <Button variant="contained" color="info" sx={{ borderRadius: 2 }}>
                                Créer Examen
                            </Button>
                        </Box>

                        <Card elevation={3} sx={{ p: 2, mb: 3 }}>
                            <Typography variant="h6" gutterBottom>Filtrer par Filière / Section</Typography>
                            <Box display="flex" gap={2}>
                                <TextField label="Filière" variant="outlined" />
                                <TextField label="Section" variant="outlined" />
                                <Button variant="outlined">Appliquer</Button>
                            </Box>
                        </Card>

                        <Card elevation={3}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Précision des Filières / Sections
                                </Typography>
                                <DataGrid
                                    rows={sectionsData}
                                    columns={sectionsColumns}
                                    autoHeight
                                    pageSize={5}
                                />
                            </CardContent>
                        </Card>
                    </Box>
                );
            case 'banque':
                return (
                    <Box>
                        <Typography variant="h5" gutterBottom>Banque de Questions</Typography>
                        <Box display="flex" justifyContent="flex-end" gap={2} mb={2}>
                            <Button variant="contained" color="success" sx={{ borderRadius: 2 }}>
                                + Question
                            </Button>
                            <Button variant="contained" color="info" sx={{ borderRadius: 2 }}>
                                Créer Examen
                            </Button>
                        </Box>
                    
                        <Card elevation={3} sx={{ p: 2, mb: 3 }}>
                            <Typography variant="h6" gutterBottom>Filtrer par Filière / Section</Typography>
                            <Typography variant="body2" gutterBottom>
                            Ajoutez, modifiez ou filtrez les questions à travers une interface simple.
                        </Typography>
                            <Box display="flex" gap={2}>
                                <TextField label="Filière" variant="outlined" />
                                <TextField label="Section" variant="outlined" />
                                <Button variant="outlined">Appliquer</Button>
                            </Box>
                        </Card>
                        {/* Liste des questions à venir */}
                        <Typography variant="body2" color="text.secondary">
                            📌 Aucune question disponible pour le moment. Ajoutez-en à l’aide du bouton en haut.
                        </Typography>
                    </Box>
                );
            case 'profile':
                return( 
                    <Box sx={{width:600, mx: 'auto',mt:2, p: 2, mb: 3 }}>
                        <card elevation={2} >
                            <Typography variant="h6" gutterBottom>Informations personnelles</Typography>
                            <TextField fullWidth label="Nom complet" margin="normal" defaultValue="John Doe" />
                            <TextField fullWidth label="Email" margin="normal" defaultValue="john.doe@example.com" />
                            <TextField fullWidth label="Date de naissance" margin="normal" defaultValue="1990-01-01" type="date" InputLabelProps={{ shrink: true }} />
                            <Button variant="contained" fullWidth sx={{ my: 2 }}>Mettre à jour</Button>
                        </card>
                        <Box  sx={{ maxWidth: 600, mx: 'auto', mt: 2 }}>
                            <Typography variant="h6" gutterBottom>Sécurité</Typography>
                            <TextField fullWidth label="Mot de passe actuel" margin="normal" type="password" />
                            <TextField fullWidth label="Nouveau mot de passe" margin="normal" type="password" />
                            <TextField fullWidth label="Confirmer le mot de passe" margin="normal" type="password" />
                            <Typography variant="body2" color="error">
                                - Au moins 8 caractères<br />
                                - Majuscule, minuscule, chiffre<br />
                                - Les mots de passe doivent correspondre
                            </Typography>
                            <Button variant="contained" color="primary" fullWidth sx={{ my: 2 }}>Changer mot de passe</Button>
                            <Button variant="contained" color="error" fullWidth>Supprimer le compte</Button>
                        </Box>
                    </Box>
            );
        }
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
                <Toolbar />
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

export default User;
