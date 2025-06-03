// AjouterSalle.jsx - VERSION CORRIGÉE
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AjouterSalle() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        numero: '',
        nom: '',
        type: '',
        capacite: ''
    });
    
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        const { numero, nom, type, capacite } = formData;

        // Validation côté client
        if (!numero || !nom || !type || !capacite) {
            setError('Tous les champs sont requis');
            return;
        }

        if (isNaN(capacite) || capacite <= 0) {
            setError('La capacité doit être un nombre positif');
            return;
        }

        try {
            console.log('Envoi des données:', { numero, nom, type, capacite });

            const response = await fetch('http://localhost:5000/api/v1/salle/SalleCreate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    numero: numero.trim(),
                    nom: nom.trim(),
                    type: type,
                    capacite: parseInt(capacite)
                })
            });

            const data = await response.json();
            console.log('Réponse serveur:', data);

            if (!response.ok) {
                throw new Error(data.message || 'Une erreur est survenue');
            }

            setSuccess(true);
            toast.success('Salle ajoutée avec succès !');

            setFormData({
                numero: '',
                nom: '',
                type: '',
                capacite: ''
            });
            
        } catch (error) {
            console.error('Erreur:', error);
            setError(error.message || "Une erreur est survenue lors de l'ajout de la salle");
            toast.error(error.message);
        }
    };

    return (
        <div className="container mt-5">
            <ToastContainer />
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header bg-primary text-white">
                            <h3 className="text-center">Ajouter une salle</h3>
                        </div>
                        <div className="card-body">
                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            )}
                            {success && (
                                <div className="alert alert-success" role="alert">
                                    Salle ajoutée avec succès !
                                </div>
                            )}
                            
                            <form onSubmit={handleSubmit}>
                                <div className="form-group mb-3">
                                    <label className="form-label">Numéro de salle</label>
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
                                <div className="form-group mb-3">
                                    <label className="form-label">Nom de la salle</label>
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
                                <div className="form-group mb-3">
                                    <label className="form-label">Type de salle</label>
                                    <select 
                                        className="form-control" 
                                        name="type" 
                                        value={formData.type}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Choisir le type de salle</option>
                                        <option value="Salle de cours">Salle de cours</option>
                                        <option value="Salle TD">Salle TD</option>
                                        <option value="Laboratoire">Laboratoire</option>
                                        <option value="Amphithéâtre">Amphithéâtre</option>
                                        <option value="Salle TP">Salle TP</option>
                                    </select>
                                </div>
                                <div className="form-group mb-3">
                                    <label className="form-label">Capacité</label>
                                    <input 
                                        type="number" 
                                        className="form-control" 
                                        name="capacite" 
                                        placeholder="Capacité" 
                                        value={formData.capacite}
                                        onChange={handleChange}
                                        min="1"
                                        max="500"
                                        required 
                                    />
                                </div>
                                <div className="text-center">
                                    <button type="submit" className="btn btn-primary me-2">Ajouter</button>
                                    <button 
                                        type="button" 
                                        className="btn btn-danger me-2"
                                        onClick={() => setFormData({ numero: '', nom: '', type: '', capacite: '' })}
                                    >
                                        Annuler
                                    </button>
                                    <button 
                                        type="button" 
                                        className="btn btn-secondary" 
                                        onClick={() => navigate('/Admin')}
                                    >
                                        Retourner
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AjouterSalle;