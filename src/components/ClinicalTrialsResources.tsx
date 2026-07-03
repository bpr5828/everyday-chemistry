import React from 'react';
import { Database, Link as LinkIcon, BookOpen, GraduationCap, Microscope, Shield } from 'lucide-react';

export default function ClinicalTrialsResources() {
  const resources = [
    {
      category: 'Clinical Registries',
      icon: Database,
      items: [
        { name: 'ClinicalTrials.gov', desc: 'The largest database of privately and publicly funded clinical studies conducted around the world.', url: 'https://clinicaltrials.gov/' },
        { name: 'WHO Clinical Trials Registry', desc: 'World Health Organization International Clinical Trials Registry Platform, facilitating access to trial registration data worldwide.', url: 'https://trialsearch.who.int/' },
        { name: 'EU Clinical Trials Register', desc: 'Information on interventional clinical trials on medicines conducted in the European Union.', url: 'https://www.clinicaltrialsregister.eu/' }
      ]
    },
    {
      category: 'Regulatory Standards',
      icon: BookOpen,
      items: [
        { name: 'CDISC Standards', desc: 'Clinical Data Interchange Standards Consortium - the global standard for clinical research data.', url: 'https://www.cdisc.org/' },
        { name: 'FDA Guidance Documents', desc: 'Official documents representing the FDA\'s current thinking on clinical topics.', url: 'https://www.fda.gov/regulatory-information/search-fda-guidance-documents' },
        { name: 'CONSORT Guidelines', desc: 'Consolidated Standards of Reporting Trials - evidence-based minimum recommendations for reporting randomized trials.', url: 'http://www.consort-statement.org/' }
      ]
    },
    {
      category: 'Learning & Careers',
      icon: GraduationCap,
      items: [
        { name: 'SPIRIT Guidelines', desc: 'Standard Protocol Items: Recommendations for Interventional Trials - guidance on standard elements for trial protocols.', url: 'https://www.spirit-statement.org/' },
        { name: 'WMA Declaration of Helsinki', desc: 'World Medical Association\'s statement of ethical principles for medical research involving human subjects.', url: 'https://www.wma.net/policies-post/wma-declaration-of-helsinki-ethical-principles-for-medical-research-involving-human-subjects/' },
        { name: 'PhUSE Working Groups', desc: 'Pharmaceutical Users Software Exchange collaboration hub for clinical data standardization and analysis scripts.', url: 'https://wiki.phuse.org/' }
      ]
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="space-y-2">
        <h2 className="text-3xl font-black font-display text-slate-800">Clinical Trials Resources</h2>
        <p className="text-sm text-slate-500 max-w-2xl leading-relaxed">
          Explore industry-standard databases, regulatory guidance, and educational paths to deepen your understanding of drug development and clinical research.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((section, idx) => {
          const Icon = section.icon;
          return (
            <div key={idx} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-800">{section.category}</h3>
              </div>
              <div className="space-y-5 flex-1">
                {section.items.map((item, i) => (
                  <div key={i} className="group">
                    <a href={item.url} target="_blank" rel="noreferrer" className="flex items-start gap-3">
                      <div className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <LinkIcon className="w-3.5 h-3.5 text-blue-500" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors mb-1">{item.name}</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                      </div>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Decorative banner */}
      <div className="bg-gradient-to-br from-blue-900 to-indigo-900 rounded-3xl p-8 text-white relative overflow-hidden mt-8 shadow-md">
        <div className="relative z-10 max-w-xl">
          <div className="flex items-center gap-2 mb-3">
            <Microscope className="w-5 h-5 text-blue-300" />
            <span className="text-xs font-bold uppercase tracking-wider text-blue-200">Featured</span>
          </div>
          <h3 className="text-2xl font-bold mb-2">Want to build your own data tools?</h3>
          <p className="text-sm text-blue-100 mb-6 leading-relaxed">
            Learn Python, R, and standard data science practices to analyze real-world biological datasets. Start with the basics of data parsing before moving to CDISC SDTM mappings.
          </p>
          <button className="bg-white text-blue-900 px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-blue-50 transition-colors active:scale-[0.98]">
            Explore Tutorials
          </button>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-1/4 translate-y-1/4">
          <Microscope className="w-96 h-96" />
        </div>
      </div>
    </div>
  );
}
