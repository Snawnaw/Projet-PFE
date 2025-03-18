import React from 'react';

const SignIn = () => {
    return (
        <div className="sign-in">
            <div className="sign-in-container">
            <h1>Créer un compte</h1>
            <form>
                <div className="form-group">
                    <input type="text" className="form-control" name="nom" placeholder="Nom" />
                </div>
                <div className="form-group">
                    <input type="text" className="form-control" name="prenom" placeholder="Prénom" />
                </div>
                <div className="form-group">
                    <input type="email" className="form-control" name="email" placeholder="Email" />
                </div>
                <div className="form-group">
                    <input type="tel" className="form-control" name="telephone" placeholder="Telephone" />
                </div>
                <div className="form-group">
                    <input type="text" className="form-control" name="grade" placeholder="Grade" />
                </div>
                <div className="form-group">
                    <input type="password" className="form-control" name="password" id="password" placeholder="Mot de passe" />
                </div>
                <div className="form-group">
                    <input type="password" className="form-control" name="password2" id="password2" placeholder="Confirmer le mot de passe" />
                </div>
                <div className="text-center">
                    <button type="submit" class="btn btn-primary" id="submit">Créer un compte</button>
                    <p>Vous avez un compte ? <a href="Connexion.html">Se connecter</a></p>
                </div>
            </form>
            </div>
        </div>
    );
};

export default SignIn;