import React from 'react';

const GénérerExamen = () => {
    return (
        <div className="container mt-5">
            <div className="card">
                <div className="card-body">
                    <div className="form-group mb-3">
                        <select className="form-select mb-3" aria-label="Sélectionner la difficulté">
                            <option selected>Sélectionner la difficulté</option>
                            <option value="facile">Facile</option>
                            <option value="moyen">Moyen</option>
                            <option value="difficile">Difficile</option>
                        </select>
                        <input type="text" className="form-control" placeholder="Saisissez votre question" />
                        <div className="mt-3">
                            <div className="form-check">
                                <input type="radio" className="form-check-input" name="answer" value="answer1" id="answer1" />
                                <label className="form-check-label" htmlFor="answer1">Réponse 1</label>
                            </div>
                            <div className="form-check">
                                <input type="radio" className="form-check-input" name="answer" value="answer2" id="answer2" />
                                <label className="form-check-label" htmlFor="answer2">Réponse 2</label>
                            </div>
                            <div className="form-check">
                                <input type="radio" className="form-check-input" name="answer" value="answer3" id="answer3" />
                                <label className="form-check-label" htmlFor="answer3">Réponse 3</label>
                            </div>
                            <button type="button" className="btn btn-success">Ajouter une réponse</button>
                        </div>
                    </div>
                    <div className="d-flex gap-2">
                        <button type="button" className="btn btn-primary">Ajouter une question</button>
                    </div>
                </div>
            </div>
            <button type="submit" className="btn btn-success">Valider</button>
            <button type="reset" className="btn btn-secondary">Annuler</button>
        </div>
    );
}

export default GénérerExamen;