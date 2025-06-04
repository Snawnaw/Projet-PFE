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
        role: 'enseignant',
        modules: [],
        filieres: [],
        password: '',
        password2: ''
    });

    const [wilayas, setWilayas] = useState([]);
    const [communes, setCommunes] = useState([]);
    const [modules, setModules] = useState([]);
    const [filieres, setFilieres] = useState([]);
    const [allModules, setAllModules] = useState([]); // Store all modules for filtering
    const [isAddressOpen, setIsAddressOpen] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const navigate = useNavigate();

    const fetchModules = async () => {
        try {
            const response = await API.get('/module/AllModules');
            setAllModules(response.data.modules || []);
            return response.data.modules || [];
        } catch (error) {
            console.error('Erreur lors de la récupération des modules :', error);
            setError('Erreur lors de la récupération des modules');
            return [];
        }
    };

    // Filter modules by selected filieres
    const filterModulesByFilieres = (modules, filiereIds) => {
        return modules.filter(module => {
            // module.filiere can be an object or an array of objects/ids
            if (Array.isArray(module.filiere)) {
                return module.filiere.some(f =>
                    typeof f === "object"
                        ? filiereIds.includes(f._id)
                        : filiereIds.includes(f)
                );
            } else if (typeof module.filiere === "object" && module.filiere !== null) {
                return filiereIds.includes(module.filiere._id);
            } else {
                return filiereIds.includes(module.filiere);
            }
        });
    };

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

        if (!formData.filieres || formData.filieres.length === 0) {
            setError("Veuillez sélectionner au moins une filière.");
            setLoading(false);
            return;
        }

        if (formData.role === "enseignant" && (!formData.modules || formData.modules.length === 0)) {
            setError("Veuillez sélectionner au moins un module.");
            setLoading(false);
            return;
        }

        console.log({
            nom: formData.nom,
            prenom: formData.prenom,
            date_naissance: formData.date_naissance,
            numero_tel: formData.numero_tel,
            email: formData.email,
            wilaya: formData.wilaya,
            commune: formData.commune,
            code_postal: formData.codePostal,
            filieres: formData.filieres,
            password: formData.password,
            role: formData.role,
            modules: formData.modules
        });

        try {
            const response = await API.post('/enseignant/EnseignantCreate', {
                nom: formData.nom,
                prenom: formData.prenom,
                date_naissance: formData.date_naissance,
                numero_tel: formData.numero_tel,
                email: formData.email,
                wilaya: formData.wilaya,
                commune: formData.commune,
                code_postal: formData.codePostal,
                filieres: formData.filieres,
                password: formData.password,
                role: formData.role,
                ...(formData.role === "enseignant" ? { modules: formData.modules } : {})
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
            // Show backend validation error if available
            const backendMsg = error?.response?.data?.message;
            setError(backendMsg || error.message || "Une erreur est survenue lors de l'ajout de l'enseignant");
            toast.error(backendMsg || error.message || "Une erreur est survenue lors de l'ajout de l'enseignant", {
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
            modules: [],
            filieres: [],
            password: '',
            password2: ''
        });

        setCommunes([]);
        setModules([]);
        setError(null);
        setSuccess(false);
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

        // Load modules
        fetchModules()
            .then(fetchedModules => {
                setModules(fetchedModules || []);
            });

        // Load filieres
        API.get('/filiere/AllFiliere')
            .then(res => setFilieres(res.data.filieres || []))
            .catch(() => setFilieres([]));
    }, [navigate]);

    // When filiere changes, filter modules for that filiere
    useEffect(() => {
        if (formData.filieres && formData.filieres.length > 0) {
            setModules(filterModulesByFilieres(allModules, formData.filieres));
        } else {
            setModules([]);
        }
    }, [formData.filieres, allModules]);

    const handleModuleChange = (e) => {
        const { options } = e.target;
        const value = Array.from(options)
            .filter(option => option.selected)
            .map(option => option.value);

        setFormData({
            ...formData,
            modules: value
        });
    };

    const handleFiliereChange = (e) => {
        const { options } = e.target;
        const value = Array.from(options)
            .filter(option => option.selected)
            .map(option => option.value);

        setFormData({
            ...formData,
            filieres: value,
            modules: [] // Réinitialiser les modules quand les filières changent
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
        const { name, value } = e.target;
        // If role changes to admin, clear modules
        if (name === "role" && value === "admin") {
            setFormData({
                ...formData,
                [name]: value,
                modules: []
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
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
                            <h3 className="text-center">Ajouter un utilisateur</h3>
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
                                        type={showPassword ? "text" : "password"}
                                        className="form-control"
                                        name="password"
                                        placeholder="Mot de passe"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                    <div style={{ marginTop: "0.5rem" }}>
                                        <input
                                            type="checkbox"
                                            id="showPassword"
                                            checked={showPassword}
                                            onChange={() => setShowPassword(!showPassword)}
                                            style={{ marginRight: "0.5rem" }}
                                        />
                                        <label htmlFor="showPassword">Afficher le mot de passe</label>
                                    </div>
                                </div>
                                <div className="form-group mb-3">
                                    <input
                                        type={showPassword2 ? "text" : "password"}
                                        className="form-control"
                                        name="password2"
                                        placeholder="Confirmer le mot de passe"
                                        value={formData.password2}
                                        onChange={handleChange}
                                        required
                                    />
                                    <div style={{ marginTop: "0.5rem" }}>
                                        <input
                                            type="checkbox"
                                            id="showPassword2"
                                            checked={showPassword2}
                                            onChange={() => setShowPassword2(!showPassword2)}
                                            style={{ marginRight: "0.5rem" }}
                                        />
                                        <label htmlFor="showPassword2">Afficher le mot de passe</label>
                                    </div>
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

                                <div className="form-group mb-3">
                                    <label className="form-label">Filières</label>
                                    <select
                                        className="form-control"
                                        name="filieres"
                                        multiple
                                        size="4"
                                        value={formData.filieres}
                                        onChange={handleFiliereChange}
                                        required
                                    >
                                        {filieres.map(f => (
                                            <option key={f._id} value={f._id}>{f.nom}</option>
                                        ))}
                                    </select>
                                    <small className="form-text text-muted">
                                        Maintenez Ctrl (Windows) ou Cmd (Mac) pour sélectionner plusieurs filières.
                                    </small>
                                </div>

                                {/* Show modules select only if role is enseignant */}
                                {formData.role === "enseignant" && (
                                    <div className="form-group mb-3">
                                        <label className="form-label">Modules</label>
                                        <select
                                            className="form-control"
                                            name="modules"
                                            multiple
                                            size="5"
                                            value={formData.modules}
                                            onChange={handleModuleChange}
                                            required
                                        >
                                            {modules.map(module => (
                                                <option key={module._id} value={module._id}>
                                                    {module.nom}
                                                </option>
                                            ))}
                                        </select>
                                        <small className="form-text text-muted">
                                            Maintenez Ctrl (Windows) ou Cmd (Mac) pour sélectionner plusieurs modules.
                                        </small>
                                        {modules.length === 0 && formData.filieres.length > 0 && (
                                            <small className="text-warning">
                                                Aucun module disponible pour les filières sélectionnées.
                                            </small>
                                        )}
                                    </div>
                                )}

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