import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ModifierFiliere = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [filiere, setFiliere] = useState('');
    const [code, setCode] = useState('');
    const [cycle, setCycle] = useState('');
    const [niveau, setNiveau] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFiliere = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/v1/filiere/${id}`, {
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error('Erreur lors du chargement de la filière');
                }

                const data = await response.json();
                const filiereData = data.filiere;
                
                setFiliere(filiereData.nom || '');
                setCode(filiereData.code || '');
                setCycle(filiereData.cycle || '');
                setNiveau(filiereData.niveau || '');
                setLoading(false);
            } catch (error) {
                console.error('Error:', error);
                setError(error.message || 'Erreur lors du chargement de la filière');
                setLoading(false);
            }
        };

        if (id) {
            fetchFiliere();
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        // Validation
        if (!filiere || !code || !cycle || !niveau) {
            setError('Veuillez remplir tous les champs');
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/v1/filiere/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    nom: filiere,
                    code: code,
                    cycle: cycle,
                    niveau: niveau
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Une erreur est survenue');
            }

            setSuccess(true);
            toast.success('Filière modifiée avec succès !', {
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

            // Rediriger après un délai
            setTimeout(() => {
                navigate('/Admin');
            }, 2500);
        } catch (error) {
            console.error('Error:', error);
            setError(error.message || "Une erreur est survenue lors de la modification de la filière");
            toast.error(error.message || "Une erreur est survenue lors de la modification de la filière", {
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
        // Reset to original values by refetching
        window.location.reload();
    };

    if (loading) {
        return (
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card">
                            <div className="card-body text-center">
                                <div className="spinner-border" role="status">
                                    <span className="visually-hidden">Chargement...</span>
                                </div>
                                <p className="mt-2">Chargement des données...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <ToastContainer />
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header bg-warning text-dark">
                            <h3 className="text-center">Modifier la filière</h3>
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

                                <div className="form-group mb-3">
                                    <label className="form-label">Niveau</label>
                                    <select 
                                        className="form-control" 
                                        value={niveau} 
                                        onChange={(e) => setNiveau(e.target.value)}
                                        required
                                    >
                                        <option value="" disabled>Choisissez un niveau</option>
                                        <option value="L1">L1</option>
                                        <option value="L2">L2</option>
                                        <option value="L3">L3</option>
                                        <option value="M1">M1</option>
                                        <option value="M2">M2</option>
                                    </select>
                                </div>

                                <div className="text-center">
                                    <Button type="submit" variant="warning" className="me-2">Modifier</Button>
                                    <button type="button" className="btn btn-danger me-2" onClick={handleReset}>Annuler</button>
                                    <button type="button" className="btn btn-secondary" onClick={() => navigate('/Admin')}>Retourner</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModifierFiliere;