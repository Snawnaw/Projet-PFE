import React, { useState, useEffect } from 'react';
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
    Toolbar,
    CircularProgress,
    Alert
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import ClassIcon from '@mui/icons-material/Class';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import CategoryIcon from '@mui/icons-material/Category';
import { admin, auth } from '../services/api';

const Admin = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [currentView, setCurrentView] = useState('sections');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    // Data states
    const [sectionsData, setSectionsData] = useState([]);
    const [teachersData, setTeachersData] = useState([]);
    const [sallesData, setSallesData] = useState([]);
    const [filieresData, setFilieresData] = useState([]);
    const [userProfile, setUserProfile] = useState(null);

    useEffect(() => {
        // Check if user is logged in and is admin
        const checkAuth = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                if (!user || user.role !== 'admin') {
                    navigate('/signin');
                    return;
                }
                
                // Load initial data for current view
                loadData(currentView);
            } catch (error) {
                console.error('Authentication error:', error);
                navigate('/signin');
            }
        };
        
        checkAuth();
    }, [navigate]);
    
    // Load data based on current view
    const loadData = async (view) => {
        setLoading(true);
        setError('');
        
        try {
            switch (view) {
                case 'profile':
                    if (!userProfile) {
                        const response = await auth.getProfile();
                        setUserProfile(response.data.user);
                    }
                    break;
                    
                case 'sections':
                    if (sectionsData.length === 0) {
                        const response = await admin.getSections();
                        setSectionsData(response.data.sections || []);
                    }
                    break;
                    
                case 'enseignants':
                    if (teachersData.length === 0) {
                        const response = await admin.getTeachers();
                        setTeachersData(response.data.teachers || []);
                    }
                    break;
                    
                case 'salles':
                    if (sallesData.length === 0) {
                        const response = await admin.getSalles();
                        setSallesData(response.data.salles || []);
                    }
                    break;
                    
                case 'filieres':
                    if (filieresData.length === 0) {
                        const response = await admin.getFilieres();
                        setFilieresData(response.data.filieres || []);
                    }
                    break;
                    
                default:
                    break;
            }
        } catch (err) {
            console.error(`Error loading ${view}:`, err);
            setError(`Erreur lors du chargement des données: ${err.response?.data?.message || err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await auth.logout();
            navigate('/signin');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const sectionsColumns = [
        { field: '_id', headerName: 'ID', width: 220 },
        { field: 'nom', headerName: 'Nom', width: 130 },
        { field: 'filiere', headerName: 'Filière', width: 130, valueGetter: (params) => params.row.filiere?.nom || '' },
        { field: 'niveau', headerName: 'Niveau', width: 130 },
    ];

    const teachersColumns = [
        { field: '_id', headerName: 'ID', width: 220 },
        { field: 'nom', headerName: 'Nom', width: 130 },
        { field: 'prenom', headerName: 'Prénom', width: 130 },
        { field: 'email', headerName: 'Email', width: 200 },
    ];

    const sallesColumns = [
        { field: '_id', headerName: 'ID', width: 220 },
        { field: 'numero', headerName: 'Numéro', width: 130 },
        { field: 'type', headerName: 'Type', width: 130 },
        { field: 'capacite', headerName: 'Capacité', width: 130 },
    ];

    const toggleDrawer = () => {
        setOpen(!open);
    };

    const menuItems = [
        { text: 'Mon Profil', icon: <PersonIcon />, view: 'profile' },
        { text: 'Enseignants', icon: <SchoolIcon />, view: 'enseignants' },
        { text: 'Filières', icon: <CategoryIcon />, view: 'filieres' },
        { text: 'Sections', icon: <ClassIcon />, view: 'sections' },
        { text: 'Salles', icon: <MeetingRoomIcon />, view: 'salles' },
        { text: 'Génerer Examen', icon: <SchoolIcon />, view: 'génerer examen' },
    ];

    const handleMenuClick = (view) => {
        setCurrentView(view);
        setOpen(false);
        loadData(view);
    };

    return (
        <Box sx={{ display: 'flex' }}>
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
                    <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
                        Dashboard Admin
                    </Typography>
                    <Button color="inherit" onClick={handleLogout}>
                        Déconnexion
                    </Button>
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
                    backgroundColor: '#fafafa',
                    minHeight: '100vh'
                }}
            >
                <Toolbar /> {/* This creates space below the AppBar */}
                
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}
                
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        {currentView === 'profile' && userProfile && (
                            <Box>
                                <Typography variant="h6" gutterBottom>Mon Profil</Typography>
                                <Typography><strong>Nom:</strong> {userProfile.nom}</Typography>
                                <Typography><strong>Prénom:</strong> {userProfile.prenom}</Typography>
                                <Typography><strong>Email:</strong> {userProfile.email}</Typography>
                                <Typography><strong>Téléphone:</strong> {userProfile.numeroTel}</Typography>
                                <Typography><strong>Rôle:</strong> {userProfile.role}</Typography>
                            </Box>
                        )}
                        
                        {currentView === 'filieres' && (
                            <>
                                <Button 
                                    variant="contained" 
                                    onClick={() => navigate('/AjouterFiliere')} 
                                    sx={{ mb: 2 }}
                                >
                                    Ajouter Filière
                                </Button>
                                <Typography variant="h6">Gestion des Filières</Typography>
                                {filieresData.length > 0 ? (
                                    <DataGrid
                                        rows={filieresData.map(f => ({...f, id: f._id}))}
                                        columns={[
                                            { field: 'id', headerName: 'ID', width: 220 },
                                            { field: 'nom', headerName: 'Nom', width: 130 },
                                            { field: 'description', headerName: 'Description', width: 300 },
                                        ]}
                                        pageSize={5}
                                        rowsPerPageOptions={[5]}
                                        autoHeight
                                        disableSelectionOnClick
                                        getRowId={(row) => row.id}
                                    />
                                ) : (
                                    <Typography sx={{ mt: 2 }}>Aucune filière trouvée</Typography>
                                )}
                            </>
                        )}
                        
                        {currentView === 'sections' && (
                            <>
                                <Button 
                                    variant="contained" 
                                    onClick={() => navigate('/AjouterSection')} 
                                    sx={{ mb: 2 }}
                                >
                                    Ajouter Section
                                </Button>
                                <DataGrid
                                    rows={sectionsData.map(s => ({...s, id: s._id}))}
                                    columns={sectionsColumns}
                                    pageSize={5}
                                    rowsPerPageOptions={[5]}
                                    autoHeight
                                    disableSelectionOnClick
                                    getRowId={(row) => row.id}
                                />
                            </>
                        )}
                        
                        {currentView === 'enseignants' && (
                            <>
                                <Button 
                                    variant="contained" 
                                    onClick={() => navigate('/AjouterEnseignant')} 
                                    sx={{ mb: 2 }}
                                >
                                    Ajouter Enseignant
                                </Button>
                                <DataGrid
                                    rows={teachersData.map(t => ({...t, id: t._id}))}
                                    columns={teachersColumns}
                                    pageSize={5}
                                    rowsPerPageOptions={[5]}
                                    autoHeight
                                    disableSelectionOnClick
                                    getRowId={(row) => row.id}
                                />
                            </>
                        )}
                        
                        {currentView === 'salles' && (
                            <>
                                <Button 
                                    variant="contained" 
                                    onClick={() => navigate('/AjouterSalle')} 
                                    sx={{ mb: 2 }}
                                >
                                    Ajouter Salle
                                </Button>
                                <DataGrid
                                    rows={sallesData.map(s => ({...s, id: s._id}))}
                                    columns={sallesColumns}
                                    pageSize={5}
                                    rowsPerPageOptions={[5]}
                                    autoHeight
                                    disableSelectionOnClick
                                    getRowId={(row) => row.id}
                                />
                            </>
                        )}
                        
                        {currentView === 'génerer examen' && (
                            <>
                                <Button 
                                    variant="contained" 
                                    onClick={() => navigate('/GénérerExamen')} 
                                    sx={{ mb: 2 }}
                                >
                                    Générer un nouvel examen
                                </Button>
                                <Typography variant="h6">Générer Examen</Typography>
                            </>
                        )}
                    </>
                )}
            </Box>
        </Box>
    );
};

export default Admin;