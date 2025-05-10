import React, { useState, useEffect } from 'react';
import { Accordion, Form, Button, Row, Col } from 'react-bootstrap';
import '../styles/pages/QuestionForm.css';
import API from '../services/api';

function QuestionForm({ userRole, userModule }) {
  const [modules, setModules] = useState([]);
  const [isLoadingModules, setIsLoadingModules] = useState(true);
  const [error, setError] = useState(null);

  // State for the form and questions
  const [questions, setQuestions] = useState([{
    _id: Date.now().toString(),
    question: '',
    questionType: 'CHECKBOX',
    options: [{ option: 'Option 1' }, { option: 'Option 2' }],
    open: true,
    difficulty: 'Facile',
    module: userRole?.toLowerCase() === 'admin' ? '' : userModule,
    correctAnswer: ''
  }]);

  // Log props for debugging
  useEffect(() => {
    console.log("QuestionForm props:", { userRole, userModule });
  }, [userRole, userModule]);

  useEffect(() => {
    const fetchModules = async () => {
      setIsLoadingModules(true);
      try {
        const response = await API.get('/module/AllModules');
        if (response.data && response.data.modules) {
          console.log("Modules fetched:", response.data);
          setModules(response.data.modules);
          
          // If user is enseignant, update all questions with their module
          if (userRole?.toLowerCase() === 'enseignant' && userModule) {
            setQuestions(prev => prev.map(q => ({
              ...q,
              module: userModule
            })));
          }
        }
      } catch (error) {
        console.error('Error fetching modules:', error);
        setError("Impossible de charger les modules. Veuillez réessayer plus tard.");
      } finally {
        setIsLoadingModules(false);
      }
    };
  
    fetchModules();
  }, [userRole, userModule]);
  
  const [currentFocusedQuestionId, setCurrentFocusedQuestionId] = useState(null);
  
  useEffect(() => {
    // Set the first question as focused by default
    if (questions.length > 0 && !currentFocusedQuestionId) {
      setCurrentFocusedQuestionId(questions[0]._id);
    }
  }, [questions, currentFocusedQuestionId]);
  
  // Function to add a new question
  const addQuestionTemplate = () => {
    const newQuestion = {
      _id: Date.now().toString(),
      question: '',
      questionType: 'CHECKBOX',
      options: [{ option: 'Option 1' }, { option: 'Option 2' }],
      open: true,
      difficulty: 'Facile',
      module: userRole?.toLowerCase() === 'admin' ? '' : userModule,
      correctAnswer: ''
    };
    
    closeAllExpandedQuestions();
    setQuestions([...questions, newQuestion]);
    setCurrentFocusedQuestionId(newQuestion._id);
  };
  
  // Function to close all expanded questions
  const closeAllExpandedQuestions = () => {
    let updatedQuestions = questions.map(q => ({...q, open: false}));
    setQuestions(updatedQuestions);
  };
  
  // Function to handle question expansion
  const handleExpand = (questionIndex) => {
    let updatedQuestions = [...questions];
    updatedQuestions.forEach((q, index) => {
      if(index === questionIndex) {
        updatedQuestions[index].open = true;
        setCurrentFocusedQuestionId(q._id);
      } else {
        updatedQuestions[index].open = false;
      }
    });
    setQuestions(updatedQuestions);
  };
  
  // Function to update question text
  const updateQuestion = (questionText, questionIndex) => {
    let updatedQuestions = [...questions];
    updatedQuestions[questionIndex].question = questionText;
    setQuestions(updatedQuestions);
  };
  
  // Function to update question type
  const updateQuestionType = (type, questionIndex) => {
    let updatedQuestions = [...questions];
    updatedQuestions[questionIndex].questionType = type;
    setQuestions(updatedQuestions);
  };
  
  // Function to add option
  const addOption = (questionIndex) => {
    let updatedQuestions = [...questions];
    if(updatedQuestions[questionIndex].options.length < 5) {
      updatedQuestions[questionIndex].options.push({ option: `Option ${updatedQuestions[questionIndex].options.length + 1}` });
      setQuestions(updatedQuestions);
    }
  };
  
  // Function to remove option
  const removeOption = (questionIndex, optionIndex) => {
    let updatedQuestions = [...questions];
    if(updatedQuestions[questionIndex].options.length > 1) {
      updatedQuestions[questionIndex].options.splice(optionIndex, 1);
      setQuestions(updatedQuestions);
    }
  };
  
  // Function to update option value
  const handleOptionValue = (optionValue, questionIndex, optionIndex) => {
    let updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex].option = optionValue;
    setQuestions(updatedQuestions);
  };
  
  // Function to copy question
  const copyQuestion = (questionIndex) => {
    let copiedQuestion = JSON.parse(JSON.stringify(questions[questionIndex]));
    copiedQuestion._id = Date.now().toString();
    copiedQuestion.open = true;
    
    closeAllExpandedQuestions();
    
    let updatedQuestions = [...questions];
    updatedQuestions.splice(questionIndex + 1, 0, copiedQuestion);
    setQuestions(updatedQuestions);
    setCurrentFocusedQuestionId(copiedQuestion._id);
  };
  
  // Function to delete question
  const deleteQuestion = (questionIndex) => {
    if(questions.length > 1) {
      let updatedQuestions = [...questions];
      updatedQuestions.splice(questionIndex, 1);
      setQuestions(updatedQuestions);
    }
  };
  
  // Function to update difficulty
  const updateDifficulty = (difficulty, questionIndex) => {
    let updatedQuestions = [...questions];
    updatedQuestions[questionIndex].difficulty = difficulty;
    setQuestions(updatedQuestions);
  };
  
  // Improved module update function
  const updateModule = (moduleId, questionIndex) => {
    console.log('Updating module:', moduleId, 'for question:', questionIndex);
    let updatedQuestions = [...questions];
    updatedQuestions[questionIndex].module = moduleId;
    setQuestions(updatedQuestions);
  };

  // Render module selection based on user role
  const renderModuleSelection = (question, index) => {
    if (isLoadingModules) {
        return <div>Chargement des modules...</div>;
    }
    
    if (error) {
        return <div className="text-danger">{error}</div>;
    }
    
    if (userRole?.toLowerCase() === 'admin') {
        return (
            <Form.Select
                value={question.module || ''}
                onChange={(e) => {
                    if (!e.target.value) {
                        alert('Veuillez sélectionner un module valide');
                        return;
                    }
                    updateModule(e.target.value, index);
                }}
                required
            >
                <option value="">Sélectionner un module</option>
                {modules && modules.length > 0 ? (
                    modules.map((module) => (
                        <option key={module._id} value={module._id}>
                            {module.nom} ({module.code})
                        </option>
                    ))
                ) : (
                    <option disabled>Aucun module disponible</option>
                )}
            </Form.Select>
        );
    }
    
    // For teachers - show their assigned module
    const moduleInfo = modules.find(m => m._id === userModule);
    return (
        <Form.Control
            type="text"
            value={moduleInfo ? `${moduleInfo.nom} (${moduleInfo.code})` : 'Module non disponible'}
            readOnly
            className="bg-light"
        />
    );
  };

  // Function to update correct answer
  const updateCorrectAnswer = (correctAnswer, questionIndex) => {
    let updatedQuestions = [...questions];
    updatedQuestions[questionIndex].correctAnswer = correctAnswer;
    setQuestions(updatedQuestions);
  };
  
  const saveForm = async () => {
    try {
        // Validate all questions have modules
        const questionsWithMissingModule = questions.filter(q => !q.module);
        if (questionsWithMissingModule.length > 0) {
            alert(`Les questions suivantes n'ont pas de module sélectionné:
                ${questionsWithMissingModule.map((q, i) => `\n${i+1}. ${q.question || 'Sans titre'}`).join('')}
            `);
            return;
        }

        // Prepare data for API
        const questionsToSave = questions.map(q => ({
            enonce: q.question,
            difficulte: q.difficulty,
            type: q.questionType === 'CHECKBOX' ? 'QCM' : 'TEXT',
            module: q.module,
            options: q.questionType !== 'TEXT' ? 
                q.options.map(opt => ({
                    text: opt.option,
                    isCorrect: q.correctAnswer === opt.option
                })) : undefined,
            correctAnswer: q.questionType === 'TEXT' ? q.correctAnswer : undefined
        }));

        const response = await API.post('/question', {
            questions: questionsToSave
        });

        if (response.data.success) {
            alert('Questions sauvegardées avec succès!');
            navigate('/admin');
        } else {
            throw new Error(response.data.message || 'Failed to save questions');
        }
      } catch (error) {
          console.error('Error saving questions:', error);
          alert(`Erreur lors de la sauvegarde: ${error.message}`);
      }
  };
  
  // Function to display questions
  const displayQuestions = () => {
    return questions.map((question, i) => (
      <div key={question._id} id={question._id} className="question-container mb-3">
        <Accordion 
          activeKey={question.open ? `panel${i}` : null} 
          onSelect={() => handleExpand(i)}
          className={question.open ? "question-box-border" : ""}
        >
          <Accordion.Item eventKey={`panel${i}`}>
            <Accordion.Header>
              {!question.open && (
                <div className="question-header w-100">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">
                      {(i + 1).toString() + ". " + (question.question || "Untitled Question")}
                    </h5>
                    <div className="question-actions">
                      <Button 
                        variant="outline-secondary" 
                        size="sm" 
                        className="me-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleExpand(i);
                        }}
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                  
                  <div className="question-preview mt-2">
                    {question.questionType === 'RADIO' && (
                      <Form>
                        {question.options.map((option, j) => (
                          <Form.Check
                            key={j}
                            type="radio"
                            name={`question-${i}`}
                            label={option.option}
                            disabled
                          />
                        ))}
                      </Form>
                    )}
                    {question.questionType === 'CHECKBOX' && (
                      <Form>
                        {question.options.map((option, j) => (
                          <Form.Check
                            key={j}
                            type="checkbox"
                            name={`question-${i}-option-${j}`}
                            label={option.option}
                            disabled
                          />
                        ))}
                      </Form>
                    )}
                    {question.questionType === 'TEXT' && (
                      <Form.Control
                        type="text"
                        placeholder="Short text answer"
                        disabled
                      />
                    )}
                  </div>
                </div>
              )}
            </Accordion.Header>
            <Accordion.Body>
              <div className="question-edit-area">
                <Form.Group className="mb-3">
                  <Form.Control
                    as="textarea"
                    rows={2}
                    placeholder="Question"
                    value={question.question}
                    onChange={(e) => updateQuestion(e.target.value, i)}
                  />
                </Form.Group>
                
                <Row className="mb-3">
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Type de question</Form.Label>
                      <Form.Select
                        value={question.questionType}
                        onChange={(e) => updateQuestionType(e.target.value, i)}
                      >
                        <option value="CHECKBOX">QCM</option>
                        <option value="TEXT">Question ouverte</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Difficulté</Form.Label>
                      <Form.Select
                        value={question.difficulty}
                        onChange={(e) => updateDifficulty(e.target.value, i)}
                      >
                        <option value="Facile">Facile</option>
                        <option value="Moyenne">Moyenne</option>
                        <option value="Difficile">Difficile</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Module</Form.Label>
                      {renderModuleSelection(question, i)}
                    </Form.Group>
                  </Col>
                </Row>
                
                {/* Options Section */}
                {(question.questionType === 'RADIO' || question.questionType === 'CHECKBOX') && (
                  <div className="options-container mb-3">
                    {question.options.map((option, j) => (
                      <div key={j} className="option-row d-flex align-items-center mb-2">
                        <div className="option-icon me-2">
                          {question.questionType === 'RADIO' ? (
                            <i className="bi bi-circle"></i>
                          ) : (
                            <i className="bi bi-square"></i>
                          )}
                        </div>
                        <Form.Control
                          type="text"
                          placeholder={`Option ${j + 1}`}
                          value={option.option}
                          onChange={(e) => handleOptionValue(e.target.value, i, j)}
                          className="me-2"
                        />
                        <Form.Check
                          type="radio"
                          name={`correct-answer-${i}`}
                          onChange={() => updateCorrectAnswer(option.option, i)}
                          checked={question.correctAnswer === option.option}
                          label="Correct"
                          className="me-2"
                        />
                        {question.options.length > 1 && (
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => removeOption(i, j)}
                          >
                            <i className="bi bi-trash"></i>
                          </Button>
                        )}
                      </div>
                    ))}
                    
                    {question.options.length < 5 && (
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => addOption(i)}
                        className="mt-2"
                      >
                        Add Option
                      </Button>
                    )}
                  </div>
                )}
                
                {/* Text Answer Section */}
                {question.questionType === 'TEXT' && (
                  <Form.Group className="mb-3">
                    <Form.Label>Correct Answer</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter the correct answer"
                      value={question.correctAnswer}
                      onChange={(e) => updateCorrectAnswer(e.target.value, i)}
                    />
                  </Form.Group>
                )}
                
                {/* Question Footer */}
                <div className="question-footer d-flex justify-content-between mt-4">
                  <div>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      className="me-2"
                      onClick={() => copyQuestion(i)}
                    >
                      <i className="bi bi-files"></i> Dupliquer
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => deleteQuestion(i)}
                      disabled={questions.length === 1}
                    >
                      <i className="bi bi-trash"></i> Supprimer
                    </Button>
                  </div>
                </div>
              </div>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>
    ));
  };
  
  return (
    <div className="question-form-container">
      <div className="form-header mb-4">
        <h2 className="form-title">Créer une question</h2>
      </div>
      
      <div className="questions-container">
        {displayQuestions()}
      </div>
      
      <div className="form-actions d-flex justify-content-between mt-4">
        <Button 
          variant="primary" 
          onClick={addQuestionTemplate}
        >
          <i className="bi bi-plus-circle"></i> (+) Question
        </Button>
        <Button 
          variant="success" 
          onClick={saveForm}
        >
          <i className="bi bi-save"></i> Sauvgarder Question(s)
        </Button>
      </div>
    </div>
  );
}
export default QuestionForm;