import React, { useEffect, useState } from 'react';
import { 
    Box, 
    Typography, 
    CircularProgress, 
    Alert,
    Paper,
    Grid,
    Avatar
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import API from '../services/api';

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
                <Box display="flex" alignItems="center" mb={4}>
                    <Avatar 
                        sx={{ 
                            width: 100, 
                            height: 100, 
                            bgcolor: 'primary.main',
                            mr: 3
                        }}
                    >
                        <PersonIcon sx={{ fontSize: 60 }} />
                    </Avatar>
                    <Box>
                        <Typography variant="h4" gutterBottom>
                            {adminData.nom} {adminData.prenom}
                        </Typography>
                        <Typography variant="subtitle1" color="textSecondary">
                            {adminData.role}
                        </Typography>
                    </Box>
                </Box>

                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Box mb={2}>
                            <Typography variant="subtitle2" color="textSecondary">
                                Date de naissance
                            </Typography>
                            <Typography variant="body1">
                                {adminData.date_naissance
                                    ? new Date(adminData.date_naissance).toLocaleDateString('fr-FR')
                                    : 'N/A'}
                            </Typography>
                        </Box>
                        
                        <Box mb={2}>
                            <Typography variant="subtitle2" color="textSecondary">
                                Email
                            </Typography>
                            <Typography variant="body1">
                                {adminData.email}
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Box mb={2}>
                            <Typography variant="subtitle2" color="textSecondary">
                                Téléphone
                            </Typography>
                            <Typography variant="body1">
                                {adminData.numero_tel || 'N/A'}
                            </Typography>
                        </Box>

                        <Box mb={2}>
                            <Typography variant="subtitle2" color="textSecondary">
                                Date de création du compte
                            </Typography>
                            <Typography variant="body1">
                                {adminData.createdAt ? new Date(adminData.createdAt).toLocaleDateString('fr-FR') : 'N/A'}
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};

export default AdminProfile;