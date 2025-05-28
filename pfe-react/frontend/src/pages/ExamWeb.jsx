import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Typography,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Checkbox,
  TextField,
  Button,
  Box,
  Paper
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';

// Fond violet clair pour la page
const BgBox = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: '#f3e8fd',
  paddingTop: theme.spacing(6),
  paddingBottom: theme.spacing(6),
}));

// Carte de question style Google Forms
const QuestionCard = styled(Paper)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  borderRadius: 12,
  boxShadow: '0 2px 8px rgba(80, 0, 120, 0.07)',
  background: '#fff',
  maxWidth: 600,
  marginLeft: 'auto',
  marginRight: 'auto',
}));

const ExamWeb = () => {
  const { shareableId } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [answers, setAnswers] = useState({});
  const [remainingTime, setRemainingTime] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [fullQuestions, setFullQuestions] = useState([]);
  const timerRef = useRef();

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const res = await axios.get(`/exam/public/${shareableId}`);
        setExam(res.data.exam);
        const duration = res.data.exam?.duree || 60;
        setRemainingTime(duration * 60);

        if (Array.isArray(res.data.exam?.questions) && typeof res.data.exam.questions[0] === 'string') {
          const questionObjs = await Promise.all(
            res.data.exam.questions.map(qid =>
              axios.get(`/question/${qid}`).then(qres => qres.data.question)
            )
          );
          setFullQuestions(questionObjs);
        } else if (Array.isArray(res.data.exam?.questions)) {
          setFullQuestions(res.data.exam.questions);
        } else {
          setFullQuestions([]);
        }
      } catch (err) {
        setError('Exam not found or invalid link');
      } finally {
        setLoading(false);
      }
    };
    fetchExam();
  }, [shareableId]);

  useEffect(() => {
    if (loading || error) return;
    if (remainingTime <= 0) return;
    timerRef.current = setInterval(() => {
      setRemainingTime((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          handleSubmit();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [loading, error, exam]);

  const handleOptionChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleCheckboxChange = (questionId, optionId) => {
    setAnswers(prev => {
      const prevArr = Array.isArray(prev[questionId]) ? prev[questionId] : [];
      if (prevArr.includes(optionId)) {
        return { ...prev, [questionId]: prevArr.filter(id => id !== optionId) };
      } else {
        return { ...prev, [questionId]: [...prevArr, optionId] };
      }
    });
  };

  const handleTextChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    try {
      const studentId = localStorage.getItem('studentId');
      await axios.post(`/submission/submit/${shareableId}`, {
        studentId,
        answers
      });
      navigate('/submission-success');
    } catch (err) {
      setSubmitError('Failed to submit exam. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Helper pour format mm:ss
  function formatTime(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  if (loading) return <div style={{ textAlign: 'center', marginTop: 80 }}>Chargement...</div>;
  if (error) return (
    <BgBox>
      <Container maxWidth="sm">
        <QuestionCard sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="error" variant="h6">{error}</Typography>
          <Button variant="contained" sx={{ mt: 2 }} onClick={() => window.location.href = '/'}>Retour</Button>
        </QuestionCard>
      </Container>
    </BgBox>
  );

  return (
    <BgBox>
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{
          borderRadius: 3,
          mb: 4,
          p: 3,
          background: '#fff',
          textAlign: 'center'
        }}>
          <Typography variant="h4" sx={{ color: '#6c2eb7', fontWeight: 700, mb: 1 }}>
            {exam?.module?.nom || 'Examen WEB'}
          </Typography>
          <Typography variant="subtitle1" sx={{ color: '#6c2eb7', mb: 2 }}>
            {exam?.examType?.toUpperCase() || ''} &bull; {exam?.filiere?.nom || ''}
          </Typography>
          <Typography variant="body2" sx={{ color: '#888', mb: 1 }}>
            Temps restant : <b>{formatTime(remainingTime)}</b>
          </Typography>
        </Paper>

        <form onSubmit={handleSubmit}>
          {fullQuestions.length > 0 ? (
            fullQuestions.map((question, index) => {
              const qType = (question.type || '').toUpperCase();
              const options = Array.isArray(question.options) ? question.options : [];
              return (
                <QuestionCard key={question._id}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      {index + 1}. {question.enonce}
                    </Typography>
                    <FormControl component="fieldset" fullWidth>
                      {/* QCM (checkbox) */}
                      {qType === 'QCM' && (
                        options.length > 0 ? (
                          options.map(option => (
                            <FormControlLabel
                              key={option._id || option.text}
                              control={
                                <Checkbox
                                  checked={Array.isArray(answers[question._id]) &&
                                            answers[question._id].includes(option._id)}
                                  onChange={() => handleCheckboxChange(question._id, option._id)}
                                />
                              }
                              label={option.text}
                              sx={{ mb: 1, ml: 2 }}
                            />
                          ))
                        ) : (
                          <Typography color="text.secondary">
                            Aucune option disponible
                          </Typography>
                        )
                      )}
                      {/* QCU (radio) */}
                      {qType === 'QCU' && (
                        options.length > 0 ? (
                          <RadioGroup
                            value={answers[question._id] || ''}
                            onChange={(e) => handleOptionChange(question._id, e.target.value)}
                          >
                            {options.map(option => (
                              <FormControlLabel
                                key={option._id || option.text}
                                value={option._id}
                                control={<Radio />}
                                label={option.text}
                                sx={{ mb: 1, ml: 2 }}
                              />
                            ))}
                          </RadioGroup>
                        ) : (
                          <Typography color="text.secondary">
                            Aucune option disponible
                          </Typography>
                        )
                      )}
                      {/* TEXT */}
                      {qType === 'TEXT' && (
                        <TextField
                          fullWidth
                          variant="outlined"
                          value={answers[question._id] || ''}
                          onChange={(e) => handleTextChange(question._id, e.target.value)}
                          placeholder="Votre réponse"
                          multiline
                          minRows={2}
                          sx={{ mt: 1 }}
                        />
                      )}
                    </FormControl>
                  </CardContent>
                </QuestionCard>
              );
            })
          ) : (
            <QuestionCard>
              <CardContent>
                <Typography variant="body1" align="center">
                  Aucune question disponible pour cet examen.
                </Typography>
              </CardContent>
            </QuestionCard>
          )}

          {submitError && (
            <QuestionCard>
              <CardContent>
                <Typography color="error">{submitError}</Typography>
              </CardContent>
            </QuestionCard>
          )}

          {fullQuestions.length > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{
                  background: '#6c2eb7',
                  fontWeight: 600,
                  px: 5,
                  borderRadius: 3,
                  boxShadow: '0 2px 8px rgba(0, 68, 120, 0.07)'
                }}
                disabled={submitting}
              >
                {submitting ? 'Envoi...' : 'Envoyer'}
              </Button>
            </Box>
          )}
        </form>
      </Container>
    </BgBox>
  );
};

export default ExamWeb;