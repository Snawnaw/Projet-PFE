import { useEffect, useState } from 'react';
import axios from 'axios';

const SubmissionTable = ({ examId }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await axios.get(`/api/v1/submission/${examId}`);
        setSubmissions(res.data.submissions);
      } catch (err) {
        setSubmissions([]);
      }
      setLoading(false);
    };
    fetchSubmissions();
  }, [examId]);

  if (loading) return <div>Loading...</div>;

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Étudiant</th>
          <th>Date de soumission</th>
          <th>Score</th>
          <th>Détails</th>
        </tr>
      </thead>
      <tbody>
        {submissions.map(sub => (
          <tr key={sub._id}>
            <td>{sub.student?.name || sub.student}</td>
            <td>{new Date(sub.submittedAt).toLocaleString()}</td>
            <td>{sub.score} / {sub.totalQuestions}</td>
            <td>
              <a href={`/submissions/${sub._id}`}>Voir</a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SubmissionTable;