import React from 'react';

const Connexion = () => {
    return (
        <div className="connexion">
            <h1>Connexion</h1>
            <form>
                <div className="form-group">
                    <input type="email" className="form-control" name="email" placeholder="Email" />
                </div>
                <div className="form-group">
                    <input type="password" className="form-control" name="password" id="password" placeholder="Mot de passe" />
                </div>
                <div className="text-center">
                    <button type="submit" className="btn btn-primary" id="submit">Se connecter</button>
                    <p>Vous n'avez pas un compte ? <a href="Creation de compte.html">Créer un compte</a></p>
                </div>
            </form>
        </div>
    );
};

export default Connexion;