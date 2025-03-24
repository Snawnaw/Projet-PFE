import React from 'react';

const AjouterSection = () => {
    return (
        <div className="AjouterSection">
            <h1>Ajouter une section</h1>
            <form>
                <div class="form-group">
                    <input type="text" class="form-control" name="nom" placeholder="Nom de la section" />
                </div>
                <div class="form-group">
                    <input type="text" class="form-control" name="filiere" placeholder="Filiere" />
                </div>
                <div class="form-group">
                    <input type="text" class="form-control" name="niveau" placeholder="Niveau" />
                </div>
                <div class="form-group">
                    <input type="text" class="form-control" name="annee" placeholder="Annee" />
                </div>
                <div class="form-group">
                    <input type="text" class="form-control" name="nbgroupes" placeholder="Nombre de groupes" />
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