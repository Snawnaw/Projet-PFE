import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ModifierEnseignant = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        email: '',
        numero_tel: '',
        date_naissance: '',
        role: 'enseignant',
        modules: [],
        filieres: []
    });
    
    const [modules, setModules] = useState([]);
    const [filieres, setFilieres] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [enseignantRes, modulesRes, filieresRes] = await Promise.all([
                    API.get(`/enseignant/${id}`),
                    API.get('/module/AllModules'),
                    API.get('/filiere/AllFiliere')
                ]);
                
                setFormData(enseignantRes.data);
                setModules(modulesRes.data.modules || []);
                setFilieres(filieresRes.data.filieres || []);
            } catch (error) {
                setError("Erreur lors du chargement des données");
            }
        };
        
        fetchData();
    }, [id]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleModuleChange = (e) => {
        const selected = Array.from(e.target.selectedOptions, option => option.value);
        setFormData({ ...formData, modules: selected });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            await API.put(`/enseignant/${id}`, formData);
            toast.success('Enseignant modifié avec succès !', {
                position: "top-center",
                autoClose: 2000,
                transition: Slide
            });
            setTimeout(() => navigate('/Admin'), 2000);
        } catch (error) {
            setError(error.response?.data?.message || "Erreur lors de la modification");
            toast.error(error.response?.data?.message || "Erreur lors de la modification", {
                position: "top-center",
                autoClose: 2000,
                transition: Slide
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <ToastContainer />
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header bg-primary text-white">
                            <h3 className="text-center">Modifier un enseignant</h3>
                        </div>
                        <div className="card-body">
                            {error && <div className="alert alert-danger">{error}</div>}
                            
                            <form onSubmit={handleSubmit}>
                                <div className="form-group mb-3">
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="nom"
                                        placeholder="Nom"
                                        value={formData.nom}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                
                                <div className="form-group mb-3">
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="prenom"
                                        placeholder="Prénom"
                                        value={formData.prenom}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                
                                {/* Ajouter tous les autres champs comme dans AjouterEnseignant.jsx */}
                                
                                <div className="form-group mb-3">
                                    <label>Modules</label>
                                    <select
                                        multiple
                                        className="form-control"
                                        name="modules"
                                        value={formData.modules}
                                        onChange={handleModuleChange}
                                        size="5"
                                    >
                                        {modules.map(module => (
                                            <option key={module._id} value={module._id}>
                                                {module.nom}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div className="text-center">
                                    <button
                                        type="submit"
                                        className="btn btn-primary me-2"
                                        disabled={loading}
                                    >
                                        {loading ? 'Enregistrement...' : 'Enregistrer'}
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        onClick={() => navigate('/Admin')}
                                    >
                                        Annuler
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModifierEnseignant;