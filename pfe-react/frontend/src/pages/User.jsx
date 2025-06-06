import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EnseignantProfile from '../components/Enseignants/EnseignantProfile';
import GénérateurExamenEnseignant from '../pages/GénérateurExamenEnseignant';
import BanqueDeQuestionsEnseignant from '../pages/BanqueDeQuestionsEnseignant';
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
    TextField,
    CircularProgress,
    Snackbar
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import ClassIcon from '@mui/icons-material/Class';
import LogoutIcon from '@mui/icons-material/Logout';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import { DataGrid } from '@mui/x-data-grid';

// --- Custom hook for user data ---
function useUserData() {
    const [loading, setLoading] = useState(true);
    const [questions, setQuestions] = useState([]);
    const [exams, setExams] = useState([]);
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState('');
    // Fetch all user data on mount
    useEffect(() => {
        loadData();
    }, []);
    const loadData = async () => {
        setLoading(true);
        try {
            // Replace URLs with your backend endpoints
            const [qRes, eRes, pRes] = await Promise.all([
                fetch('/api/user/questions'),
                fetch('/api/user/exams'),
                fetch('/api/user/profile')
            ]);
            setQuestions(await qRes.json());
            setExams(await eRes.json());
            setProfile(await pRes.json());
        } catch (err) {
            setError('Erreur lors du chargement des données');
        }
        setLoading(false);
    };
    // Handlers for actions
    const addQuestion = async (question) => {
        try {
            await fetch('/api/user/questions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(question)
            });
            loadData();
        } catch {
            setError('Erreur lors de l\'ajout de la question');
        }
    };
    const updateProfile = async (data) => {
        try {
            await fetch('/api/user/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            loadData();
        } catch {
            setError('Erreur lors de la mise à jour du profil');
        }
    };
    // ...other handlers (edit/delete question, generate exam, etc.)...
    return {
        loading, questions, exams, profile, error, setError,
        addQuestion, updateProfile, reload: loadData
    };
}

// --- Placeholder pour Examens ---
function ExamensEnseignant() {
    return (
        <Box>
            <Typography variant="h5" gutterBottom>Mes Examens</Typography>
            {/* TODO: Afficher la liste des examens créés par l'enseignant */}
            <Typography>Liste des examens à venir ou passés (à implémenter).</Typography>
        </Box>
    );
}

// --- Placeholder pour Soumissions/Corrigés ---
function SoumissionsEnseignant() {
    return (
        <Box>
            <Typography variant="h5" gutterBottom>Soumissions & Corrigés</Typography>
            {/* TODO: Afficher la liste des soumissions/réponses des étudiants et accès aux corrigés */}
            <Typography>Liste des soumissions d'étudiants et corrigés d'examens web (à implémenter).</Typography>
        </Box>
    );
}

// --- Main User Component ---
const User = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [currentView, setCurrentView] = useState('génerer examen');
    const {
        loading, questions, exams, profile, error, setError,
        addQuestion, updateProfile, reload
    } = useUserData();

    const toggleDrawer = () => setOpen(!open);

    const menuItems = [
        { text: 'Mon Profil', icon: <PersonIcon />, view: 'profile' },
        { text: 'Générer Examen', icon: <SchoolIcon />, view: 'génerer examen' },
        { text: 'Banque de Questions', icon: <ClassIcon />, view: 'banque' },
        { text: 'Examens', icon: <AssignmentIcon />, view: 'examens' },
        { text: 'Soumissions', icon: <AssignmentTurnedInIcon />, view: 'soumissions' },
    ];

    const handleMenuClick = (view) => {
        setCurrentView(view);
        setOpen(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('token'); // or sessionStorage, depending on your implementation
        navigate('/SignIn'); // Redirect to login page
    };

    // --- DataGrid columns ---
    const questionColumns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'titre', headerName: 'Titre', width: 200 },
        { field: 'module', headerName: 'Module', width: 150 },
        { field: 'section', headerName: 'Section', width: 120 },
        // ...add more columns as needed...
    ];
    const examColumns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'titre', headerName: 'Titre', width: 200 },
        { field: 'date', headerName: 'Date', width: 120 },
        // ...add more columns as needed...
    ];

    // --- Render main content based on view ---
    const renderMainContent = () => {
        if (loading) return <Box display="flex" justifyContent="center" mt={5}><CircularProgress /></Box>;
        switch (currentView) {
            case 'génerer examen':
                return <GénérateurExamenEnseignant />;
            case 'banque':
                return <BanqueDeQuestionsEnseignant />;
            case 'profile':
                return <EnseignantProfile />;
            case 'examens':
                return <ExamensEnseignant />;
            case 'soumissions':
                return <SoumissionsEnseignant />;
            default:
                return null;
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
                    <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
                        Dashboard Enseignant
                    </Typography>
                    <Button
                        color="inherit"
                        startIcon={<LogoutIcon />}
                        onClick={handleLogout}
                    >
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
                <Snackbar
                    open={!!error}
                    autoHideDuration={4000}
                    onClose={() => setError('')}
                    message={error}
                />
            </Box>
        </Box>
    );
};

export default User;
