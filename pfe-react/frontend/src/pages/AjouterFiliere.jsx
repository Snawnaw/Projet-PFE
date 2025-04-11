import React, { useState } from 'react';
import { Button } from 'react-bootstrap';

const AjouterFiliere = () => {
    const [filiereName, setFiliereName] = useState('');
    const [code, setCode] = useState('');
    const [cycle, setCycle] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add your submit logic here
        console.log('Filiere submitted:', { filiereName, code, cycle });
    };

    return (
        <form onSubmit={handleSubmit} className="AjouterFiliere">
            <div className="form-group">
                <h1>Ajouter une filière</h1>
                <label className="form-label">Nom de la Filière</label>
                <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Ex: Génie Informatique"
                    value={filiereName}
                    onChange={(e) => setFiliereName(e.target.value)}
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
                />
            </div>

            <div className="form-group">
                <label className="form-label">Cycle</label>
                <select 
                    className="form-control" 
                    value={cycle} 
                    onChange={(e) => setCycle(e.target.value)}
                >
                    <option value="" disabled>Choisissez un cycle</option>
                    <option value="1">Licence</option>
                    <option value="2">Master</option>
                </select>
            </div>

            <div className="buttons-group">
                <Button type="submit">Ajouter</Button>
                <Button type="button">Annuler</Button>
            </div>
        </form>
    );
};

export default AjouterFiliere;