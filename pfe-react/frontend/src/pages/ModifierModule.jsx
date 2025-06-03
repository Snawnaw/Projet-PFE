import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ModifierModule = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [nomModule, setNomModule] = useState('');
    const [code, setCode] = useState('');
    const [filiere, setFiliere] = useState('');
    const [section, setSection] = useState('');
    const [enseignant, setEnseignant] = useState('');
    const [type, setType] = useState('');
    const [filieres, setFilieres] = useState([]);
    const [sections, setSections] = useState([]);
    const [enseignants, setEnseignants] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch module data
                const moduleResponse = await fetch(`http://localhost:5000/api/v1/module/${id}`, {
                    credentials: 'include',
                });
                if (!moduleResponse.ok) {
                    throw new Error('Erreur lors du chargement du module');
                }
                const moduleData = await moduleResponse.json();
                const module = moduleData.module;
                
                setNomModule(module.nom || '');
                setCode(module.code || '');
                setFiliere(module.filiere?._id || module.filiere || '');
                setSection(module.section?._id || module.section || '');
                setEnseignant(module.enseignant?._id || module.enseignant || '');
                setType(module.type || '');

                // Fetch all filieres
                const filieresResponse = await fetch('http://localhost:5000/api/v1/filiere/AllFiliere', {
                    credentials: 'include',
                });
                if (filieresResponse.ok) {
                    const filieresData = await filieresResponse.json();
                    setFilieres(filieresData.filieres);
                }

                // Fetch all enseignants
                const enseignantsResponse = await fetch('http://localhost:5000/api/v1/enseignant/AllEnseignant', {
                    credentials: 'include',
                });
                if (enseignantsResponse.ok) {
                    const enseignantsData = await enseignantsResponse.json();
                    setEnseignants(enseignantsData.enseignants);
                }

                // Fetch all sections for the current filiere
                if (module.filiere) {
                    const sectionsResponse = await fetch(`http://localhost:5000/api/v1/section/SectionsByFiliere/${module.filiere?._id || module.filiere}`, {
                        credentials: 'include',
                    });
                    if (sectionsResponse.ok) {
                        const sectionsData = await sectionsResponse.json();
                        setSections(sectionsData.sections);
                    }
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

    const handleFiliereChange = async (e) => {
        const selectedFiliere = e.target.value;
        setFiliere(selectedFiliere);
        setSection('');
    
        try {
            const response = await fetch(`http://localhost:5000/api/v1/section/SectionsByFiliere/${selectedFiliere}`, {
                credentials: 'include',
            });
    
            if (!response.ok) {
                throw new Error('Échec du chargement des sections');
            }
    
            const data = await response.json();
            setSections(data.sections);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        // Validation
        if (!nomModule || !code || !filiere || !section || !type) {
            setError('Veuillez remplir tous les champs obligatoires');
            return;
        }

        if (code.length > 5) {
            setError('Le code ne doit pas dépasser 5 caractères');
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/v1/module/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    nom: nomModule,
                    code,
                    filiere,
                    section,
                    ...(enseignant && { enseignant }),
                    type
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Une erreur est survenue');
            }

            setSuccess(true);
            toast.success('Module modifié avec succès !', {
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
            setError(error.message || 'Une erreur est survenue lors de la modification du module');
            toast.error(error.message || "Une erreur est survenue lors de la modification du module", {
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
                            <h3 className="text-center">Modifier le module</h3>
                        </div>
                        <div className="card-body">
                            {error && <div className="alert alert-danger">{error}</div>}

                            <form onSubmit={handleSubmit}>
                                <div className="form-group mb-3">
                                    <label className="form-label">Nom du Module</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        value={nomModule}
                                        onChange={(e) => setNomModule(e.target.value)}
                                        maxLength={50}
                                        required
                                    />
                                </div>

                                <div className="form-group mb-3">
                                    <label className="form-label">Code du Module</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                        maxLength={5}
                                        required
                                    />
                                </div>

                                <div className="form-group mb-3">
                                    <label className="form-label">Filière</label>
                                    <select 
                                        className="form-control" 
                                        value={filiere} 
                                        onChange={handleFiliereChange}
                                        required
                                    >
                                        <option value="">Sélectionnez une filière</option>
                                        {filieres.map(f => (
                                            <option key={f._id} value={f._id}>{f.nom}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group mb-3">
                                    <label className="form-label">Section</label>
                                    <select 
                                        className="form-control" 
                                        value={section} 
                                        onChange={(e) => setSection(e.target.value)}
                                        required
                                    >
                                        <option value="">Sélectionnez une section</option>
                                        {sections.map(s => (
                                            <option key={s._id} value={s._id}>{s.nom}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group mb-3">
                                    <label className="form-label">Enseignant</label>
                                    <select
                                        className="form-control"
                                        value={enseignant}
                                        onChange={(e) => setEnseignant(e.target.value)}
                                    >
                                        <option value="">Sélectionnez un enseignant (optionnel)</option>
                                        {enseignants.map(e => (
                                            <option key={e._id} value={e._id}>{e.nom} {e.prenom}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group mb-3">
                                    <label className="form-label">Type</label>
                                    <select 
                                        className="form-control" 
                                        value={type} 
                                        onChange={(e) => setType(e.target.value)}
                                        required
                                    >
                                        <option value="">Sélectionnez un type</option>
                                        <option value="semestriel">Semestriel</option>
                                        <option value="trimestriel">Trimestriel</option>
                                        <option value="annuel">Annuel</option>
                                    </select>
                                </div>

                                <div className="text-center">
                                    <button type="submit" className="btn btn-warning me-2">Modifier</button>
                                    <button type="button" className="btn btn-danger me-2" onClick={handleReset}>Annuler</button>
                                    <button type="button" className="btn btn-secondary" onClick={() => navigate('/Admin')}>Retourner</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModifierModule;