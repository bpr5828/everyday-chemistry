import React, { useState, useRef } from 'react';
import { Sparkles, ArrowRight, AlertTriangle, RefreshCw, HeartPulse, MessageSquare, ThumbsUp, Upload, Image as ImageIcon, Type, ShieldAlert } from 'lucide-react';

interface CitizenFeedback {
  user: string;
  comment: string;
  helpful: number;
}

interface ParsedIngredient {
  original_text: string;
  matched: boolean;
  confidence_score: number;
  compound_uuid: string | null;
  common_name: string;
  molecular_formula: string;
  safety_tier_rating: 'Green' | 'Yellow' | 'Red';
  function_txt: string;
  description: string;
  when_to_use?: string[];
  when_not_to_use?: string[];
  feedback: CitizenFeedback[];
}

interface ParseResponse {
  product_uuid: string;
  ingredients: ParsedIngredient[];
}

interface ProductAnalyzerProps {
  onSearchCompound: (uuid: string) => void;
}

export default function ProductAnalyzer({ onSearchCompound }: ProductAnalyzerProps) {
  const [inputType, setInputType] = useState<'text' | 'image'>('text');
  const [ingredientsText, setIngredientsText] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [healthConditions, setHealthConditions] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ParseResponse | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleParse = async () => {
    const hasInput = inputType === 'text' ? ingredientsText.trim() : imageFile;
    if (!hasInput) return;
    
    setLoading(true);
    setResult(null);

    // Simulate network delay / OCR processing
    setTimeout(() => {
      // For simulation, if it's an image, we just use a hardcoded list.
      const textToParse = inputType === 'image' 
        ? 'Water, Sodium Laureth Sulfate, Citric Acid, Caffeine' 
        : ingredientsText;
        
      fallbackParse(textToParse);
      setLoading(false);
    }, 1500);
  };

  const fallbackParse = (text: string) => {
    const tokens = text.split(',').map(t => t.trim()).filter(Boolean);
    const mockDb: Record<string, any> = {
      'water': { name: 'Water', formula: 'H2O', safety: 'Green', desc: 'Universal solvent', func: 'Solvent', feedback: [{user: 'ChemistMom', comment: 'Safe for everything.', helpful: 12}] },
      'glycerin': { name: 'Glycerin', formula: 'C3H8O3', safety: 'Green', desc: 'Moisturizing alcohol humectant', func: 'Humectant', when_to_use: ['Dry skin'], when_not_to_use: [], feedback: [] },
      'sodium fluoride': { name: 'Sodium Fluoride', formula: 'NaF', safety: 'Red', desc: 'Dental enamel fortifier', func: 'Enamel protector', when_not_to_use: ['Fluorosis risk'], feedback: [{user: 'DentistDave', comment: 'Do not swallow.', helpful: 45}] },
      'citric acid': { name: 'Citric Acid', formula: 'C6H8O7', safety: 'Green', desc: 'Acidity regulator', func: 'pH regulator', when_not_to_use: ['Acid reflux', 'Sensitive stomach'], feedback: [] },
      'caffeine': { name: 'Caffeine', formula: 'C8H10N4O2', safety: 'Yellow', desc: 'Stimulating alkaloid', func: 'Stimulant', when_not_to_use: ['Insomnia', 'High blood pressure'], when_to_use: ['Fatigue'], feedback: [{user: 'NightOwl', comment: 'Gives me jitters if I have too much.', helpful: 8}] },
      'sodium laureth sulfate': { name: 'Sodium Laureth Sulfate', formula: 'C14H29NaO5S', safety: 'Yellow', desc: 'Surfactant foaming cleanser', func: 'Cleanser Surfactant', when_not_to_use: ['Eczema', 'Dry scalp'], feedback: [{user: 'SkinCareJunkie', comment: 'Strips my skin of oils, beware.', helpful: 104}] }
    };

    const list: ParsedIngredient[] = tokens.map((token) => {
      const cleanTok = token.toLowerCase();
      let matched = false;
      let data: any = { name: token, formula: 'N/A', safety: 'Yellow', desc: 'Unknown compound in mock fallback database.', func: 'Unmatched ingredient', feedback: [], when_to_use: [], when_not_to_use: [] };
      
      for (const k in mockDb) {
        if (cleanTok.includes(k) || k.includes(cleanTok)) {
          matched = true;
          data = mockDb[k];
          break;
        }
      }

      const conditionsStr = healthConditions.toLowerCase();
      if (conditionsStr.includes('eczema') && cleanTok.includes('sulfate')) {
        data.safety = 'Red';
      }

      return {
        original_text: token,
        matched,
        confidence_score: matched ? 0.90 : 0.0,
        compound_uuid: matched ? token.toLowerCase().replace(' ', '_') : null,
        common_name: data.name,
        molecular_formula: data.formula,
        safety_tier_rating: data.safety,
        function_txt: data.func,
        description: data.desc,
        when_to_use: data.when_to_use || [],
        when_not_to_use: data.when_not_to_use || [],
        feedback: data.feedback || []
      };
    });

    setResult({
      product_uuid: 'parsed_fallback',
      ingredients: list,
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="space-y-2 text-center">
        <h2 className="text-4xl font-black font-display text-slate-800">Product Analyzer</h2>
        <p className="text-sm text-slate-500 max-w-xl mx-auto">
          Identify chemical components in your products and get personalized health suggestions. Upload an image of an ingredient label or paste the text directly.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-8">
        {/* Input Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Source Input */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-750 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs">1</span>
              Ingredient Source
            </h3>
            
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button 
                onClick={() => setInputType('text')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${inputType === 'text' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <Type className="w-4 h-4" /> Text
              </button>
              <button 
                onClick={() => setInputType('image')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${inputType === 'image' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <ImageIcon className="w-4 h-4" /> Image
              </button>
            </div>

            {inputType === 'text' ? (
              <textarea
                value={ingredientsText}
                onChange={(e) => setIngredientsText(e.target.value)}
                placeholder="Paste ingredients separated by commas..."
                rows={4}
                className="w-full bg-slate-50 border border-slate-200 focus:border-green-500/50 outline-none rounded-xl p-4 text-sm text-slate-800 transition-all font-mono"
              />
            ) : (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-32 border-2 border-dashed border-slate-300 hover:border-green-400 bg-slate-50 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors"
              >
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                />
                {imageFile ? (
                  <div className="text-center">
                    <p className="text-sm font-bold text-green-600">{imageFile.name}</p>
                    <p className="text-xs text-slate-500 mt-1">Click to change image</p>
                  </div>
                ) : (
                  <div className="text-center text-slate-500">
                    <Upload className="w-6 h-6 mx-auto mb-2 opacity-50" />
                    <p className="text-sm font-bold">Upload Label Image</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Health Conditions */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-750 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs">2</span>
              Health Profile <span className="text-[10px] font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Optional</span>
            </h3>
            
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-red-500">
                <HeartPulse className="w-5 h-5" />
                <span className="text-xs font-medium text-slate-600">Personalize your risk warnings.</span>
              </div>
              <input
                type="text"
                value={healthConditions}
                onChange={(e) => setHealthConditions(e.target.value)}
                placeholder="e.g. Eczema, Acid reflux, Insomnia..."
                className="w-full bg-white border border-slate-200 focus:border-red-400 outline-none rounded-lg p-3 text-sm text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleParse}
          disabled={loading || (inputType === 'text' ? !ingredientsText.trim() : !imageFile)}
          className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:pointer-events-none text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.99]"
        >
          {loading ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Analyzing Components...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Analyze Product Components</span>
            </>
          )}
        </button>
      </div>

      {/* Results Section */}
      {result && (
        <div className="space-y-6 animate-fade-in-up">
          <div className="flex items-center gap-3">
            <h3 className="text-2xl font-black font-display text-slate-800">Components</h3>
            <span className="bg-slate-200 text-slate-600 text-xs font-bold px-2.5 py-1 rounded-full">
              {result.ingredients.length} found
            </span>
          </div>

          <div className="space-y-6">
            {result.ingredients.map((ingr, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                <div className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    
                    {/* Compound Info */}
                    <div className="space-y-3 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h4 className="text-xl font-extrabold text-slate-900">{ingr.common_name}</h4>
                        <span className="text-sm font-mono text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">{ingr.molecular_formula}</span>
                        <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg border ${
                          ingr.safety_tier_rating === 'Green' ? 'bg-green-50 border-green-200 text-green-700' : 
                          ingr.safety_tier_rating === 'Yellow' ? 'bg-yellow-50 border-yellow-200 text-yellow-755' : 
                          'bg-red-50 border-red-200 text-red-700'
                        }`}>
                          {ingr.safety_tier_rating} Safety
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">{ingr.description}</p>
                      <div className="text-xs font-medium text-slate-500">
                        Primary Role: <span className="text-slate-800">{ingr.function_txt}</span>
                      </div>
                    </div>

                    {/* Details Button */}
                    {ingr.matched && ingr.compound_uuid && (
                      <button
                        onClick={() => onSearchCompound(ingr.compound_uuid!)}
                        className="shrink-0 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 px-4 py-2 rounded-xl border border-slate-200 transition-all font-bold flex items-center justify-center gap-2 text-sm"
                      >
                        Science Details <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Suggestions based on health conditions */}
                  {(ingr.when_to_use && ingr.when_to_use.length > 0 || ingr.when_not_to_use && ingr.when_not_to_use.length > 0) && (
                    <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {ingr.when_to_use && ingr.when_to_use.length > 0 && (
                        <div className="bg-green-50/50 border border-green-100 rounded-2xl p-4">
                          <span className="text-xs font-bold uppercase tracking-widest text-green-700 block mb-2">Suggestions for use</span>
                          <ul className="list-disc list-inside text-sm text-green-800 space-y-1">
                            {ingr.when_to_use.map((cond, j) => <li key={j}>{cond}</li>)}
                          </ul>
                        </div>
                      )}
                      {ingr.when_not_to_use && ingr.when_not_to_use.length > 0 && (
                        <div className="bg-red-50/50 border border-red-100 rounded-2xl p-4">
                          <span className="text-xs font-bold uppercase tracking-widest text-red-700 block mb-2">Warnings & Avoid</span>
                          <ul className="list-disc list-inside text-sm text-red-800 space-y-1">
                            {ingr.when_not_to_use.map((cond, j) => (
                              <li key={j}>
                                {cond} 
                                {healthConditions.toLowerCase().includes(cond.toLowerCase()) && 
                                  <span className="ml-2 inline-flex items-center gap-1 text-red-600 font-bold bg-red-100 px-2 py-0.5 rounded-md text-[10px] uppercase">
                                    <AlertTriangle className="w-3 h-3" /> matches your profile
                                  </span>
                                }
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Feedback Section */}
                <div className="bg-slate-50 border-t border-slate-200 p-6 md:px-8">
                  <div className="flex items-center gap-2 mb-4">
                    <MessageSquare className="w-4 h-4 text-blue-500" />
                    <h4 className="text-sm font-bold text-slate-700">Citizen Experience & Feedback</h4>
                  </div>
                  
                  {ingr.feedback.length > 0 ? (
                    <div className="space-y-3 mb-4">
                      {ingr.feedback.map((fb, j) => (
                        <div key={j} className="flex gap-3 bg-white p-3 rounded-xl border border-slate-100 shadow-xs">
                          <div className="w-8 h-8 rounded-full bg-slate-200 flex flex-shrink-0 items-center justify-center text-xs font-bold text-slate-500">
                            {fb.user.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <div className="text-xs font-bold text-slate-800 mb-0.5">{fb.user}</div>
                            <div className="text-sm text-slate-600">{fb.comment}</div>
                          </div>
                          <button className="flex flex-col items-center justify-center gap-0.5 text-slate-400 hover:text-blue-600 transition-colors shrink-0 px-2">
                            <ThumbsUp className="w-4 h-4" />
                            <span className="text-[10px] font-bold">{fb.helpful}</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-slate-500 italic mb-4">No experiences shared yet.</div>
                  )}

                  <div className="flex gap-3">
                    <input 
                      type="text" 
                      placeholder="Share your experience or reaction to this ingredient..." 
                      className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 transition-colors shadow-sm" 
                    />
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-sm">
                      Post
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>

          {/* Disclaimer Reminder */}
          <div className="flex items-start gap-3 bg-slate-100 border border-slate-200 rounded-2xl p-5 mt-8">
            <ShieldAlert className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-500 leading-relaxed">
              <strong>Medical Disclaimer:</strong> The suggestions and health warnings provided above are generated from user experiences and general educational databases. They are not evaluated by the FDA and are not intended to diagnose, treat, cure, or prevent any disease. Always consult your physician.
            </p>
          </div>

        </div>
      )}

    </div>
  );
}
