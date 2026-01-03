/**
 * Export PDF Button: Generate and download professional circuit diagrams
 * Supports both static DOL starter and AI-generated circuits
 */

import React, { useState, useRef, useCallback } from 'react';
import { PDFExporter, DOL_STARTER_CIRCUIT } from '../utils/PDFExporter';
import { CircuitTemplate } from '../ai/CircuitGenerator';
import { DynamicEPLANRenderer } from './DynamicEPLANRenderer';
import { svgToImage } from '../utils/svgToImage';

interface ExportPDFButtonProps {
  compact?: boolean;
  // For AI-generated circuits
  aiTemplate?: CircuitTemplate | null;
  aiGeneratedImage?: string; // Base64 data URL of Gemini-generated circuit diagram
  aiConfig?: {
    voltage?: string;
    phases?: number;
    frequency?: string;
    projectName?: string;
  };
}

const ExportPDFButton: React.FC<ExportPDFButtonProps> = ({
  compact = false,
  aiTemplate = null,
  aiGeneratedImage,
  aiConfig = {},
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const diagramRef = useRef<HTMLDivElement>(null);

  // Export DOL Starter (legacy)
  const handleExportDOL = () => {
    setIsGenerating(true);

    setTimeout(() => {
      try {
        const pdf = PDFExporter.generateDOLStarterPDF(DOL_STARTER_CIRCUIT);
        PDFExporter.downloadPDF(pdf, 'DOL_Motor_Starter_Circuit.pdf');
        alert('PDF generated successfully! Check your downloads folder.');
      } catch (error) {
        console.error('PDF generation failed:', error);
        alert('Failed to generate PDF. Please try again.');
      } finally {
        setIsGenerating(false);
      }
    }, 500);
  };

  // Export AI-generated circuit
  const handleExportAI = useCallback(async () => {
    if (!aiTemplate) {
      alert('No AI-generated circuit available. Generate a circuit first.');
      return;
    }

    setIsGenerating(true);

    try {
      let diagramImage: string;

      // Use AI-generated image if available, otherwise fall back to SVG rendering
      if (aiGeneratedImage) {
        diagramImage = aiGeneratedImage;
      } else if (diagramRef.current) {
        // Wait a bit for the diagram to render
        await new Promise((resolve) => setTimeout(resolve, 300));

        // Find the SVG element in the diagram container
        const svgElement = diagramRef.current.querySelector('svg');
        if (!svgElement) {
          throw new Error('Could not find SVG element');
        }

        // Capture the SVG as an image
        diagramImage = await svgToImage(svgElement as SVGSVGElement, {
          width: 1200,
          height: 800,
          backgroundColor: '#ffffff',
        });
      } else {
        throw new Error('No diagram available');
      }

      // Generate the PDF with the diagram
      const pdf = PDFExporter.generateAICircuitPDF(aiTemplate, diagramImage, {
        voltage: aiConfig.voltage || '400V AC',
        phases: aiConfig.phases || 3,
        frequency: aiConfig.frequency || '50Hz',
        projectName: aiConfig.projectName || 'AI Generated Circuit',
      });

      // Download the PDF
      const filename = `AI_Circuit_${new Date().toISOString().slice(0, 10)}.pdf`;
      PDFExporter.downloadPDF(pdf, filename);

      alert('AI Circuit PDF generated successfully! Check your downloads folder.');
    } catch (error) {
      console.error('AI PDF generation failed:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  }, [aiTemplate, aiConfig, aiGeneratedImage]);

  // If we have an AI template, show the AI export button
  if (aiTemplate) {
    return (
      <div className="relative">
        {/* Hidden diagram for capture */}
        <div
          ref={diagramRef}
          className="absolute left-[-9999px] top-0"
          style={{ width: '1200px', height: '800px' }}
        >
          <DynamicEPLANRenderer
            template={aiTemplate}
            config={{
              voltage: aiConfig.voltage || '400V AC',
              phases: aiConfig.phases || 3,
              frequency: aiConfig.frequency || '50Hz',
              motorPower: '7.5kW',
            }}
            titleBlock={{
              projectName: aiConfig.projectName || 'AI Generated Circuit',
              drawingTitle: aiTemplate.description,
            }}
          />
        </div>

        {/* Export button */}
        <button
          onClick={handleExportAI}
          disabled={isGenerating}
          className={`bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg font-medium transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg flex items-center gap-2 ${
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
              <span>Export AI Circuit PDF</span>
            </>
          )}
        </button>

        {!compact && (
          <div className="mt-2 text-xs text-gray-600">
            <p>
              {aiGeneratedImage
                ? 'Gemini AI-generated circuit diagram with:'
                : 'AI-generated professional circuit diagram with:'}
            </p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              {aiGeneratedImage && <li>Gemini 2.5 Flash Image schematic</li>}
              {!aiGeneratedImage && <li>EPLAN-style circuit schematic</li>}
              <li>Bill of Materials (BOM)</li>
              <li>Wiring connections table</li>
              <li>Technical specifications</li>
            </ul>
          </div>
        )}
      </div>
    );
  }

  // Default: DOL Starter export
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
