import React from 'react';
import { createRoot } from 'react-dom/client';

export const printComponent = (component: React.ReactElement) => {
  // Create a hidden iframe
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  iframe.name = 'print-iframe';
  document.body.appendChild(iframe);

  const iframeDoc = iframe.contentWindow?.document;
  if (!iframeDoc) return;

  // Build the print document structure
  iframeDoc.write(`
    <html>
      <head>
        <title>C-ROUTE | PRINT</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap" rel="stylesheet">
        <style>
          @page { 
            size: A4; 
            margin: 0; 
          }
          body { 
            margin: 0; 
            padding: 0; 
            font-family: 'IBM Plex Sans Arabic', sans-serif !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          #print-root { 
            width: 210mm;
            min-height: 297mm;
            margin: 0 auto;
            background: white; 
            padding: 15mm;
            box-sizing: border-box;
          }
          * { -webkit-print-color-adjust: exact !important; }
        </style>
      </head>
      <body dir="rtl">
        <div id="print-root"></div>
      </body>
    </html>
  `);
  iframeDoc.close();

  // Wait for the iframe structure to be ready
  iframe.onload = () => {
    const container = iframeDoc.getElementById('print-root');
    if (container) {
      const root = createRoot(container);
      root.render(component);

      // Short delay for React render + Tailwind CDN
      setTimeout(() => {
        if (iframe.contentWindow) {
          iframe.contentWindow.focus();
          iframe.contentWindow.print();
        }
        
        setTimeout(() => {
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
          }
        }, 2000);
      }, 800);
    }
  };
};
