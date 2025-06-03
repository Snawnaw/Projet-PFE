import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import QuestionForm from '../components/QuestionForm';

const CreerQuestion = () => {
    const [userRole, setUserRole] = useState('');
    const [userModules, setUserModules] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            try {
                // 1. Récupérer l'utilisateur connecté
                const response = await fetch('http://localhost:5000/api/v1/auth/me', {
                    credentials: 'include'
                });
                if (!response.ok) throw new Error('Failed to fetch user data');
                const data = await response.json();
                setUserRole(data.user?.role || 'admin');

                // 2. Si enseignant, récupérer ses modules
                if (data.user?.role === 'enseignant') {
                    // Récupérer l'objet enseignant par email
                    const enseignantRes = await fetch(`http://localhost:5000/api/v1/enseignant/byEmail/${data.user.email}`, {
                        credentials: 'include'
                    });
                    const enseignantData = await enseignantRes.json();
                    const enseignantId = enseignantData.enseignant?._id;
                    if (enseignantId) {
                        // Récupérer ses modules
                        const modulesRes = await fetch(`http://localhost:5000/api/v1/module/modules/byEnseignant/${enseignantId}`, {
                            credentials: 'include'
                        });
                        const modulesData = await modulesRes.json();
                        setUserModules(modulesData.modules || []);
                    } else {
                        setUserModules([]);
                    }
                } else {
                    // Si admin, récupérer tous les modules
                    const modulesRes = await fetch('http://localhost:5000/api/v1/module/AllModules', {
                        credentials: 'include'
                    });
                    const modulesData = await modulesRes.json();
                    setUserModules(modulesData.modules || []);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                setUserRole('admin');
                setUserModules([]);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    if (loading) {
        return <div>Chargement des données utilisateur...</div>;
    }

    return (
        <div>
            <QuestionForm userRole={userRole} userModules={userModules} />
        </div>
    );
}

export default CreerQuestion;