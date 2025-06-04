import API from '../services/api';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import CategoryIcon from '@mui/icons-material/Category';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import React, { useState, useEffect } from 'react';
import ClassIcon from '@mui/icons-material/Class';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import { auth } from '../services/api';
import GénérateurExamen from './GénérateurExamen';
import Examens from './Examens';
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
    Grid,
    TextField,
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
    const [editOpen, setEditOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const [saving, setSaving] = useState(false);

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

    const handleEditOpen = () => {
        setEditData({ ...adminData });
        setEditOpen(true);
    };

    const handleEditChange = (e) => {
        setEditData({ ...editData, [e.target.name]: e.target.value });
    };

    const handleEditSave = async () => {
        setSaving(true);
        try {
            // Correction de l'URL pour la mise à jour du profil admin
            // Utilisez l'endpoint réel de votre backend, par exemple :
            // const response = await API.put('/admin/update', editData);
            // ou '/auth/update-me' selon votre API
            const response = await API.put('/auth/update-me', editData);
            setAdminData(response.data.user || editData);
            setEditOpen(false);
            setError(null);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.message ||
                "Erreur lors de la mise à jour"
            );
        }
        setSaving(false);
    };

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
        <Box sx={{ maxWidth: 600, mx: 'auto', p: 2 }}>
            <Paper elevation={4} sx={{
                p: 4,
                borderRadius: 4,
                background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%)',
                boxShadow: '0 4px 24px rgba(0,0,0,0.07)'
            }}>
                <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
                    <Typography variant="h4" fontWeight={700} gutterBottom color="primary">
                        {adminData.nom} {adminData.prenom}
                    </Typography>
                    <Chip
                        label={adminData.role?.toUpperCase() || 'ADMIN'}
                        color="primary"
                        sx={{ fontWeight: 'bold', fontSize: 16, mb: 1, px: 2 }}
                    />
                </Box>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="textSecondary">Date de naissance</Typography>
                        <Typography variant="body1" gutterBottom>
                            {adminData.date_naissance
                                ? new Date(adminData.date_naissance).toLocaleDateString('fr-FR')
                                : 'N/A'}
                        </Typography>
                        <Typography variant="subtitle2" color="textSecondary">Email</Typography>
                        <Typography variant="body1" gutterBottom>
                            {adminData.email}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="textSecondary">Téléphone</Typography>
                        <Typography variant="body1" gutterBottom>
                            {adminData.numero_tel || 'N/A'}
                        </Typography>
                        <Typography variant="subtitle2" color="textSecondary">Date de création du compte</Typography>
                        <Typography variant="body1">
                            {adminData.createdAt ? new Date(adminData.createdAt).toLocaleDateString('fr-FR') : 'N/A'}
                        </Typography>
                    </Grid>
                </Grid>
                <Box display="flex" justifyContent="flex-end" mt={2}>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={handleEditOpen}
                    >
                        Modifier
                    </Button>
                </Box>
            </Paper>

            <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
                <DialogTitle>Modifier mon profil</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Nom"
                        name="nom"
                        value={editData?.nom || ''}
                        onChange={handleEditChange}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="Prénom"
                        name="prenom"
                        value={editData?.prenom || ''}
                        onChange={handleEditChange}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="Email"
                        name="email"
                        value={editData?.email || ''}
                        onChange={handleEditChange}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="Téléphone"
                        name="numero_tel"
                        value={editData?.numero_tel || ''}
                        onChange={handleEditChange}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="Date de naissance"
                        name="date_naissance"
                        type="date"
                        value={editData?.date_naissance ? editData.date_naissance.slice(0, 10) : ''}
                        onChange={handleEditChange}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditOpen(false)}>Annuler</Button>
                    <Button onClick={handleEditSave} disabled={saving}>Enregistrer</Button>
                </DialogActions>
            </Dialog>
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
    const [etudiantsData, setEtudiantsData] = useState([]); // Add this line

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

                case 'etudiants':
                    if (etudiantsData.length === 0) {
                        const response = await API.get('/etudiant/AllEtudiant');
                        console.log('Students API Response:', response.data); // Debug log
                        setEtudiantsData(response.data.etudiants || []);
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
        switch (type) {
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
            case 'etudiant':
                navigate(`/ModifierEtudiant/${row._id}`);
                break;
        }
    };

    const handleDelete = async () => {
        try {
            let endpoint = '';
            switch (deleteType) {
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
                case 'etudiant':
                    endpoint = `/etudiant/${itemToDelete}`;
                    break;
            }

            const response = await API.delete(endpoint);

            // Refresh data after deletion based on type
            switch (deleteType) {
                case 'section':
                    const sectionResponse = await API.get('/section/AllSections');
                    setSectionsData(sectionResponse.data.sections);
                    break;
                case 'enseignant':
                    const enseignantResponse = await API.get('/enseignant/AllEnseignant');
                    setTeacherData(enseignantResponse.data.enseignants);
                    break;
                case 'etudiant':
                    const etudiantResponse = await API.get('/etudiant/AllEtudiant');
                    setEtudiantsData(etudiantResponse.data.etudiants);
                    break;
                case 'salle':
                    const salleResponse = await API.get('/salle/AllSalle');
                    setSallesData(salleResponse.data.salles);
                    break;
                case 'filiere':
                    const filiereResponse = await API.get('/filiere/AllFiliere');
                    setFilieresData(filiereResponse.data.filieres);
                    break;
                case 'module':
                    const moduleResponse = await API.get('/module/AllModules');
                    setModulesData(moduleResponse.data.modules);
                    break;
                case 'question':
                    fetchQuestions();
                    break;
                default:
                    loadData(currentView);
                    break;
            }

            setDeleteDialogOpen(false);
            setItemToDelete(null);
            setDeleteType('');
        } catch (error) {
            console.error('Delete error:', error);
            setError(`Erreur lors de la suppression: ${error.response?.data?.message || error.message}`);
            setDeleteDialogOpen(false);
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
        { field: 'niveau', headerName: 'Niveau', width: 130 },
        {
            field: 'filiere',
            headerName: 'Filière',
            width: 130,
        },
        { field: 'nom', headerName: 'Nom', width: 130 },
        { field: 'nombre_etudiants', headerName: 'Nombre d\'étudiants', width: 180 },
        { field: 'nombre_groupes', headerName: 'Nombre de groupes', width: 180 }, // Ensure field name matches backend
        ...getActionColumns('section')
    ];

    const filiereColumns = [
        { field: 'nom', headerName: 'Nom', width: 130 },
        { field: 'code', headerName: 'Code', width: 130 },
        { field: 'cycle', headerName: 'Cycle', width: 200 },
        { field: 'niveau', headerName: 'Niveau', width: 130 },
        ...getActionColumns('filiere')
    ];

    const moduleColumns = [
        { field: 'nom', headerName: 'Nom', width: 130 },
        { field: 'filiere', headerName: 'Filière', width: 130 },
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
        { field: 'nom', headerName: 'Nom', width: 130 },
        { field: 'prenom', headerName: 'Prénom', width: 130 },
        {
            field: 'date_naissance',
            headerName: 'Date de naissance',
            width: 150,
            renderCell: (params) => {
                if (!params.value) return 'Non renseignée';
                return new Date(params.value).toLocaleDateString('fr-FR');
            }
        },
        { field: 'email', headerName: 'Email', width: 200 },
        { field: 'numero_tel', headerName: 'Téléphone', width: 130 },
        { field: 'modules', headerName: 'Modules', width: 200 }, // Changed from 'module' to 'modules'
        { field: 'filieres', headerName: 'Filières', width: 150 }, // Added filieres column
        { field: 'role', headerName: 'Rôle', width: 100 },
        // {
        //     field: 'createdAt',
        //     headerName: 'Date de création',
        //     width: 150,
        //     type: 'date',
        //     valueFormatter: formatDate
        // },
        ...getActionColumns('enseignant')
    ];

    const etudiantsColumns = [
        { field: 'nom', headerName: 'Nom', width: 130 },
        { field: 'prenom', headerName: 'Prénom', width: 130 },
        {
            field: 'date_naissance',
            headerName: 'Date de naissance',
            width: 150,
            renderCell: (params) => {
                if (!params.value) return 'Non renseignée';
                return new Date(params.value).toLocaleDateString('fr-FR');
            }
        },
        { field: 'email', headerName: 'Email', width: 200 },
        { field: 'numero_tel', headerName: 'Téléphone', width: 130 },
        { field: 'filiere', headerName: 'Filière', width: 130 },
        { field: 'section', headerName: 'Section', width: 130 },
        {
            field: 'createdAt',
            headerName: 'Date de création',
            width: 150,
            renderCell: (params) => {
                if (!params.value) return 'N/A';
                return new Date(params.value).toLocaleDateString('fr-FR');
            }
        },
        ...getActionColumns('etudiant')
    ];

    const sallesColumns = [
        { field: 'nom', headerName: 'Nom', width: 130 },
        { field: 'numero', headerName: 'Numéro', width: 130 },
        { field: 'type', headerName: 'Type', width: 130 },
        { field: 'capacite', headerName: 'Capacité', width: 130 },
        ...getActionColumns('salle')
    ];

    const questionColumns = [
        { field: 'module', headerName: 'Module', width: 180 },
        { field: 'enonce', headerName: 'Énoncé', width: 400, flex: 1 },
        { field: 'reponse', headerName: 'Réponse', width: 200, flex: 1 },
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
                    sx={{
                        bgcolor:
                            params.value === 'QCM' ? '#1976d2' :
                                params.value === 'QCU' ? '#9c27b0' : '#757575',
                        color: 'white'
                    }}
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
                    sx={{
                        bgcolor:
                            params.value === 'Facile' ? '#4caf50' :
                                params.value === 'Moyen' ? '#ff9800' :
                                    params.value === 'Difficile' ? '#f44336' : '#757575',
                        color: 'white'
                    }}
                />
            )
        },
        ...getActionColumns('question')
    ];

    const toggleDrawer = () => {
        setOpen(!open);
    };

    const menuItems = [
        { text: 'Mon Profil', icon: <PersonIcon />, view: 'profile' },
        { text: 'Enseignants', icon: <SchoolIcon />, view: 'enseignants' },
        { text: 'Étudiants', icon: <PersonIcon />, view: 'etudiants' },
        { text: 'Salles', icon: <MeetingRoomIcon />, view: 'salles' },
        { text: 'Filières', icon: <CategoryIcon />, view: 'filieres' },
        { text: 'Sections', icon: <ClassIcon />, view: 'sections' },
        { text: 'Modules', icon: <ClassIcon />, view: 'modules' },
        { text: 'Banque de Questions', icon: <SchoolIcon />, view: 'banque de questions' },
        { text: 'Examens', icon: <SchoolIcon />, view: 'examens' },
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
                        {currentView === 'profile' && <AdminProfile />}

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
                                            cycle: filiere.cycle,
                                            niveau: filiere.niveau
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
                                    rows={modulesData.map(module => {
                                        console.log('Module data:', module); // Debug log to see structure
                                        return {
                                            id: module._id,
                                            _id: module._id,
                                            nom: module.nom,
                                            filiere: module.filiere?.nom || 'N/A',
                                            section: module.section?.nom || 'N/A',
                                            enseignant: module.enseignant
                                                ? (typeof module.enseignant === 'object'
                                                    ? `${module.enseignant.nom || ''} ${module.enseignant.prenom || ''}`.trim()
                                                    : module.enseignant)
                                                : 'Non assigné',
                                            type: module.type || 'N/A',
                                        };
                                    })}
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
                                            nom: t.nom || 'N/A',
                                            prenom: t.prenom || 'N/A',
                                            date_naissance: t.date_naissance || '',
                                            numero_tel: t.numero_tel || '',
                                            email: t.email || '',
                                            role: t.role || '',
                                            createdAt: t.createdAt || '',
                                            modules: t.modules || 'N/A', // Backend already returns joined string
                                            filieres: t.filieres || 'N/A' // Backend already returns joined string
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
                                            id: q._id,
                                            _id: q._id,
                                            enonce: q.enonce || 'N/A',
                                            type: q.type || 'N/A',
                                            difficulte: q.difficulte || 'N/A',
                                            module: q.module?.nom || 'N/A',
                                            reponse: Array.isArray(q.options)
                                                ? q.options
                                                    .filter(opt => opt && opt.isCorrect)
                                                    .map(opt => opt && opt.text || 'N/A')
                                                    .join(', ')
                                                : 'N/A'
                                        }))}
                                        columns={questionColumns}
                                        pageSize={10}
                                        rowsPerPageOptions={[10, 25, 50]}
                                        getRowId={(row) => row.id}
                                        loading={loadingQuestions}
                                        components={{ Toolbar: GridToolbar }}
                                        componentsProps={{
                                            toolbar: {
                                                showQuickFilter: true,
                                                quickFilterProps: { debounceMs: 500 },
                                            },
                                        }}
                                        sx={{
                                            '& .MuiDataGrid-virtualScroller': {
                                                minHeight: 200
                                            }
                                        }}
                                    />
                                </Box>
                            </Box>
                        )}

                        {currentView === 'examens' && (
                            <>
                                <Examens />
                            </>
                        )}

                        {currentView === 'etudiants' && (
                            <>
                                <Button
                                    variant="contained"
                                    onClick={() => navigate('/AjouterEtudiant')}
                                    sx={{ mb: 2 }}
                                >
                                    Ajouter Étudiant
                                </Button>
                                <Box sx={{ height: 400, width: '100%' }}>
                                    <DataGrid
                                        rows={etudiantsData.map(e => ({
                                            id: e._id,
                                            _id: e._id,
                                            nom: e.nom || 'N/A',
                                            prenom: e.prenom || 'N/A',
                                            date_naissance: e.date_naissance,
                                            numero_tel: e.numero_tel || 'N/A',
                                            email: e.email || 'N/A',
                                            niveau: e.niveau || 'N/A',
                                            filiere: e.filiere || 'N/A',
                                            section: e.section || 'N/A',
                                            role: e.role || 'etudiant',
                                            createdAt: e.createdAt,
                                        }))}
                                        columns={etudiantsColumns}
                                        pageSize={10}
                                        rowsPerPageOptions={[5, 10, 25]}
                                        autoHeight
                                        disableSelectionOnClick
                                        loading={loading}
                                    />
                                </Box>
                            </>
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