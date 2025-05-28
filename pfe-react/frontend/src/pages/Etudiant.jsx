import React, { useEffect, useState } from 'react';
import {
    AppBar, Toolbar, Typography, Button, Box, Tabs, Tab, Paper, CircularProgress, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

const Etudiant = () => {
    const [tab, setTab] = useState(0);
    const [loading, setLoading] = useState(false);
    const [examens, setExamens] = useState([]);
    const [resultats, setResultats] = useState([]);
    const [corriges, setCorriges] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [error, setError] = useState('');
    const [snackbar, setSnackbar] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchExamens();
        // fetchResultats();
        // fetchCorriges();
    }, []);

    useEffect(() => {
        if (tab === 3) {
            fetchSubmissions();
        }
    }, [tab]);

    const fetchSubmissions = async () => {
        setLoading(true);
        try {
            const studentId = localStorage.getItem('studentId');
            const res = await API.get(`/submission/student/${studentId}`);
            setSubmissions(res.data.submissions || []);
        } catch (err) {
            setError('Erreur lors du chargement des soumissions');
        } finally {
            setLoading(false);
        }
    };

    const fetchExamens = async () => {
        setLoading(true);
        try {
            // Fetch available exams for the student (replace endpoint as needed)
            const res = await API.get('/exam');
            setExamens(res.data.exams || []);
        } catch (err) {
            setError('Erreur lors du chargement des examens');
        } finally {
            setLoading(false);
        }
    };

    const fetchResultats = async () => {
        setLoading(true);
        try {
            // Fetch student's submitted exams and results (replace endpoint as needed)
            const res = await API.get('/etudiant/resultats');
            setResultats(res.data.resultats || []);
        } catch (err) {
            setError('Erreur lors du chargement des résultats');
        } finally {
            setLoading(false);
        }
    };

    const fetchCorriges = async () => {
        setLoading(true);
        try {
            // Fetch answer keys for completed exams (replace endpoint as needed)
            const res = await API.get('/etudiant/corriges');
            setCorriges(res.data.corriges || []);
        } catch (err) {
            setError('Erreur lors du chargement des corrigés');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleTabChange = (event, newValue) => {
        setTab(newValue);
    };

    // --- Render content for each tab ---
    const renderExamens = () => (
        <Box mt={3}>
            <Typography variant="h6" gutterBottom>Examens disponibles</Typography>
            {loading ? <CircularProgress /> : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Module</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>Format</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {examens.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">Aucun examen disponible</TableCell>
                                </TableRow>
                            )}
                            {examens.map(exam => (
                                <TableRow key={exam._id}>
                                    <TableCell>{exam.module?.nom || ''}</TableCell>
                                    <TableCell>{exam.examDate ? new Date(exam.examDate).toLocaleString('fr-FR') : ''}</TableCell>
                                    <TableCell>{exam.examType}</TableCell>
                                    <TableCell>{exam.format}</TableCell>
                                    <TableCell>
                                        {exam.format === 'WEB' && exam.shareableId ? (
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                size="small"
                                                onClick={() => window.open(`/exam/${exam.shareableId}`, '_blank')}
                                            >
                                                Passer
                                            </Button>
                                        ) : (
                                            <span>-</span>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );

    const renderResultats = () => (
        <Box mt={3}>
            <Typography variant="h6" gutterBottom>Mes Résultats</Typography>
            {loading ? <CircularProgress /> : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Module</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Score</TableCell>
                                <TableCell>Note</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {resultats.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">Aucun résultat</TableCell>
                                </TableRow>
                            )}
                            {resultats.map(res => (
                                <TableRow key={res.examId}>
                                    <TableCell>{res.moduleNom}</TableCell>
                                    <TableCell>{res.examDate ? new Date(res.examDate).toLocaleString('fr-FR') : ''}</TableCell>
                                    <TableCell>{res.score} / {res.totalQuestions}</TableCell>
                                    <TableCell>{res.note || '-'}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );

    const renderCorriges = () => (
        <Box mt={3}>
            <Typography variant="h6" gutterBottom>Corrigés</Typography>
            {loading ? <CircularProgress /> : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Module</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Corrigé</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {corriges.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={3} align="center">Aucun corrigé disponible</TableCell>
                                </TableRow>
                            )}
                            {corriges.map(corr => (
                                <TableRow key={corr.examId}>
                                    <TableCell>{corr.moduleNom}</TableCell>
                                    <TableCell>{corr.examDate ? new Date(corr.examDate).toLocaleString('fr-FR') : ''}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="outlined"
                                            color="secondary"
                                            size="small"
                                            onClick={() => window.open(corr.corrigeUrl, '_blank')}
                                        >
                                            Voir Corrigé
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );

    const renderSubmissions = () => (
        <Box mt={3}>
            <Typography variant="h6" gutterBottom>Mes Soumissions</Typography>
            {loading ? <CircularProgress /> : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Examen</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Score</TableCell>
                                <TableCell>Détails</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {submissions.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">Aucune soumission</TableCell>
                                </TableRow>
                            )}
                            {submissions.map(sub => (
                                <TableRow key={sub._id}>
                                    <TableCell>{sub.examId?.module?.nom || ''}</TableCell>
                                    <TableCell>{new Date(sub.submittedAt).toLocaleString('fr-FR')}</TableCell>
                                    <TableCell>{sub.score}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            onClick={() => navigate(`/submissions/${sub._id}`)}
                                        >
                                            Voir
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Espace Étudiant
                    </Typography>
                    <Button color="inherit" startIcon={<LogoutIcon />} onClick={handleLogout}>
                        Déconnexion
                    </Button>
                </Toolbar>
            </AppBar>
            <Paper square>
                <Tabs
                    value={tab}
                    onChange={handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                    centered
                >
                    <Tab label="Examens" />
                    <Tab label="Résultats" />
                    <Tab label="Corrigés" />
                    <Tab label="Soumissions" />
                </Tabs>
            </Paper>
            <Box p={3}>
                {tab === 0 && renderExamens()}
                {tab === 1 && renderResultats()}
                {tab === 2 && renderCorriges()}
                {tab === 3 && renderSubmissions()}
            </Box>
            <Snackbar
                open={!!error || !!snackbar}
                autoHideDuration={4000}
                onClose={() => { setError(''); setSnackbar(''); }}
                message={error || snackbar}
            />
        </Box>
    );


};

export default Etudiant;
