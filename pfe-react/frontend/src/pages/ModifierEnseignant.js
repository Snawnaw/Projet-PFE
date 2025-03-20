import React from 'react';

const ModifierEnseignant = () => {
    return (
        <div className="modifier-enseignant">
            <h1>Modifier un enseignant</h1>
            <form>
                <div class="form-group">
                    <input type="text" class="form-control" name="nom" placeholder="Nom" required />
                </div>
                <div class="form-group">
                    <input type="text" class="form-control" name="prenom" placeholder="Prenom" required />
                </div>
                <div class="form-group">
                    <input type="email" class="form-control" name="email" placeholder="Email" required />
                </div>
                <div class="form-group">
                    <input type="tel" class="form-control" name="telephone" placeholder="Telephone" required />
                </div>
                <div class="form-group">
                    <input type="text" class="form-control" name="grade" placeholder="Grade" required />
                </div>
                <div class="form-group">
                    <select class="form-control" name="filiere" required>
                        <option value="">Sélectionner une filière</option>
                        <option value="Informatique">Informatique</option>
                        <option value="Mathématiques">Mathématiques</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Sections assignées:</label>
                    <select class="form-control" name="sections[]" multiple required>
                        <option value="S001">Section A - Informatique</option>
                        <option value="S002">Section B - Mathématiques</option>
                    </select>
                </div>
                <div class="text-right">
                    <button type="submit" class="btn btn-primary">Enregistrer les modifications</button>
                    <button type="reset" class="btn btn-danger">Annuler</button>
                    <a href="AdminAcces.html" class="btn btn-primary">Retour</a>
                </div>
            </form>
        </div>
    );
};

export default ModifierEnseignant;