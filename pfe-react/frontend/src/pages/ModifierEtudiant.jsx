import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { Box, Button, TextField, Typography, Paper, Alert } from '@mui/material';

const ModifierEtudiant = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({ nom: '', prenom: '', email: '', numero_tel: '', date_naissance: '', filiere: '', section: '', role: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [filieres, setFilieres] = useState([]);
    const [sections, setSections] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            // Fetch etudiant data
            API.get(`/etudiant/${id}`)
                .then(res => setForm(res.data))
                .catch(() => setError("Erreur lors du chargement"))
                .finally(() => setLoading(false));
            
            // Fetch filieres
            const filieresResponse = await fetch('http://localhost:5000/api/v1/filiere/AllFiliere', { credentials: 'include' });
            if (filieresResponse.ok) {
                const filieresData = await filieresResponse.json();
                setFilieres(filieresData.filieres);
            }
            // Fetch sections
            const sectionsResponse = await fetch('http://localhost:5000/api/v1/section/AllSections', { credentials: 'include' });
            if (sectionsResponse.ok) {
                const sectionsData = await sectionsResponse.json();
                setSections(sectionsData.sections);
            }
        };
        if (id) fetchData();
    }, [id]);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.put(`/etudiant/${id}`, form);
            navigate('/Admin');
        } catch {
            setError("Erreur lors de la modification");
        }
    };

    if (loading) return <Typography>Chargement...</Typography>;
    return (
        <Box sx={{ maxWidth: 500, mx: 'auto', mt: 4 }}>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h5" mb={2}>Modifier Étudiant</Typography>
                {error && <Alert severity="error">{error}</Alert>}
                <form onSubmit={handleSubmit}>
                    <TextField label="Nom" name="nom" value={form.nom} onChange={handleChange} fullWidth margin="normal" />
                    <TextField label="Prénom" name="prenom" value={form.prenom} onChange={handleChange} fullWidth margin="normal" />
                    <TextField label="Email" name="email" value={form.email} onChange={handleChange} fullWidth margin="normal" />
                    <TextField label="Téléphone" name="numero_tel" value={form.numero_tel} onChange={handleChange} fullWidth margin="normal" />
                    <TextField label="Date de naissance" name="date_naissance" type="date" value={form.date_naissance ? form.date_naissance.slice(0,10) : ''} onChange={handleChange} fullWidth margin="normal" InputLabelProps={{ shrink: true }} />
                    <div className="form-group mb-3">
                        <label className="form-label">Filière</label>
                        <select className="form-control" name="filiere" value={form.filiere} onChange={handleChange} required>
                            <option value="">Sélectionner une filière</option>
                            {filieres.map(filiere => (
                                <option key={filiere._id} value={filiere._id}>{filiere.nom}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group mb-3">
                        <label className="form-label">Section</label>
                        <select className="form-control" name="section" value={form.section} onChange={handleChange} required>
                            <option value="">Sélectionner une section</option>
                            {sections.map(section => (
                                <option key={section._id} value={section._id}>{section.nom}</option>
                            ))}
                        </select>
                    </div>
                    <TextField label="Rôle" name="role" value={form.role} onChange={handleChange} fullWidth margin="normal" />
                    <Box mt={2} display="flex" gap={2}>
                        <Button type="submit" variant="contained">Enregistrer</Button>
                        <Button variant="outlined" onClick={() => navigate(-1)}>Annuler</Button>
                    </Box>
                </form>
            </Paper>
        </Box>
    );
};

export default ModifierEtudiant;
