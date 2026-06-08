import React from 'react';
import { 
  Home, 
  Search, 
  Sparkles, 
  FileText, 
  Volume2, 
  MapPin, 
  ShieldAlert,
  Database,
  FlaskConical,
  GraduationCap,
  Activity,
  BookOpen
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  pendingCount: number;
  userEmail: string | null;
}

export default function Layout({ children, activeTab, setActiveTab, pendingCount, userEmail }: LayoutProps) {
  const theme1Items = [
    { id: 'products', label: 'Product Analyzer', icon: Sparkles, desc: 'Paste & decode labels' },
    { id: 'articles', label: 'Food Chemistry', icon: FileText, desc: 'Cooking & science articles' },
  ];

  const theme2Items = [
    { id: 'cdisc-validator', label: 'CDISC Validator', icon: Activity, desc: 'Data quality checks' },
    { id: 'biotech-resources', label: 'Biotech Resources', icon: BookOpen, desc: 'Databases & learning' },
  ];

  const adminItem = { id: 'admin', label: 'Admin Moderation', icon: ShieldAlert, desc: 'Verify community data', badge: pendingCount > 0 ? pendingCount : undefined };

  const renderNavGroup = (title: string, items: typeof theme1Items) => (
    <div className="mb-6">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-3 px-3">
        {title}
      </span>
      <div className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-left transition-all duration-200 group relative ${
                isActive 
                  ? 'bg-green-50 border border-green-200/80 text-green-900 font-medium shadow-sm shadow-green-100' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform duration-200 ${
                isActive ? 'text-green-600' : 'text-slate-400 group-hover:scale-110'
              }`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold m-0 leading-tight">{item.label}</p>
                <p className="text-[11px] text-slate-400 truncate m-0 leading-none mt-0.5">{item.desc}</p>
              </div>
              {'badge' in item && item.badge && (
                <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
              {isActive && (
                <span className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-green-500 rounded-r" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-80 bg-white border-r border-slate-200/80 flex flex-col justify-between shrink-0 h-screen sticky top-0 overflow-y-auto custom-scrollbar">
        <div className="p-6">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8 cursor-pointer select-none" onClick={() => setActiveTab('home')}>
            <div className="p-2.5 bg-green-50 border border-green-200 rounded-xl text-green-600">
              <FlaskConical className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-xl font-bold font-display tracking-tight text-slate-900 m-0 leading-none">Everyday</h1>
              <span className="text-xs text-green-600 font-semibold tracking-wider uppercase">Chemistry</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav>
            {renderNavGroup('Product & Consumer Lab', theme1Items)}
            {renderNavGroup('Clinical Trials & Biotech', theme2Items)}
            {renderNavGroup('Utilities', [adminItem])}
          </nav>
        </div>

        {/* College Application Profile Card */}
        <div className="p-6 pt-0 mt-auto border-t border-slate-200/80 bg-white">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl mt-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-50 border border-purple-200 rounded-lg text-purple-600">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-purple-700 font-display uppercase tracking-wider">College Portfolio</h3>
                <span className="text-[11px] text-slate-500">Theme Reflection</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              "I built this platform to transform chemistry from dry memorization into a visible, interactive public lab with real community impact."
            </p>
            <div className="mt-3 flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
              <Database className="w-3.5 h-3.5 text-slate-400" />
              <span>105 compounds seeded</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Top Header */}
        <header className="h-16 border-b border-slate-200 px-8 flex items-center justify-between bg-white/75 backdrop-blur-md sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Citizen Science Portal
            </span>
          </div>

          {userEmail && (
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">
              <span className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">
                {userEmail.charAt(0).toUpperCase()}
              </span>
              <span className="text-xs font-medium text-slate-700">{userEmail}</span>
            </div>
          )}
        </header>

        {/* Module Content */}
        <div className="flex-1 p-8">
          <div className="max-w-6xl mx-auto animate-fade-in">
            {children}
          </div>
        </div>

        {/* Global Footer */}
        <footer className="border-t border-slate-200/60 py-6 px-8 text-center text-xs text-slate-500 bg-slate-50 mt-auto">
          <p>© 2026 Everyday Chemistry. Created for Academic Portfolios and Citizen Science Education.</p>
          <p className="mt-1 text-[11px] text-slate-400">Disclaimer: All descriptions are for educational purposes. Consult medical professionals for health advice.</p>
        </footer>
      </main>
    </div>
  );
}
