import API from '../services/api';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import CategoryIcon from '@mui/icons-material/Category';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import React, { useState, useEffect } from 'react';
import ClassIcon from '@mui/icons-material/Class';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import { admin, auth } from '../services/api';
import { DataGrid } from '@mui/x-data-grid';
import GénérateurExamen from './GénérateurExamen';
/*import axios from 'axios';
import { response } from '../../../backend/App';
import { NavItem } from 'react-bootstrap';*/

import { 
    CircularProgress,
    ListItemIcon,
    ListItemText,
    Typography,
    IconButton,
    ListItem,
    Toolbar,
    AppBar,
    Drawer,
    Button,
    Alert,
    List,
    Box
} from '@mui/material';
import { date } from 'yup';

const Admin = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [currentView, setCurrentView] = useState('sections');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    // Data states
    const [sectionsData, setSectionsData] = useState([]);
    const [sallesData, setSallesData] = useState([]);
    const [filieresData, setFilieresData] = useState([]);
    const [userData, setUserProfile] = useState([]);
    const [adminData, setAdminData] = useState([]);
    const [teacherData, setTeacherData] = useState([]);

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
                    if (!adminData) {
                        const response = await API.get('');  // Endpoint to get admin data
                        console.log('ADMIN DATA:', response.data); // 🔍 DEBUG
                        setAdminData(response.data.admin);
                    }
                    break;
                    
                case 'sections':
                    if (sectionsData.length === 0) {
                        const response = await API.get('/section/AllSections');
                        console.log('SECTIONS:', response.data); // 🔍 DEBUG
                        setSectionsData(response.data.sections);
                    }
                    break;
                    
                case 'enseignants':
                    if (teacherData.length === 0) {
                        const response = await API.get('/enseignant/AllEnseignant');
                        setTeacherData(response.data);
                    }
                    break;
                    
                case 'salles':
                    if (sallesData.length === 0) {
                        const response = await API.get('/salle/AllSalle');
                        console.log('SALLES:', response.data); // 🔍 DEBUG
                        setSallesData(response.data.salles);
                    }
                    break;
                    
                case 'filieres':
                    if (filieresData.length === 0) {
                        const response = await API.get('/filiere/AllFiliere');
                        console.log('FILIERES:', response.data); // 🔍 DEBUG
                        setFilieresData(response.data.filieres);
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
        { 
            field: 'filiere', 
            headerName: 'Filière', 
            width: 130, 
            valueGetter: (params) => params.row?.filiere?.nom ?? 'N/A'
        },
        { field: 'niveau', headerName: 'Niveau', width: 130 },
        { field: 'nbgroupes', headerName: 'Nombre de groupes', width: 180 },
    ];

    const filiereColumns = [
        { field: '_id', headerName: 'ID', width: 220 },
        { field: 'nom', headerName: 'Nom', width: 130 },
        { field: 'code', headerName: 'Code', width: 130 },
        { field: 'cycle', headerName: 'Cycle', width: 200 },
    ];

    const AdminColumns = [
        { field: '_id', headerName: 'ID', width: 220 },
        { field: 'nom', headerName: 'Nom', width: 130 },
        { field: 'prenom', headerName: 'Prénom', width: 130 },
        { field: 'date_naissance', headerName: 'Date de naissance', width: 180 },
        { field: 'numero_tel', headerName: 'Numéro de téléphone', width: 180 },
        { field: 'email', headerName: 'Email', width: 200 },
        { field: 'password', headerName: 'Mot de passe', width: 180 },
        { field: 'role', headerName: 'Rôle', width: 130 },
        { field: 'createdAt', headerName: 'Date de création', width: 180, type: 'date' },
    ];

    // Add this utility function at the top of your file
    const formatDate = (params) => {
        if (!params || !params.value) return '';
        try {
            return new Date(params.value).toLocaleDateString('fr-FR');
        } catch (error) {
            return '';
        }
    };

    // Update your columns definition
    const teachersColumns = [
        { field: '_id', headerName: 'ID', width: 220 },
        { field: 'nom', headerName: 'Nom', width: 130 },
        { field: 'prenom', headerName: 'Prénom', width: 130 },
        { 
            field: 'date_naissance',
            headerName: 'Date de naissance',
            width: 150,
            type: 'date',
            valueFormatter: formatDate
        },
        { field: 'email', headerName: 'Email', width: 200 },
        { field: 'numero_tel', headerName: 'Téléphone', width: 130 },
        { field: 'role', headerName: 'Rôle', width: 100 },
        {
            field: 'createdAt',
            headerName: 'Date de création',
            width: 150,
            type: 'date',
            valueFormatter: formatDate
        }
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
                        {currentView === 'profile' && adminData && (
                            <Box>
                                <Typography variant="h6" gutterBottom>Mon Profil</Typography>
                                <Typography><strong>Nom:</strong> {adminData.nom}</Typography>
                                <Typography><strong>Prénom:</strong> {adminData.prenom}</Typography>
                                <Typography><strong>Date de naissance:</strong> {adminData.dateNaissance}</Typography>
                                <Typography><strong>Email:</strong> {adminData.email}</Typography>
                                <Typography><strong>Mot de passe:</strong> {adminData.password}</Typography>
                                <Typography><strong>Téléphone:</strong> {adminData.numeroTel}</Typography>
                                <Typography><strong>Rôle:</strong> {adminData.role}</Typography>
                            </Box>
                        )}
                        
                        {currentView === 'filieres' && filieresData && (
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
                                        rows={filieresData.map(filiere => ({
                                            id: filiere._id,
                                            _id: filiere._id,
                                            nom: filiere.nom,
                                            code: filiere.code,
                                            cycle: filiere.cycle
                                        }))}
                                        columns={filiereColumns}
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
                                    rows={sectionsData.map(s => ({
                                        id: s._id,
                                        _id: s._id,
                                        nom: s.nom,
                                        filiere: s.filiere, // Keep the whole filiere object
                                        niveau: s.niveau,
                                        nbgroupes: s.nombre_de_groupes,
                                    }))}
                                    columns={sectionsColumns}
                                    pageSize={5}
                                    rowsPerPageOptions={[5]}
                                    autoHeight
                                    disableSelectionOnClick
                                />
                            </>
                        )}

                        {currentView === 'salles' && sallesData && (
                            <>
                                <Button
                                    variant="contained"
                                    onClick={() => navigate('/AjouterSalle')}
                                    sx={{ mb: 2 }}
                                >
                                    Ajouter Salle
                                </Button>
                                <DataGrid
                                    rows={sallesData.map(salle => ({
                                        id: salle._id,
                                        _id: salle._id,
                                        numero: salle.numero,
                                        type: salle.type,
                                        capacite: salle.capacite,
                                    }))}
                                    columns={sallesColumns}
                                    pageSize={5}
                                    rowsPerPageOptions={[5]}
                                    autoHeight
                                    disableSelectionOnClick
                                />
                            </>
                        )}
                        
                        {currentView === 'enseignants' && teacherData && (
                            <Box sx={{ width: '100%', height: '100%' }}>
                                <Button 
                                    variant="contained" 
                                    onClick={() => navigate('/AjouterEnseignant')} 
                                    sx={{ mb: 2 }}
                                >
                                    Ajouter Enseignant
                                </Button>
                                <Box sx={{ height: 400, width: '100%' }}>
                                    <DataGrid
                                        rows={teacherData.map(t => ({
                                            id: t._id || Math.random(),
                                            _id: t._id,
                                            nom: t.nom || '',
                                            prenom: t.prenom || '',
                                            date_naissance: t.date_naissance ? new Date(t.date_naissance) : null,
                                            numero_tel: t.numero_tel || '',
                                            email: t.email || '',
                                            role: t.role || '',
                                            createdAt: t.createdAt ? new Date(t.createdAt) : null
                                        }))}
                                        columns={teachersColumns}
                                        pageSize={5}
                                        rowsPerPageOptions={[5]}
                                        autoHeight
                                        disableSelectionOnClick
                                    />
                                </Box>
                            </Box>
                        )}
                        
                        {currentView === 'génerer examen' && (
                            <>
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
                            </>
                        )}
                    </>
                )}
            </Box>
        </Box>
    );
};

export default Admin;