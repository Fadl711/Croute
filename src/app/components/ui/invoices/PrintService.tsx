import React from 'react';
import { createRoot } from 'react-dom/client';

export const printComponent = (component: React.ReactElement) => {
  const printWindow = window.open('', '_blank', 'width=900,height=1200');
  if (!printWindow) {
    alert('الرجاء السماح بالنوافذ المنبثقة لطباعة الفواتير');
    return;
  }

  // Set up the document structure
  printWindow.document.write(`
    <html>
      <head>
        <title>C-ROUTE | Printing Document</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap" rel="stylesheet">
        <style>
          body { font-family: 'IBM Plex Sans Arabic', sans-serif !important; }
          @page { margin: 0; size: A4; }
          @media print {
            body { margin: 0; padding: 0; }
            .no-print { display: none !important; }
          }
        </style>
      </head>
      <body>
        <div id="print-root"></div>
      </body>
    </html>
  `);

  const container = printWindow.document.getElementById('print-root');
  if (container) {
    const root = createRoot(container);
    root.render(component);
    
    // Wait for content and tailwind to load
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
      // Optional: close after print
      // printWindow.close();
    }, 1000);
  }
};
