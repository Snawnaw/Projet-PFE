import React from 'react';

const AjouterEnseignant = () => {
    return (
        <div className="AjouterEnseignant">
            <div className="form-container">
                <h1>Ajouter un enseignant</h1>
                <form>
                    <div className="form-group">
                        <input type="text" className="form-control" name="nom" placeholder="Nom" required />
                    </div>
                    <div className="form-group">
                        <input type="text" className="form-control" name="prenom" placeholder="Prenom" required />
                    </div>
                    <div className="form-group">
                        <input type="email" className="form-control" name="email" placeholder="Email" required />
                    </div>
                    <div className="form-group">
                        <input type="tel" className="form-control" name="telephone" placeholder="Telephone" required />
                    </div>
                    <div className="form-group">
                        <select className="form-control" name="grade" placeholder="Grade" required>
                            <option value="">Sélectionner un grade</option>
                            <option value="">Professeur</option>
                            <option value="">Maitre de conférence A</option>
                            <option value="">Maitre de conférence B</option>
                            <option value="">Maitre assistant</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <select className="form-control" name="filiere" placeholder="Filiere" required>
                            <option value="">Sélectionner une filière</option>
                            <option value="Informatique">Informatique</option>
                            <option value="Mathématiques">Mathématiques</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Sections assignées:</label>
                        <select className="form-control" name="sections[]" multiple required>
                            <option value="S001">Section A</option>
                            <option value="S002">Section B</option>
                        </select>
                    </div>
                    <div className="text-right">
                        <button type="submit" className="btn btn-primary">Ajouter</button>
                        <button type="reset" className="btn btn-danger">Annuler</button>
                        <a href='#' className="btn btn-primary">Retour</a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AjouterEnseignant;