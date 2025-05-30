import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import ExamWeb from './ExamWeb';
import axios from 'axios';
import { ExamPDF } from '../components/ExamPDF';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';

const GénérateurExamen = () => {
    // Existing state
    const [selectedFiliere, setSelectedFiliere] = useState('');
    const [selectedModule, setSelectedModule] = useState('');
    const [examType, setExamType] = useState('');
    const [examDate, setExamDate] = useState('');
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(false);
    const [duration, setDuration] = useState(60);
    const [questions, setQuestions] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [filieres, setFilieres] = useState([]);
    const [sections, setSections] = useState([]);
    const [modules, setModules] = useState([]);
    const [selectedSection, setSelectedSection] = useState('');
    const [selectedEnseignant, setSelectedEnseignant] = useState('');
    const [enseignants, setEnseignants] = useState([]);
    const [generatedLink, setGeneratedLink] = useState('');
    const [examFormat, setExamFormat] = useState(''); // 'WEB' or 'PDF'
    const [nbQuestions, setnbQuestions] = useState(1); // Number of questions to generate
    const [difficulte, setdifficulte] = useState(''); // difficulte level
    const [selectedExam, setSelectedExam] = useState('');
    // Fetch initial data (unchanged)
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [filieresRes, sectionsRes, modulesRes, enseignantsRes] = await Promise.all([
                    fetch('http://localhost:5000/api/v1/filiere/AllFiliere', { credentials: 'include' }),
                    fetch('http://localhost:5000/api/v1/section/AllSections', { credentials: 'include' }),
                    fetch('http://localhost:5000/api/v1/module/AllModules', { credentials: 'include' }),
                    fetch('http://localhost:5000/api/v1/enseignant/AllEnseignant', { credentials: 'include' })
                ]);

                if (!filieresRes.ok || !sectionsRes.ok || !modulesRes.ok || !enseignantsRes.ok) {
                    throw new Error('Failed to fetch initial data');
                }

                const [filieresData, sectionsData, modulesData, enseignantsData] = await Promise.all([
                    filieresRes.json(),
                    sectionsRes.json(),
                    modulesRes.json(),
                    enseignantsRes.json()
                ]);

                setFilieres(filieresData.filieres);
                setSections(sectionsData.sections);
                setModules(modulesData.modules);
                setEnseignants(enseignantsData.enseignants);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchInitialData();
    }, []);

    const fetchExams = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/v1/exam', {
                credentials: 'include'
            });
            const data = await response.json();
            setExams(data.exams || []);
        } catch (error) {
            setError(error.message);
        }
    };

    useEffect(() => {
        fetchExams();
    }, []);

    // Handle filiere change (unchanged)
    const handleFiliereChange = async (e) => {
        const selectedFiliere = e.target.value;
        setSelectedFiliere(selectedFiliere);
        setSelectedSection('');

        try {
            const response = await fetch(`http://localhost:5000/api/v1/section/SectionsByFiliere/${selectedFiliere}`, {
                credentials: 'include',
            });
            if (!response.ok) throw new Error('Échec du chargement des sections');
            const data = await response.json();
            setSections(data.sections);
        } catch (error) {
            setError(error.message);
        }
    };

    // NEW: Fetch questions based on selected module, difficulte and number
    const fetchQuestions = async () => {
        if (!selectedModule) {
            setError('Veuillez sélectionner un module');
            return false;
        }

        try {
            const response = await fetch(
                `http://localhost:5000/api/v1/question/module/${selectedModule}?limit=${nbQuestions}&difficulte=${difficulte}`,
                { credentials: 'include' }
            );

            if (!response.ok) throw new Error('Échec de la récupération des questions');

            const data = await response.json();

            if (!data.questions || data.questions.length === 0) {
                setQuestions([]); // <-- important pour désactiver le bouton
                setError('Aucune question disponible pour les critères sélectionnés');
                return false;
            }

            setQuestions(data.questions); // Update the questions state
            setError(null);
            return true;
        } catch (error) {
            setQuestions([]); // <-- important pour désactiver le bouton
            setError(error.message);
            return false;
        }
    };

    // NEW: Generate exam link
    const generateExamLink = async (examId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/v1/exam/${examId}/generate-link`, {
            method: 'GET',
            credentials: 'include'
            });
            const data = await response.json();
            if (data.success) {
            setGeneratedLink(data.link);
            toast.success('Exam link generated!');
            console.log('Exam ID:', id);
            console.log('Exam:', exam);
            }
        } catch (error) {
            setError('Failed to generate link');
        }
    };

    // UPDATED: Handle form submission
    const handleSubmitWeb = async (e) => {
        if (e && e.preventDefault) e.preventDefault();
        setError(null);

    try {
        // First fetch questions based on criteria
        const questionsFetched = await fetchQuestions();
        if (!questionsFetched) return;

        // Prepare exam payload
        const examPayload = {
            module: selectedModule,
            filiere: selectedFiliere,
            section: selectedSection,
            enseignant: selectedEnseignant,
            examType: examType.toLowerCase(),
            difficulte: difficulte.toLowerCase(),
            examDate,
            duree: parseInt(duration),
            format: examFormat,
            questions: questions.map(q => q._id) // Send question IDs
        };

        // Use the correct endpoint based on format
        const endpoint = examFormat === 'WEB' 
            ? 'http://localhost:5000/api/v1/exam/generate-web-exam'
            : 'http://localhost:5000/api/v1/exam';

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(examPayload)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to create exam');
        }

        // Refresh exams after creation
        await fetchExams();

        // Handle success
        if (examFormat === 'WEB') {
            // Generate link for web exam
            const linkResponse = await fetch(
                `http://localhost:5000/api/v1/exam/${data.exam._id}/generate-link`, 
                { credentials: 'include' }
            );
            const linkData = await linkResponse.json();
            
            if (linkData.success) {
                setGeneratedLink(linkData.examLink);
                toast.success('Exam link generated successfully!');
            }
        } else {
            // Handle PDF generation
            const pdfGenerated = ExamPDF(data.exam, questions);
            if (pdfGenerated) {
                toast.success('PDF exam generated successfully!');
            }
        }
    } catch (error) {
        console.error('Exam creation error:', error);
        setError(error.message);
        toast.error(error.message);
    }
};

const handleGeneratePDFAnswerKey = async () => {
    if (!selectedExam) {
        toast.error('Please select an exam first');
        return;
    }

    try {
        window.open(
            `http://localhost:5000/api/v1/exam/${selectedExam}/answer-key`,
            '_blank'
        );
    } catch (error) {
        setError(error.message);
        toast.error('Failed to generate answer key');
    }
};

// Handler for generating WEB answer key
const handleGenerateWebAnswerKey = async () => {
    if (!selectedExam) {
        toast.error('Please select an exam first');
        return;
    }

    try {
        const response = await fetch(
            `http://localhost:5000/api/v1/exam/${selectedExam}/generate-link`,
            { credentials: 'include' }
        );
        const data = await response.json();
        
        if (data.success) {
            window.open(data.examLink, '_blank');
        }
    } catch (error) {
        setError(error.message);
        toast.error('Failed to generate answer key');
    }
};

    // Suppression de fetchQuestions et de la validation sur questions.length

    const handleSubmitPDF = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setError(null);
    setLoading(true);

    try {
        // First fetch questions based on criteria
        const questionsFetched = await fetchQuestions();
        if (!questionsFetched) {
            setLoading(false);
            setError('No questions found for the selected criteria');
            return;
        }

        // Prepare exam payload
        const examPayload = {
            module: selectedModule,
            filiere: selectedFiliere,
            section: selectedSection,
            enseignant: selectedEnseignant,
            examType: examType.toLowerCase(),
            difficulte: difficulte.toLowerCase(),
            examDate,
            duree: parseInt(duration),
            format: 'PDF',
            questions: questions.map(q => q._id)
        };

        console.log('Sending exam payload:', examPayload); // Debug log

        // Use the correct endpoint
        const response = await fetch('http://localhost:5000/api/v1/exam', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(examPayload)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to create exam');
        }

        console.log('Exam created successfully:', data); // Debug log
        
        // Fetch the exam with populated questions
        const examResponse = await fetch(`http://localhost:5000/api/v1/exam/${data.exam._id}`, {
            credentials: 'include'
        });
        const examData = await examResponse.json();

        if (!examResponse.ok) {
            throw new Error('Failed to fetch exam details');
        }

        // Generate the PDF with the exam data and questions
        const pdfGenerated = ExamPDF(examData.exam, examData.exam.questions || questions);
        
        if (pdfGenerated) {
            toast.success('PDF exam generated successfully!');
            setSuccess(true);
        } else {
            throw new Error('Failed to generate PDF');
        }
    } catch (error) {
        console.error('Exam creation error:', error);
        setError(error.message);
        toast.error(error.message);
    } finally {
        setLoading(false);
    }
};


    return (
        <div className="container mt-5">
            <ToastContainer />
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card mb-4">
                        <div className="card-header bg-primary text-white">
                            <h3 className="text-center">Générer un examen</h3>
                        </div>
                        <div className="card-body">
                            {error && <div className="alert alert-danger">{error}</div>}
                            {success && <div className="alert alert-success">Examen généré avec succès!</div>}
                            
                            <form onSubmit={handleSubmitWeb}>
                                {/* Existing form fields (unchanged) */}
                                <div className="form-group mb-3">
                                    <label className="form-label">Filière</label>
                                    <select 
                                        className="form-control"
                                        value={selectedFiliere}
                                        onChange={handleFiliereChange}
                                        required
                                    >
                                        <option value="">Sélectionner une filière</option>
                                        {filieres.map(f => (
                                            <option key={f._id} value={f._id}>{f.nom}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group mb-3">
                                    <label className="form-label">Section</label>
                                    <select 
                                        className="form-control"
                                        value={selectedSection}
                                        onChange={(e) => setSelectedSection(e.target.value)}
                                        required
                                    >
                                        <option value="">Sélectionner une Section</option>
                                        {sections.map(s => (
                                            <option key={s._id} value={s._id}>{s.nom}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group mb-3">
                                    <label className="form-label">Module</label>
                                    <select 
                                        className="form-control"
                                        value={selectedModule}
                                        onChange={(e) => setSelectedModule(e.target.value)}
                                        required
                                    >
                                        <option value="">Sélectionner un module</option>
                                        {modules.map(m => (
                                            <option key={m._id} value={m._id}>{m.nom}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group mb-3">
                                    <label className="form-label">Enseignant</label>
                                    <select 
                                        className="form-control"
                                        value={selectedEnseignant}
                                        onChange={(e) => setSelectedEnseignant(e.target.value)}
                                        required
                                    >
                                        <option value="">Sélectionner un enseignant</option>
                                        {enseignants.map(e => (
                                            <option key={e._id} value={e._id}>{e.nom}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group mb-3">
                                    <label className="form-label">Type d'Examen</label>
                                    <select 
                                        className="form-control"
                                        value={examType}
                                        onChange={(e) => setExamType(e.target.value)}
                                        required
                                    >
                                        <option value="">Sélectionner le type</option>
                                        <option value="final">Examen Final</option>
                                        <option value="cc">Contrôle Continu</option>
                                        <option value="tp">TP</option>
                                    </select>
                                </div>

                                {/* NEW: difficulte selection */}
                                <div className="form-group mb-3">
                                    <label className="form-label">Difficulté</label>
                                    <select 
                                        className="form-control" 
                                        value={difficulte}
                                        onChange={(e) => setdifficulte(e.target.value)}
                                        required
                                    >
                                        <option value="">Sélectionner la difficulté</option>
                                        <option value="facile">Facile</option>
                                        <option value="moyen">Moyen</option>
                                        <option value="difficile">Difficile</option>
                                    </select>
                                </div>

                                {/* UPDATED: Number of questions input */}
                                <div className="form-group mb-3">
                                    <label className="form-label">Nombre de questions</label>
                                    <input 
                                        type="number"
                                        className="form-control"
                                        min="1"
                                        max="30"
                                        step="1"
                                        value={nbQuestions}
                                        onChange={(e) => setnbQuestions(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="form-group mb-3">
                                    <label className="form-label">Date de l'Examen</label>
                                    <input 
                                        type="datetime-local"
                                        className="form-control"
                                        value={examDate}
                                        onChange={(e) => setExamDate(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="form-group mb-3">
                                    <label className="form-label">Durée (minutes)</label>
                                    <input 
                                        type="number"
                                        className="form-control"
                                        value={duration}
                                        onChange={(e) => setDuration(e.target.value)}
                                        placeholder="60"
                                        required
                                    />
                                </div>

                                <div className="text-center">
                                    <button
                                        type="button"
                                        className="btn btn-primary me-2"
                                        onClick={() => {
                                            setExamFormat('WEB');
                                            handleSubmitWeb();
                                        }}
                                    >
                                        Générer Nouvel Examen Web
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-secondary me-2"
                                        onClick={() => {
                                            setExamFormat('PDF');
                                            handleSubmitPDF();
                                        }}
                                    >
                                        Générer Nouvel Examen PDF
                                    </button>
                                    <button type="reset" className="btn btn-danger me-2">
                                        Réinitialiser
                                    </button>
                                    <button type="button" className="btn btn-secondary" onClick={() => window.history.back()}>
                                        Retourner
                                    </button>
                                </div>

                                {/* Add this right after the buttons div but before form closing */}
                                {generatedLink && (
                                    <div className="mt-4 p-3 bg-light rounded">
                                        <h5>Lien d'accès pour les étudiants</h5>
                                        <div className="input-group mb-2">
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={generatedLink}
                                                readOnly
                                            />
                                            <button
                                                className="btn btn-outline-secondary"
                                                type="button"
                                                onClick={() => {
                                                    navigator.clipboard.writeText(generatedLink);
                                                    toast.info('Lien copié dans le presse-papiers!');
                                                }}
                                            >
                                                Copier
                                            </button>
                                        </div>
                                        <small className="text-muted">Partagez ce lien avec vos étudiants pour qu'ils puissent passer l'examen</small>
                                    </div>
                                )}
                            </form>

                            {/* Supprimer la condition d'affichage du message d'avertissement lié à questions.length */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default GénérateurExamen;