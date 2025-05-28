export const ExamPDF = (exam, questions) => {
  try {
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
          .question { page-break-inside: avoid; margin-bottom: 0.5cm; }
          .options { margin-left: 1cm; }
        </style>
      </head>
      <body>
        <header>
          <h1>${exam.module?.nom || 'Exam'}</h1>
          <p>${exam.examType?.toUpperCase() || ''} • ${exam.examDate ? new Date(exam.examDate).toLocaleDateString() : ''} • Duration: ${exam.duree || 0} mins</p>
        </header>

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