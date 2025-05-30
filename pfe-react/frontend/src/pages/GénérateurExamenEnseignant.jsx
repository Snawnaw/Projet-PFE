import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { ExamPDF } from '../components/ExamPDF';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';

const GénérateurExamenEnseignant = () => {
    const [selectedFiliere, setSelectedFiliere] = useState('');
    const [selectedModule, setSelectedModule] = useState('');
    const [selectedSection, setSelectedSection] = useState('');
    const [examType, setExamType] = useState('');
    const [examDate, setExamDate] = useState('');
    const [duration, setDuration] = useState(60);
    const [filieres, setFilieres] = useState([]);
    const [sections, setSections] = useState([]);
    const [modules, setModules] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [difficulte, setDifficulte] = useState('');
    const [nbQuestions, setNbQuestions] = useState(1);
    const [questions, setQuestions] = useState([]);
    const [selectedEnseignant, setSelectedEnseignant] = useState('');
    const [generatedLink, setGeneratedLink] = useState('');

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                // 1. Récupérer l'utilisateur connecté
                const userRes = await fetch('http://localhost:5000/api/v1/auth/me', { credentials: 'include' });
                const userData = await userRes.json();
                // 2. Récupérer l'enseignant par email
                const enseignantRes = await fetch(`http://localhost:5000/api/v1/enseignant/byEmail/${userData.user.email}`, { credentials: 'include' });
                const enseignantData = await enseignantRes.json();
                setSelectedEnseignant(enseignantData.enseignant._id);

                // 3. Charger ses modules, filières, sections
                const enseignantId = enseignantData.enseignant._id;
                const [modulesRes, filieresRes, sectionsRes] = await Promise.all([
                    fetch(`http://localhost:5000/api/v1/module/modules/byEnseignant/${enseignantId}`, { credentials: 'include' }),
                    fetch(`http://localhost:5000/api/v1/filiere/FiliereByEnseignant/${enseignantId}`, { credentials: 'include' }),
                    fetch(`http://localhost:5000/api/v1/section/SectionsByEnseignant/${enseignantId}`, { credentials: 'include' }),
                ]);
                const [modulesData, filieresData, sectionsData] = await Promise.all([
                    modulesRes.json(),
                    filieresRes.json(),
                    sectionsRes.json(),
                ]);
                setModules(modulesData.modules || []);
                setFilieres(filieresData.filieres || []);
                setSections(sectionsData.sections || []);
            } catch (error) {
                setError("Erreur lors du chargement des données");
            }
        };
        fetchInitialData();
    }, []);

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
                setQuestions([]);
                setError('Aucune question disponible pour les critères sélectionnés');
                return false;
            }
            setQuestions(data.questions);
            setError(null);
            return true;
        } catch (error) {
            setQuestions([]);
            setError(error.message);
            return false;
        }
    };

    const handleSubmitWeb = async (e) => {
        if (e) e.preventDefault();
        setError(null);
        setSuccess(false);

        const questionsFetched = await fetchQuestions();
        if (!questionsFetched) return;

        const examPayload = {
            module: selectedModule,
            filiere: selectedFiliere,
            section: selectedSection,
            enseignant: selectedEnseignant,
            examType: examType.toLowerCase(),
            difficulte: difficulte.toLowerCase(),
            examDate,
            duree: parseInt(duration),
            format: "WEB",
            questions: questions.map(q => q._id)
        };

        try {
            const response = await fetch('http://localhost:5000/api/v1/exam/generate-web-exam', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(examPayload)
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Erreur lors de la génération');

            // Générer le lien
            if (data.exam && data.exam._id) {
                const linkResponse = await fetch(
                    `http://localhost:5000/api/v1/exam/${data.exam._id}/generate-link`,
                    { credentials: 'include' }
                );
                const linkData = await linkResponse.json();
                if (linkData.success) {
                    setGeneratedLink(linkData.examLink);
                    toast.success('Lien généré avec succès !');
                }
            }
            setSuccess(true);
        } catch (err) {
            setError(err.message);
            toast.error(err.message);
        }
    };

    const handleSubmitPDF = async (e) => {
        if (e) e.preventDefault();
        setError(null);
        setSuccess(false);

        const questionsFetched = await fetchQuestions();
        if (!questionsFetched) return;

        const examPayload = {
            module: selectedModule,
            filiere: selectedFiliere,
            section: selectedSection,
            enseignant: selectedEnseignant,
            examType: examType.toLowerCase(),
            difficulte: difficulte.toLowerCase(),
            examDate,
            duree: parseInt(duration),
            format: "PDF",
            questions: questions.map(q => q._id)
        };

        try {
            const response = await fetch('http://localhost:5000/api/v1/exam', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(examPayload)
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Erreur lors de la génération');

            // Générer le PDF
            const examResponse = await fetch(`http://localhost:5000/api/v1/exam/${data.exam._id}`, {
                credentials: 'include'
            });
            const examData = await examResponse.json();
            if (!examResponse.ok) throw new Error('Erreur lors de la récupération de l\'examen');
            console.log('exam complet:', exam);
            const pdfGenerated = ExamPDF(examData.exam, examData.exam.questions || questions);
            if (pdfGenerated) {
                toast.success('PDF exam generated successfully!');
                setSuccess(true);
            } else {
                throw new Error('Failed to generate PDF');
            }
        } catch (err) {
            setError(err.message);
            toast.error(err.message);
        }
    };

    return (
        <div style={{ maxWidth: 600, margin: "auto", background: "#fff", padding: 24, borderRadius: 8 }}>
            <ToastContainer />
            <h2 style={{ textAlign: "center", marginBottom: 24 }}>Générer un examen</h2>
            {error && <div style={{ color: "red" }}>{error}</div>}
            {success && <div className="alert alert-success">Examen généré avec succès!</div>}
            <form>
                <div className="form-group mb-3">
                    <label>Filière</label>
                    <select className="form-control" value={selectedFiliere} onChange={e => setSelectedFiliere(e.target.value)} required>
                        <option value="">Sélectionner une filière</option>
                        {filieres.map(f => (
                            <option key={f._id} value={f._id}>{f.nom}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group mb-3">
                    <label>Section</label>
                    <select className="form-control" value={selectedSection} onChange={e => setSelectedSection(e.target.value)} required>
                        <option value="">Sélectionner une section</option>
                        {sections.map(s => (
                            <option key={s._id} value={s._id}>{s.nom}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group mb-3">
                    <label>Module</label>
                    <select className="form-control" value={selectedModule} onChange={e => setSelectedModule(e.target.value)} required>
                        <option value="">Sélectionner un module</option>
                        {modules.map(m => (
                            <option key={m._id} value={m._id}>{m.nom}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group mb-3">
                    <label>Type d'Examen</label>
                    <select className="form-control" value={examType} onChange={e => setExamType(e.target.value)} required>
                        <option value="">Sélectionner le type</option>
                        <option value="final">Examen Final</option>
                        <option value="cc">Contrôle Continu</option>
                        <option value="tp">TP</option>
                    </select>
                </div>
                <div className="form-group mb-3">
                    <label>Difficulté</label>
                    <select className="form-control" value={difficulte} onChange={e => setDifficulte(e.target.value)} required>
                        <option value="">Sélectionner la difficulté</option>
                        <option value="facile">Facile</option>
                        <option value="moyen">Moyen</option>
                        <option value="difficile">Difficile</option>
                    </select>
                </div>
                <div className="form-group mb-3">
                    <label>Nombre de questions</label>
                    <input type="number" className="form-control" min="1" max="30" value={nbQuestions} onChange={e => setNbQuestions(e.target.value)} required />
                </div>
                <div className="form-group mb-3">
                    <label>Date de l'Examen</label>
                    <input type="datetime-local" className="form-control" value={examDate} onChange={e => setExamDate(e.target.value)} required />
                </div>
                <div className="form-group mb-3">
                    <label>Durée (minutes)</label>
                    <input type="number" className="form-control" value={duration} onChange={e => setDuration(e.target.value)} required />
                </div>
                <div className="text-center">
                    <button
                        type="button"
                        className="btn btn-primary me-2"
                        onClick={handleSubmitWeb}
                    >
                        Générer Examen WEB
                    </button>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={handleSubmitPDF}
                    >
                        Générer Examen PDF
                    </button>
                </div>
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
        </div>
    );
};

export default GénérateurExamenEnseignant;