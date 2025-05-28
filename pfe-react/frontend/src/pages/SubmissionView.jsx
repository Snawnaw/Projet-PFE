import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const SubmissionView = () => {
  const { submissionId } = useParams();
  const [submission, setSubmission] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const res = await axios.get(`/api/v1/submission/submission/${submissionId}`);
        setSubmission(res.data.submission);

        // Fetch exam questions
        const examId = res.data.submission.examId._id || res.data.submission.examId;
        const examRes = await axios.get(`/api/v1/exam/${examId}`);
        setQuestions(examRes.data.exam.questions || []);
      } catch (err) {
        setSubmission(null);
      }
      setLoading(false);
    };
    fetchSubmission();
  }, [submissionId]);

  if (loading) return <div>Loading...</div>;
  if (!submission) return <div>Submission not found.</div>;

  // Map answers to question text
  const answerEntries = Object.entries(submission.answers);

  return (
    <div>
      <h2>Soumission de {submission.studentId?.name || submission.studentId}</h2>
      <p>Date: {new Date(submission.submittedAt).toLocaleString()}</p>
      <p>Score: {submission.score} / {questions.length}</p>
      <h4>Réponses:</h4>
      <ul>
        {answerEntries.map(([questionId, answer], idx) => {
          const question = questions.find(q => q._id === questionId);
          return (
            <li key={questionId}>
              <strong>Q:</strong> {question ? question.enonce : questionId}<br />
              <strong>Réponse:</strong> {answer}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SubmissionView;