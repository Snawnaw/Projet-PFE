import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API from '../services/api';

const ModifierQuestion = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [question, setQuestion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                const res = await API.get(`/question/${id}`);
                setQuestion(res.data.question);
            } catch (err) {
                setError("Erreur lors du chargement de la question");
            } finally {
                setLoading(false);
            }
        };
        fetchQuestion();
    }, [id]);

    const handleChange = (e) => {
        setQuestion({ ...question, [e.target.name]: e.target.value });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            await API.put(`/question/${id}`, question);
            toast.success('Question modifiée avec succès !', {
                position: "top-center",
                autoClose: 2000,
                transition: Slide,
            });
            setTimeout(() => navigate('/BanqueDeQuestions'), 2000);
        } catch (err) {
            toast.error("Erreur lors de la modification", {
                position: "top-center",
                autoClose: 2000,
                transition: Slide,
            });
        }
    };

    if (loading) return <div>Chargement...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;
    if (!question) return null;

    return (
        <div className="container mt-5">
            <ToastContainer />
            <h3>Modifier la question</h3>
            <form onSubmit={handleSave}>
                <div className="mb-3">
                    <label>Enoncé</label>
                    <input
                        type="text"
                        className="form-control"
                        name="enonce"
                        value={question.enonce || ''}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label>Difficulté</label>
                    <select
                        className="form-control"
                        name="difficulte"
                        value={question.difficulte || ''}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Choisir</option>
                        <option value="Facile">Facile</option>
                        <option value="Moyen">Moyen</option>
                        <option value="Difficile">Difficile</option>
                    </select>
                </div>
                {/* Ajoute ici d'autres champs selon ton modèle */}
                <button type="submit" className="btn btn-warning me-2">Enregistrer</button>
                <button type="button" className="btn btn-secondary" onClick={() => navigate('/BanqueDeQuestions')}>Annuler</button>
            </form>
        </div>
    );
};

export default ModifierQuestion;
