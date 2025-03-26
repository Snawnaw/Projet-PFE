import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Typography, Box } from '@mui/material';

const Admin = () => {
    const navigate = useNavigate();

    const sectionsColumns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'nom', headerName: 'Nom', width: 130 },
        { field: 'filiere', headerName: 'Filière', width: 130 },
        { field: 'niveau', headerName: 'Niveau', width: 90 },
        { field: 'groupes', headerName: 'Nombre de Groupes', width: 130 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 200,
            renderCell: (params) => (
                <>
                    <Button onClick={() => navigate(`/modifier-section/${params.row.id}`)}>
                        Modifier
                    </Button>
                    <Button onClick={() => handleDelete('section', params.row.id)} color="error">
                        Supprimer
                    </Button>
                </>
            ),
        },
    ];

    const sectionsData = [
        { id: 'S001', nom: 'Section A', filiere: 'Informatique', niveau: 2, groupes: 3 },
        { id: 'S002', nom: 'Section B', filiere: 'Mathématiques', niveau: 1, groupes: 2 }
    ];

    const teachersColumns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'nom', headerName: 'Nom', width: 130 },
        { field: 'prenom', headerName: 'Prénom', width: 130 },
        { field: 'email', headerName: 'Email', width: 200 },
        { field: 'grade', headerName: 'Grade', width: 130 },
        { field: 'filiere', headerName: 'Filière', width: 130 },
        { field: 'sections', headerName: 'Sections Assignées', width: 200 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 200,
            renderCell: (params) => (
                <>
                    <Button onClick={() => navigate(`/modifier-enseignant/${params.row.id}`)}>
                        Modifier
                    </Button>
                    <Button onClick={() => handleDelete('enseignant', params.row.id)} color="error">
                        Supprimer
                    </Button>
                </>
            ),
        },
    ];

    const teachersData = [
        { id: 'E001', nom: 'Doe', prenom: 'John', email: 'john.doe@example.com', grade: 'Professeur', filiere: 'Informatique', sections: 'Section A, Section B' },
        { id: 'E002', nom: 'Smith', prenom: 'Jane', email: 'jane.smith@example.com', grade: 'Maître de conférences', filiere: 'Mathématiques', sections: 'Section B' }
    ];

    const sallesColumns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'numero', headerName: 'Numéro', width: 130 },
        { field: 'type', headerName: 'Type', width: 130 },
        { field: 'capacite', headerName: 'Capacité', width: 130 },
        { field: 'departement', headerName: 'Département', width: 130 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 200,
            renderCell: (params) => (
                <>
                    <Button onClick={() => navigate(`/modifier-salle/${params.row.id}`)}>
                        Modifier
                    </Button>
                    <Button onClick={() => handleDelete('salle', params.row.id)} color="error">
                        Supprimer
                    </Button>
                </>
            ),
        },
    ];

    const sallesData = [
        { id: 'R001', numero: '101', type: 'Salle de cours', capacite: 30, departement: 'Informatique' },
        { id: 'R002', numero: 'Lab-01', type: 'Laboratoire', capacite: 20, departement: 'Informatique' }
    ];

    const handleDelete = (type, id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) {
            console.log(`Deleting ${type} with id: ${id}`);
        }
    };

    return (
        <Box sx={{ width: '100%', p: 2 }}>
            <Box sx={{ mb: 2 }}>
                <Button variant="contained" onClick={() => navigate('/AjouterSection')} sx={{ mr: 1 }}>
                    Ajouter Section
                </Button>
                <Button variant="contained" onClick={() => navigate('/AjouterEnseignant')} sx={{ mr: 1 }}>
                    Ajouter Enseignant
                </Button>
                <Button variant="contained" onClick={() => navigate('/AjouterSalle')}>
                    Ajouter Salle
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
            />

            <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>Enseignants</Typography>
            <DataGrid
                rows={teachersData}
                columns={teachersColumns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                autoHeight
                disableSelectionOnClick
            />

            <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>Salles</Typography>
            <DataGrid
                rows={sallesData}
                columns={sallesColumns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                autoHeight
                disableSelectionOnClick
            />
        </Box>
    );
};

export default Admin;
