import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ExamWeb = () => {
    const { shareableId } = useParams();
    const [exam, setExam] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [answers, setAnswers] = useState({});

    useEffect(() => {
        const fetchExam = async () => {
            try {
                const response = await axios.get(`/api/v1/exam/public/${shareableId}`);
                setExam(response.data.exam);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load exam');
                setLoading(false);
            }
        };

        fetchExam();
    }, [shareableId]);

    const handleOptionChange = (questionId, optionId) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: optionId
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`/api/v1/exam/submit/${shareableId}`, { answers });
            alert(`Your score: ${response.data.score}/${response.data.totalQuestions}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit exam');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="container mt-4">
            <h1>{exam?.module?.nom || 'Exam'}</h1>
            <p>Duration: {exam?.duree} minutes</p>
            
            <form onSubmit={handleSubmit}>
                {exam?.questions?.map((question, index) => (
                    <div key={question._id} className="card mb-3">
                        <div className="card-body">
                            <h5 className="card-title">Question {index + 1}</h5>
                            <p className="card-text">{question.enonce}</p>
                            
                            <div className="list-group">
                                {question.options.map(option => (
                                    <label key={option._id} className="list-group-item">
                                        <input
                                            type="radio"
                                            name={`question-${question._id}`}
                                            checked={answers[question._id] === option._id}
                                            onChange={() => handleOptionChange(question._id, option._id)}
                                            className="form-check-input me-2"
                                        />
                                        {option.text}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
                
                <button type="submit" className="btn btn-primary">Submit Exam</button>
            </form>
        </div>
    );
};

export default ExamWeb;