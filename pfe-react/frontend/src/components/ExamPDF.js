export const ExamPDF = (exam, questions) => {
  try {
    // Debug: log questions to verify structure
    console.log("ExamPDF questions:", questions);
    
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
          <p>${exam.examType.toUpperCase()} • ${new Date(exam.examDate).toLocaleDateString()} • Duration: ${exam.duree} mins</p>
        </header>

        ${questions.map((q, i) => `
          <div class="question">
            <h3>${i+1}. ${q.enonce || q.text || ''}</h3>
            <div class="options">
              ${q.options.map((opt, j) => 
                `<p>${String.fromCharCode(97 + j)}. ${opt.text}</p>`
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