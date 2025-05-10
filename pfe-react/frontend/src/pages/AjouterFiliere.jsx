import React, { useState } from 'react';
import { Button } from 'react-bootstrap';

const AjouterFiliere = () => {
    const [filiere, setFiliere] = useState('');
    const [code, setCode] = useState('');
    const [cycle, setCycle] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        // Validation
        if (!filiere || !code || !cycle) {
            setError('Veuillez remplir tous les champs');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/v1/filiere/FiliereCreate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    nom: filiere,
                    code: code,
                    cycle: cycle
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Une erreur est survenue');
            }

            // Reset form
            setFiliere('');
            setCode('');
            setCycle('');
            setSuccess(true);
        } catch (error) {
            console.error('Error:', error);
            setError(error.message || 'Une erreur est survenue lors de l\'ajout de la filière');
        }
    };

    const handleReset = () => {
        setFiliere('');
        setCode('');
        setCycle('');
        setError(null);
        setSuccess(false);
    };

    return (
        <div className="ajouter-filiere-container">
            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}
            {success && (
                <div className="alert alert-success" role="alert">
                    Filière ajoutée avec succès!
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">Nom de la Filière</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Ex: Génie Informatique"
                        value={filiere}
                        onChange={(e) => setFiliere(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Code de la Filière</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Ex: GI"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Cycle</label>
                    <select 
                        className="form-control" 
                        value={cycle} 
                        onChange={(e) => setCycle(e.target.value)}
                        required
                    >
                        <option value="" disabled>Choisissez un cycle</option>
                        <option value="Licence">Licence</option>
                        <option value="Master">Master</option>
                    </select>
                </div>

                <div className="buttons-group">
                    <Button type="submit" variant="primary">Ajouter</Button>
                    <Button type="button" variant="secondary" onClick={handleReset}>Annuler</Button>
                    <Button type="button" variant="link" onClick={() => window.history.back()}>Retour</Button>
                </div>
            </form>
        </div>
    );
};

export default AjouterFiliere;