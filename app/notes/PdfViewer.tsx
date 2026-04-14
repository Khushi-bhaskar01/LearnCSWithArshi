"use client";
import { useState, useRef, useEffect, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerProps {
  pdfUrl: string;
  isMobile: boolean;
  noteName?: string;
}

// TOC definitions per subject
const TOC_MAP: Record<string, { label: string; page: number }[]> = {
  TOC: [
    { label: "Part 1", page: 4 },
    { label: "Part 2", page: 193 },
    { label: "Part 3", page: 314 },
    { label: "Part 4", page: 387 },
  ],
  OS: [
    { label: "Part 1", page: 3 },
    { label: "Part 2", page: 126 },
    { label: "Part 3", page: 228 },
    { label: "Part 4", page: 368 },
  ],
};

function detectSubject(noteName?: string): string | null {
  if (!noteName) return null;
  const upper = noteName.toUpperCase();
  if (upper.includes("TOC") || upper.includes("THEORY OF COMPUTATION")) return "TOC";
  if (upper.includes("OS") || upper.includes("OPERATING SYSTEM")) return "OS";
  return null;
}

export default function PdfViewer({ pdfUrl, isMobile, noteName }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [jumpPage, setJumpPage] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [tocOpen, setTocOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);

  const subject = detectSubject(noteName);
  const tocEntries = subject ? TOC_MAP[subject] : null;

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  // Scroll to a specific page
  const scrollToPage = useCallback((pageNum: number) => {
    const idx = pageNum - 1;
    const el = pageRefs.current[idx];
    if (el && containerRef.current) {
      containerRef.current.scrollTo({ top: el.offsetTop - 8, behavior: 'smooth' });
    }
    setTocOpen(false);
  }, []);

  // Fullscreen toggle via the Fullscreen API
  const toggleFullscreen = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const handler = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  const pageWidth = isMobile
    ? typeof window !== 'undefined' && window.innerWidth >= 360
      ? window.innerWidth - 60
      : 300
    : isFullscreen
    ? Math.min(window.innerWidth - 40, 1100)
    : 800;

  return (
    <div
      ref={containerRef}
      className="pdf-viewer-root relative bg-gray-100 rounded-xl shadow-xl overflow-y-auto flex flex-col"
      style={{
        height: isFullscreen ? '100vh' : 'calc(100vh - 350px)',
        minHeight: '500px',
        maxHeight: isFullscreen ? '100vh' : '900px',
        background: isFullscreen ? '#1a1a2e' : undefined,
      }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* ── Toolbar ── */}
      <div
        className="sticky top-0 z-20 flex items-center gap-2 px-4 py-2 backdrop-blur-sm"
        style={{
          background: isFullscreen
            ? 'rgba(26,26,46,0.95)'
            : 'rgba(255,255,255,0.92)',
          borderBottom: '1px solid rgba(244,162,97,0.25)',
        }}
      >
        {/* TOC Dropdown */}
        {tocEntries && (
          <div className="relative">
            <button
              onClick={() => setTocOpen((v) => !v)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all"
              style={{
                background: 'linear-gradient(135deg,#F4A261,#E76F51)',
                color: '#fff',
                boxShadow: '0 2px 8px rgba(244,162,97,0.35)',
              }}
              title="Table of Contents"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M5 10.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm-2-1a.5.5 0 1 0 0 1 .5.5 0 0 0 0-1zm0 2a.5.5 0 1 0 0 1 .5.5 0 0 0 0-1zm0 2a.5.5 0 1 0 0 1 .5.5 0 0 0 0-1z"/>
                <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2zm10-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1z"/>
              </svg>
              Contents
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                <path d={tocOpen ? "M7.247 4.86l-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592c.86 0 1.32-1.012.753-1.659L8.753 4.86a1 1 0 0 0-1.506 0z" : "M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"} />
              </svg>
            </button>

            {tocOpen && (
              <div
                className="absolute left-0 mt-1 rounded-xl shadow-2xl overflow-hidden z-30 animate-fade-in"
                style={{
                  background: isFullscreen ? '#1e1e3a' : '#fff',
                  border: '1px solid rgba(244,162,97,0.3)',
                  minWidth: '180px',
                }}
              >
                <div className="px-4 py-2 text-xs font-bold tracking-widest uppercase" style={{ color: '#F4A261', borderBottom: '1px solid rgba(244,162,97,0.2)' }}>
                  {subject} – Chapters
                </div>
                {tocEntries.map((entry) => (
                  <button
                    key={entry.label}
                    onClick={() => scrollToPage(entry.page)}
                    className="w-full text-left flex items-center justify-between px-4 py-2.5 text-sm transition-all hover:bg-orange-50"
                    style={{ color: isFullscreen ? '#e0e0ff' : '#333' }}
                  >
                    <span className="font-medium">{entry.label}</span>
                    <span className="text-xs ml-4 px-2 py-0.5 rounded-full font-mono" style={{ background: 'rgba(244,162,97,0.15)', color: '#E76F51' }}>
                      pg {entry.page}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Page count */}
        {numPages && (
          <span className="text-xs font-mono px-2" style={{ color: isFullscreen ? '#aaa' : '#888' }}>
            {numPages} pages
          </span>
        )}

        {/* Fullscreen button */}
        <button
          onClick={toggleFullscreen}
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all"
          style={{
            background: isFullscreen ? 'rgba(244,162,97,0.2)' : '#f3f4f6',
            color: isFullscreen ? '#F4A261' : '#555',
            border: isFullscreen ? '1px solid rgba(244,162,97,0.4)' : '1px solid #e5e7eb',
          }}
        >
          {isFullscreen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M5.5 0a.5.5 0 0 1 .5.5v4A1.5 1.5 0 0 1 4.5 6h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5zm5 0a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 10 4.5v-4a.5.5 0 0 1 .5-.5zM0 10.5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 6 11.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5zm10 1a1.5 1.5 0 0 1 1.5-1.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4z"/>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M1.5 1h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4A1.5 1.5 0 0 1 1.5 1zm9 0a.5.5 0 0 1 0-1h4A1.5 1.5 0 0 1 16 1.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4zm-9 9a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 0 14.5v-4a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5z"/>
            </svg>
          )}
          {isFullscreen ? "Exit" : "Fullscreen"}
        </button>
      </div>

      {/* ── PDF Document ── */}
      <div className="flex-1 flex justify-center">
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="flex items-center justify-center w-full h-full min-h-[500px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F4A261] mx-auto mb-4"></div>
                <p className="text-gray-600">Loading PDF Pages...</p>
              </div>
            </div>
          }
          className="flex flex-col items-center py-4"
        >
          {Array.from(new Array(numPages || 0), (_, index) => (
            <div
              key={`page_wrap_${index + 1}`}
              ref={(el) => { pageRefs.current[index] = el; }}
            >
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                className="mb-4 shadow-md"
                width={pageWidth}
              />
            </div>
          ))}
        </Document>
      </div>
    </div>
  );
}
