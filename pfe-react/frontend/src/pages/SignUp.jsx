import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const SignUp = () => {
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        wilaya: '',
        commune: '',
        codePostal: '',
        grade: '',
        password: '',
        password2: ''
    });
    const [selectedWilaya, setSelectedWilaya] = useState('');
    const [communes, setCommunes] = useState([]);
    const [isAddressOpen, setIsAddressOpen] = useState(false);
    
    // Liste des wilayas algériennes
    const wilayas = [
        "1-Adrar", "2-Chlef", "3-Laghouat", "4-Oum El Bouaghi", "5-Batna", "6-Béjaïa", "7-Biskra", "8-Béchar",
        "Blida", "Bouira", "Tamanrasset", "Tébessa", "Tlemcen", "Tiaret", "Tizi Ouzou", "Alger",
        "Djelfa", "Jijel", "Sétif", "Saïda", "Skikda", "Sidi Bel Abbès", "Annaba", "Guelma",
        "Constantine", "Médéa", "Mostaganem", "M'Sila", "Mascara", "Ouargla", "Oran", "El Bayadh",
        "Illizi", "Bordj Bou Arréridj", "Boumerdès", "El Tarf", "Tindouf", "Tissemsilt", "El Oued",
        "Khenchela", "Souk Ahras", "Tipaza", "Mila", "Aïn Defla", "Naâma", "Aïn Témouchent",
        "Ghardaïa", "Relizane", "Timimoun", "Bordj Badji Mokhtar", "Ouled Djellal", "Béni Abbès",
        "In Salah", "In Guezzam", "Touggourt", "Djanet", "El M'Ghair", "El Meniaa"
    ];
    
    // Mapping des wilayas aux communes (simplifié pour l'exemple)
    const communesByWilaya = {
        "Alger": ["Alger Centre", "Bab El Oued", "El Harrach", "Bir Mourad Raïs", "Hussein Dey"],
        "Oran": ["Oran", "Bir El Djir", "Es Senia", "Arzew", "Aïn El Turk"],
        "Constantine": ["Constantine", "El Khroub", "Hamma Bouziane", "Didouche Mourad", "Aïn Smara"],
        // Ajoutez d'autres wilayas et leurs communes selon vos besoins
    };

    useEffect(() => {
        if (selectedWilaya && communesByWilaya[selectedWilaya]) {
            setCommunes(communesByWilaya[selectedWilaya]);
        } else {
            setCommunes([]);
        }
    }, [selectedWilaya]);

    const toggleAddress = () => {
        setIsAddressOpen(!isAddressOpen);
    };

    const handleWilayaChange = (e) => {
        const wilaya = e.target.value;
        setSelectedWilaya(wilaya);
        // Mettre à jour également le formData
        setFormData({
            ...formData,
            wilaya: wilaya
        });
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleCommuneChange = (e) => {
        const commune = e.target.value;
        setFormData({
            ...formData,
            commune: commune
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
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header bg-primary text-white">
                            <h3 className="text-center">Créer un compte</h3>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="form-group mb-3">
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        name="nom" 
                                        placeholder="Nom" 
                                        value={formData.nom} 
                                        onChange={handleChange}
                                        required 
                                    />
                                </div>
                                <div className="form-group mb-3">
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        name="prenom" 
                                        placeholder="Prénom" 
                                        value={formData.prenom} 
                                        onChange={handleChange}
                                        required 
                                    />
                                </div>
                                <div className="form-group mb-3">
                                    <input 
                                        type="email" 
                                        className="form-control" 
                                        name="email" 
                                        placeholder="Email" 
                                        value={formData.email} 
                                        onChange={handleChange}
                                        required 
                                    />
                                </div>
                                <div className="form-group mb-3">
                                    <input 
                                        type="tel" 
                                        className="form-control" 
                                        name="telephone" 
                                        placeholder="Telephone" 
                                        value={formData.telephone} 
                                        onChange={handleChange}
                                        required 
                                    />
                                </div>
                                
                                {/* Section d'adresse déroulante */}
                                <div className="card mb-4">
                                    <div 
                                        className="card-header bg-light d-flex justify-content-between align-items-center" 
                                        onClick={toggleAddress}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <h5 className="mb-0">Adresse</h5>
                                        <span className="accordion-icon">
                                            {isAddressOpen ? 
                                                <i className="fas fa-chevron-up"></i> : 
                                                <i className="fas fa-chevron-down"></i>
                                            }
                                        </span>
                                    </div>
                                    <div className={`card-body collapse ${isAddressOpen ? 'show' : ''}`}>
                                        <div className="form-group mb-3">
                                            <label className="form-label">Wilaya</label>
                                            <select 
                                                className="form-control" 
                                                name="wilaya" 
                                                value={selectedWilaya}
                                                onChange={handleWilayaChange}
                                                required
                                            >
                                                <option value="">Sélectionner une wilaya</option>
                                                {wilayas.map((wilaya, index) => (
                                                    <option key={index} value={wilaya}>{wilaya}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="form-group mb-3">
                                            <label className="form-label">Commune</label>
                                            <select 
                                                className="form-control" 
                                                name="commune"
                                                value={formData.commune}
                                                onChange={handleCommuneChange}
                                                disabled={!selectedWilaya || communes.length === 0}
                                                required
                                            >
                                                <option value="">Sélectionner une commune</option>
                                                {communes.map((commune, index) => (
                                                    <option key={index} value={commune}>{commune}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="form-group mb-3">
                                            <label className="form-label">Code Postal</label>
                                            <input 
                                                type="number" 
                                                className="form-control" 
                                                name="codePostal" 
                                                placeholder="Code Postal"
                                                value={formData.codePostal}
                                                onChange={handleChange}
                                                required 
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group mb-3">
                                    <select 
                                        className="form-control" 
                                        name="grade"
                                        value={formData.grade}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Sélectionner un grade</option>
                                        <option value="Professeur">Professeur</option>
                                        <option value="Maitre de conférence A">Maitre de conférence A</option>
                                        <option value="Maitre de conférence B">Maitre de conférence B</option>
                                        <option value="Maitre assistant">Maitre assistant</option>
                                    </select>
                                </div>
                                <div className="form-group mb-3">
                                    <input 
                                        type="password" 
                                        className="form-control" 
                                        name="password" 
                                        placeholder="Mot de passe" 
                                        value={formData.password} 
                                        onChange={handleChange}
                                        required 
                                    />
                                </div>
                                <div className="form-group mb-3">
                                    <input 
                                        type="password" 
                                        className="form-control" 
                                        name="password2" 
                                        placeholder="Confirmer le mot de passe" 
                                        value={formData.password2} 
                                        onChange={handleChange}
                                        required 
                                    />
                                </div>
                                <div className="text-center">
                                    <button type="submit" className="btn btn-primary">Créer un compte</button>
                                    <p className="mt-3">Vous avez un compte? <Link to="/SignIn">Se connecter</Link></p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;