import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AjouterSalle() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        numero: '',
        type: '',
        capacite: '',
        departement: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/salles', formData);
            alert('Salle ajoutée avec succès');
            navigate('/salles'); // Redirect to salles list
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur lors de l\'ajout de la salle');
        }
    };

    return (
        <div className="AjouterSalle">
            <h1>Ajouter une salle</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input 
                        type="text" 
                        className="form-control" 
                        name="numero" 
                        placeholder="Numéro de salle" 
                        value={formData.numero}
                        onChange={handleChange}
                        required 
                    />
                </div>
                <div className="form-group">
                    <select 
                        className="form-control" 
                        name="type" 
                        value={formData.type}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Type de salle</option>
                        <option value="cours">Salle de cours</option>
                        <option value="td">Salle TD</option>
                        <option value="tp">Laboratoire</option>
                        <option value="amphi">Amphithéâtre</option>
                    </select>
                </div>
                <div className="form-group">
                    <input 
                        type="number" 
                        className="form-control" 
                        name="capacite" 
                        placeholder="Capacité" 
                        value={formData.capacite}
                        onChange={handleChange}
                        required 
                    />
                </div>
                <div className="form-group">
                    <select 
                        className="form-control" 
                        name="departement" 
                        value={formData.departement}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Département</option>
                        <option value="Informatique">Informatique</option>
                        <option value="Mathématiques">Mathématiques</option>
                    </select>
                </div>
                <div className="text-right">
                    <button type="submit" className="btn btn-primary">Ajouter</button>
                    <button type="reset" className="btn btn-danger">Annuler</button>
                    <button type="button" className="btn btn-primary" onClick={() => navigate('/salles')}>Retour</button>
                </div>
            </form>
        </div>
    );
}

export default AjouterSalle;