/**
 * AI Prompt Panel: Natural language interface for circuit generation
 * Uses Google Gemini AI to generate real electrical circuit diagrams from descriptions
 */

import React, { useState } from 'react';
import { AICircuitGenerator, CircuitGenerationResultWithImage } from '../ai/CircuitGenerator';
import { useStore } from '../store';
import ExportPDFButton from './ExportPDFButton';
import { GeminiAPIError } from '../types';

const AIPromptPanel: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<CircuitGenerationResultWithImage | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<GeminiAPIError | null>(null);

  const { addComponent, addConnection, componentLibrary } = useStore();

  const examplePrompts = [
    'Create a 3-phase motor starter circuit with start and stop buttons',
    'Design a lighting control system with relay and manual switch',
    'Build a PLC control system with 24VDC power supply and sensors',
    'Make a power distribution panel with main breaker and 3 sub-circuits',
    'Create an HVAC control system with temperature sensor and fan control',
    'Design an automatic pump control with water level sensors',
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setError(null);
    setResult(null);

    try {
      // Use Gemini AI for circuit generation WITH image generation
      const generationResult = await AICircuitGenerator.generateCircuitWithImage(
        prompt,
        componentLibrary
      );

      setResult(generationResult);

      // Check for errors in the result
      if (generationResult.error) {
        setError(generationResult.error);
      } else if (generationResult.success && generationResult.template) {
        // If successful, apply the circuit
        applyCircuitTemplate(generationResult.template);
      }
    } catch (err) {
      setError({
        type: 'UNKNOWN',
        message: 'An unexpected error occurred',
        details: err instanceof Error ? err.message : String(err),
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const applyCircuitTemplate = (template: any) => {
    const componentMap = new Map<string, string>();

    // Add components
    template.components.forEach((comp: any) => {
      // Find matching component definition in library
      const definition = componentLibrary.find((def) => def.type === comp.type);

      if (definition) {
        const instanceId = addComponent(definition, comp.position || { x: 100, y: 100 });
        componentMap.set(comp.id, instanceId);
      }
    });

    // Add connections
    setTimeout(() => {
      template.connections.forEach((conn: any) => {
        const fromInstanceId = componentMap.get(conn.from.componentId);
        const toInstanceId = componentMap.get(conn.to.componentId);

        if (fromInstanceId && toInstanceId) {
          // Construct pin IDs (simplified - in production would need actual pin mapping)
          const fromPinId = `${fromInstanceId}_${conn.from.pin}`;
          const toPinId = `${toInstanceId}_${conn.to.pin}`;

          try {
            addConnection(fromPinId, toPinId);
          } catch (error) {
            console.error('Connection failed:', error);
          }
        }
      });
    }, 500);
  };

  const handleExampleClick = (example: string) => {
    setPrompt(example);
  };

  const getConfidenceColor = (confidence: number): string => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceLabel = (confidence: number): string => {
    if (confidence >= 0.8) return 'High Confidence';
    if (confidence >= 0.6) return 'Medium Confidence';
    return 'Low Confidence';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">AI Circuit Generator</h2>
        <p className="text-sm text-gray-600">
          Describe your electrical circuit in plain English, and let AI generate the wiring diagram automatically.
        </p>
      </div>

      {/* Prompt Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Describe your circuit:
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Example: Create a motor starter circuit with overload protection and start/stop buttons..."
          className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          disabled={isGenerating}
        />
      </div>

      {/* Generate Button */}
      <div className="mb-6 flex gap-4">
        <button
          onClick={handleGenerate}
          disabled={!prompt.trim() || isGenerating}
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          {isGenerating ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>AI is designing...</span>
            </>
          ) : (
            <>
              <span className="material-icons text-sm">auto_fix_high</span>
              <span>Generate with AI</span>
            </>
          )}
        </button>

        <button
          onClick={() => {
            setPrompt('');
            setResult(null);
            setError(null);
          }}
          className="px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
        >
          Clear
        </button>
      </div>

      {/* Example Prompts */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Example Prompts:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {examplePrompts.map((example, index) => (
            <button
              key={index}
              onClick={() => handleExampleClick(example)}
              className="text-left px-4 py-2 bg-gray-50 hover:bg-blue-50 border border-gray-200 rounded-lg text-sm text-gray-700 hover:text-blue-600 transition-colors"
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <span className="material-icons text-red-600 mt-0.5">error</span>
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800 mb-1">
                {error.type === 'API_KEY_INVALID' && 'API Key Error'}
                {error.type === 'RATE_LIMIT' && 'Rate Limit Exceeded'}
                {error.type === 'NETWORK_ERROR' && 'Network Error'}
                {error.type === 'PARSE_ERROR' && 'AI Response Error'}
                {error.type === 'UNKNOWN' && 'Unexpected Error'}
              </p>
              <p className="text-sm text-red-700">{error.message}</p>
              {error.details && (
                <p className="text-xs text-red-600 mt-2 font-mono bg-red-100 p-2 rounded">
                  {error.details}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* AI Processing Indicator */}
      {isGenerating && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <div>
              <p className="text-sm font-medium text-blue-800">AI is designing your circuit...</p>
              <p className="text-xs text-blue-600">Using Google Gemini to analyze your requirements</p>
            </div>
          </div>
        </div>
      )}

      {/* Generation Result */}
      {result && !error && (
        <div className="border-t border-gray-200 pt-6">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-800">Generation Result</h3>
              <div className={`text-sm font-medium ${getConfidenceColor(result.confidence)}`}>
                {getConfidenceLabel(result.confidence)} ({(result.confidence * 100).toFixed(0)}%)
              </div>
            </div>

            {result.success ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-3">
                  <span className="material-icons text-green-600 mt-0.5">check_circle</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-green-800 mb-1">
                      Circuit Generated Successfully!
                    </p>
                    <p className="text-sm text-green-700">
                      Generated by: <span className="font-semibold">{result.patternUsed}</span>
                    </p>
                    {result.template && (
                      <p className="text-sm text-green-700 mt-2">
                        {result.template.description}
                      </p>
                    )}
                    {result.reasoning && (
                      <div className="mt-3 pt-3 border-t border-green-200">
                        <p className="text-xs font-medium text-green-800 mb-1">AI Reasoning:</p>
                        <p className="text-xs text-green-700">{result.reasoning}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-3">
                  <span className="material-icons text-red-600 mt-0.5">error</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-red-800 mb-1">
                      Could not generate circuit
                    </p>
                    <p className="text-sm text-red-700">
                      Try rephrasing your description or use one of the example prompts.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Suggestions */}
          {result.suggestions && result.suggestions.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-yellow-800 mb-2">Suggestions:</h4>
              <ul className="list-disc list-inside space-y-1">
                {result.suggestions.map((suggestion, index) => (
                  <li key={index} className="text-sm text-yellow-700">
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Circuit Details */}
          {result.success && result.template && (
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Circuit Details:</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Components</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {result.template.components.length}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Connections</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {result.template.connections.length}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* AI-Generated Diagram Preview */}
          {result.success && result.diagramImage && (
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">
                AI-Generated Circuit Diagram:
              </h4>
              <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                <img
                  src={result.diagramImage}
                  alt="AI-Generated Circuit Diagram"
                  className="w-full h-auto"
                />
              </div>
              {result.imageDescription && (
                <p className="text-xs text-gray-500 mt-2 italic">
                  {result.imageDescription}
                </p>
              )}
            </div>
          )}

          {/* Image Generation Error (if circuit succeeded but image failed) */}
          {result.success && result.imageError && (
            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-700">
                <span className="font-medium">Note:</span> Circuit generated successfully, but image generation failed.
                The PDF will use the standard schematic renderer.
              </p>
            </div>
          )}
        </div>
      )}

      {/* PDF Export Section */}
      <div className="mt-6 border-t border-gray-200 pt-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-4">Export Professional Documentation:</h4>
        <ExportPDFButton
          aiTemplate={result?.success ? result.template : null}
          aiGeneratedImage={result?.success ? result.diagramImage : undefined}
          aiConfig={{
            voltage: '400V AC',
            phases: 3,
            frequency: '50Hz',
            projectName: 'AI Generated Circuit',
          }}
        />
      </div>

      {/* Help Section */}
      <div className="mt-6 border-t border-gray-200 pt-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Tips for better results:</h4>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start gap-2">
            <span className="material-icons text-xs mt-0.5">check</span>
            <span>Be specific about component types (MCB, relay, contactor, PLC, etc.)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="material-icons text-xs mt-0.5">check</span>
            <span>Include voltage and current ratings when known (e.g., "24V DC", "16A")</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="material-icons text-xs mt-0.5">check</span>
            <span>Mention control type (manual, automatic, PLC-based)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="material-icons text-xs mt-0.5">check</span>
            <span>Add safety requirements (overload protection, emergency stop, etc.)</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AIPromptPanel;
