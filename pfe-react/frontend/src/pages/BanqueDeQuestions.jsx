import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataGrid, GridToolbar } from '@mui/x-data-grid'; // Import GridToolbar
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const BanqueDeQuestions = () => {
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [modules, setModules] = useState([]);
    const [filterModule, setFilterModule] = useState('');
    const [filterDifficulte, setFilterDifficulte] = useState('');

    useEffect(() => {
        fetchQuestions();
        fetchModules();
    }, []);

    const fetchQuestions = async () => {
        try {
            const res = await axios.get('/question');
            setQuestions(res.data.questions || []);
        } catch (err) {}
    };

    const fetchModules = async () => {
        try {
            const res = await axios.get('/module/AllModules');
            setModules(res.data.modules || []);
        } catch (err) {}
    };

    // Filtering logic
    const filteredQuestions = questions.filter(q =>
        (!filterModule || (q.module?._id || q.module) === filterModule) &&
        (!filterDifficulte || (q.difficulte || '').toLowerCase() === filterDifficulte.toLowerCase())
    );

    // Suppression d'une question
    const handleDeleteQuestion = async (id) => {
        console.log("Suppression question id:", id); // debug
        if (!window.confirm("Voulez-vous vraiment supprimer cette question ?")) return;
        try {
            // Corrige ici l'URL si besoin
            await axios.delete(`/api/v1/question/${id}`);
            setQuestions(questions.filter(q => (q._id || q.id) !== id));
        } catch (err) {
            alert("Erreur lors de la suppression.");
        }
    };

    const columns = [
        { 
            field: 'id', 
            headerName: 'ID', 
            width: 90,
            filterable: true // Enable filtering
        },
        {
            field: 'module',
            headerName: 'Module',
            width: 150,
            filterable: true
        },
        {
            field: 'enoncé',
            headerName: 'Énoncé',
            width: 400,
            flex: 1,
            filterable: true
        },
        {
            field: 'reponse',
            headerName: 'Réponse',
            width: 200,
            flex: 1,
            filterable: true
        },
        {
            field: 'difficulte',
            headerName: 'Difficulté',
            width: 130,
            filterable: true
        },
        {
            field: 'type',
            headerName: 'Type',
            width: 130,
            filterable: true
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <div>
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        style={{ marginRight: 8 }}
                        onClick={() => navigate(`/ModifierQuestion/${params.row.id}`)}
                    >
                        <EditIcon fontSize="small" />
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleDeleteQuestion(params.row.id)}
                    >
                        <DeleteIcon fontSize="small" />
                    </Button>
                </div>
            ),
        },
    ];

    // Adapter la structure des rows pour correspondre aux vraies questions
    const rows = filteredQuestions.map(q => ({
        id: q._id || q.id,
        module: q.module?.nom || '',
        enoncé: q.enonce || q.enoncé || '',
        reponse: Array.isArray(q.options)
            ? q.options.filter(opt => opt.isCorrect).map(opt => opt.text).join(', ')
            : (q.correctAnswer || ''),
        difficulte: q.difficulte,
        type: q.type,
        // ...autres champs si besoin
    }));

    const handleAddQuestion = () => {
        navigate('/CreerQuestion'); // Navigate to the question creation page
    };

    return (
        <div style={{ height: 400, width: '100%', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handleAddQuestion}
                >
                    Ajouter Question
                </Button>
            </div>
            {/* Filter controls */}
            <div className="row mb-3">
                <div className="col-md-4">
                    <select className="form-control" value={filterModule} onChange={e => setFilterModule(e.target.value)}>
                        <option value="">Module</option>
                        {modules.map(m => (
                            <option key={m._id} value={m._id}>{m.nom}</option>
                        ))}
                    </select>
                </div>
                <div className="col-md-4">
                    <select className="form-control" value={filterDifficulte} onChange={e => setFilterDifficulte(e.target.value)}>
                        <option value="">Difficulté</option>
                        <option value="facile">Facile</option>
                        <option value="moyen">Moyen</option>
                        <option value="difficile">Difficile</option>
                    </select>
                </div>
            </div>
            <DataGrid
                rows={rows}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                checkboxSelection
                disableSelectionOnClick
                components={{ Toolbar: GridToolbar }} // Add the toolbar
                componentsProps={{
                    toolbar: {
                        showQuickFilter: true,
                        quickFilterProps: { debounceMs: 500 },
                    },
                }}
            />
        </div>
    );
};

export default BanqueDeQuestions;