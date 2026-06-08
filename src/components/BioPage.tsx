import React from 'react';
import { Mail, MapPin, Award, GraduationCap, Heart, Code2, Cpu } from 'lucide-react';

export default function BioPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-12">
      
      {/* Header Section */}
      <div className="text-center space-y-3 mb-10">
        <h2 className="text-4xl font-black font-display text-slate-900 tracking-tight">Meet the Developer</h2>
        <p className="text-slate-500 text-lg">High School Senior & Citizen Scientist</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col items-center text-center relative overflow-hidden">
            {/* Background design */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-green-400 to-blue-500 opacity-20"></div>
            
            <div className="relative w-40 h-40 rounded-full border-4 border-white shadow-md overflow-hidden mt-6 mb-4">
              <img 
                src="/creator.png" 
                alt="Creator Profile" 
                className="w-full h-full object-cover"
              />
            </div>
            
            <h3 className="text-2xl font-black text-slate-900 font-display">Sarah Jenkins</h3>
            <p className="text-sm font-bold text-green-600 tracking-wider uppercase mt-1 mb-4">Class of 2027</p>
            
            <div className="w-full space-y-3 text-sm text-slate-600 mt-4">
              <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-xl">
                <Mail className="w-4 h-4 text-slate-400" />
                <span>sarah.citizen.science@gmail.com</span>
              </div>
              <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-xl">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span>Austin, Texas</span>
              </div>
            </div>
          </div>

          {/* Quick Stats / Badges */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center shadow-sm">
              <Code2 className="w-6 h-6 mx-auto text-blue-500 mb-2" />
              <div className="text-2xl font-black text-slate-800">10k+</div>
              <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Lines of Code</div>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center shadow-sm">
              <Cpu className="w-6 h-6 mx-auto text-purple-500 mb-2" />
              <div className="text-2xl font-black text-slate-800">React</div>
              <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Tech Stack</div>
            </div>
          </div>
        </div>

        {/* Middle Column: Bio Details */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Passion Section */}
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4 text-red-500">
              <Heart className="w-6 h-6" />
              <h3 className="text-xl font-bold text-slate-900">My Passion</h3>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              Ever since middle school, I've been fascinated by the invisible molecular world that governs our daily lives. Why does soap work? How do clinical trials prove a drug is safe? 
            </p>
            <p className="text-slate-600 text-sm leading-relaxed">
              I believe that scientific literacy is a human right. By combining my love for AP Chemistry and computer science, I aim to build tools that make science accessible, transparent, and interactive for everyone.
            </p>
          </div>

          {/* Why I Built This */}
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4 text-blue-500">
              <Code2 className="w-6 h-6" />
              <h3 className="text-xl font-bold text-slate-900">Why I Built This</h3>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              I noticed a massive gap between academic chemistry and consumer awareness. People use cosmetics and medications daily without understanding the active ingredients. This portal was built as my Capstone Project to bridge that gap—turning dry chemical data into a "Molecular Lens" for everyday consumers.
            </p>
          </div>

          {/* Achievements */}
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4 text-yellow-500">
              <Award className="w-6 h-6" />
              <h3 className="text-xl font-bold text-slate-900">Achievements</h3>
            </div>
            <ul className="space-y-4">
              <li className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-yellow-50 text-yellow-600 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">State Science Fair Finalist</h4>
                  <p className="text-xs text-slate-500">2025 - Chemistry & Software Category</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Code2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Girls Who Code President</h4>
                  <p className="text-xs text-slate-500">Led a 30-member high school chapter.</p>
                </div>
              </li>
            </ul>
          </div>

        </div>

      </div>
    </div>
  );
}
