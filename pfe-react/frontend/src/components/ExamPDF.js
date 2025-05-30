console.log('exam complet:', exam);
export const ExamPDF = (exam, questions) => {
  try {
    console.log('exam.filiere:', exam.filiere);
    if (!exam || !questions) {
      console.error("Missing exam or questions data");
      return false;
    }

    // Ensure questions is always an array
    const safeQuestions = Array.isArray(questions) ? questions : [];
    
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${exam.module?.nom || 'Exam'}</title>
        <style>
          body { font-family: Arial; margin: 2cm; }
          header { text-align: center; margin-bottom: 1cm; }
          .info-table { margin: 0 auto 1cm auto; border-collapse: collapse; }
          .info-table td { padding: 4px 12px; }
          .student-fields { margin-bottom: 1cm; }
          .question { page-break-inside: avoid; margin-bottom: 0.5cm; }
          .options { margin-left: 1cm; }
        </style>
      </head>
      <body>
        <header>
          <h1>${exam.module?.nom || 'Exam'}</h1>
          <table class="info-table">
            <tr>
              <td><strong>Filière :</strong></td>
              <td>${exam.filiere?.nom || ''}</td>
              <td><strong>Section :</strong></td>
              <td>${exam.section?.nom || ''}</td>
            </tr>
            <tr>
              <td><strong>Enseignant :</strong></td>
              <td>${exam.enseignant?.nom ? exam.enseignant.nom + ' ' + (exam.enseignant.prenom || '') : ''}</td>
              <td><strong>Date :</strong></td>
              <td>${exam.examDate ? new Date(exam.examDate).toLocaleDateString() : ''}</td>
            </tr>
            <tr>
              <td><strong>Type :</strong></td>
              <td>${exam.examType?.toUpperCase() || ''}</td>
              <td><strong>Durée :</strong></td>
              <td>${exam.duree || 0} mins</td>
            </tr>
          </table>
        </header>

        <div class="student-fields">
          <strong>Nom et prénom :</strong> ...................... <br/>
        </div>
        
        ${safeQuestions.map((q, i) => `
          <div class="question">
            <h3>${i+1}. ${q.enonce || q.text || 'Question'}</h3>
            <div class="options">
              ${(q.options || []).map((opt, j) => 
                `<p>${String.fromCharCode(97 + j)}. ${opt.text || ''}</p>`
              ).join('')}
            </div>
          </div>
        `).join('')}
      </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 500);
    
    return true;
  } catch (error) {
    console.error('PDF generation failed:', error);
    return false;
  }
};