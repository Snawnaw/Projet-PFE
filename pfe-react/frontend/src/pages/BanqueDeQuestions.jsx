import React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid'; // Import GridToolbar
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const BanqueDeQuestions = () => {
    const navigate = useNavigate();

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
        }
    ];

    const rows = [
        { id: '001', enoncé: 'Question 1', difficulte: 'facile', type: 'QCM' },
        { id: '002', enoncé: 'Question 2', difficulte: 'moyen', type: 'QCU' },
    ];

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