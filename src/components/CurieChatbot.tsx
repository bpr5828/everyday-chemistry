import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, X, MessageCircle } from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
}

export default function CurieChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 'welcome', 
      sender: 'bot', 
      text: "Hi! I'm Curie, your Everyday Chemistry assistant. Ask me anything about chemistry in daily products or clinical trial pipelines!" 
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'user', text: userMessage }]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const responseText = generateBotResponse(userMessage);
      setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'bot', text: responseText }]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Simulate network delay
  };

  const generateBotResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes('clinical trial') || lowerQuery.includes('fda')) {
      return "Clinical trials are carefully designed studies that test new drugs in humans. They usually happen in 3 phases before FDA approval to prove safety and efficacy. CDISC is the standard data format they use!";
    }
    if (lowerQuery.includes('chemistry') || lowerQuery.includes('chemical')) {
      return "Chemistry is all around us! From the sodium lauryl sulfate that makes your shampoo foam, to the citric acid that preserves your food. Every physical thing is a chemical!";
    }
    if (lowerQuery.includes('ingredient') || lowerQuery.includes('product')) {
      return "You can use our Product Analyzer tool to paste ingredient lists from cosmetics or foods. It will check them against health conditions like eczema or acid reflux and give you safety warnings.";
    }
    if (lowerQuery.includes('cdisc')) {
      return "CDISC (Clinical Data Interchange Standards Consortium) creates the standards that pharmaceutical companies must use when submitting trial data to regulatory agencies like the FDA. We have a simulator for it in the Clinical Trials section!";
    }
    if (lowerQuery.includes('who') || lowerQuery.includes('creator') || lowerQuery.includes('developer')) {
      return "This portal was developed by a passionate high school student who loves chemistry and wants to demystify science for the public! Check out the Bio section above for more details.";
    }

    return "That's a great question! While I'm still learning, I specialize in everyday chemistry and clinical trials. Try asking me about 'clinical trials', 'CDISC', or 'ingredients'!";
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[350px] h-[500px] flex flex-col bg-slate-50 rounded-3xl border border-slate-200 overflow-hidden shadow-2xl animate-fade-in origin-bottom-right">
          {/* Header */}
          <div className="bg-slate-900 text-white p-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center border-2 border-white/20">
                <Bot className="w-6 h-6 text-slate-900" />
              </div>
              <div>
                <h3 className="font-bold font-display text-lg leading-tight flex items-center gap-2">
                  Curie <Sparkles className="w-3 h-3 text-green-400" />
                </h3>
                <p className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold">Science Assistant</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Chat Area */}
          <div className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                  msg.sender === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-sm' 
                    : 'bg-white border border-slate-200 text-slate-700 rounded-bl-sm shadow-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex gap-1 items-center">
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-slate-200 shrink-0">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1 pr-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask Curie about chemistry..."
                className="flex-1 bg-transparent border-none focus:outline-none px-3 py-2 text-sm text-slate-700"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white p-2 rounded-lg transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`${isOpen ? 'bg-slate-800 scale-90' : 'bg-green-600 hover:scale-105 hover:bg-green-500'} text-white w-16 h-16 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 border-4 border-white`}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-7 h-7" />}
      </button>

    </div>
  );
}
