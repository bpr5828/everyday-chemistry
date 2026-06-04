import React, { useState, useEffect } from 'react';
import { Search, FlaskConical, AlertTriangle, ShieldCheck, Link2, HelpCircle, ArrowRight, Tag } from 'lucide-react';

interface CompoundBasic {
  compound_uuid: string;
  common_name: string;
  iupac_name: string;
  molecular_formula: string;
  safety_tier_rating: string;
  description?: string;
  function_txt?: string;
}

interface CompoundDetail extends CompoundBasic {
  mechanism_of_action_txt: string;
  misconceptions_txt: string;
  alternatives_txt: string;
  source_urls: string[];
}

interface DeJargonizerProps {
  initialSearchId: string | null;
  clearInitialSearch: () => void;
}

export default function DeJargonizer({ initialSearchId, clearInitialSearch }: DeJargonizerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<CompoundBasic[]>([]);
  const [selectedCompound, setSelectedCompound] = useState<CompoundDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const categories = [
    { label: 'All', value: null },
    { label: 'Acids & Bases', value: 'acid' },
    { label: 'Preservatives', value: 'preservative' },
    { label: 'Surfactants', value: 'sulfate' },
    { label: 'Sweeteners', value: 'sweetener' },
    { label: 'Medicines', value: 'acetyl' }
  ];

  // If initialSearchId was passed, trigger loading that compound directly
  useEffect(() => {
    if (initialSearchId) {
      fetchCompoundDetail(initialSearchId);
      clearInitialSearch();
    } else {
      // Default load
      fetchResults('');
    }
  }, [initialSearchId]);

  // Fetch search results on search query or category tag change
  useEffect(() => {
    if (!initialSearchId) {
      const delayDebounceFn = setTimeout(() => {
        fetchResults(searchQuery);
      }, 200);

      return () => clearTimeout(delayDebounceFn);
    }
  }, [searchQuery, selectedTag]);

  const fetchResults = async (q: string) => {
    setLoading(true);
    setError(null);
    try {
      // If we filtered by a category value, we override the query if search query is empty
      let queryVal = q;
      if (!q && selectedTag) {
        queryVal = selectedTag;
      }
      
      const response = await fetch(`/api/search?q=${encodeURIComponent(queryVal)}`);
      if (!response.ok) throw new Error('Search request failed');
      const data = await response.json();
      
      setSearchResults(data.compounds);
      
      // Auto select first match if it is a specific search match
      if (q && data.compounds.length > 0 && data.compounds[0].common_name.toLowerCase() === q.toLowerCase()) {
        fetchCompoundDetail(data.compounds[0].compound_uuid);
      }
    } catch (err: any) {
      console.error(err);
      setError('Could not connect to the Everyday Chemistry search database. Please ensure the Python API is running.');
      // Local fallback simulation (Water, Baking Soda, Acid, etc)
      fallbackSearch(q);
    } finally {
      setLoading(false);
    }
  };

  const fallbackSearch = (q: string) => {
    // Basic local fallback if API fails
    const mockList: CompoundBasic[] = [
      { compound_uuid: 'water', common_name: 'Water', iupac_name: 'Oxidane', molecular_formula: 'H2O', safety_tier_rating: 'Green', description: 'Universal solvent' },
      { compound_uuid: 'sodium_chloride', common_name: 'Table Salt', iupac_name: 'Sodium chloride', molecular_formula: 'NaCl', safety_tier_rating: 'Green', description: 'Ionic compound' },
      { compound_uuid: 'acetic_acid', common_name: 'Vinegar', iupac_name: 'Ethanoic acid', molecular_formula: 'CH3COOH', safety_tier_rating: 'Yellow', description: 'Weak acid' },
      { compound_uuid: 'sodium_bicarbonate', common_name: 'Baking Soda', iupac_name: 'Sodium hydrogen carbonate', molecular_formula: 'NaHCO3', safety_tier_rating: 'Green', description: 'Leavener base' },
      { compound_uuid: 'sodium_hypochlorite', common_name: 'Bleach', iupac_name: 'Sodium chlorate(I)', molecular_formula: 'NaClO', safety_tier_rating: 'Red', description: 'Disinfectant' }
    ];
    const filtered = mockList.filter(c => 
      c.common_name.toLowerCase().includes(q.toLowerCase()) || 
      c.molecular_formula.toLowerCase().includes(q.toLowerCase())
    );
    setSearchResults(filtered);
  };

  const fetchCompoundDetail = async (uuid: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/compounds/${uuid}`);
      if (!response.ok) throw new Error('Failed to retrieve compound details');
      const data = await response.json();
      setSelectedCompound(data);
      // Synchronize search query with active compound
      setSearchQuery(data.common_name);
    } catch (err: any) {
      console.error(err);
      setError('Could not retrieve chemical specifications.');
      // Fallback detail
      if (uuid === 'water') {
        setSelectedCompound({
          compound_uuid: 'water',
          common_name: 'Water',
          iupac_name: 'Oxidane',
          molecular_formula: 'H2O',
          safety_tier_rating: 'Green',
          description: 'Essential molecule for life.',
          function_txt: 'Solvent',
          mechanism_of_action_txt: 'Acts as primary carrier in cell membranes.',
          misconceptions_txt: 'Dihydrogen Monoxide is a scary name for water.',
          alternatives_txt: 'None',
          source_urls: ['https://pubchem.ncbi.nlm.nih.gov/compound/Water']
        });
      } else {
        setSelectedCompound({
          compound_uuid: uuid,
          common_name: uuid.replace('_', ' ').toUpperCase(),
          iupac_name: 'Unknown',
          molecular_formula: 'N/A',
          safety_tier_rating: 'Yellow',
          description: 'Local fallback active. Run seed script and local uvicorn server to populate full database.',
          function_txt: 'N/A',
          mechanism_of_action_txt: 'N/A',
          misconceptions_txt: 'None',
          alternatives_txt: 'None',
          source_urls: []
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="space-y-1">
        <h2 className="text-3xl font-black font-display text-slate-800 m-0">Chemical De-Jargonizer</h2>
        <p className="text-sm text-slate-500">
          Demystifying complex chemical nomenclature on ingredient listings into accessible, objective scientific context.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        
        {/* Search List Panel */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-6 flex flex-col justify-between shadow-sm">
          <div className="space-y-4">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name, IUPAC, or formula..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-green-500/50 focus:bg-white outline-none rounded-xl py-3 pl-11 pr-4 text-sm text-slate-800 placeholder-slate-400 transition-all font-medium"
              />
              <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
            </div>

            {/* Category Tags */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {categories.map((cat, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedTag(cat.value);
                    setSearchQuery('');
                  }}
                  className={`text-[10px] font-bold px-2.5 py-1.5 rounded-lg border transition-all flex items-center gap-1 ${
                    selectedTag === cat.value && !searchQuery
                      ? 'bg-green-50 border-green-200 text-green-700 font-extrabold'
                      : 'bg-slate-100 border-slate-250/60 text-slate-650 hover:bg-slate-200/50 hover:text-slate-800'
                  }`}
                >
                  <Tag className="w-3 h-3" />
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>

            {/* List header */}
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider pt-2">
              <span>Compounds Database</span>
              <span>{searchResults.length} matches</span>
            </div>

            {/* Search Result Cards */}
            <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
              {loading && searchResults.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400 animate-pulse">
                  Querying database...
                </div>
              ) : searchResults.length > 0 ? (
                searchResults.map(c => {
                  const isSelected = selectedCompound?.compound_uuid === c.compound_uuid;
                  return (
                    <button
                      key={c.compound_uuid}
                      onClick={() => fetchCompoundDetail(c.compound_uuid)}
                      className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-green-50 border-green-250 text-green-900 font-semibold shadow-xs'
                          : 'bg-slate-50/50 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold font-display text-sm truncate">{c.common_name}</span>
                          <span className="text-[10px] font-mono text-purple-750 shrink-0">{c.molecular_formula}</span>
                        </div>
                        <span className="text-[11px] text-slate-400 truncate block mt-0.5">{c.iupac_name || 'N/A'}</span>
                      </div>
                      <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md ${
                        c.safety_tier_rating === 'Green'
                          ? 'bg-green-50 text-green-700'
                          : c.safety_tier_rating === 'Yellow'
                          ? 'bg-yellow-50 text-yellow-750'
                          : 'bg-red-50 text-red-700'
                      }`}>
                        {c.safety_tier_rating}
                      </span>
                    </button>
                  );
                })
              ) : (
                <div className="text-center py-8 text-xs text-slate-400">
                  No matching chemical compounds found.
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 p-3 rounded-xl text-[11px] text-red-700 leading-normal">
              {error}
            </div>
          )}
        </div>

        {/* Detailed Compound Card Panel */}
        <div className="md:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          {selectedCompound ? (
            <div className="space-y-6">
              {/* Card Title Header */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 pb-4 border-b border-slate-200">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <h3 className="text-3xl font-black font-display text-slate-800 m-0">
                      {selectedCompound.common_name}
                    </h3>
                    <span className="font-mono text-xs bg-purple-50 border border-purple-100 text-purple-705 px-2 py-0.5 rounded-md">
                      {selectedCompound.molecular_formula}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-semibold">
                    IUPAC Name: <span className="text-slate-650 font-mono">{selectedCompound.iupac_name || 'N/A'}</span>
                  </p>
                </div>

                {/* Safety Badge */}
                <div className={`p-4 rounded-2xl border flex items-center gap-3 shrink-0 ${
                  selectedCompound.safety_tier_rating === 'Green'
                    ? 'bg-green-50 border-green-200 text-green-700'
                    : selectedCompound.safety_tier_rating === 'Yellow'
                    ? 'bg-yellow-50 border-yellow-250 text-yellow-750'
                    : 'bg-red-50 border-red-250 text-red-700'
                }`}>
                  {selectedCompound.safety_tier_rating === 'Green' ? (
                    <ShieldCheck className="w-8 h-8 shrink-0 text-green-600" />
                  ) : (
                    <AlertTriangle className="w-8 h-8 shrink-0" />
                  )}
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 leading-none">Safety Tier</h4>
                    <span className="text-sm font-black font-display tracking-wide uppercase mt-1 block">
                      {selectedCompound.safety_tier_rating} Profile
                    </span>
                  </div>
                </div>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Left Column: Descriptions */}
                <div className="space-y-5">
                  <div>
                    <h4 className="text-xs font-bold text-slate-450 uppercase tracking-widest block mb-1">
                      Plain-English Explanation
                    </h4>
                    <p className="text-xs text-slate-650 leading-relaxed bg-slate-50 p-4 border border-slate-200 rounded-2xl">
                      {selectedCompound.description}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-450 uppercase tracking-widest block mb-1">
                      Purpose in Consumer Products
                    </h4>
                    <p className="text-xs text-slate-650 leading-relaxed bg-slate-50 p-4 border border-slate-200 rounded-2xl">
                      {selectedCompound.function_txt}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-xs font-bold text-slate-450 uppercase tracking-widest block mb-1">
                      Biomedical Mechanism
                    </h4>
                    <p className="text-xs text-slate-650 leading-relaxed bg-slate-50 p-4 border border-slate-200 rounded-2xl">
                      {selectedCompound.mechanism_of_action_txt}
                    </p>
                  </div>
                </div>

                {/* Right Column: Misconceptions & Alternatives */}
                <div className="space-y-5">
                  <div className="bg-green-50 border border-green-200 p-4.5 rounded-2xl space-y-2 shadow-xs">
                    <div className="flex items-center gap-2 text-green-800 font-bold text-xs uppercase tracking-wider">
                      <HelpCircle className="w-4 h-4" />
                      <span>Debunking Misconceptions</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {selectedCompound.misconceptions_txt}
                    </p>
                  </div>

                  <div className="bg-purple-50 border border-purple-250/50 p-4.5 rounded-2xl space-y-2 shadow-xs">
                    <div className="flex items-center gap-2 text-purple-800 font-bold text-xs uppercase tracking-wider">
                      <FlaskConical className="w-4 h-4" />
                      <span>Alternatives & Equivalents</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {selectedCompound.alternatives_txt}
                    </p>
                  </div>

                  {/* Scientific Source Trail */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-450 uppercase tracking-widest block mb-1">
                      Scientific Source Trail
                    </h4>
                    <div className="flex flex-col gap-1.5">
                      {selectedCompound.source_urls.map((url, i) => (
                        <a
                          key={i}
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2 text-xs text-green-700 hover:text-green-850 hover:underline p-3 bg-slate-50 border border-slate-200 rounded-xl transition-all shadow-xs"
                        >
                          <Link2 className="w-4 h-4 shrink-0 text-slate-400" />
                          <span className="truncate">{url}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 p-8 min-h-[400px]">
              <div className="p-4 bg-slate-100 border border-slate-200 rounded-full text-slate-400 animate-pulse">
                <FlaskConical className="w-12 h-12" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-slate-700">Explore De-Jargonizer Cards</h3>
                <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
                  Search or click a chemical compound on the left panel to translate complex jargon into safety tiers, functional roles, and factual misconceptions.
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
