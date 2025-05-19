import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AjouterFiliere = () => {
    const [filiere, setFiliere] = useState('');
    const [code, setCode] = useState('');
    const [cycle, setCycle] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        // Validation
        if (!filiere || !code || !cycle) {
            setError('Veuillez remplir tous les champs');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/v1/filiere/FiliereCreate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    nom: filiere,
                    code: code,
                    cycle: cycle
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Une erreur est survenue');
            }

            setSuccess(true);
            toast.success('Filière ajoutée avec succès !', {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Slide,
            });

            // Reset form
            setFiliere('');
            setCode('');
            setCycle('');
            setSuccess(true);
        } catch (error) {
            console.error('Error:', error);
            setError(error.message || "Une erreur est survenue lors de l'ajout de la filière");
            toast.error(error.message || "Une erreur est survenue lors de l'ajout de la filière", {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Slide,
            });
        }
    };

    const handleReset = () => {
        setFiliere('');
        setCode('');
        setCycle('');
        setError(null);
        setSuccess(false);
    };

    return (
        <div className="container mt-5">
            <ToastContainer />
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header bg-primary text-white">
                            <h3 className="text-center">Ajouter une filière</h3>
                        </div>
                        <div className="card-body">
                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            )}
                            <form onSubmit={handleSubmit}>
                                <div className="form-group mb-3">
                                    <label className="form-label">Nom de la Filière</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        placeholder="Ex: Génie Informatique"
                                        value={filiere}
                                        onChange={(e) => setFiliere(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="form-group mb-3">
                                    <label className="form-label">Code de la Filière</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        placeholder="Ex: GI"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="form-group mb-3">
                                    <label className="form-label">Cycle</label>
                                    <select 
                                        className="form-control" 
                                        value={cycle} 
                                        onChange={(e) => setCycle(e.target.value)}
                                        required
                                    >
                                        <option value="" disabled>Choisissez un cycle</option>
                                        <option value="Licence">Licence</option>
                                        <option value="Master">Master</option>
                                    </select>
                                </div>

                                <div className="text-center">
                                    <Button type="submit" variant="primary" className="me-2">Ajouter</Button>
                                    <button type="reset" className="btn btn-danger me-2" onClick={handleReset}>Annuler</button>
                                    <button type="button" className="btn btn-secondary" onClick={() => window.history.back()}>Retourner</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AjouterFiliere;