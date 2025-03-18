import React, { useState } from 'react';
import { TextField, Button, FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';

interface EnseignantData {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  grade: string;
  filiere: string;
  sections: string[];
}

const AjouterEnseignant: React.FC = () => {
  const [enseignant, setEnseignant] = useState<EnseignantData>({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    grade: '',
    filiere: '',
    sections: []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Enseignant submitted:', enseignant);
  };

  return (
    <Box className="container">
      <h1>Ajouter un enseignant</h1>
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth margin="normal">
          <TextField
            label="Nom"
            value={enseignant.nom}
            onChange={(e) => setEnseignant({ ...enseignant, nom: e.target.value })}
            required
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <TextField
            label="Prénom"
            value={enseignant.prenom}
            onChange={(e) => setEnseignant({ ...enseignant, prenom: e.target.value })}
            required
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <TextField
            label="Email"
            type="email"
            value={enseignant.email}
            onChange={(e) => setEnseignant({ ...enseignant, email: e.target.value })}
            required
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <TextField
            label="Téléphone"
            value={enseignant.telephone}
            onChange={(e) => setEnseignant({ ...enseignant, telephone: e.target.value })}
            required
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <TextField
            label="Grade"
            value={enseignant.grade}
            onChange={(e) => setEnseignant({ ...enseignant, grade: e.target.value })}
            required
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel>Filière</InputLabel>
          <Select
            value={enseignant.filiere}
            onChange={(e) => setEnseignant({ ...enseignant, filiere: e.target.value })}
            required
          >
            <MenuItem value="Informatique">Informatique</MenuItem>
            <MenuItem value="Mathématiques">Mathématiques</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel>Sections</InputLabel>
          <Select
            multiple
            value={enseignant.sections}
            onChange={(e) => setEnseignant({ ...enseignant, sections: typeof e.target.value === 'string' ? [e.target.value] : e.target.value })}
            required
          >
            <MenuItem value="S001">Section A - Informatique</MenuItem>
            <MenuItem value="S002">Section B - Mathématiques</MenuItem>
          </Select>
        </FormControl>
        <div style={{ marginTop: '20px' }}>
          <Button type="submit" variant="contained" color="primary">
            Ajouter
          </Button>
          <Button type="reset" variant="contained" color="error" sx={{ ml: 2 }}>
            Annuler
          </Button>
        </div>
      </form>
    </Box>
  );
};

export default AjouterEnseignant;
