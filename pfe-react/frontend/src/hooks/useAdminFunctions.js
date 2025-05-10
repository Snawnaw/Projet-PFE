import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { auth } from '../services/api';

export const useAdminData = () => {
    const navigate = useNavigate();
    const [sectionsData, setSectionsData] = useState([]);
    const [sallesData, setSallesData] = useState([]);
    const [filieresData, setFilieresData] = useState([]);
    const [modulesData, setModulesData] = useState([]);
    const [adminData, setAdminData] = useState([]);
    const [teacherData, setTeacherData] = useState([]);
    const [questionsData, setQuestionsData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [loadingQuestions, setLoadingQuestions] = useState(false);

    const loadData = async (view) => {
        setLoading(true);
        setError('');
        
        try {
            switch (view) {
                case 'profile':
                    if (!adminData) {
                        const response = await API.get('');
                        setAdminData(response.data.admin);
                    }
                    break;
                    
                case 'sections':
                    if (sectionsData.length === 0) {
                        const response = await API.get('/section/AllSections');
                        setSectionsData(response.data.sections);
                    }
                    break;
                    
                case 'enseignants':
                    if (teacherData.length === 0) {
                        const response = await API.get('/enseignant/AllEnseignant');
                        setTeacherData(response.data.enseignants);
                    }
                    break;
                    
                case 'salles':
                    if (sallesData.length === 0) {
                        const response = await API.get('/salle/AllSalle');
                        setSallesData(response.data.salles);
                    }
                    break;
                    
                case 'filieres':
                    if (filieresData.length === 0) {
                        const response = await API.get('/filiere/AllFiliere');
                        setFilieresData(response.data.filieres);
                    }
                    break;

                case 'modules':
                    if (modulesData.length === 0) {
                        const response = await API.get('/module/AllModules');
                        setModulesData(response.data.modules);
                    }
                    break;
            }
        } catch (err) {
            setError(`Erreur lors du chargement des données: ${err.response?.data?.message || err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await auth.logout();
            navigate('/signin');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const fetchQuestions = async (moduleId) => {
        setLoadingQuestions(true);
        try {
            const response = await API.get(moduleId 
                ? `/question/module/${moduleId}`
                : '/question');
            
            const questions = Array.isArray(response.data?.questions) 
                ? response.data.questions.map(q => ({
                    ...q,
                    module: q.module || { _id: null, nom: 'N/A' }
                }))
                : [];
    
            setQuestionsData(questions);
        } catch (error) {
            console.error('Error fetching questions:', error);
            setError('Error loading questions');
            setQuestionsData([]);
        } finally {
            setLoadingQuestions(false);
        }
    };

    return {
        sectionsData,
        sallesData,
        filieresData,
        modulesData,
        adminData,
        teacherData,
        questionsData,
        loading,
        error,
        loadingQuestions,
        loadData,
        handleLogout,
        fetchQuestions
    };
};
