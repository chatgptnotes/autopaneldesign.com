/**
 * Export PDF Button: Generate and download professional circuit diagrams
 */

import React, { useState } from 'react';
import { PDFExporter, DOL_STARTER_CIRCUIT } from '../utils/PDFExporter';

interface ExportPDFButtonProps {
  compact?: boolean;
}

const ExportPDFButton: React.FC<ExportPDFButtonProps> = ({ compact = false }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleExportDOL = () => {
    setIsGenerating(true);

    // Simulate processing time for better UX
    setTimeout(() => {
      try {
        const pdf = PDFExporter.generateDOLStarterPDF(DOL_STARTER_CIRCUIT);
        PDFExporter.downloadPDF(pdf, 'DOL_Motor_Starter_Circuit.pdf');

        // Success notification (you can enhance this with a toast library)
        alert('PDF generated successfully! Check your downloads folder.');
      } catch (error) {
        console.error('PDF generation failed:', error);
        alert('Failed to generate PDF. Please try again.');
      } finally {
        setIsGenerating(false);
      }
    }, 500);
  };

  return (
    <div className="relative">
      <button
        onClick={handleExportDOL}
        disabled={isGenerating}
        className={`bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white rounded-lg font-medium transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg flex items-center gap-2 ${
          compact ? 'px-4 py-2 text-sm' : 'px-6 py-3'
        }`}
      >
        {isGenerating ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Generating PDF...</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span>Export DOL Starter PDF</span>
          </>
        )}
      </button>

      {/* Info tooltip */}
      {!compact && (
        <div className="mt-2 text-xs text-gray-600">
          <p>Complete 3-page professional circuit diagram with:</p>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>Circuit schematic</li>
            <li>Bill of Materials (BOM)</li>
            <li>Wiring connections table</li>
            <li>Technical notes & safety warnings</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ExportPDFButton;
