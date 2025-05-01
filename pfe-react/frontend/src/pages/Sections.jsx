import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Typography, Box } from '@mui/material';
import axios from 'axios';

const Sections = () => {
    const navigate = useNavigate();
    const [sectionsData, setSectionsData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSections();
    }, []);

    const fetchSections = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/v1/section/AllSections', {
                withCredentials: true
            });
            if (response.data.success) {
                const formattedData = response.data.sections.map(section => ({
                    id: section._id,
                    nom: section.nom,
                    filiere: section.filiere,
                    niveau: section.niveau,
                    groupes: section.nombre_de_groupes,
                }));
                setSectionsData(formattedData);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching sections:', error);
            setLoading(false);
        }
    };

    const handleDelete = async (type, id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) {
            try {
                await axios.delete(`http://localhost:5000/api/v1/section/SectionDelete/${id}`, {
                    withCredentials: true
                });
                fetchSections(); // Refresh the data after deletion
            } catch (error) {
                console.error('Error deleting section:', error);
            }
        }
    };

    const sectionsColumns = [
        { field: 'nom', headerName: 'Nom', flex: 1 },
        { field: 'filiere', headerName: 'Filière', flex: 1 },
        { field: 'niveau', headerName: 'Niveau', flex: 1 },
        { field: 'groupes', headerName: 'Nombre de groupes', flex: 1 },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 1,
            sortable: false,
            renderCell: (params) => (
                <Box>
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => navigate(`/ModifierSection/${params.row.id}`)}
                        sx={{ mr: 1 }}
                    >
                        Modifier
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleDelete('section', params.row.id)}
                    >
                        Supprimer
                    </Button>
                </Box>
            ),
        },
    ];

    return (
        <Box sx={{ width: '100%', p: 2 }}>
            <Box sx={{ mb: 2 }}>
                <Button variant="contained" onClick={() => navigate('/AjouterSection')} sx={{ mr: 1 }}>
                    Ajouter Section
                </Button>
            </Box>

            <Typography variant="h5" sx={{ mb: 2 }}>Sections</Typography>
            <DataGrid
                rows={sectionsData}
                columns={sectionsColumns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                autoHeight
                disableSelectionOnClick
                loading={loading}
            />
        </Box>
    );
};

export default Sections;