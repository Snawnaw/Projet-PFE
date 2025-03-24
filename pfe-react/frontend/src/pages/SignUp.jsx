import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SignUp = () => {
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        grade: '',
        password: '',
        password2: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.password !== formData.password2) {
            alert("Les mots de passe ne correspondent pas");
            return;
        }
        // TODO: Add API call to handle registration
        console.log(formData);
    };

    return (
        <div className="CreationCompte">
            <h1>Créer un compte</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input type="text" className="form-control" name="nom" placeholder="Nom" value={formData.nom} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <input type="text" className="form-control" name="prenom" placeholder="Prénom" value={formData.prenom} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <input type="email" className="form-control" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <input type="tel" className="form-control" name="telephone" placeholder="Telephone" value={formData.telephone} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <select className="form-control" name="grade" placeholder="Grade" required>
                            <option value="">Chef departement</option>
                            <option value="Informatique">Maitre de conférance</option>
                    </select>
                </div>
                <div className="form-group">
                    <input type="password" className="form-control" name="password" placeholder="Mot de passe" value={formData.password} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <input type="password" className="form-control" name="password2" placeholder="Confirmer le mot de passe" value={formData.password2} onChange={handleChange} />
                </div>
                <div className="text-center">
                    <button type="submit" className="btn btn-primary">Créer un compte</button>
                    <p>Vous avez un compte ? <Link to="/SignIn">Se connecter</Link></p>
                </div>
            </form>
        </div>
    );
};

export default SignUp;