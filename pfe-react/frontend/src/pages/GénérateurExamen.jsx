import React, { useEffect, useState } from 'react';

const GénérateurExamen = () => {
    const [selectedFiliere, setSelectedFiliere] = useState('');
    const [selectedModule, setSelectedModule] = useState('');
    const [examType, setExamType] = useState('');
    const [examDate, setExamDate] = useState('');
    const [duration, setDuration] = useState(60);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const [filieres, setFilieres] = useState([]);
    const [sections, setSections] = useState([]);
    const [modules, setModules] = useState([]);
    

    const modulesByFiliere = {
        'GI': [
            { id: 'JAVA', name: 'Programmation Java' },
            { id: 'BDD', name: 'Base de données' },
            { id: 'WEB', name: 'Développement Web' }
        ],
        'GC': [
            { id: 'STR', name: 'Structures' },
            { id: 'MAT', name: 'Matériaux' }
        ],
        'GE': [
            { id: 'ELEC', name: 'Électronique' },
            { id: 'AUTO', name: 'Automatisme' }
        ]
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission
    };

    return (
        <div className="container">
            {/* Quick Actions Card 
            <div className="card mb-3">
                <div className="card-body">
                    <h3>Actions Rapides</h3>
                    <div className="btn-group">
                        <button className="btn btn-primary me-2">Créer un Nouvel Examen</button>
                        <button className="btn btn-success me-2">Générer un QCM</button>
                        <button className="btn btn-primary">Banque de Questions</button>
                    </div>
                </div>
            </div>*/}

                        <div className="card mb-3">
                            <div className="card-body">
                                <h3>Créer un Nouvel Examen</h3>
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label">Filière</label>
                                        <select 
                                            className="form-control"
                                            value={selectedFiliere}
                                            onChange={(e) => setSelectedFiliere(e.target.value)}
                                        >
                                            <option value="">Sélectionner une filière</option>
                                            <option value="GI">Génie Informatique</option>
                                            <option value="GC">Génie Civil</option>
                                            <option value="GE">Génie Électrique</option>
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Module</label>
                                        <select 
                                            className="form-control"
                                            value={selectedModule}
                                            onChange={(e) => setSelectedModule(e.target.value)}
                                            disabled={!selectedFiliere}
                                        >
                                            <option value="">Sélectionner un module</option>
                                            {selectedFiliere && modulesByFiliere[selectedFiliere].map(module => (
                                                <option key={module.id} value={module.id}>
                                                    {module.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Type d'Examen</label>
                                        <select 
                                            className="form-control"
                                            value={examType}
                                            onChange={(e) => setExamType(e.target.value)}
                                        >
                                            <option value="final">Examen Final</option>
                                            <option value="cc">Contrôle Continu</option>
                                            <option value="tp">TP</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="form-label">Difficulté</label>
                                        <select className="form-select mb-3" aria-label="Sélectionner la difficulté">
                                            <option selected>Sélectionner la difficulté</option>
                                            <option value="facile">Facile</option>
                                            <option value="moyen">Moyen</option>
                                            <option value="difficile">Difficile</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="form-label">Nombre de questions</label>
                                        <input 
                                            type="number"
                                            className="form-control mb-3"
                                            min="1"
                                            max="30"
                                            step="1"
                                            defaultValue="1"
                                            aria-label="Nombre de questions"
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Date de l'Examen</label>
                                        <input 
                                            type="datetime-local"
                                            className="form-control"
                                            value={examDate}
                                            onChange={(e) => setExamDate(e.target.value)}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Durée (minutes)</label>
                                        <input 
                                            type="number"
                                            className="form-control"
                                            value={duration}
                                            onChange={(e) => setDuration(e.target.value)}
                                            placeholder="60"
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Format d'examen</label>
                                        <select className="form-select mb-3" aria-label="Sélectionner le type d'examen">
                                            <option selected>Sélectionner le format de l'examen</option>
                                            <option value="WEB">WEB</option>
                                            <option value="PDF à imprimer">PDF à imprimer</option>
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <button type="submit" className="btn btn-primary me-2">Créer l'Examen</button>
                                        <button type="reset" className="btn btn-danger">Réinitialiser</button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Exams Table */}
            <div className="card mb-3">
                <div className="card-body">
                    <h3>Examens Planifiés</h3>
                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Titre</th>
                                    <th>Filière</th>
                                    <th>Module</th>
                                    <th>Date</th>
                                    <th>Type</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Examen Final - Java</td>
                                    <td>Génie Informatique</td>
                                    <td>Programmation Java</td>
                                    <td>2024-01-20</td>
                                    <td>Final</td>
                                    <td>
                                        <button className="btn btn-primary btn-sm me-2">Éditer</button>
                                        <button className="btn btn-danger btn-sm">Supprimer</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GénérateurExamen;