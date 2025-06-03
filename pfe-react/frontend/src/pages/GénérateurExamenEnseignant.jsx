import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { ExamPDF } from '../components/ExamPDF';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';

const GénérateurExamenEnseignant = () => {
    const [selectedFiliere, setSelectedFiliere] = useState('');
    const [selectedModule, setSelectedModule] = useState('');
    const [selectedSection, setSelectedSection] = useState('');
    const [selectedSalle, setSelectedSalle] = useState('');
    const [examType, setExamType] = useState('');
    const [examDate, setExamDate] = useState('');
    const [duration, setDuration] = useState(60);
    const [filieres, setFilieres] = useState([]);
    const [sections, setSections] = useState([]);
    const [modules, setModules] = useState([]);
    const [salles, setSalles] = useState([]);
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

                const sallesRes = await fetch('http://localhost:5000/api/v1/salle/AllSalle', { credentials: 'include' });

                const [modulesData, filieresData, sectionsData, sallesData] = await Promise.all([
                    modulesRes.json(),
                    filieresRes.json(),
                    sectionsRes.json(),
                    sallesRes.json()
                ]);
                
                // Ajout des logs pour le débogage
                console.log("Modules récupérés:", modulesData.modules);
                console.log("Filières récupérées:", filieresData.filieres);
                console.log("Sections récupérées:", sectionsData.sections);
                
                setModules(modulesData.modules || []);
                setFilieres(filieresData.filieres || []);
                setSections(sectionsData.sections || []);
                setSalles(sallesData.salles || []);
            } catch (error) {
                console.error("Erreur détaillée:", error);
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
            return data.questions; // <-- return the questions array
        } catch (error) {
            setQuestions([]);
            setError(error.message);
            return false;
        }
    };

    const handleSendExamLink = async () => {
        try {
            const response = await axios.post('/api/v1/notification/send-exam-link', {
                examId: generatedExamId,
                shareableLink: generatedLink,
                filiereId: selectedFiliere,
                sectionId: selectedSection,
            });
            if (response.data.success) {
                toast.success('Lien envoyé aux étudiants avec succès!');
            }
        } catch (err) {
            toast.error('Erreur lors de l\'envoi du lien.');
        }
    };

    const handleSubmitWeb = async (e) => {
        if (e) e.preventDefault();
        setError(null);
        setSuccess(false);
        
        // 1. Validation complète des champs requis
        if (!selectedFiliere) {
            setError("Veuillez sélectionner une filière");
            return;
        }
        if (!selectedSection) {
            setError("Veuillez sélectionner une section");
            return;
        }
        if (!selectedModule) {
            setError("Veuillez sélectionner un module");
            return;
        }
        if (!selectedEnseignant) {
            setError("Identifiant enseignant manquant");
            return;
        }
        if (!selectedSalle) {
            setError("Veuillez sélectionner une salle");
            return;
        }
        if (!examType) {
            setError("Veuillez sélectionner un type d'examen");
            return;
        }
        if (!difficulte) {
            setError("Veuillez sélectionner une difficulté");
            return;
        }
        if (!examDate) {
            setError("Veuillez sélectionner une date d'examen");
            return;
        }
        if (!duration || isNaN(parseInt(duration)) || parseInt(duration) <= 0) {
            setError("Veuillez indiquer une durée valide");
            return;
        }

        // 1. Récupérer les questions AVANT de créer le payload
        const questionsFetched = await fetchQuestions();
        if (!Array.isArray(questionsFetched) || questionsFetched.length === 0) {
            setError("Impossible de récupérer des questions. Vérifiez vos critères de sélection.");
            return;
        }
        
        // 2. Assigner format="WEB" explicitement et utiliser questionsFetched directement
        const examPayload = {
            module: selectedModule,
            filiere: selectedFiliere,
            section: selectedSection,
            enseignant: selectedEnseignant,
            salle: selectedSalle,
            examType: examType.toLowerCase(),
            difficulte: difficulte.toLowerCase(),
            examDate,
            duree: parseInt(duration),
            format: "WEB", // Format explicitement défini comme "WEB", jamais vide
            questions: questionsFetched.map(q => q._id) // Utiliser les questions récupérées
        };
        
        // Debug pour vérifier le payload
        console.log("Payload final:", JSON.stringify(examPayload, null, 2));
        
        try {
            // Modifier cette ligne pour utiliser le même endpoint que pour PDF
            const response = await fetch('http://localhost:5000/api/v1/exam', {
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

        // Même validation complète que pour Web
        if (!selectedFiliere) {
            setError("Veuillez sélectionner une filière");
            return;
        }
        if (!selectedSection) {
            setError("Veuillez sélectionner une section");
            return;
        }
        if (!selectedModule) {
            setError("Veuillez sélectionner un module");
            return;
        }
        if (!selectedEnseignant) {
            setError("Identifiant enseignant manquant");
            return;
        }
        if (!selectedSalle) {
            setError("Veuillez sélectionner une salle");
            return;
        }
        if (!examType) {
            setError("Veuillez sélectionner un type d'examen");
            return;
        }
        if (!difficulte) {
            setError("Veuillez sélectionner une difficulté");
            return;
        }
        if (!examDate) {
            setError("Veuillez sélectionner une date d'examen");
            return;
        }
        if (!duration || isNaN(parseInt(duration)) || parseInt(duration) <= 0) {
            setError("Veuillez indiquer une durée valide");
            return;
        }

        const fetchedQuestions = await fetchQuestions();
        if (!Array.isArray(fetchedQuestions) || fetchedQuestions.length === 0) {
            setError("Impossible de récupérer des questions. Vérifiez vos critères de sélection.");
            return;
        }

        const examPayload = {
            module: selectedModule,
            filiere: selectedFiliere,
            section: selectedSection,
            enseignant: selectedEnseignant,
            salle: selectedSalle,
            examType: examType.toLowerCase(),
            difficulte: difficulte.toLowerCase(),
            examDate,
            duree: parseInt(duration),
            format: "PDF", // Format explicitement défini à "PDF"
            questions: fetchedQuestions.map(q => q._id) // Toujours utiliser le résultat de fetchQuestions
        };

        console.log("Payload examen PDF:", JSON.stringify(examPayload, null, 2));
        
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
            console.log('exam complet:', examData.exam);
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
                    <label>Filière (vos filières)</label>
                    <select className="form-control" value={selectedFiliere} onChange={e => setSelectedFiliere(e.target.value)} required>
                        <option value="">Sélectionner une filière</option>
                        {filieres.map(f => (
                            <option key={f._id} value={f._id}>{f.nom}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group mb-3">
                    <label>Section (vos sections)</label>
                    <select className="form-control" value={selectedSection} onChange={e => setSelectedSection(e.target.value)} required>
                        <option value="">Sélectionner une section</option>
                        {/* Modifié pour être moins restrictif et montrer toutes les sections si besoin */}
                        {sections.length > 0 ? (
                            sections.map(s => (
                                <option key={s._id} value={s._id}>
                                    {s.nom} {s.filiere && s.filiere.nom ? `(${s.filiere.nom})` : ''}
                                </option>
                            ))
                        ) : (
                            <option disabled>Aucune section disponible</option>
                        )}
                    </select>
                    <small className="form-text text-muted">
                        {sections.length} section(s) disponible(s)
                    </small>
                </div>
                <div className="form-group mb-3">
                    <label>Module (vos modules)</label>
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
                    <label className="form-label">Salle</label>
                    <select 
                        className="form-control"
                        value={selectedSalle}
                        onChange={(e) => setSelectedSalle(e.target.value)}
                        required
                    >
                        <option value="">Sélectionner une salle</option>
                        {salles.map(salle => (
                            <option key={salle._id} value={salle._id}>
                                {salle.nom} - {salle.numero} (Capacité: {salle.capacite}, Type: {salle.type})
                            </option>
                        ))}
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