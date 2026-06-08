import React, { useState, useEffect } from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

export default function DisclaimerModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasAcknowledged = localStorage.getItem('disclaimer_acknowledged');
    if (!hasAcknowledged) {
      setIsOpen(true);
    }
  }, []);

  const handleAcknowledge = () => {
    localStorage.setItem('disclaimer_acknowledged', 'true');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
      <div className="bg-white max-w-lg w-full rounded-3xl p-8 shadow-2xl relative border border-slate-200 animate-fade-in">
        <div className="mx-auto w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-center text-slate-800 mb-4 font-display">
          Medical Disclaimer
        </h2>
        <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
          <p>
            Welcome to the Everyday Chemistry Citizen Science Portal. Please note that all information provided on this platform is for <strong>educational and informational purposes only</strong>.
          </p>
          <p>
            This platform is <strong>not</strong> a substitute for professional medical advice, diagnosis, or treatment. 
          </p>
          <p>
            Always seek the advice of your physician or other qualified health providers with any questions you may have regarding a medical condition, symptoms, or the use of any products discussed here.
          </p>
        </div>
        <div className="mt-8">
          <button
            onClick={handleAcknowledge}
            className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3.5 px-6 rounded-xl font-bold transition-all active:scale-[0.98] shadow-sm"
          >
            <ShieldCheck className="w-5 h-5" />
            I Understand and Agree
          </button>
        </div>
      </div>
    </div>
  );
}
