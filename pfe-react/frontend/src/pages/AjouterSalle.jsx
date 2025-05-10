import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AjouterSalle() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        numero: '',
        nom: '',
        type: '',
        capacite: ''
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
            const token = localStorage.getItem('token'); // Or wherever the token is stored
            await axios.post('http://localhost:5000/api/v1/salle/SalleCreate', formData, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            alert('Salle ajoutée avec succès');
            // navigate('/salles'); // Redirect to salles list
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur lors de l\'ajout de la salle');
        }
    };

    return (
        <div className="AjouterSalle">
            <h1>Ajouter une salle</h1>
            <form>
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
                    <input 
                        type="text" 
                        className="form-control" 
                        name="nom" 
                        placeholder="Nom de la salle" 
                        value={formData.nom}
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
                <div className="text-right">
                    <button type="submit" className="btn btn-primary" onClick={handleSubmit}>Ajouter</button>
                    <button type="reset" className="btn btn-danger">Annuler</button>
                    <button type="button" className="btn btn-primary" onClick={() => navigate('/salles')}>Retour</button>
                </div>
            </form>
        </div>
    );
}

export default AjouterSalle;