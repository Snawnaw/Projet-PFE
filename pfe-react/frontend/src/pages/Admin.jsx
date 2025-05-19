import API from '../services/api';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import CategoryIcon from '@mui/icons-material/Category';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import React, { useState, useEffect } from 'react';
import ClassIcon from '@mui/icons-material/Class';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import { auth } from '../services/api';
import { DataGrid } from '@mui/x-data-grid';
import GénérateurExamen from './GénérateurExamen';
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
    Box,
    Paper,
    Chip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContentText from '@mui/material/DialogContentText';

// AdminProfile component definition moved inside Admin.jsx
const AdminProfile = () => {
    const [adminData, setAdminData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                setLoading(true);
                const response = await API.get('/auth/me');
                setAdminData(response.data.user);
            } catch (err) {
                setError('Failed to load admin profile');
                console.error('Error fetching admin data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchAdminData();
    }, []);

    if (loading) return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
        </Box>
    );
    
    if (error) return (
        <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>
    );
    
    if (!adminData) return (
        <Alert severity="info" sx={{ my: 2 }}>No admin data available</Alert>
    );

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                {/* ...existing AdminProfile JSX code... */}
            </Paper>
        </Box>
    );
};

const Admin = () => {
    const navigate = useNavigate();
    const [sectionsData, setSectionsData] = useState([]);
    const [sallesData, setSallesData] = useState([]);
    const [filieresData, setFilieresData] = useState([]);
    const [modulesData, setModulesData] = useState([]);
    const [adminData, setAdminData] = useState([]);
    const [teacherData, setTeacherData] = useState([]);
    const [questionsData, setQuestionsData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [loadingQuestions, setLoadingQuestions] = useState(false);
    const [open, setOpen] = useState(false);
    const [currentView, setCurrentView] = useState('sections');
    const [filiere, setFiliere] = useState('');
    const [section, setSection] = useState('');
    const [module, setModule] = useState('');
    const [enseignant, setEnseignant] = useState('');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [deleteType, setDeleteType] = useState('');

    const loadData = async (view) => {
        setLoading(true);
        setError('');
        
        try {
            switch (view) {
                case 'profile':
                    if (!adminData) {
                        const response = await API.get('');
                        setAdminData(response.data.admin);
                    }
                    break;
                    
                case 'sections':
                    if (sectionsData.length === 0) {
                        const response = await API.get('/section/AllSections');
                        setSectionsData(response.data.sections);
                    }
                    break;
                    
                case 'enseignants':
                    if (teacherData.length === 0) {
                        const response = await API.get('/enseignant/AllEnseignant');
                        setTeacherData(response.data.enseignants);
                    }
                    break;
                    
                case 'salles':
                    if (sallesData.length === 0) {
                        const response = await API.get('/salle/AllSalle');
                        setSallesData(response.data.salles);
                    }
                    break;
                    
                case 'filieres':
                    if (filieresData.length === 0) {
                        const response = await API.get('/filiere/AllFiliere');
                        setFilieresData(response.data.filieres);
                    }
                    break;

                case 'modules':
                    if (modulesData.length === 0) {
                        const response = await API.get('/module/AllModules');
                        setModulesData(response.data.modules);
                    }
                    break;
            }
        } catch (err) {
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

    const fetchQuestions = async (moduleId) => {
        setLoadingQuestions(true);
        try {
            const response = await API.get(moduleId 
                ? `/question/module/${moduleId}`
                : '/question');
            
            console.log('Questions API Response:', response); // Add this line
            
            const questions = Array.isArray(response.data?.questions) 
                ? response.data.questions.map(q => ({
                    ...q,
                    module: q.module || { _id: null, nom: 'N/A' }
                }))
                : [];
            
            console.log('Processed Questions:', questions); // Add this line
            setQuestionsData(questions);
        } catch (error) {
            console.error('Error fetching questions:', error);
            setError('Error loading questions');
            setQuestionsData([]);
        } finally {
            setLoadingQuestions(false);
        }
    };

    useEffect(() => {
        if (currentView === 'banque de questions') {
            fetchQuestions();
        }
    }, [currentView]);

    useEffect(() => {
        if (currentView === 'banque de questions' && modulesData.length === 0) {
            loadData('modules').then(() => fetchQuestions());
        } else if (currentView === 'banque de questions') {
            fetchQuestions();
        }
    }, [currentView]);

    // Keep only the view-specific logic in Admin component
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                if (!user || user.role !== 'admin') {
                    navigate('/signin');
                    return;
                }
                loadData(currentView);
            } catch (error) {
                console.error('Authentication error:', error);
                navigate('/signin');
            }
        };
        checkAuth();
    }, [currentView]);

    const handleUpdate = (row, type) => {
        switch(type) {
            case 'filiere':
                navigate(`/ModifierFiliere/${row._id}`);
                break;
            case 'section':
                navigate(`/ModifierSection/${row._id}`);
                break;
            case 'module':
                navigate(`/ModifierModule/${row._id}`);
                break;
            case 'salle':
                navigate(`/ModifierSalle/${row._id}`);
                break;
            case 'enseignant':
                navigate(`/ModifierEnseignant/${row._id}`);
                break;
            case 'question':
                navigate(`/ModifierQuestion/${row._id}`);
                break;
        }
    };

    const handleDelete = async () => {
        try {
            let endpoint = '';
            switch(deleteType) {
                case 'filiere':
                    endpoint = `/filiere/${itemToDelete}`;
                    break;
                case 'section':
                    endpoint = `/section/${itemToDelete}`;
                    break;
                case 'module':
                    endpoint = `/module/${itemToDelete}`;
                    break;
                case 'salle':
                    endpoint = `/salle/${itemToDelete}`;
                    break;
                case 'enseignant':
                    endpoint = `/enseignant/${itemToDelete}`;
                    break;
                case 'question':
                    endpoint = `/question/${itemToDelete}`;
                    break;
            }

            await API.delete(endpoint);
            
            // Refresh data after deletion
            loadData(currentView);
            
            setDeleteDialogOpen(false);
            setItemToDelete(null);
        } catch (error) {
            setError(`Erreur lors de la suppression: ${error.message}`);
        }
    };

    const openDeleteDialog = (id, type) => {
        setItemToDelete(id);
        setDeleteType(type);
        setDeleteDialogOpen(true);
    };

    const getActionColumns = (type) => [
        {
            field: 'actions',
            headerName: 'Actions',
            width: 200,
            renderCell: (params) => (
                <Box>
                    <IconButton 
                        color="primary" 
                        onClick={() => handleUpdate(params.row, type)}
                    >
                        <EditIcon />
                    </IconButton>
                    <IconButton 
                        color="error" 
                        onClick={() => openDeleteDialog(params.row._id, type)}
                    >
                        <DeleteIcon />
                    </IconButton>
                </Box>
            )
        }
    ];

    const sectionsColumns = [
        { field: '_id', headerName: 'ID', width: 220 },
        { field: 'nom', headerName: 'Nom', width: 130 },
        { 
            field: 'filiere', 
            headerName: 'Filière', 
            width: 130, 
        },
        { field: 'niveau', headerName: 'Niveau', width: 130 },
        { field: 'nombre_etudiants', headerName: 'Nombre d\'étudiants', width: 180 },
        { field: 'nombre_groupes', headerName: 'Nombre de groupes', width: 180 }, // Ensure field name matches backend
        ...getActionColumns('section')
    ];

    const filiereColumns = [
        { field: '_id', headerName: 'ID', width: 220 },
        { field: 'nom', headerName: 'Nom', width: 130 },
        { field: 'code', headerName: 'Code', width: 130 },
        { field: 'cycle', headerName: 'Cycle', width: 200 },
        ...getActionColumns('filiere')
    ];

    const moduleColumns = [
        { field: '_id', headerName: 'ID', width: 220 },
        { field: 'nom', headerName: 'Nom', width: 130 },
        { field: 'filiere', headerName: 'Filière', width: 130 },
        { field: 'section', headerName: 'Section', width: 130 },
        { field: 'enseignant', headerName: 'Enseignant', width: 180 },
        { field: 'type', headerName: 'Type', width: 180 },
        ...getActionColumns('module')
    ]

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
        { field: 'module', headerName: 'Module', width: 130 },
        { field: 'role', headerName: 'Rôle', width: 100 },
        {
            field: 'createdAt',
            headerName: 'Date de création',
            width: 150,
            type: 'date',
            valueFormatter: formatDate
        },
        ...getActionColumns('enseignant')
    ];

    const sallesColumns = [
        { field: '_id', headerName: 'ID', width: 220 },
        { field: 'nom', headerName: 'Nom', width: 130 },
        { field: 'numero', headerName: 'Numéro', width: 130 },
        { field: 'type', headerName: 'Type', width: 130 },
        { field: 'capacite', headerName: 'Capacité', width: 130 },
        ...getActionColumns('salle')
    ];

    const questionColumns = [
        { field: '_id', headerName: 'ID', width: 220 },
        { field: 'enonce', headerName: 'Énoncé', width: 400 },
        { 
            field: 'type', 
            headerName: 'Type', 
            width: 120,
            renderCell: (params) => (
                <Chip 
                    label={params.value || 'N/A'} 
                    color={
                        params.value === 'QCM' ? 'primary' : 
                        params.value === 'QCU' ? 'secondary' : 'default'
                    }
                />
            )
        },
        { 
            field: 'difficulte', 
            headerName: 'Difficulté', 
            width: 120,
            renderCell: (params) => (
                <Chip 
                    label={params.value || 'N/A'} 
                    color={
                        params.value === 'Facile' ? 'success' : 
                        params.value === 'Moyen' ? 'warning' : 'error'
                    }
                />
            )
        },
        { 
            field: 'module',
            headerName: 'Module',
            width: 180,
            valueGetter: (params) => {
                // Safely access the module name
                return params?.row?.module?.nom || 'N/A';
            },
        },
        ...getActionColumns('question')
    ];

    const toggleDrawer = () => {
        setOpen(!open);
    };

    const menuItems = [
        { text: 'Mon Profil', icon: <PersonIcon />, view: 'profile' },
        { text: 'Enseignants', icon: <SchoolIcon />, view: 'enseignants' },
        { text: 'Filières', icon: <CategoryIcon />, view: 'filieres' },
        { text: 'Sections', icon: <ClassIcon />, view: 'sections' },
        { text: 'Modules', icon: <ClassIcon />, view: 'modules' },
        { text: 'Salles', icon: <MeetingRoomIcon />, view: 'salles' },
        { text: 'Génerer Examen', icon: <SchoolIcon />, view: 'génerer examen' },
        { text: 'Banque de Questions', icon: <SchoolIcon />, view: 'banque de questions' },
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
                    <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>Dashboard Admin</Typography>
                    <Button color="inherit" onClick={handleLogout}>Déconnexion</Button>
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
                <Toolbar /> {/* Space below the AppBar */}
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
                        {currentView === 'profile' && <AdminProfile/>}
                        
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
                                        filiere: s.filiere?.nom || 'N/A', // Keep the whole filiere object
                                        niveau: s.niveau,
                                        nombre_etudiants: s.nombre_etudiants,
                                        nombre_groupes: s.nombre_groupes,
                                    }))}
                                    columns={sectionsColumns}
                                    pageSize={5}
                                    rowsPerPageOptions={[5]}
                                    autoHeight
                                    disableSelectionOnClick
                                />
                            </>
                        )}

                        {currentView === 'modules' && (
                            <>
                                <Button
                                    variant="contained"
                                    onClick={() => navigate('/AjouterModule')}
                                    sx={{ mb: 2 }}
                                >
                                    Ajouter Module
                                </Button>
                                <DataGrid
                                    rows={modulesData.map(module => ({
                                        id: module._id,
                                        _id: module._id,
                                        nom: module.nom,
                                        filiere: module.filiere.nom,
                                        section: module.section.nom,
                                        enseignant: module.enseignant.nom,
                                        type: module.type,
                                    }))}
                                    columns={moduleColumns}
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
                                        nom: salle.nom,
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

                        
                        
                        {currentView === 'enseignants' && Array.isArray(teacherData) && (
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
                                            nom: t.nom ,
                                            prenom: t.prenom ,
                                            date_naissance: t.date_naissance ||'',
                                            numero_tel: t.numero_tel ,
                                            email: t.email,
                                            ole: t.role || '',
                                            createdAt: t.createdAt || '',
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
                                <Box display="flex" justifyContent="flex-end" gap={2} mb={2}>
                                        <Button 
                                            variant="contained" 
                                            onClick={() => navigate('/CreerQuestion')}
                                            color="success"
                                            sx={{ borderRadius: 2, mb: 2 }}
                                        >
                                            + Question
                                        </Button>
                                    </Box>
                                    <GénérateurExamen />;
                                </Box>
                            </>
                        )}

                        {currentView === 'banque de questions' && (
                            <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Box>
                                    <Button 
                                        variant="contained" 
                                        onClick={() => navigate('/CreerQuestion')} 
                                        sx={{ mb: 2 }}
                                    >
                                        Ajouter Question
                                    </Button>
                                    
                                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                                        {/* Your filter controls */}
                                    </Box>
                                </Box>

                                <Box sx={{ flex: 1, height: 600, width: '100%' }}>
                                    <DataGrid
                                        rows={questionsData.map(q => ({
                                            ...q,
                                            id: q._id // Make sure each row has an id property
                                        }))}
                                        columns={questionColumns}
                                        pageSize={10}
                                        rowsPerPageOptions={[10, 25, 50]}
                                        getRowId={(row) => row._id}
                                        loading={loadingQuestions}
                                        sx={{
                                            '& .MuiDataGrid-virtualScroller': {
                                                minHeight: 200
                                            }
                                        }}
                                    />
                                </Box>
                            </Box>
                        )}

                    </>
                )}
            </Box>

            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
            >
                <DialogTitle>Confirmer la suppression</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Annuler</Button>
                    <Button onClick={handleDelete} color="error">
                        Supprimer
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Admin;