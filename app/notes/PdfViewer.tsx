"use client";
import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerProps {
  pdfUrl: string;
  isMobile: boolean;
}

export default function PdfViewer({ pdfUrl, isMobile }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  return (
    <div 
      className="relative bg-white rounded-xl shadow-xl overflow-y-auto pdf-viewer-container flex justify-center bg-gray-100"
      style={{
        height: 'calc(100vh - 350px)',
        minHeight: '500px',
        maxHeight: '900px'
      }}
      onContextMenu={(e) => e.preventDefault()}
    >
      <Document
        file={pdfUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={
          <div className="absolute inset-0 flex items-center justify-center z-10 w-full h-full min-h-[500px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F4A261] mx-auto mb-4"></div>
              <p className="text-gray-600">Loading PDF Pages...</p>
            </div>
          </div>
        }
        className="flex flex-col items-center py-4"
      >
        {Array.from(new Array(numPages || 0), (el, index) => (
          <Page 
            key={`page_${index + 1}`} 
            pageNumber={index + 1} 
            renderTextLayer={false}
            renderAnnotationLayer={false}
            className="mb-4 shadow-md"
            width={isMobile ? (window.innerWidth >= 360 ? window.innerWidth - 60 : 300) : 800}
          />
        ))}
      </Document>
    </div>
  );
}
