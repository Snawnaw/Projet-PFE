import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';

const AjouterModule = () => {
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

        const fetchSections = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/v1/section/AllSections', {
                    credentials: 'include',
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch sections');
                }
                const data = await response.json();
                setSections(data.sections);
            } catch (error) {
                setError(error.message);
            }
        };

        const fetchEnseignants = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/v1/enseignant/AllEnseignant', {
                    credentials: 'include',
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch enseignants');
                }
                const data = await response.json();
                setEnseignants(data.enseignants);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchFilieres();
        fetchSections();
        fetchEnseignants();
    }, []);

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
            setSections(data.sections); // ✅ car tu renvoies directement `res.status(200).json(sections)`
        } catch (error) {
            setError(error.message);
        }
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        // Validation
        if (!nomModule || !code || !filiere || !section || !enseignant || !type) {
            setError('Veuillez remplir tous les champs');
            return;
        }

        if (filieres.length === 0 || sections.length === 0 || enseignants.length === 0) {
            setError('Les données nécessaires ne sont pas disponibles. Veuillez réessayer.');
            return;
        }

        if (code.length > 5) {
            setError('Le code ne doit pas dépasser 5 caractères');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/v1/module/ModuleCreate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    nom: nomModule,
                    code,
                    filiere,
                    section,
                    enseignant,
                    type
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Une erreur est survenue');
            }

            handleReset();
            setSuccess(true);
        } catch (error) {
            setError(error.message || 'Une erreur est survenue lors de l\'ajout du module');
        }
    };

    const handleReset = () => {
        setNomModule('');
        setCode('');
        setFiliere('');
        setSection('');
        setEnseignant('');
        setType('');
        setError(null);
        setSuccess(false);
    };

    return (
        <div className="ajouter-module-container">
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">Module ajouté avec succès!</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Nom du Module</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        value={nomModule}
                        onChange={(e) => setNomModule(e.target.value)}
                        maxLength={50}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Code du Module</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        maxLength={5}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Filière</label>
                    <select 
                        className="form-control" 
                        value={filiere} 
                        onChange={handleFiliereChange}
                        required
                    >
                        <option value="">Sélectionnez une filière</option>
                        {filieres && filieres.map(f => (
                            <option key={f._id} value={f._id}>{f.nom}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Section</label>
                    <select 
                        className="form-control" 
                        value={section} 
                        onChange={(e) => setSection(e.target.value)}
                        required
                    >
                        <option value="">Sélectionnez une section</option>
                        {sections && sections.map(s => (
                            <option  key={s._id} value={s._id}>{s.nom}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Enseignant</label>
                    <select
                        className="form-control"
                        value={enseignant}
                        onChange={(e) => setEnseignant(e.target.value)}
                        required
                    >
                        <option value="">Sélectionnez un enseignant</option>
                        {enseignants && enseignants.map((e) => (
                            <option key={e._id} value={e._id}>{e.nom}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Type</label>
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

                <div className="buttons-group">
                    <Button type="submit" variant="primary">Ajouter</Button>
                    <Button type="button" variant="secondary" onClick={handleReset}>Annuler</Button>
                    <Button type="button" variant="link" onClick={() => window.history.back()}>Retour</Button>
                </div>
            </form>
        </div>
    );
};

export default AjouterModule;
