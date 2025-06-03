import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ModifierSection = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nom: '',
        filiere: '',
        cycle: '',
        niveau: '',
        nombre_etudiants: '',
        nombre_groupes: ''
    });
    const [filieres, setFilieres] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch section data
                const sectionResponse = await fetch(`http://localhost:5000/api/v1/section/${id}`, {
                    credentials: 'include',
                });
                if (!sectionResponse.ok) {
                    throw new Error('Erreur lors du chargement de la section');
                }
                const sectionData = await sectionResponse.json();
                const section = sectionData.section;
                
                setFormData({
                    nom: section.nom || '',
                    filiere: section.filiere || '',
                    cycle: section.cycle || '',
                    niveau: section.niveau || '',
                    nombre_etudiants: section.nombre_etudiants || '',
                    nombre_groupes: section.nombre_groupes || ''
                });

                // Fetch filieres
                const filieresResponse = await fetch('http://localhost:5000/api/v1/filiere/AllFiliere', {
                    credentials: 'include',
                });
                if (filieresResponse.ok) {
                    const filieresData = await filieresResponse.json();
                    setFilieres(filieresData.filieres);
                }

                setLoading(false);
            } catch (error) {
                console.error('Error:', error);
                setError(error.message || 'Erreur lors du chargement des données');
                setLoading(false);
            }
        };

        if (id) {
            fetchData();
        }
    }, [id]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleFiliereChange = (e) => {
        const selectedFiliereId = e.target.value;
        const selectedFiliere = filieres.find(filiere => filiere._id === selectedFiliereId);
        
        setFormData({
            ...formData,
            filiere: selectedFiliereId,
            cycle: selectedFiliere ? selectedFiliere.cycle : ''
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        const { nom, filiere, cycle, niveau, nombre_etudiants, nombre_groupes } = formData;

        // Validation
        if (!nom || !filiere || !cycle || !niveau || !nombre_etudiants || !nombre_groupes) {
            setError('Veuillez remplir tous les champs obligatoires');
            return;
        }

        if (isNaN(nombre_etudiants) || nombre_etudiants <= 0) {
            setError('Le nombre d\'étudiants doit être un nombre positif');
            return;
        }

        if (isNaN(nombre_groupes) || nombre_groupes <= 0) {
            setError('Le nombre de groupes doit être un nombre positif');
            return;
        }

        try {
            console.log('Envoi des données:', formData);

            const response = await fetch(`http://localhost:5000/api/v1/section/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    nom: nom.trim(),
                    filiere,
                    cycle,
                    niveau: niveau.trim(),
                    nombre_etudiants: parseInt(nombre_etudiants),
                    nombre_groupes: parseInt(nombre_groupes)
                })
            });

            const data = await response.json();
            console.log('Réponse serveur:', data);

            if (!response.ok) {
                throw new Error(data.message || 'Une erreur est survenue');
            }

            setSuccess(true);
            toast.success('Section modifiée avec succès !', {
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

            // Rediriger après un délai
            setTimeout(() => {
                navigate('/Admin');
            }, 2500);
            
        } catch (error) {
            console.error('Erreur:', error);
            setError(error.message || "Une erreur est survenue lors de la modification de la section");
            toast.error(error.message || "Une erreur est survenue lors de la modification de la section", {
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

    const handleReset = () => {
        // Reset to original values by reloading
        window.location.reload();
    };

    if (loading) {
        return (
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card">
                            <div className="card-body text-center">
                                <div className="spinner-border" role="status">
                                    <span className="visually-hidden">Chargement...</span>
                                </div>
                                <p className="mt-2">Chargement des données...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <ToastContainer />
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header bg-warning text-dark">
                            <h3 className="text-center">Modifier la section</h3>
                        </div>
                        <div className="card-body">
                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            )}
                            
                            <form onSubmit={handleSubmit}>
                                <div className="form-group mb-3">
                                    <label className="form-label">Nom de la section</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        name="nom" 
                                        placeholder="Nom de la section" 
                                        value={formData.nom}
                                        onChange={handleChange}
                                        required 
                                    />
                                </div>

                                <div className="form-group mb-3">
                                    <label className="form-label">Filière</label>
                                    <select 
                                        className="form-control" 
                                        name="filiere" 
                                        value={formData.filiere}
                                        onChange={handleFiliereChange}
                                        required
                                    >
                                        <option value="">Sélectionner une filière</option>
                                        {filieres.map(filiere => (
                                            <option key={filiere._id} value={filiere._id}>
                                                {filiere.nom}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group mb-3">
                                    <label className="form-label">Cycle</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="cycle"
                                        value={formData.cycle}
                                        readOnly
                                    />
                                </div>

                                <div className="form-group mb-3">
                                    <label className="form-label">Niveau</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        name="niveau" 
                                        placeholder="Niveau" 
                                        value={formData.niveau}
                                        onChange={handleChange}
                                        required 
                                    />
                                </div>

                                <div className="form-group mb-3">
                                    <label className="form-label">Nombre d'étudiants</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="nombre_etudiants"
                                        placeholder="Nombre d'étudiants"
                                        value={formData.nombre_etudiants}
                                        onChange={handleChange}
                                        min="1"
                                        max="1000"
                                        required
                                    />
                                </div>

                                <div className="form-group mb-3">
                                    <label className="form-label">Nombre de groupes</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="nombre_groupes"
                                        placeholder="Nombre de groupes"
                                        value={formData.nombre_groupes}
                                        onChange={handleChange}
                                        min="1"
                                        max="30"
                                        required
                                    />
                                </div>

                                <div className="text-center">
                                    <button type="submit" className="btn btn-warning me-2">Modifier</button>
                                    <button 
                                        type="button" 
                                        className="btn btn-danger me-2"
                                        onClick={handleReset}
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
};

export default ModifierSection;