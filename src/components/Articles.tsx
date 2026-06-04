import React, { useState, useEffect } from 'react';
import { FileText, ArrowRight, ShieldCheck, Calendar, BookOpen, ExternalLink, Link2, GraduationCap } from 'lucide-react';

interface ArticleBasic {
  slug: string;
  title: string;
  category: string;
  reading_level: string;
  last_reviewed_at: string;
  compound_ids: string[];
}

interface ArticleDetail extends ArticleBasic {
  content: string;
  source_log: {
    author: string;
    reviewer: string;
    citations: string[];
  };
  compounds: Array<{
    compound_uuid: string;
    common_name: string;
    molecular_formula: string;
    safety_tier_rating: string;
    function_txt: string;
  }>;
}

interface ArticlesProps {
  onSearchCompound: (uuid: string) => void;
}

export default function Articles({ onSearchCompound }: ArticlesProps) {
  const [articles, setArticles] = useState<ArticleBasic[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<ArticleDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/articles');
      if (!response.ok) throw new Error('Failed to load articles list');
      const data = await response.json();
      setArticles(data);
      // Load first article by default if any
      if (data.length > 0) {
        fetchArticleDetail(data[0].slug);
      }
    } catch (err: any) {
      console.error(err);
      setError('Could not connect to the articles database. Using local fallback entries.');
      fallbackArticles();
    } finally {
      setLoading(false);
    }
  };

  const fallbackArticles = () => {
    const list: ArticleBasic[] = [
      { slug: 'fermentation-preservation', title: 'The Chemistry of Preserving: How Salt and Vinegar Save Food', category: 'Food Chemistry', reading_level: 'High School / General', last_reviewed_at: '2026-05-15', compound_ids: ['sodium_chloride', 'acetic_acid'] },
      { slug: 'maillard-reaction', title: 'Maillard Reaction: The Science of Searing, Baking, and Browning', category: 'Food Chemistry', reading_level: 'General', last_reviewed_at: '2026-05-18', compound_ids: ['glucose'] }
    ];
    setArticles(list);
    if (list.length > 0) {
      fallbackArticleDetail(list[0].slug);
    }
  };

  const fetchArticleDetail = async (slug: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/articles/${slug}`);
      if (!response.ok) throw new Error('Failed to load article detail');
      const data = await response.json();
      setSelectedArticle(data);
    } catch (err: any) {
      console.error(err);
      fallbackArticleDetail(slug);
    } finally {
      setLoading(false);
    }
  };

  const fallbackArticleDetail = (slug: string) => {
    if (slug === 'fermentation-preservation') {
      setSelectedArticle({
        slug: 'fermentation-preservation',
        title: 'The Chemistry of Preserving: How Salt and Vinegar Save Food',
        category: 'Food Chemistry',
        reading_level: 'High School / General',
        last_reviewed_at: '2026-05-15',
        compound_ids: ['sodium_chloride', 'acetic_acid'],
        content: "For thousands of years, humans have used sodium chloride (table salt) and acetic acid (vinegar) to preserve food. But how do these simple molecules stop bacterial decay?\n\n### Osmotic Shock with Salt\nWhen food is treated with high concentrations of sodium chloride, it creates a hypertonic environment. Water inside bacterial cells rushes out via osmosis to balance the salt concentrations. This dehydrates and disables the bacteria, stopping food spoilage.\n\n### Acidic Disruption with Vinegar\nAcetic acid easily penetrates bacterial cell membranes in its neutral state. Once inside the cell, it dissociates into hydrogen ions and acetate ions. This lowers the cell's internal pH, disrupting essential metabolic enzymes and neutralizing the microorganism.",
        source_log: {
          author: 'Everyday Chemistry Team',
          reviewer: 'Chemistry Mentor',
          citations: ['NIH PMC Preservative Review', 'FDA Food Safety Guidance']
        },
        compounds: [
          { compound_uuid: 'sodium_chloride', common_name: 'Table Salt', molecular_formula: 'NaCl', safety_tier_rating: 'Green', function_txt: 'Preservative' },
          { compound_uuid: 'acetic_acid', common_name: 'Vinegar', molecular_formula: 'CH3COOH', safety_tier_rating: 'Yellow', function_txt: 'Acidifier' }
        ]
      });
    } else {
      setSelectedArticle({
        slug: 'maillard-reaction',
        title: 'Maillard Reaction: The Science of Searing, Baking, and Browning',
        category: 'Food Chemistry',
        reading_level: 'General',
        last_reviewed_at: '2026-05-18',
        compound_ids: ['glucose'],
        content: 'The Maillard reaction is a chemical reaction between amino acids and reducing sugars that gives browned food its desirable flavor. Seared steaks, cookies, and toasted bread all owe their aroma to this reaction.',
        source_log: {
          author: 'Everyday Chemistry Team',
          reviewer: 'Food Biochemist',
          citations: ['Journal of Food Chemistry 2024']
        },
        compounds: [
          { compound_uuid: 'glucose', common_name: 'Glucose', molecular_formula: 'C6H12O6', safety_tier_rating: 'Green', function_txt: 'Reducing sugar' }
        ]
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="space-y-1">
        <h2 className="text-3xl font-black font-display text-slate-800 m-0">Food & Daily Chemistry Articles</h2>
        <p className="text-sm text-slate-500">
          Peer-reviewed articles translating complex kitchen reactions, biochemical metabolisms, and household safety parameters.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        
        {/* List side */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm">
          <h3 className="text-xs font-bold text-slate-450 uppercase tracking-widest block pb-2 border-b border-slate-200">
            Available Articles
          </h3>
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {articles.map((art) => {
              const isSelected = selectedArticle?.slug === art.slug;
              return (
                <button
                  key={art.slug}
                  onClick={() => fetchArticleDetail(art.slug)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all ${
                    isSelected
                      ? 'bg-green-55 border-green-200 text-green-950 font-semibold shadow-xs'
                      : 'bg-slate-50 border border-slate-200 hover:border-slate-350/60 hover:bg-slate-100/50 text-slate-700'
                  }`}
                >
                  <span className="text-[10px] text-green-700 font-extrabold uppercase tracking-widest block mb-1">
                    {art.category}
                  </span>
                  <h4 className="text-sm font-bold font-display text-slate-800 leading-snug line-clamp-2 m-0">
                    {art.title}
                  </h4>
                  <div className="flex items-center gap-3 mt-3 text-[10px] text-slate-400 font-medium">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5" />
                      {art.reading_level}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Read side */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          
          {/* Article Contents */}
          <div className="md:col-span-2 bg-white border border-slate-200 rounded-3xl p-8 space-y-6 min-h-[400px] shadow-sm">
            {selectedArticle ? (
              <article className="space-y-6">
                
                {/* Header */}
                <div className="space-y-3 pb-5 border-b border-slate-200">
                  <span className="text-xs text-green-700 font-extrabold uppercase tracking-widest">
                    {selectedArticle.category}
                  </span>
                  <h1 className="text-3xl font-black font-display text-slate-800 tracking-tight m-0 leading-tight">
                    {selectedArticle.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 font-semibold pt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      Reviewed: {selectedArticle.last_reviewed_at}
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4 text-slate-400" />
                      Reading Level: {selectedArticle.reading_level}
                    </span>
                  </div>
                </div>

                {/* Markdown body content */}
                <div className="text-sm text-slate-650 leading-relaxed space-y-4 font-normal">
                  {selectedArticle.content.split('\n\n').map((paragraph, index) => {
                    if (paragraph.startsWith('### ')) {
                      return (
                        <h3 key={index} className="text-lg font-bold font-display text-slate-800 mt-6 mb-2">
                          {paragraph.replace('### ', '')}
                        </h3>
                      );
                    }
                    if (paragraph.startsWith('- ')) {
                      return (
                        <ul key={index} className="list-disc pl-5 space-y-1.5 my-3 text-xs text-slate-600">
                          {paragraph.split('\n').map((li, idx) => (
                            <li key={idx} className="leading-relaxed">
                              {li.replace('- ', '')}
                            </li>
                          ))}
                        </ul>
                      );
                    }
                    return (
                      <p key={index} className="leading-relaxed">
                        {paragraph}
                      </p>
                    );
                  })}
                </div>
              </article>
            ) : (
              <div className="h-full flex items-center justify-center text-center text-slate-400 py-20 animate-pulse">
                Loading article contents...
              </div>
            )}
          </div>

          {/* Source Trail Panel */}
          <div className="space-y-6">
            {selectedArticle && (
              <>
                {/* Linked Chemicals */}
                <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-4 shadow-sm">
                  <h4 className="text-xs font-bold text-slate-450 uppercase tracking-widest block border-b border-slate-200 pb-2">
                    Linked Chemicals
                  </h4>
                  <div className="flex flex-col gap-2">
                    {selectedArticle.compounds.map((comp) => (
                      <button
                        key={comp.compound_uuid}
                        onClick={() => onSearchCompound(comp.compound_uuid)}
                        className="w-full text-left p-3.5 bg-slate-50 border border-slate-200 hover:border-slate-350 hover:bg-slate-100 rounded-2xl flex items-center justify-between text-xs transition-all group shadow-xs"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-800 group-hover:text-green-700">{comp.common_name}</span>
                            <span className="text-[10px] font-mono text-purple-700">{comp.molecular_formula}</span>
                          </div>
                          <span className="text-[10px] text-slate-450 block mt-0.5 truncate">{comp.function_txt}</span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-900" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Source Review Log */}
                <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-4 shadow-sm">
                  <h4 className="text-xs font-bold text-slate-450 uppercase tracking-widest block border-b border-slate-200 pb-2">
                    Research Integrity Log
                  </h4>
                  <div className="space-y-3.5">
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Draft Author</span>
                      <p className="text-xs font-semibold text-slate-700">{selectedArticle.source_log.author}</p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-green-705">
                        <ShieldCheck className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-wider block">Verified Reviewer</span>
                      </div>
                      <p className="text-xs font-semibold text-slate-700">{selectedArticle.source_log.reviewer}</p>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Scientific Citations</span>
                      <div className="flex flex-col gap-1.5">
                        {selectedArticle.source_log.citations.map((cite, i) => (
                          <div key={i} className="flex items-start gap-2 bg-slate-50 border border-slate-200 p-2.5 rounded-xl">
                            <Link2 className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                            <span className="text-[10px] text-slate-600 font-medium leading-relaxed">{cite}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
