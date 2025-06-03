import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Spinner, Alert } from 'react-bootstrap';

const SubmissionTable = ({ examId }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
      if (!examId) return;
      axios.get(`/api/v1/exam/${examId}/submissions`)
          .then(res => {
              setSubmissions(res.data.submissions || []);
              setAnswerKey(res.data.answerKey || []);
          })
          .catch(err => {
              setError('Erreur lors du chargement des soumissions');
          });
  }, [examId]);

  if (!examId) return null;
  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (submissions.length === 0) return <div>Aucune soumission pour cet examen.</div>;

  return (
    <div className="mt-4">
      <h5>Soumissions des étudiants</h5>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Étudiant</th>
            <th>Email</th>
            <th>Section</th>
            <th>Date de soumission</th>
            <th>Score</th>
            <th>Voir réponses</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map(sub => (
            <tr key={sub._id}>
              <td>{sub.student?.nom} {sub.student?.prenom}</td>
              <td>{sub.student?.email}</td>
              <td>{sub.student?.section?.nom || ''}</td>
              <td>{new Date(sub.submittedAt).toLocaleString('fr-FR')}</td>
              <td>{sub.score ?? '-'}</td>
              <td>
                <button
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => alert(JSON.stringify(sub.answers, null, 2))}
                >
                  Détail
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default SubmissionTable;