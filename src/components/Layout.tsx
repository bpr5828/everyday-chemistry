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
  GraduationCap
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  pendingCount: number;
}

export default function Layout({ children, activeTab, setActiveTab, pendingCount }: LayoutProps) {
  const menuItems = [
    { id: 'explore', label: 'X-Ray House', icon: Home, desc: 'Clickable house chemistry' },
    { id: 'de-jargonizer', label: 'De-Jargonizer', icon: Search, desc: 'Chemical search engine' },
    { id: 'products', label: 'Product Analyzer', icon: Sparkles, desc: 'Paste & decode labels' },
    { id: 'articles', label: 'Food Chemistry', icon: FileText, desc: 'Cooking & science articles' },
    { id: 'podcast', label: 'Podcast Hub', icon: Volume2, desc: 'Audio annotations sync' },
    { id: 'map', label: 'Citizen Map', icon: MapPin, desc: 'Tap-water pH readings' },
    { id: 'admin', label: 'Admin Moderation', icon: ShieldAlert, desc: 'Verify community data', badge: pendingCount > 0 ? pendingCount : undefined },
  ];

  return (
    <div className="min-h-screen bg-[#070a13] text-gray-100 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-80 bg-[#0b0f19] border-r border-gray-800/80 flex flex-col justify-between shrink-0 p-6">
        <div>
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8 cursor-pointer select-none" onClick={() => setActiveTab('explore')}>
            <div className="p-2.5 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400">
              <FlaskConical className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-xl font-bold font-display tracking-tight text-white m-0 leading-none">Everyday</h1>
              <span className="text-xs text-green-400 font-semibold tracking-wider uppercase">Chemistry</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-3 px-3">
              Explore & Tools
            </span>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-left transition-all duration-200 group relative ${
                    isActive 
                      ? 'bg-green-500/10 border border-green-500/25 text-white font-medium shadow-md shadow-green-500/5' 
                      : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/30 border border-transparent'
                  }`}
                >
                  <Icon className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'text-green-400' : 'text-gray-500 group-hover:scale-110'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold m-0 leading-tight">{item.label}</p>
                    <p className="text-[11px] text-gray-500 truncate m-0 leading-none mt-0.5">{item.desc}</p>
                  </div>
                  {item.badge && (
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
          </nav>
        </div>

        {/* College Application Profile Card */}
        <div className="mt-8 pt-6 border-t border-gray-800/80">
          <div className="p-4 bg-gray-900/50 border border-gray-800 rounded-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-500/10 border border-purple-500/30 rounded-lg text-purple-400">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-purple-300 font-display uppercase tracking-wider">College Portfolio</h3>
                <span className="text-[11px] text-gray-400">Theme Reflection</span>
              </div>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              "I built this platform to transform chemistry from dry memorization into a visible, interactive public lab with real community impact."
            </p>
            <div className="mt-3 flex items-center gap-1.5 text-[10px] text-gray-500 font-medium">
              <Database className="w-3.5 h-3.5 text-gray-500" />
              <span>105 compounds seeded</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Top Header */}
        <header className="h-16 border-b border-gray-800/50 px-8 flex items-center justify-between bg-[#0b0f19]/40 backdrop-blur-md sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Citizen Science Portal
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noreferrer"
              className="text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1 bg-gray-800/40 border border-gray-700/60 px-3 py-1.5 rounded-lg"
            >
              <span>GitHub Repo</span>
            </a>
            <div className="text-xs text-gray-500 bg-gray-900 border border-gray-800 px-3 py-1.5 rounded-lg">
              Status: <span className="text-green-400 font-medium">Live</span>
            </div>
          </div>
        </header>

        {/* Module Content */}
        <div className="flex-1 p-8">
          <div className="max-w-6xl mx-auto animate-fade-in">
            {children}
          </div>
        </div>

        {/* Global Footer */}
        <footer className="border-t border-gray-800/40 py-6 px-8 text-center text-xs text-gray-500 bg-[#070a13]">
          <p>© 2026 Everyday Chemistry. Created for Academic Portfolios and Citizen Science Education.</p>
          <p className="mt-1 text-[11px] text-gray-600">Disclaimer: All descriptions are for educational purposes. Consult medical professionals for health advice.</p>
        </footer>
      </main>
    </div>
  );
}
