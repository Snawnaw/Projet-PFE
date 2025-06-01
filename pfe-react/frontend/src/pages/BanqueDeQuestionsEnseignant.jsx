import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const BanqueDeQuestionsEnseignant = () => {
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
            const rawQuestions = res.data.questions || [];

            // Adapter les données comme dans BanqueDeQuestions.jsx
            const formatted = rawQuestions.map(q => ({
                id: q._id,
                enoncé: q.enonce || 'N/A',
                difficulte: q.difficulte || 'N/A',
                type: q.type || 'N/A',
                module: q.module?.nom || 'N/A',
                reponse: (q.options || [])
                    .filter(opt => opt?.isCorrect)
                    .map(opt => opt?.text || 'N/A')
                    .join(', ')
            }));

            setQuestions(formatted);
        } catch (err) {
            console.error('Erreur lors du chargement des questions :', err);
        }
    };

    const fetchModules = async () => {
        try {
            const res = await axios.get('/module/AllModules');
            setModules(res.data.modules || []);
        } catch (err) {
            console.error('Erreur lors du chargement des modules :', err);
        }
    };

    // Filtrage
    const filteredQuestions = questions.filter(q =>
        (!filterModule || q.module === modules.find(m => m._id === filterModule)?.nom) &&
        (!filterDifficulte || q.difficulte.toLowerCase() === filterDifficulte.toLowerCase())
    );

    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'module', headerName: 'Module', width: 150 },
        { field: 'enoncé', headerName: 'Énoncé', width: 400, flex: 1 },
        { field: 'reponse', headerName: 'Réponse', width: 200, flex: 1 },
        { field: 'difficulte', headerName: 'Difficulté', width: 130 },
        { field: 'type', headerName: 'Type', width: 130 },
    ];

    const handleAddQuestion = () => {
        navigate('/CreerQuestion');
    };

    return (
        <div style={{ height: 400, width: '100%', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                <Button variant="contained" color="primary" onClick={handleAddQuestion}>
                    Ajouter Question
                </Button>
            </div>
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
                rows={filteredQuestions}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                checkboxSelection
                disableSelectionOnClick
                components={{ Toolbar: GridToolbar }}
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

export default BanqueDeQuestionsEnseignant;
