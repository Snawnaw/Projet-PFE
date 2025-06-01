import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import QuestionForm from '../components/QuestionForm';

const CreerQuestion = () => {
    const [userRole, setUserRole] = useState('');
    const [userModule, setUserModule] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://localhost:5000/api/v1/auth/me', {
                    credentials: 'include'
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }

                const data = await response.json();
                // Correction ici :
                setUserRole(data.user?.role || 'admin');
                setUserModule(data.user?.modules || []);
            } catch (error) {
                console.error('Error fetching user data:', error);
                setUserRole('admin');
                setUserModule('');
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
            <QuestionForm userRole={userRole} userModules={userModule} />
        </div>
    );
}

export default CreerQuestion;