import React, { useEffect, useState } from 'react';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AjouterSection = () => {
    const [filieres, setFilieres] = useState([]);
    const [selectedCycle, setSelectedCycle] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchFilieres = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/v1/filiere/AllFiliere', {
                    credentials: 'include',
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch filieres');
                }
                const data = await response.json();
                setFilieres(data.filieres);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchFilieres();
    }, []);

    const handleFiliereChange = (e) => {
        const selectedFiliere = filieres.find(filiere => filiere._id === e.target.value);
        if (selectedFiliere) {
            setSelectedCycle(selectedFiliere.cycle); // Automatically set the cycle
        } else {
            setSelectedCycle('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        if (
            !e.target.filiere.value ||
            !selectedCycle ||
            !e.target.niveau.value ||
            !e.target.nombre_etudiants.value ||
            !e.target.nombre_groupes.value
        ) {
            setError('Veuillez remplir tous les champs obligatoires');
            return;
        }

        // Utiliser le nom tel que saisi par l'utilisateur ou générer un nom simple
        let sectionName = e.target.nom.value.trim();
        
        // Si le nom est vide, générer un nom simple SANS suffixe
        if (!sectionName) {
            sectionName = e.target.niveau.value; // Juste le niveau, rien d'autre
        }

        try {
            const response = await fetch('http://localhost:5000/api/v1/section/SectionCreate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    nom: sectionName,
                    filiere: e.target.filiere.value,
                    cycle: selectedCycle,
                    niveau: e.target.niveau.value,
                    nombre_etudiants: e.target.nombre_etudiants.value,
                    nombre_groupes: e.target.nombre_groupes.value,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Une erreur est survenue');
            }

            e.target.reset();
            setSelectedCycle('');
            setSuccess(true);
            toast.success(`Section "${sectionName}" ajoutée avec succès !`, {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Slide,
            });
        } catch (error) {
            console.error('Error:', error);
            setError(error.message || "Une erreur est survenue lors de l'ajout de la section");
            toast.error(error.message || "Une erreur est survenue lors de l'ajout de la section", {
                position: "top-center",
                autoClose: 3000,
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

    const handleReset = (e) => {
        e.preventDefault();
        setSuccess(false);
        setError(null);
        setSelectedCycle(''); // Réinitialiser le cycle aussi
        
        // Réinitialiser le formulaire
        const form = e.target.closest('form');
        if (form) {
            form.reset();
        }
    };

    return (
        <div className="container mt-5">
            <ToastContainer />
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header bg-primary text-white">
                            <h3 className="text-center">Ajouter une section</h3>
                        </div>
                        <div className="card-body">
                            {error && <p className="alert alert-danger">{error}</p>}
                            <form onSubmit={handleSubmit}>
                                <div className="form-group mb-3">
                                    <label className="form-label">Nom de la section (optionnel)</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        name="nom" 
                                        placeholder="Ex: Section A, Groupe 1, etc."
                                    />
                                    <small className="form-text text-muted">
                                        Si laissé vide, le niveau sera utilisé comme nom (ex: si niveau = "1", nom = "1")
                                    </small>
                                </div>

                                <div className="form-group mb-3">
                                    <label className="form-label">Filière</label>
                                    <select className="form-control" name="filiere" onChange={handleFiliereChange} required>
                                        <option value="">Sélectionner une filière</option>
                                        {filieres &&
                                            filieres.map((filiere) => (
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
                                        value={selectedCycle}
                                        readOnly
                                    />
                                </div>

                                <div className="form-group mb-3">
                                    <label className="form-label">Niveau</label>
                                    <input type="text" className="form-control" name="niveau" placeholder="Saisir le Niveau" />
                                </div>

                                <div className="form-group mb-3">
                                    <label className="form-label">Nombre d'étudiants</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="nombre_etudiants"
                                        placeholder="Saisir le nombre d'étudiants"
                                        min="1"
                                        max="30"
                                        step="1"
                                        defaultValue="1"
                                    />
                                </div>

                                <div className="form-group mb-3">
                                    <label className="form-label">Nombre de groupes</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="nombre_groupes"
                                        placeholder="Saisir le nombre de groupes"
                                        min="1"
                                        max="30"
                                        step="1"
                                        defaultValue="1"
                                    />
                                </div>

                                <div className="text-center">
                                    <button type="submit" className="btn btn-primary me-2">
                                        Ajouter Section
                                    </button>
                                    <button type="reset" className="btn btn-danger me-2" onClick={handleReset}>
                                        Annuler
                                    </button>
                                    <button type="button" className="btn btn-secondary" onClick={() => window.history.back()}>
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

export default AjouterSection;
