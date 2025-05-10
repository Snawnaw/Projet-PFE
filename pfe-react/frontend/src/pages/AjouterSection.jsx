import React, { useEffect, useState } from 'react';

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
            !e.target.nom.value ||
            !e.target.filiere.value ||
            !selectedCycle ||
            !e.target.niveau.value ||
            !e.target.nombre_etudiants.value || // Fixed name
            !e.target.nombre_groupes.value // Fixed name
        ) {
            setError('Veuillez remplir tous les champs');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/v1/section/SectionCreate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    nom: e.target.nom.value,
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
            setSuccess(true);
            alert('Section ajoutée avec succès');
        } catch (error) {
            console.error('Error:', error);
            setError(error.message || "Une erreur est survenue lors de l'ajout de la section");
        }
    };

    const handleReset = (e) => {
        e.preventDefault();
        setSuccess(false);
        setError(null);
    };

    return (
        <div className="AjouterSection">
            <h1>Ajouter une section</h1>
            {error && <p className="text-danger">{error}</p>}
            {success && <p className="text-success">Section ajoutée avec succès !</p>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">Nom de la section</label>
                    <input type="text" className="form-control" name="nom" placeholder="Nom de la section" />
                </div>

                <div className="form-group">
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

                <div className="form-group">
                    <label className="form-label">Cycle</label>
                    <input
                        type="text"
                        className="form-control"
                        name="cycle"
                        value={selectedCycle} // Automatically set cycle
                        readOnly
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Niveau</label>
                    <input type="text" className="form-control" name="niveau" placeholder="Saisir le Niveau" />
                </div>

                <div>
                    <label className="form-label">Nombre d'étudiants</label>
                    <input
                        type="number"
                        className="form-control mb-3"
                        name="nombre_etudiants"
                        placeholder="Saisir le nombre d'étudiants"
                        min="1"
                        max="30"
                        step="1"
                        defaultValue="1"
                    />
                </div>

                <div>
                    <label className="form-label">Nombre de groupes</label>
                    <input
                        type="number"
                        className="form-control mb-3"
                        name="nombre_groupes"
                        placeholder="Saisir le nombre de groupes"
                        min="1"
                        max="30"
                        step="1"
                        defaultValue="1"
                    />
                </div>

                <div className="text-right">
                    <button type="submit" className="btn btn-primary">
                        Ajouter Section
                    </button>
                    <button type="reset" className="btn btn-danger" onClick={handleReset}>
                        Annuler
                    </button>
                    <a href="#" className="btn btn-primary">
                        Retour
                    </a>
                </div>
            </form>
        </div>
    );
};

export default AjouterSection;
