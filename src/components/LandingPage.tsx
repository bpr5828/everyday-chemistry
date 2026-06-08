import React, { useState } from 'react';
import { FlaskConical, ShieldAlert, ArrowRight, Target, TestTube, Mail, RefreshCw, CheckCircle2 } from 'lucide-react';

interface LandingPageProps {
  onEnter: (email: string) => void;
}

export default function LandingPage({ onEnter }: LandingPageProps) {
  const [step, setStep] = useState<'email' | 'disclaimer'>('email');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const checkEmailExists = async () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const webhookUrl = import.meta.env.VITE_GOOGLE_SHEET_WEBHOOK_URL;
      
      if (webhookUrl) {
        // Fetch expects a GET by default
        const urlWithParams = new URL(webhookUrl);
        urlWithParams.searchParams.append('email', email);
        
        const response = await fetch(urlWithParams.toString());
        const data = await response.json();
        
        if (data.exists) {
          // Bypass disclaimer
          setSubmitted(true);
          setTimeout(() => onEnter(email), 500);
          return;
        }
      } else {
        console.warn('VITE_GOOGLE_SHEET_WEBHOOK_URL is not set. Simulating check.');
        await new Promise(r => setTimeout(r, 800));
        // Always show disclaimer locally without webhook
      }
      
      setStep('disclaimer');

    } catch (err) {
      console.error('Failed to verify email:', err);
      // On CORS/Network error for GET, fallback to asking for disclaimer to be safe
      setStep('disclaimer');
    } finally {
      setLoading(false);
    }
  };

  const handleAcknowledge = async () => {
    setLoading(true);

    try {
      const webhookUrl = import.meta.env.VITE_GOOGLE_SHEET_WEBHOOK_URL;
      
      if (webhookUrl) {
        await fetch(webhookUrl, {
          method: 'POST',
          mode: 'no-cors', 
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, ackStatus: 'Yes', timestamp: new Date().toISOString() }),
        });
      } else {
        await new Promise(r => setTimeout(r, 800));
      }
      
      setSubmitted(true);
      setTimeout(() => {
        onEnter(email);
      }, 800);

    } catch (err) {
      console.error('Failed to submit email:', err);
      setError('Failed to record acknowledgment. You may proceed anyway.');
      setTimeout(() => onEnter(email), 1500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in pb-4">
      
      {/* Hero Section */}
      <div className="text-center space-y-3 pt-4">
        <div className="mx-auto w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center border-4 border-green-100 shadow-sm">
          <FlaskConical className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-black font-display text-slate-900 tracking-tight">
            Everyday Chemistry & Biotech Vision
          </h1>
          <p className="text-base text-slate-500 max-w-2xl mx-auto leading-relaxed">
            A dual-purpose citizen science portal exploring the chemistry of our daily lives and demystifying clinical drug development.
          </p>
        </div>
      </div>

      {/* Pillars Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-3">
            <TestTube className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">Consumer Lab</h3>
          <p className="text-xs text-slate-600 leading-relaxed mb-0">
            Educating consumers about the chemical components of everyday products. Understand implications based on health conditions.
          </p>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-3">
            <Target className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">Clinical Trials</h3>
          <p className="text-xs text-slate-600 leading-relaxed mb-0">
            De-jargonizing the clinical drug pipeline. Learn how trials are designed and how regulatory agencies evaluate data.
          </p>
        </div>
      </div>

      {/* Verification / Disclaimer Flow */}
      <div className={`border-2 ${step === 'disclaimer' ? 'bg-red-50 border-red-200' : 'bg-white border-slate-200'} p-6 rounded-2xl relative overflow-hidden transition-colors duration-500`}>
        
        {step === 'email' ? (
          <div className="relative z-10 space-y-4 max-w-sm mx-auto text-center">
            <div>
              <h2 className="text-xl font-bold font-display text-slate-800">Enter Portal</h2>
              <p className="text-xs text-slate-500 mt-1">Please enter your email to continue</p>
            </div>
            
            <div className="space-y-3 text-left">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading || submitted}
                  onKeyDown={(e) => e.key === 'Enter' && checkEmailExists()}
                  className="block w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm shadow-sm"
                  placeholder="you@example.com"
                />
              </div>
              {error && <p className="text-xs text-red-600 font-bold text-center">{error}</p>}
              
              <button 
                onClick={checkEmailExists}
                disabled={loading || submitted}
                className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:pointer-events-none text-white font-bold py-2.5 rounded-xl shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Checking...</span>
                  </>
                ) : submitted ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verified</span>
                  </>
                ) : (
                  <>
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="relative z-10 space-y-3 animate-fade-in">
            <div className="flex items-center gap-2 text-red-700 mb-1">
              <ShieldAlert className="w-6 h-6" />
              <h2 className="text-xl font-black font-display">Medical Disclaimer</h2>
            </div>
            <p className="text-xs text-red-900 leading-relaxed font-medium">
              All information provided on this platform is strictly for <strong>educational and informational purposes only</strong>. This is a citizen science project and is not a substitute for professional medical advice, diagnosis, or treatment. Always consult your physician or a qualified healthcare provider before acting on any suggestions or analyzing any product ingredients here.
            </p>
            
            <div className="pt-4 mt-4 border-t border-red-200/50 flex flex-col sm:flex-row items-center gap-4 justify-between">
              <div className="text-xs text-red-800">
                Acknowledging as: <strong>{email}</strong>
              </div>
              
              <button 
                onClick={handleAcknowledge}
                disabled={loading || submitted}
                className="w-full sm:w-auto bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold py-2.5 px-6 rounded-xl shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Recording...</span>
                  </>
                ) : submitted ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Acknowledged</span>
                  </>
                ) : (
                  <>
                    <span>I Understand & Accept</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
        
        {step === 'disclaimer' && (
          <ShieldAlert className="absolute -right-10 -bottom-10 w-48 h-48 text-red-500 opacity-5 pointer-events-none" />
        )}
      </div>

    </div>
  );
}
