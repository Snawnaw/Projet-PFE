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
            setSuccess(true);
            toast.success('Salle ajoutée avec succès !', {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Slide,
            });

        } catch (error) {
            //console.error('Error:', error);
            //setError(error.message || "Une erreur est survenue lors de l'ajout de la salle");
            toast.error(error.message || "Une erreur est survenue lors de l'ajout de la salle", {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Slide,
            });
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
                            <form>
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
                                        <option value="">Type de salle</option>
                                        <option value="cours">Salle de cours</option>
                                        <option value="td">Salle TD</option>
                                        <option value="tp">Laboratoire</option>
                                        <option value="amphi">Amphithéâtre</option>
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
                                        required 
                                    />
                                </div>
                                <div className="text-center">
                                    <button type="submit" className="btn btn-primary me-2" onClick={handleSubmit}>Ajouter</button>
                                    <button type="reset" className="btn btn-danger me-2">Annuler</button>
                                    <button type="button" className="btn btn-secondary" onClick={() => navigate('/salles')}>Retourner</button>
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