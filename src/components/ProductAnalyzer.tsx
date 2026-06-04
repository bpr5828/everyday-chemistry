import React, { useState } from 'react';
import { Sparkles, FileText, ArrowRight, ShieldCheck, AlertTriangle, RefreshCw } from 'lucide-react';

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
}

interface ParseResponse {
  product_uuid: string;
  ingredients: ParsedIngredient[];
  safety_score_aggregate: number;
  ingredient_count: number;
  breakdown: {
    green: number;
    yellow: number;
    red: number;
  };
}

interface ProductAnalyzerProps {
  onSearchCompound: (uuid: string) => void;
}

export default function ProductAnalyzer({ onSearchCompound }: ProductAnalyzerProps) {
  const [ingredientsText, setIngredientsText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ParseResponse | null>(null);

  const presets = [
    {
      label: ' SmileScience Toothpaste',
      text: 'Water, Sorbitol, Hydrated Silica, Glycerin, Sodium Lauryl Sulfate, Xanthan Gum, Flavor, Sodium Fluoride, Sodium Saccharin, Titanium Dioxide'
    },
    {
      label: ' EcoClean Soap',
      text: 'Water, Sodium Lauryl Sulfate, Sodium Laureth Sulfate, Lauramine Oxide, Alcohol Denat., Sodium Chloride, Fragrance'
    },
    {
      label: ' HyperVolt Energy Drink',
      text: 'Carbonated Water, Sucrose, Glucose, Citric Acid, Taurine, Sodium Citrate, Caffeine, Niacinamide'
    },
    {
      label: ' BrightHome Bleach',
      text: 'Water, Sodium Hypochlorite, Sodium Chloride, Sodium Carbonate, Sodium Hydroxide'
    }
  ];

  const handleParse = async (textToParse = ingredientsText) => {
    if (!textToParse.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/products/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients_text: textToParse })
      });
      if (!response.ok) throw new Error('Parse request failed');
      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError('Could not connect to the ingredients analyzer backend. Fallback to local parsing parser.');
      fallbackParse(textToParse);
    } finally {
      setLoading(false);
    }
  };

  const fallbackParse = (text: string) => {
    // Local mock parsing fallback
    const tokens = text.split(',').map(t => t.trim()).filter(Boolean);
    const mockDb: Record<string, { name: string; formula: string; safety: 'Green' | 'Yellow' | 'Red'; desc: string; func: string }> = {
      'water': { name: 'Water', formula: 'H2O', safety: 'Green', desc: 'Universal solvent', func: 'Solvent' },
      'glycerin': { name: 'Glycerin', formula: 'C3H8O3', safety: 'Green', desc: 'Moisturizing alcohol humectant', func: 'Humectant' },
      'sodium fluoride': { name: 'Sodium Fluoride', formula: 'NaF', safety: 'Red', desc: 'Dental enamel fortifier', func: 'Enamel protector' },
      'citric acid': { name: 'Citric Acid', formula: 'C6H8O7', safety: 'Green', desc: 'Acidity regulator', func: 'pH regulator' },
      'caffeine': { name: 'Caffeine', formula: 'C8H10N4O2', safety: 'Yellow', desc: 'Stimulating alkaloid', func: 'Stimulant' },
      'sodium laureth sulfate': { name: 'Sodium Laureth Sulfate', formula: 'C14H29NaO5S', safety: 'Yellow', desc: 'Surfactant foaming cleanser', func: 'Cleanser Surfactant' }
    };

    let green = 0, yellow = 0, red = 0;
    const list: ParsedIngredient[] = tokens.map((token) => {
      const cleanTok = token.toLowerCase();
      let matched = false;
      let data: { name: string; formula: string; safety: 'Green' | 'Yellow' | 'Red'; desc: string; func: string } = { name: token, formula: 'N/A', safety: 'Yellow', desc: 'Unknown compound in mock fallback database.', func: 'Unmatched ingredient' };
      
      for (const k in mockDb) {
        if (cleanTok.includes(k) || k.includes(cleanTok)) {
          matched = true;
          data = mockDb[k];
          break;
        }
      }

      if (data.safety === 'Green') green++;
      else if (data.safety === 'Yellow') yellow++;
      else red++;

      return {
        original_text: token,
        matched,
        confidence_score: matched ? 0.90 : 0.0,
        compound_uuid: matched ? token.toLowerCase().replace(' ', '_') : null,
        common_name: data.name,
        molecular_formula: data.formula,
        safety_tier_rating: data.safety,
        function_txt: data.func,
        description: data.desc
      };
    });

    const score = Math.max(0, 100 - (yellow * 10) - (red * 25));

    setResult({
      product_uuid: 'parsed_fallback',
      ingredients: list,
      safety_score_aggregate: score,
      ingredient_count: tokens.length,
      breakdown: { green, yellow, red }
    });
  };

  const scoreColor = (score: number) => {
    if (score >= 85) return 'text-green-700 border-green-200 bg-green-50';
    if (score >= 60) return 'text-yellow-750 border-yellow-250/80 bg-yellow-50';
    return 'text-red-700 border-red-200 bg-red-50';
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="space-y-1">
        <h2 className="text-3xl font-black font-display text-slate-800 m-0">Label Product Ingredient Analyzer</h2>
        <p className="text-sm text-slate-500">
          Paste an ingredient list from shampoo, snacks, or cleaners to dissect individual molecules, compile risk ratios, and review objective explanations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Paste Box */}
        <div className="lg:col-span-1 bg-white border border-slate-200 rounded-3xl p-6 space-y-5 shadow-sm">
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-750">Paste Ingredient Label Text</h3>
            <textarea
              value={ingredientsText}
              onChange={(e) => setIngredientsText(e.target.value)}
              placeholder="Copy and paste comma-separated ingredients listing from any package..."
              rows={8}
              className="w-full bg-slate-50 border border-slate-200 focus:border-green-500/50 focus:bg-white outline-none rounded-xl p-4 text-xs text-slate-800 placeholder-slate-400 transition-all font-mono leading-relaxed"
            />
          </div>

          {/* Quick presets */}
          <div className="space-y-2.5">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Select Sample Presets</h4>
            <div className="flex flex-col gap-2">
              {presets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setIngredientsText(preset.text);
                    handleParse(preset.text);
                  }}
                  className="w-full text-left text-xs bg-slate-50 border border-slate-200 hover:border-slate-350/60 hover:bg-slate-100 p-2.5 rounded-xl transition-all flex items-center gap-2 text-slate-650 hover:text-slate-900 shadow-xs"
                >
                  <FileText className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                  <span className="truncate">{preset.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => handleParse()}
              disabled={loading || !ingredientsText.trim()}
              className="flex-1 bg-green-600 hover:bg-green-700 active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-xs transition-all duration-150 shadow-sm"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Decoding List...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Dissect Ingredients</span>
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="bg-red-55/10 border border-red-200 p-3.5 rounded-xl text-[11px] text-red-750">
              {error}
            </div>
          )}
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-6">
          {result ? (
            <div className="space-y-6">
              
              {/* Product Card Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* Aggregate Score Card */}
                <div className={`border p-6 rounded-3xl flex flex-col justify-between items-center text-center shadow-sm ${scoreColor(result.safety_score_aggregate)}`}>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Aggregate Safety Score</h4>
                  <div className="my-3">
                    <span className="text-5xl font-black font-display tracking-tight">
                      {Math.round(result.safety_score_aggregate)}
                    </span>
                    <span className="text-lg text-slate-450 font-semibold">/100</span>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider">
                    {result.safety_score_aggregate >= 85 ? 'Premium Profile' : result.safety_score_aggregate >= 60 ? 'Precautionary Profile' : 'High Active Profile'}
                  </span>
                </div>

                {/* Score Breakdown Counts */}
                <div className="bg-white border border-slate-200 p-6 rounded-3xl sm:col-span-2 flex flex-col justify-between gap-4 shadow-sm">
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-slate-750">Ingredient Proportions</h3>
                    <p className="text-xs text-slate-500 leading-normal">
                      Distribution of chemical compounds parsed from raw text matches in the database directory.
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-green-50 border border-green-200 p-3 rounded-2xl text-center shadow-xs">
                      <span className="text-xs font-bold text-green-700 uppercase tracking-widest block">Green</span>
                      <span className="text-xl font-bold text-slate-800 mt-1 block">{result.breakdown.green}</span>
                      <span className="text-[9px] text-slate-450 font-semibold block mt-0.5">Everyday Safe</span>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-250/80 p-3 rounded-2xl text-center shadow-xs">
                      <span className="text-xs font-bold text-yellow-750 uppercase tracking-widest block">Yellow</span>
                      <span className="text-xl font-bold text-slate-800 mt-1 block">{result.breakdown.yellow}</span>
                      <span className="text-[9px] text-slate-450 font-semibold block mt-0.5">Mild Irritant</span>
                    </div>
                    <div className="bg-red-50 border border-red-200 p-3 rounded-2xl text-center shadow-xs">
                      <span className="text-xs font-bold text-red-700 uppercase tracking-widest block">Red</span>
                      <span className="text-xl font-bold text-slate-800 mt-1 block">{result.breakdown.red}</span>
                      <span className="text-[9px] text-slate-455 font-semibold block mt-0.5">Concentrated Risk</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Ingredients Scanned Cards */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <h3 className="text-sm font-bold text-slate-750">Ingredient Dissection Scan</h3>
                  <span className="text-xs text-slate-450">{result.ingredient_count} items analyzed</span>
                </div>

                <div className="space-y-3">
                  {result.ingredients.map((ingr, i) => (
                    <div 
                      key={i}
                      className={`p-4 rounded-2xl border flex flex-col sm:flex-row justify-between sm:items-center gap-4 transition-all ${
                        ingr.matched 
                          ? 'bg-slate-50 border-slate-200 hover:border-slate-350/60 shadow-xs' 
                          : 'bg-yellow-50/50 border-dashed border-yellow-250/80'
                      }`}
                    >
                      <div className="space-y-1.5 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-extrabold text-slate-850">{ingr.common_name}</span>
                          <span className="text-xs font-mono text-purple-700">{ingr.molecular_formula}</span>
                          {ingr.confidence_score > 0 && ingr.confidence_score < 1.0 && (
                            <span className="text-[9px] bg-blue-55/10 border border-blue-200 text-blue-700 font-bold px-2 py-0.5 rounded">
                              Fuzzy Match ({Math.round(ingr.confidence_score * 100)}%)
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 m-0 leading-normal max-w-xl">{ingr.description}</p>
                        <p className="text-[10px] text-slate-500 font-semibold m-0 mt-1">
                          Role: <span className="text-slate-700">{ingr.function_txt}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                        <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg border ${
                          ingr.safety_tier_rating === 'Green'
                            ? 'bg-green-50 border-green-200 text-green-700'
                            : ingr.safety_tier_rating === 'Yellow'
                            ? 'bg-yellow-50 border-yellow-200 text-yellow-755'
                            : 'bg-red-50 border-red-200 text-red-700'
                        }`}>
                          {ingr.safety_tier_rating}
                        </span>
                        
                        {ingr.matched && ingr.compound_uuid ? (
                          <button
                            onClick={() => onSearchCompound(ingr.compound_uuid!)}
                            className="bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 p-2.5 rounded-xl border border-slate-200 hover:border-slate-300 transition-all cursor-pointer shadow-xs"
                            title="View chemical card"
                          >
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        ) : (
                          <div className="flex items-center gap-1 text-[10px] text-yellow-750 font-bold">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>Unmatched</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 p-8 bg-white border border-slate-200 rounded-3xl min-h-[400px] shadow-sm">
              <div className="p-4 bg-slate-100 border border-slate-200 rounded-full text-slate-400 animate-pulse">
                <Sparkles className="w-12 h-12" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-slate-700">Analyzer Output Display</h3>
                <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
                  Enter an ingredients list on the left panel or select one of the product presets to scan the chemical proportions.
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
