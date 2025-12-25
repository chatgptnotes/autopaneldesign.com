/**
 * FAQ Component with Schema.org Markup for SEO
 * Frequently Asked Questions about AutoPanel Design
 */

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    question: "What is AutoPanel Design and how does it work?",
    answer: "AutoPanel Design is a free, AI-powered electrical panel design tool that helps you create professional electrical circuits and control panels. Simply describe your requirements in plain English (like 'Create a DOL motor starter with overload protection'), and our AI generates complete circuit diagrams with 2D schematics and 3D panel layouts. No installation required - everything runs in your web browser.",
    category: "Getting Started"
  },
  {
    question: "Is AutoPanel Design really free? Are there any hidden costs?",
    answer: "Yes, AutoPanel Design is completely free with no hidden costs, subscriptions, or feature limitations. Unlike expensive ECAD software like EPLAN ($5,000+) or AutoCAD Electrical ($2,315/year), we provide professional-grade electrical panel design tools at zero cost. You get unlimited access to AI circuit generation, 3D visualization, PDF exports, and our complete component library.",
    category: "Pricing"
  },
  {
    question: "What types of electrical circuits can I design?",
    answer: "You can design a wide range of industrial electrical circuits including: DOL (Direct Online) motor starters, Star-Delta starters, reversing starters, PLC control systems, lighting control circuits, HVAC control systems, pump control circuits, power distribution panels, and custom control panels. Our AI recognizes over 100+ electrical components from major manufacturers like Siemens, ABB, and Schneider Electric.",
    category: "Features"
  },
  {
    question: "Do I need to install any software?",
    answer: "No installation required! AutoPanel Design is a web-based application that runs entirely in your browser. Just visit www.autopaneldesign.com and start designing immediately. It works on Windows, Mac, Linux, and even tablets. All you need is a modern web browser with JavaScript enabled.",
    category: "Technical"
  },
  {
    question: "How does the AI circuit designer work?",
    answer: "Our AI uses advanced pattern recognition to understand your electrical requirements described in natural language. When you say 'motor starter with emergency stop', the AI identifies the circuit type, selects appropriate components (circuit breaker, contactor, overload relay, buttons), generates proper wiring connections, and creates both 2D electrical schematics and 3D DIN rail layouts - all following IEC and NEC standards.",
    category: "AI Features"
  },
  {
    question: "Can I export my designs for documentation?",
    answer: "Yes! AutoPanel Design generates professional 3-page PDF documentation including: complete circuit diagrams with electrical symbols, detailed Bill of Materials (BOM) with manufacturer part numbers, wiring connection tables, technical installation notes, safety warnings, and standards compliance information (IEC 60204-1, NEC Article 430). You can also export circuit diagrams as PNG images.",
    category: "Export"
  },
  {
    question: "Is the software suitable for professional electrical engineers?",
    answer: "Absolutely! AutoPanel Design follows industry standards (IEC 60204-1, IEC 60947, NEC) and uses real component specifications from manufacturers like Siemens, ABB, Schneider Electric, Phoenix Contact, and WAGO. Professional engineers use it for quick panel quotes, customer presentations, and project documentation. It's also perfect for students learning electrical panel design.",
    category: "Professional Use"
  },
  {
    question: "What is the 3D panel viewer and how does it help?",
    answer: "The 3D panel viewer shows exactly how your electrical components will be physically mounted on DIN rails inside the control panel. You can drag and drop components, check for collisions, verify spacing requirements, and visualize wire routing in 3D space. This digital twin feature ensures your design will fit properly before ordering components or starting installation.",
    category: "3D Features"
  },
  {
    question: "Does it comply with electrical safety standards?",
    answer: "Yes, AutoPanel Design includes automatic safety validation for IEC 60204-1 (Safety of Machinery), IEC 60947 (Low-voltage Switchgear), and NEC Article 430 (Motors). The AI checks for proper overcurrent protection, correct wire sizing, safety interlocks, emergency stop requirements, and component ratings. You'll get warnings if your design doesn't meet safety standards.",
    category: "Safety & Compliance"
  },
  {
    question: "Can I use it for commercial projects?",
    answer: "Yes! AutoPanel Design is free for both personal and commercial use. Electrical contractors use it for customer quotes, panel shops for production designs, maintenance teams for retrofit planning, and OEMs for machine control panels. The generated PDFs are production-ready and can be submitted for regulatory approval.",
    category: "Commercial Use"
  },
  {
    question: "What's included in the component library?",
    answer: "Our library includes 100+ industrial electrical components: Circuit Breakers (MCBs) from Siemens and Schneider, Contactors from ABB and Siemens, Relays from Finder, PLCs (Siemens S7-1200), Power Supplies from Phoenix Contact, Terminal Blocks from WAGO, Motors from WEG, Indicators from IDEC, and Fuses from Littelfuse. All with real specifications and part numbers.",
    category: "Components"
  },
  {
    question: "How is this different from AutoCAD Electrical or EPLAN?",
    answer: "Key differences: 1) FREE vs $2,000-$15,000/year, 2) Web-based vs desktop installation, 3) AI-powered conversational design vs manual drafting, 4) Learn in minutes vs months of training, 5) Instant 3D visualization vs separate tools, 6) No IT infrastructure needed. We focus on speed and ease-of-use while traditional ECAD tools offer more advanced features for large enterprises.",
    category: "Comparison"
  },
  {
    question: "Is my data secure and private?",
    answer: "Yes, your designs are processed client-side in your browser. We don't store your circuit designs on our servers. PDF generation happens locally on your computer. No account creation required, no data collection, and HTTPS encryption protects all communications. Your intellectual property stays with you.",
    category: "Security"
  },
  {
    question: "Can I collaborate with my team?",
    answer: "Currently, AutoPanel Design is single-user focused. Collaboration features (cloud storage, team sharing, real-time editing) are planned for version 2.0 in Q2 2025. For now, you can share designs via PDF exports or save projects locally.",
    category: "Collaboration"
  },
  {
    question: "What browsers are supported?",
    answer: "AutoPanel Design works on all modern browsers: Chrome, Edge, Firefox, Safari (desktop and mobile). For best performance with 3D visualization, we recommend Chrome or Edge. Mobile browsers work great for viewing and simple editing, but desktop is recommended for complex designs.",
    category: "Technical"
  },
];

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Generate schema.org FAQPage markup
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FAQ_DATA.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <div className="w-full">
      {/* Schema.org Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-slate-600">
            Everything you need to know about AutoPanel Design
          </p>
        </div>

        <div className="space-y-4">
          {FAQ_DATA.map((faq, index) => (
            <div
              key={index}
              className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden transition-all hover:shadow-md"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <div className="flex-1 pr-4">
                  {faq.category && (
                    <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1 block">
                      {faq.category}
                    </span>
                  )}
                  <h3 className="text-lg font-semibold text-slate-800">
                    {faq.question}
                  </h3>
                </div>
                <div className="flex-shrink-0">
                  {openIndex === index ? (
                    <ChevronUp className="w-5 h-5 text-slate-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-600" />
                  )}
                </div>
              </button>

              {openIndex === index && (
                <div className="px-6 pb-4">
                  <div className="pt-2 border-t border-slate-100">
                    <p className="text-slate-700 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center p-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
          <h3 className="text-2xl font-bold text-slate-800 mb-3">
            Still have questions?
          </h3>
          <p className="text-slate-600 mb-6">
            Try AutoPanel Design now - it's free and requires no installation!
          </p>
          <a
            href="https://github.com/chatgptnotes/autopaneldesign.com/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Ask on GitHub
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
