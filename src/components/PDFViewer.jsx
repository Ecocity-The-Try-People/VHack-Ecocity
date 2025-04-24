import { useState, useEffect } from 'react';

export function PDFViewer({ pdfData }) {
  const [pdfUrl, setPdfUrl] = useState('');

  useEffect(() => {
    // Create blob URL from base64 data
    const binaryString = window.atob(pdfData.split(',')[1]);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    setPdfUrl(url);

    // Clean up
    return () => URL.revokeObjectURL(url);
  }, [pdfData]);

  return (
    <iframe
      src={pdfUrl}
      className="w-full h-full"
      title="PDF Viewer"
    />
  );
}