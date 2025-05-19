import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api'; // Make sure this import path is correct
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AjouterEnseignant = () => {
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        date_naissance: '',
        numero_tel: '',
        email: '',
        wilaya: '',
        commune: '',
        codePostal: '',
        role: 'enseignant', // Default role
        module: '', // Assuming you want to add a module field
        password: '',
        password2: ''
    });

    const [wilayas, setWilayas] = useState([]);
    const [communes, setCommunes] = useState([]);
    const [isAddressOpen, setIsAddressOpen] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    {/*const fetchModules = async () => {
        try {
            const response = await API.get('http://localhost:5000/api/v1/filiere/AllModules');
            return response.data.modules; // Assuming the API returns an array of modules
        } catch (error) {
            console.error('Erreur lors de la récupération des modules :', error);
            setError('Erreur lors de la récupération des modules');
        }
    };*/}

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
    
        if (!formData.numero_tel || !formData.date_naissance) {
            setError('Veuillez remplir tous les champs requis.');
            setLoading(false);
            return;
        }
    
        if (formData.password !== formData.password2) {
            setError("Les mots de passe ne correspondent pas.");
            setLoading(false);
            return;
        }

        if (formData.module === '') {
            setError("Veuillez sélectionner un module.");
            setLoading(false);
            return;
        }
    
        try {    
            const response = await API.post('/enseignant/EnseignantCreate', {
                nom: formData.nom,
                prenom: formData.prenom,
                date_naissance: formData.date_naissance,
                numero_tel: formData.numero_tel,
                email: formData.email,
                adresse: {
                    wilaya: formData.wilaya,
                    commune: formData.commune,
                    code_postal: formData.codePostal,
                },
                password: formData.password,
                role: formData.role,
                module: formData.module // Assuming you want to add a module field
            });
    
            console.log('Réponse du serveur :', response.data);
            setSuccess(true);
            toast.success('Enseignant ajoutée avec succès !', {
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
            
            // Clear form after successful submission
            handleReset();
            
        } catch (error) {
            console.error('Erreur :', error);
            setError(error.message || "Une erreur est survenue lors de l'ajout de l'enseignant");
            toast.error(error.message || "Une erreur est survenue lors de l'ajout de l'enseignant", {
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
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        //reset form
        setFormData({
            nom: '',
            prenom: '',
            date_naissance: '',
            numero_tel: '',
            email: '',
            wilaya: '',
            commune: '',
            codePostal: '',
            role: 'enseignant',
            module: '', // Assuming you want to add a module field
            password: '',
            password2: ''
        });
    };

    useEffect(() => {
        // Load wilayas
        fetch('/src/pages/CommunesAlgerie.JSON')
            .then(res => res.json())
            .then(data => {
                const uniqueWilayas = [...new Set(data.map(item => item.wilaya_name))];
                setWilayas(uniqueWilayas);
            })
            .catch(err => {
                console.error("Erreur lors du chargement des communes :", err);
                setError("Erreur lors du chargement des wilayas");
            });
    }, [navigate]);

    const handleModuleChange = (e) => {
        setFormData({
            ...formData,
            module: e.target.value
        });
    };

    const handleWilayaChange = (e) => {
        const selectedWilaya = e.target.value;
        setFormData({
            ...formData,
            wilaya: selectedWilaya,
            commune: '' // Réinitialiser la commune
        });

        // Filtrer les communes correspondant à la wilaya sélectionnée
        fetch('/src/pages/CommunesAlgerie.JSON')
            .then(res => res.json())
            .then(data => {
                const filteredCommunes = data
                    .filter(item => item.wilaya_name === selectedWilaya)
                    .map(item => item.commune_name);
                setCommunes(filteredCommunes);
            })
            .catch(err => {
                console.error('Erreur lors du filtrage des communes :', err);
                setError("Erreur lors du chargement des communes");
            });
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const toggleAddress = () => {
        setIsAddressOpen(!isAddressOpen);
    };

    return (
        <div className="container mt-5">
            <ToastContainer />
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">Enseignant ajouté avec succès !</div>}
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header bg-primary text-white">
                            <h3 className="text-center">Ajouter un enseignant</h3>
                        </div>
                        <div className="card-body">
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
                                <div className="form-group mb-3">
                                <input
                                    type="date"
                                    className="form-control"
                                    name="date_naissance"
                                    placeholder="Date de naissance"
                                    value={formData.date_naissance || ''} 
                                    onChange={handleChange}
                                    required
                                />
                                </div>
                                <div className="form-group mb-3">
                                    <input 
                                        type="tel" 
                                        className="form-control" 
                                        name="numero_tel" 
                                        placeholder="Telephone" 
                                        value={formData.numero_tel}
                                        onChange={handleChange}
                                        required 
                                    />
                                </div>
                                
                                {/* Section d'adresse déroulante */}
                                <div className="card mb-4">
                                    <div 
                                        className="card-header bg-light d-flex justify-content-between align-items-center" 
                                        onClick={toggleAddress}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <h6 className="mb-0">Adresse</h6>
                                        <span className="accordion-icon">
                                            {isAddressOpen ? 
                                                <i className="fas fa-chevron-up"></i> : 
                                                <i className="fas fa-chevron-down"></i>
                                            }
                                        </span>
                                    </div>
                                    <div className={`card-body collapse ${isAddressOpen ? 'show' : ''}`}>
                                        <div className="form-group mb-3">
                                            <label className="form-label">Wilaya</label>
                                            <select 
                                                className="form-control" 
                                                name="wilaya" 
                                                value={formData.wilaya}
                                                onChange={handleWilayaChange}
                                                required
                                            >
                                                <option value="">Sélectionner une wilaya</option>
                                                {wilayas.map((wilaya, index) => (
                                                    <option key={index} value={wilaya}>{wilaya}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="form-group mb-3">
                                            <label className="form-label">Commune</label>
                                            <select 
                                                className="form-control" 
                                                name="commune"
                                                value={formData.commune}
                                                onChange={handleChange}
                                                disabled={!formData.wilaya || communes.length === 0}
                                                required
                                            >
                                                <option value="">Sélectionner une commune</option>
                                                {communes.map((commune, index) => (
                                                    <option key={index} value={commune}>{commune}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="form-group mb-3">
                                            <label className="form-label">Code Postal</label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                name="codePostal" 
                                                placeholder="Code Postal"
                                                value={formData.codePostal}
                                                onChange={handleChange}
                                                required 
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group mb-3">
                                    <input 
                                        type="email" 
                                        className="form-control" 
                                        name="email" 
                                        placeholder="Email" 
                                        value={formData.email} 
                                        onChange={handleChange}
                                        required 
                                    />
                                </div>
                                <div className="form-group mb-3">
                                    <input 
                                        type="password" 
                                        className="form-control" 
                                        name="password" 
                                        placeholder="Mot de passe" 
                                        value={formData.password} 
                                        onChange={handleChange}
                                        required 
                                    />
                                </div>
                                <div className="form-group mb-3">
                                    <input 
                                        type="password" 
                                        className="form-control" 
                                        name="password2" 
                                        placeholder="Confirmer le mot de passe" 
                                        value={formData.password2} 
                                        onChange={handleChange}
                                        required 
                                    />
                                </div>
                                <div className="form-group mb-3">
                                    <select 
                                        className="form-control" 
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                    >
                                        <option value="enseignant">Enseignant</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                                
                                {/*<div className="form-group mb-3">
                                    <select 
                                        className="form-control" 
                                        name="module"
                                        value={formData.module}
                                        onChange={handleChange}
                                    >
                                        <option value="">Choisissez le module</option>
                                    </select>
                                </div>*/}
                                
                                <div className="text-center">
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary me-2" 
                                        disabled={loading}
                                    >
                                        {loading ? 'Chargement...' : 'Ajouter enseignant'}
                                    </button>
                                    <button 
                                        type="button" 
                                        className="btn btn-danger me-2" 
                                        onClick={handleReset}
                                        disabled={loading}
                                    >
                                        Annuler
                                    </button>
                                    <button 
                                        type="button" 
                                        className="btn btn-secondary"
                                        onClick={() => navigate('/Admin')}
                                        disabled={loading}
                                    >
                                        Retour
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

export default AjouterEnseignant;