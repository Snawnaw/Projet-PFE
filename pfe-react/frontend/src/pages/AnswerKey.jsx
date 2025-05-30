import React from 'react';
import { saveAs } from 'file-saver';

const AnswerKey = ({ examData, questions }) => {
  const downloadAnswerKey = () => {
    const content = `
      Answer Key for ${examData.module} - ${examData.examType}
      Date: ${new Date(examData.examDate).toLocaleDateString()}
      Duration: ${examData.duration} minutes
      difficulte: ${examData.difficulte}
      
      Questions:
      ${questions.map((q, i) => `
        ${i + 1}. ${q.text}
        Correct Answer: ${q.correctAnswer || 'Not specified'}
      `).join('\n')}
    `;
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `AnswerKey_${examData.module}_${examData.examType}.txt`);
  };

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header bg-primary text-white">
          <h2>Answer Key - {examData.module}</h2>
        </div>
        <div className="card-body">
          <h4>Exam Details</h4>
          <p><strong>Type:</strong> {examData.examType}</p>
          <p><strong>Date:</strong> {new Date(examData.examDate).toLocaleDateString()}</p>
          <p><strong>Duration:</strong> {examData.duration} minutes</p>
          
          <h4 className="mt-4">Questions and Answers</h4>
          <ol>
            {questions.map((question, index) => (
              <li key={question._id} className="mb-3">
                <p><strong>Question:</strong> {question.text}</p>
                <p><strong>Correct Answer:</strong> {question.correctAnswer || 'Not specified'}</p>
              </li>
            ))}
          </ol>
          
          <button onClick={downloadAnswerKey} className="btn btn-primary">
            Download Answer Key
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnswerKey;