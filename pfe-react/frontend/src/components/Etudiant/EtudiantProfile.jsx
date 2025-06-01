import React, { useEffect, useState } from 'react';
import API from "../../services/api";
import {
    Box,
    Typography,
    CircularProgress,
    Alert,
    Paper,
    Grid,
    Chip,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField
} from '@mui/material';

const EtudiantProfile = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editOpen, setEditOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // 1. Get user info
                const response = await API.get('/auth/me');
                const user = response.data.user;
                // Fetch etudiant info by email if role is etudiant
                if (user.role === 'etudiant') {
                    const etudiantRes = await API.get(`/etudiant/byEmail/${user.email}`);
                    setData(etudiantRes.data.etudiant);
                } else {
                    setError("Ce profil n'est accessible que pour les étudiants.");
                }
            } catch (err) {
                setError('Erreur lors du chargement du profil');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleEditOpen = () => {
        setEditData({ ...data });
        setEditOpen(true);
    };

    const handleEditChange = (e) => {
        setEditData({ ...editData, [e.target.name]: e.target.value });
    };

    const handleEditSave = async () => {
        setSaving(true);
        try {
            // Use the correct endpoint for updating etudiant
            const response = await API.put(`/etudiant/EtudiantEdit/${editData._id}`, editData);
            setData(response.data.etudiant || editData);
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

    if (!data) return (
        <Alert severity="info" sx={{ my: 2 }}>Aucune donnée disponible</Alert>
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
                        {data.nom} {data.prenom}
                    </Typography>
                    <Chip
                        label={data.role?.toUpperCase() || 'ETUDIANT'}
                        color="primary"
                        sx={{ fontWeight: 'bold', fontSize: 16, mb: 1, px: 2 }}
                    />
                </Box>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="textSecondary">Date de naissance</Typography>
                        <Typography variant="body1" gutterBottom>
                            {data.date_naissance
                                ? new Date(data.date_naissance).toLocaleDateString('fr-FR')
                                : 'N/A'}
                        </Typography>
                        <Typography variant="subtitle2" color="textSecondary">Email</Typography>
                        <Typography variant="body1" gutterBottom>
                            {data.email}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="textSecondary">Téléphone</Typography>
                        <Typography variant="body1" gutterBottom>
                            {data.numero_tel || 'N/A'}
                        </Typography>
                        <Typography variant="subtitle2" color="textSecondary">Date de création du compte</Typography>
                        <Typography variant="body1">
                            {data.createdAt ? new Date(data.createdAt).toLocaleDateString('fr-FR') : 'N/A'}
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

export default EtudiantProfile;