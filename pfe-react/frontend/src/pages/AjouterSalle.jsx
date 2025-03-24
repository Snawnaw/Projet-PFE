import React from 'react';

function AjouterSalle() {
    return (
        <div className="AjouterSalle">
            <h1>Ajouter une salle</h1>
            <form>
                <div class="form-group">
                    <input type="text" class="form-control" name="numero" placeholder="Numéro de salle" required />
                </div>
                <div class="form-group">
                    <select class="form-control" name="type" required>
                        <option value="">Type de salle</option>
                        <option value="cours">Salle de cours</option>
                        <option value="td">Salle TD</option>
                        <option value="tp">Laboratoire</option>
                        <option value="amphi">Amphithéâtre</option>
                    </select>
                </div>
                <div class="form-group">
                    <input type="number" class="form-control" name="capacite" placeholder="Capacité" required />
                </div>
                <div class="form-group">
                    <select class="form-control" name="departement" required>
                        <option value="">Département</option>
                        <option value="Informatique">Informatique</option>
                        <option value="Mathématiques">Mathématiques</option>
                    </select>
                </div>
                <div class="text-right">
                    <button type="submit" class="btn btn-primary">Ajouter</button>
                    <button type="reset" class="btn btn-danger">Annuler</button>
                    <a href='#'  class="btn btn-primary">Retour</a>
                </div>
            </form>
        </div>
    );
}

export default AjouterSalle;