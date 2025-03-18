import React, { useState } from 'react';
import { Button, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

interface FiliereData {
  name: string;
  code: string;
  duration: string;
}

const AjouterFiliere: React.FC = () => {
  const [filiereData, setFiliereData] = useState<FiliereData>({
    name: '',
    code: '',
    duration: '3'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Filiere submitted:', filiereData);
  };

  return (
    <div className="container">
      <h1>Ajouter une Nouvelle Filière</h1>
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth margin="normal">
          <TextField
            label="Nom de la Filière"
            value={filiereData.name}
            onChange={(e) => setFiliereData({ ...filiereData, name: e.target.value })}
            required
          />
        </FormControl>

        <FormControl fullWidth margin="normal">
          <TextField
            label="Code de la Filière"
            value={filiereData.code}
            onChange={(e) => setFiliereData({ ...filiereData, code: e.target.value })}
            required
          />
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>Durée (années)</InputLabel>
          <Select
            value={filiereData.duration}
            onChange={(e) => setFiliereData({ ...filiereData, duration: e.target.value })}
          >
            <MenuItem value="3">3</MenuItem>
            <MenuItem value="5">5</MenuItem>
          </Select>
        </FormControl>

        <div style={{ marginTop: '20px' }}>
          <Button type="submit" variant="contained" color="primary">
            Enregistrer la Filière
          </Button>
          <Button type="reset" variant="contained" color="error" style={{ marginLeft: '10px' }}>
            Réinitialiser
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AjouterFiliere;
