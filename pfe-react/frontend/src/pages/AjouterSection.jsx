import React, { useEffect, useState } from 'react';

const AjouterSection = () => {
    const [filieres, setFilieres] = useState([]); // State to store filieres
    const [error, setError] = useState(null); // State to handle errors

    useEffect(() => {
        const fetchFilieres = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/v1/filiere/AllFiliere', {
                    credentials: 'include',});
                if (!response.ok) {
                    throw new Error('Failed to fetch filieres');
                }
                const data = await response.json();
                setFilieres(data.filieres); // Assuming the API returns an array of filieres
            } catch (error) {
                setError(error.message);
            }
        };

        fetchFilieres();
    }, []); // Empty dependency array to run once on mount

    return (
        <div className="AjouterSection">
            <h1>Ajouter une section</h1>
            <form>
                <div class="form-group">
                    <input type="text" class="form-control" name="nom" placeholder="Nom de la section" />
                </div>
                <div className="form-group">
                        <select className="form-control" name="filiere" placeholder="Filiere" required>
                            <option value="">Sélectionner une filière</option>
                            {filieres.map((filiere) => (
                                <option key={filiere._id} value={filiere._id}>
                                    {filiere.nom}
                                </option>
                            ))}
                        </select>
                </div>
                <div className="form-group">
                <select className="form-control" name="cycle" placeholder="Cycle" required>
                    <option value="" disabled>Choisissez un cycle</option>
                    <option value="1">Licence</option>
                    <option value="2">Master</option>
                </select>
                </div>
                <div class="form-group">
                    <input type="text" class="form-control" name="niveau" placeholder="Niveau" />
                </div>
                <div>
                                        <label className="form-label">Nombre d'étudiants</label>
                                        <input 
                                            type="number"
                                            className="form-control mb-3"
                                            min="1"
                                            max="30"
                                            step="1"
                                            defaultValue="1"
                                            aria-label="Nombre d'étudiants"
                                        />
                </div>
                <div>
                                        <label className="form-label">Nombre de groupes</label>
                                        <input 
                                            type="number"
                                            className="form-control mb-3"
                                            min="1"
                                            max="30"
                                            step="1"
                                            defaultValue="1"
                                            aria-label="Nombre de groupes"
                                        />
                </div>
                <div class="text-right">
                    <button type="submit" class="btn btn-primary">Ajouter</button>
                    <button type="reset" class="btn btn-danger">Annuler</button>
                    <a href='#' class="btn btn-primary">Retour</a>
                </div>
            </form>
        </div>
    );
};

export default AjouterSection;