import React, { useState } from 'react';
import { TextField, Button, FormControl, Box } from '@mui/material';

interface SectionData {
  nom: string;
  filiere: string;
  niveau: string;
  nbGroupes: string;
}

const AjouterSection: React.FC = () => {
  const [section, setSection] = useState<SectionData>({
    nom: '',
    filiere: '',
    niveau: '',
    nbGroupes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Section submitted:', section);
  };

  return (
    <Box className="container">
      <h1>Ajouter une section</h1>
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth margin="normal">
          <TextField
            label="Nom de la section"
            value={section.nom}
            onChange={(e) => setSection({ ...section, nom: e.target.value })}
            required
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <TextField
            label="Filière"
            value={section.filiere}
            onChange={(e) => setSection({ ...section, filiere: e.target.value })}
            required
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <TextField
            label="Niveau"
            type="number"
            value={section.niveau}
            onChange={(e) => setSection({ ...section, niveau: e.target.value })}
            required
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <TextField
            label="Nombre de groupes"
            type="number"
            value={section.nbGroupes}
            onChange={(e) => setSection({ ...section, nbGroupes: e.target.value })}
            required
          />
        </FormControl>
        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <Button type="submit" variant="contained" color="primary">
            Ajouter
          </Button>
          <Button type="reset" variant="contained" color="error">
            Annuler
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default AjouterSection;
