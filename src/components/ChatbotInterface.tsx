/**
 * Conversational AI Chatbot Interface
 * Multi-step question-answer flow for circuit design
 * Generates PDF output automatically
 */

import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Loader } from 'lucide-react';
import { AICircuitGenerator, CircuitGenerationResult } from '../ai/CircuitGenerator';
import { PDFExporter } from '../utils/PDFExporter';

// ============================================================================
// TYPES
// ============================================================================

interface ChatMessage {
  id: string;
  role: 'bot' | 'user';
  content: string;
  timestamp: Date;
  options?: string[];
}

interface CircuitRequirements {
  circuitType?: string;
  voltage?: string;
  current?: string;
  phases?: string;
  specialRequirements?: string[];
}

enum ConversationStep {
  GREETING = 'greeting',
  CIRCUIT_TYPE = 'circuit_type',
  VOLTAGE = 'voltage',
  CURRENT = 'current',
  PHASES = 'phases',
  SPECIAL_REQUIREMENTS = 'special_requirements',
  CONFIRMATION = 'confirmation',
  GENERATION = 'generation',
  COMPLETE = 'complete',
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const ChatbotInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentStep, setCurrentStep] = useState<ConversationStep>(ConversationStep.GREETING);
  const [requirements, setRequirements] = useState<CircuitRequirements>({});
  const [userInput, setUserInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize conversation
  useEffect(() => {
    addBotMessage(
      "Hello! I'm your AI Electrical Panel Design Assistant. I'll help you design a professional electrical circuit by asking a few questions. Let's get started!",
      []
    );

    setTimeout(() => {
      askCircuitType();
    }, 1000);
  }, []);

  // ============================================================================
  // MESSAGE HANDLING
  // ============================================================================

  const addBotMessage = (content: string, options: string[] = []) => {
    const message: ChatMessage = {
      id: `bot_${Date.now()}`,
      role: 'bot',
      content,
      timestamp: new Date(),
      options,
    };
    setMessages((prev) => [...prev, message]);
  };

  const addUserMessage = (content: string) => {
    const message: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, message]);
  };

  // ============================================================================
  // CONVERSATION FLOW
  // ============================================================================

  const askCircuitType = () => {
    setCurrentStep(ConversationStep.CIRCUIT_TYPE);
    addBotMessage(
      'What type of electrical circuit do you need?',
      [
        'Motor Starter (DOL)',
        'Lighting Control',
        'PLC Control System',
        'Power Distribution',
        'HVAC Control',
        'Pump Control',
      ]
    );
  };

  const askVoltage = () => {
    setCurrentStep(ConversationStep.VOLTAGE);
    addBotMessage(
      'What voltage rating do you need?',
      ['230V Single Phase', '400V Three Phase', '24V DC', '110V AC', 'Custom']
    );
  };

  const askCurrent = () => {
    setCurrentStep(ConversationStep.CURRENT);
    addBotMessage(
      'What is the current rating?',
      ['10A', '16A', '25A', '32A', '63A', 'Custom']
    );
  };

  const askPhases = () => {
    setCurrentStep(ConversationStep.PHASES);
    addBotMessage(
      'How many phases?',
      ['Single Phase', 'Three Phase']
    );
  };

  const askSpecialRequirements = () => {
    setCurrentStep(ConversationStep.SPECIAL_REQUIREMENTS);
    addBotMessage(
      'Any special requirements? (Select all that apply, or type "none")',
      [
        'Emergency Stop',
        'Overload Protection',
        'Remote Control',
        'Status Indicators',
        'Auto/Manual Switch',
        'None',
      ]
    );
  };

  const showConfirmation = () => {
    setCurrentStep(ConversationStep.CONFIRMATION);

    const summary = `
Perfect! Here's what I understood:

📋 Circuit Type: ${requirements.circuitType}
⚡ Voltage: ${requirements.voltage}
🔌 Current: ${requirements.current}
🔧 Phases: ${requirements.phases}
✨ Special Requirements: ${requirements.specialRequirements?.join(', ') || 'None'}

Shall I proceed with generating your circuit design?
    `.trim();

    addBotMessage(summary, ['Yes, Generate Circuit', 'No, Start Over']);
  };

  const generateCircuit = async () => {
    setCurrentStep(ConversationStep.GENERATION);
    setIsGenerating(true);

    addBotMessage('Generating your circuit design... Please wait.');

    // Simulate AI processing
    setTimeout(() => {
      // Build description from requirements
      const description = buildDescriptionFromRequirements(requirements);

      // Generate circuit using AI
      const result: CircuitGenerationResult = AICircuitGenerator.generateFromDescription(description);

      if (result.success && result.template) {
        addBotMessage(
          `✅ Circuit generated successfully!\n\nPattern Used: ${result.patternUsed}\nConfidence: ${Math.round((result.confidence || 0) * 100)}%\n\nGenerating PDF documentation...`
        );

        // Generate and download PDF
        setTimeout(() => {
          try {
            const pdf = PDFExporter.generateDOLStarterPDF();
            pdf.save(`${requirements.circuitType?.replace(/\s/g, '_')}_Circuit.pdf`);

            addBotMessage(
              '🎉 Your circuit has been designed and the PDF has been downloaded!\n\nWould you like to design another circuit?',
              ['Yes, Design Another', 'No, Thank You']
            );

            setCurrentStep(ConversationStep.COMPLETE);
          } catch (error) {
            addBotMessage('❌ Error generating PDF. Please try again.');
          }
          setIsGenerating(false);
        }, 2000);
      } else {
        addBotMessage('❌ Failed to generate circuit. Please check your requirements and try again.');
        setIsGenerating(false);
      }
    }, 1500);
  };

  const buildDescriptionFromRequirements = (reqs: CircuitRequirements): string => {
    let desc = `${reqs.circuitType} circuit`;
    if (reqs.voltage) desc += ` with ${reqs.voltage}`;
    if (reqs.current) desc += ` rated at ${reqs.current}`;
    if (reqs.phases) desc += ` ${reqs.phases}`;
    if (reqs.specialRequirements && reqs.specialRequirements.length > 0) {
      desc += ` including ${reqs.specialRequirements.join(', ')}`;
    }
    return desc;
  };

  const resetConversation = () => {
    setMessages([]);
    setRequirements({});
    setCurrentStep(ConversationStep.GREETING);

    addBotMessage("Let's design another circuit! I'm ready when you are.");
    setTimeout(() => {
      askCircuitType();
    }, 1000);
  };

  // ============================================================================
  // USER INPUT HANDLING
  // ============================================================================

  const handleOptionClick = (option: string) => {
    addUserMessage(option);

    switch (currentStep) {
      case ConversationStep.CIRCUIT_TYPE:
        setRequirements((prev) => ({ ...prev, circuitType: option }));
        setTimeout(() => askVoltage(), 500);
        break;

      case ConversationStep.VOLTAGE:
        setRequirements((prev) => ({ ...prev, voltage: option }));
        setTimeout(() => askCurrent(), 500);
        break;

      case ConversationStep.CURRENT:
        setRequirements((prev) => ({ ...prev, current: option }));
        setTimeout(() => askPhases(), 500);
        break;

      case ConversationStep.PHASES:
        setRequirements((prev) => ({ ...prev, phases: option }));
        setTimeout(() => askSpecialRequirements(), 500);
        break;

      case ConversationStep.SPECIAL_REQUIREMENTS:
        const currentReqs = requirements.specialRequirements || [];
        if (option === 'None') {
          setRequirements((prev) => ({ ...prev, specialRequirements: [] }));
          setTimeout(() => showConfirmation(), 500);
        } else {
          setRequirements((prev) => ({
            ...prev,
            specialRequirements: [...currentReqs, option],
          }));
          // Allow multiple selections
          addBotMessage('Added! Select more or click "None" when done.', [
            'Emergency Stop',
            'Overload Protection',
            'Remote Control',
            'Status Indicators',
            'Auto/Manual Switch',
            'None',
          ]);
        }
        break;

      case ConversationStep.CONFIRMATION:
        if (option === 'Yes, Generate Circuit') {
          generateCircuit();
        } else {
          resetConversation();
        }
        break;

      case ConversationStep.COMPLETE:
        if (option === 'Yes, Design Another') {
          resetConversation();
        } else {
          addBotMessage('Thank you for using AutoPanel Design! Have a great day! 👋');
        }
        break;
    }
  };

  const handleSendMessage = () => {
    if (!userInput.trim()) return;

    handleOptionClick(userInput);
    setUserInput('');
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">AI Circuit Designer</h2>
            <p className="text-sm text-slate-500">Conversational electrical panel design</p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.role === 'bot'
                  ? 'bg-gradient-to-br from-blue-500 to-purple-600'
                  : 'bg-gradient-to-br from-green-500 to-emerald-600'
              }`}
            >
              {message.role === 'bot' ? (
                <Bot className="w-5 h-5 text-white" />
              ) : (
                <User className="w-5 h-5 text-white" />
              )}
            </div>

            {/* Message Content */}
            <div className={`flex flex-col gap-2 max-w-2xl ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div
                className={`px-4 py-3 rounded-2xl shadow-sm ${
                  message.role === 'bot'
                    ? 'bg-white text-slate-800 border border-slate-200'
                    : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                }`}
              >
                <p className="whitespace-pre-line">{message.content}</p>
              </div>

              {/* Quick Reply Options */}
              {message.role === 'bot' && message.options && message.options.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {message.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleOptionClick(option)}
                      disabled={isGenerating}
                      className="px-4 py-2 bg-white border-2 border-blue-500 text-blue-600 rounded-full
                               hover:bg-blue-50 transition-colors text-sm font-medium shadow-sm
                               disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}

              {/* Timestamp */}
              <span className="text-xs text-slate-400">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}

        {/* Loading Indicator */}
        {isGenerating && (
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Loader className="w-5 h-5 text-white animate-spin" />
            </div>
            <div className="px-4 py-3 bg-white rounded-2xl border border-slate-200">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-slate-200 px-6 py-4">
        <div className="flex gap-3 items-center">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your custom response or use quick replies above..."
            disabled={isGenerating}
            className="flex-1 px-4 py-3 border border-slate-300 rounded-full focus:outline-none
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     disabled:bg-slate-100 disabled:cursor-not-allowed"
          />
          <button
            onClick={handleSendMessage}
            disabled={!userInput.trim() || isGenerating}
            className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full
                     flex items-center justify-center hover:shadow-lg transition-shadow
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>

        {/* Info */}
        <p className="text-xs text-slate-400 mt-3 text-center">
          Powered by Claude AI • AutoPanel Design v1.3
        </p>
      </div>
    </div>
  );
};

export default ChatbotInterface;
