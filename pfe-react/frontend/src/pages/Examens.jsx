import React, { useEffect, useState } from "react";
import axios from "axios";
import { saveAs } from 'file-saver';
import SubmissionTable from "./SubmissionTable";

const Examens = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedExam, setSelectedExam] = useState('');
  // Filter states
  const [filieres, setFilieres] = useState([]);
  const [sections, setSections] = useState([]);
  const [modules, setModules] = useState([]);
  const [enseignants, setEnseignants] = useState([]);
  const [filterFiliere, setFilterFiliere] = useState('');
  const [filterSection, setFilterSection] = useState('');
  const [filterModule, setFilterModule] = useState('');
  const [filterEnseignant, setFilterEnseignant] = useState('');
  const [filterDifficulte, setFilterDifficulte] = useState('');
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    fetchExams();
    fetchFilters();
  }, []);

  const fetchFilters = async () => {
    try {
      const [filieresRes, sectionsRes, modulesRes, enseignantsRes] = await Promise.all([
        axios.get("/filiere/AllFiliere"),
        axios.get("/section/AllSections"),
        axios.get("/module/AllModules"),
        axios.get("/enseignant/AllEnseignant"),
      ]);
      setFilieres(filieresRes.data.filieres || []);
      setSections(sectionsRes.data.sections || []);
      setModules(modulesRes.data.modules || []);
      setEnseignants(enseignantsRes.data.enseignants || []);
    } catch (err) {
      // ignore filter errors
    }
  };

  const fetchExams = async () => {
    try {
      const res = await axios.get("/exam");
      setExams(res.data.exams || []);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const handleDownloadAnswerKey = async (examId) => {
    try {
      const response = await axios.get(`/exam/${examId}/answer-key`, {
        responseType: 'blob'
      });
      saveAs(new Blob([response.data]), `answer_key_${examId}.pdf`);
    } catch (err) {}
  };

  const handleGeneratePDFAnswerKey = async () => {
    if (!selectedExam) return;
    window.open(`/api/v1/exam/${selectedExam}/answer-key`, '_blank');
  };

  const handleGenerateWebAnswerKey = async () => {
    if (!selectedExam) return;
    window.open(`/exam/${exams.find(e => e._id === selectedExam)?.shareableId || ''}`, '_blank');
  };

  // Filtering logic
  const filteredExams = exams.filter(exam => {
    return (
      (!filterFiliere || (exam.filiere?._id || exam.filiere) === filterFiliere) &&
      (!filterSection || (exam.section?._id || exam.section) === filterSection) &&
      (!filterModule || (exam.module?._id || exam.module) === filterModule) &&
      (!filterEnseignant || (exam.enseignant?._id || exam.enseignant) === filterEnseignant) &&
      (!filterDifficulte || (exam.difficulte || '').toLowerCase() === filterDifficulte.toLowerCase()) &&
      (!filterDate || (exam.examDate && exam.examDate.slice(0, 10) === filterDate))
    );
  });

  if (loading) return <div>Chargement des exams...</div>;

  return (
    <div className="container mt-4">
      <h2>Tous les examens</h2>
      {/* Filter controls */}
      <div className="row mb-3">
        <div className="col-md-2">
          <select className="form-control" value={filterFiliere} onChange={e => setFilterFiliere(e.target.value)}>
            <option value="">Filière</option>
            {filieres.map(f => (
              <option key={f._id} value={f._id}>{f.nom}</option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <select className="form-control" value={filterSection} onChange={e => setFilterSection(e.target.value)}>
            <option value="">Section</option>
            {sections.map(s => (
              <option key={s._id} value={s._id}>{s.nom}</option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <select className="form-control" value={filterModule} onChange={e => setFilterModule(e.target.value)}>
            <option value="">Module</option>
            {modules.map(m => (
              <option key={m._id} value={m._id}>{m.nom}</option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <select className="form-control" value={filterEnseignant} onChange={e => setFilterEnseignant(e.target.value)}>
            <option value="">Enseignant</option>
            {enseignants.map(e => (
              <option key={e._id} value={e._id}>{e.nom}</option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <select className="form-control" value={filterDifficulte} onChange={e => setFilterDifficulte(e.target.value)}>
            <option value="">Difficulté</option>
            <option value="facile">Facile</option>
            <option value="moyen">Moyen</option>
            <option value="difficile">Difficile</option>
          </select>
        </div>
        <div className="col-md-2">
          <input
            type="date"
            className="form-control"
            value={filterDate}
            onChange={e => setFilterDate(e.target.value)}
          />
        </div>
      </div>
      {/* Select and answer key buttons */}
      <div className="form-group mb-3">
        <label className="form-label">Selectionner un examen existant</label>
        <select
          className="form-control"
          value={selectedExam}
          onChange={(e) => setSelectedExam(e.target.value)}
        >
          <option value="">Selectionner un examen</option>
          {filteredExams.length > 0 ? (
            filteredExams.map((exam) => (
              <option key={exam._id} value={exam._id}>
                {exam.module?.nom || 'No module'} - {exam.examType} - {new Date(exam.examDate).toLocaleDateString()}
              </option>
            ))
          ) : (
            <option disabled>Pas d'examen disponible</option>
          )}
        </select>
      </div>
      <SubmissionTable examId={selectedExam} />
      {/* Exams Table */}
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>Filière</th>
              <th>Section</th>
              <th>Module</th>
              <th>Enseignant</th>
              <th>Difficulté</th>
              <th>Date</th>
              <th>Format</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredExams.map((exam) => (
              <tr key={exam._id}>
                <td>{exam.filiere?.nom || ''}</td>
                <td>{exam.section?.nom || ''}</td>
                <td>{exam.module?.nom || ''}</td>
                <td>{exam.enseignant?.nom || ''}</td>
                <td>{exam.difficulte || ''}</td>
                <td>{exam.examDate ? new Date(exam.examDate).toLocaleDateString() : ''}</td>
                <td>{exam.format}</td>
                <td>
                  {/*{exam.format === 'PDF' ? (
                    <button
                      className="btn btn-primary btn-sm me-2"
                      onClick={() => window.open(`/api/v1/exam/${exam._id}/answer-key`, '_blank')}
                    >
                      Corrigé PDF
                    </button>
                  ) : (
                    <button
                      className="btn btn-success btn-sm me-2"
                      onClick={() => window.open(`/exam/${exam.shareableId}`, '_blank')}
                    >
                      Corrigé Web
                    </button>
                  )}*/}
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => handleDownloadAnswerKey(exam._id)}
                  >
                    Télécharger Corrigé PDF
                  </button>
                </td>
              </tr>
            ))}
            {filteredExams.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center">Pas d'examens trouvés</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Examens;