import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Button, Chip, Box, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContentText from '@mui/material/DialogContentText';

const BanqueDeQuestionsEnseignant = () => {
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [modules, setModules] = useState([]);
    const [filterModule, setFilterModule] = useState('');
    const [filterDifficulte, setFilterDifficulte] = useState('');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [questionToDelete, setQuestionToDelete] = useState(null);
    const [enseignantId, setEnseignantId] = useState(null);


    useEffect(() => {
        if (enseignantId) {
            fetchQuestions();
        }
    }, [enseignantId]);

    const fetchQuestions = async () => {
        try {
            if (!enseignantId) return;
            // Récupérer les modules de l'enseignant
            const modulesRes = await axios.get(`/module/modules/byEnseignant/${enseignantId}`, { withCredentials: true });
            const enseignantModules = modulesRes.data.modules || [];
            const moduleIds = enseignantModules.map(m => m._id);

            // Récupérer toutes les questions
            const res = await axios.get('/question');
            const rawQuestions = res.data.questions || [];

            // Filtrer les questions dont le module appartient à l'enseignant
            const filteredQuestions = rawQuestions.filter(q => moduleIds.includes(q.module?._id));

            // Adapter les données comme dans Admin.jsx
            const formatted = filteredQuestions.map(q => ({
                id: q._id,
                _id: q._id,
                enonce: q.enonce || 'N/A',
                difficulte: q.difficulte || 'N/A',
                type: q.type || 'N/A',
                module: q.module?.nom || 'N/A',
                reponse: Array.isArray(q.options) 
                    ? q.options
                        .filter(opt => opt?.isCorrect)
                        .map(opt => opt?.text || 'N/A')
                        .join(', ')
                    : 'N/A'
            }));

            setQuestions(formatted);
        } catch (err) {
            console.error('Erreur lors du chargement des questions :', err);
        }
    };

    useEffect(() => {
        const fetchEnseignantAndModules = async () => {
            // 1. Récupérer l'utilisateur connecté
            const userRes = await axios.get('/auth/me', { withCredentials: true });
            const userData = userRes.data;
            // 2. Récupérer l'enseignant par email
            const enseignantRes = await axios.get(`/enseignant/byEmail/${userData.user.email}`, { withCredentials: true });
            const enseignantData = enseignantRes.data;
            setEnseignantId(enseignantData.enseignant._id);

            // 3. Charger ses modules
            const modulesRes = await axios.get(`/module/modules/byEnseignant/${enseignantData.enseignant._id}`, { withCredentials: true });
            setModules(modulesRes.data.modules || []);
        };
        fetchEnseignantAndModules();
    }, []);

    // Fonctions pour gérer les actions
    const handleEdit = (id) => {
        navigate(`/ModifierQuestion/${id}`);
    };

    const openDeleteDialog = (id) => {
        setQuestionToDelete(id);
        setDeleteDialogOpen(true);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`/question/${questionToDelete}`);
            fetchQuestions(); // Rafraîchir la liste des questions
            setDeleteDialogOpen(false);
        } catch (error) {
            console.error("Erreur lors de la suppression de la question :", error);
        }
    };

    // Filtrage
    const filteredQuestions = questions.filter(q =>
        (!filterModule || q.module === modules.find(m => m._id === filterModule)?.nom) &&
        (!filterDifficulte || q.difficulte.toLowerCase() === filterDifficulte.toLowerCase())
    );

    const columns = [
        { field: 'module', headerName: 'Module', width: 150 },
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
                            params.value === 'QCU' ? '#9c27b0' : 
                            params.value === 'TEXT' ? '#757575' : '#757575',
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
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            renderCell: (params) => (
                <Box>
                    <IconButton 
                        color="primary" 
                        onClick={() => handleEdit(params.row._id)}
                    >
                        <EditIcon />
                    </IconButton>
                    <IconButton 
                        color="error" 
                        onClick={() => openDeleteDialog(params.row._id)}
                    >
                        <DeleteIcon />
                    </IconButton>
                </Box>
            )
        }
    ];

    const handleAddQuestion = () => {
        navigate('/CreerQuestion');
    };

    return (
        <div style={{ height: 400, width: '100%', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
                <div className="filters" style={{ display: 'flex', gap: '15px' }}>
                    <select className="form-control" value={filterModule} onChange={e => setFilterModule(e.target.value)}>
                        <option value="">Module</option>
                        {modules.map(m => (
                            <option key={m._id} value={m._id}>{m.nom}</option>
                        ))}
                    </select>
                    <select className="form-control" value={filterDifficulte} onChange={e => setFilterDifficulte(e.target.value)}>
                        <option value="">Difficulté</option>
                        <option value="facile">Facile</option>
                        <option value="moyen">Moyen</option>
                        <option value="difficile">Difficile</option>
                    </select>
                </div>
                
                <Button variant="contained" color="primary" onClick={handleAddQuestion}>
                    Ajouter Question
                </Button>
            </div>
            
            <DataGrid
                rows={filteredQuestions}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10, 25, 50]}
                getRowId={(row) => row.id}
                disableSelectionOnClick
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

            {/* Dialog pour confirmer la suppression */}
            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
            >
                <DialogTitle>Confirmer la suppression</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Êtes-vous sûr de vouloir supprimer cette question ? Cette action est irréversible.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Annuler</Button>
                    <Button onClick={handleDelete} color="error">
                        Supprimer
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default BanqueDeQuestionsEnseignant;