import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, ShieldCheck, Link2, Clock, ListMusic, ArrowRight, Activity } from 'lucide-react';

interface Annotation {
  id: number;
  start_seconds: number;
  end_seconds: number;
  compound: {
    compound_uuid: string;
    common_name: string;
    molecular_formula: string;
    safety_tier_rating: string;
  } | null;
  annotation: {
    title: string;
    body: string;
  };
}

interface TranscriptSegment {
  start_seconds: number;
  end_seconds: number;
  text: string;
}

interface EpisodeDetail {
  episode_id: string;
  title_slug: string;
  audio_cdn_url: string;
  duration_seconds: number;
  linked_research_papers: string[];
  annotations: Annotation[];
  transcript: TranscriptSegment[];
}

interface PodcastHubProps {
  onSearchCompound: (uuid: string) => void;
}

export default function PodcastHub({ onSearchCompound }: PodcastHubProps) {
  const [episodes] = useState([
    { id: 'ep1', title: 'Ep 1: The Chemical House', desc: 'Dissecting cleaning agents, leaveners, and oral hygiene salts.' },
    { id: 'ep2', title: 'Ep 2: Salt, Acid, and Time', desc: 'Exploring biological preservation and fermentation pathways.' },
    { id: 'ep3', title: 'Ep 3: The Power of pH', desc: 'Citizen science mapping, tap-water chemistry, and titration basics.' },
    { id: 'ep4', title: 'Ep 4: Deciphering the Jargon', desc: 'Translating cosmetic, food, and medication warning labels.' }
  ]);

  const [activeEpisodeId, setActiveEpisodeId] = useState('ep1');
  const [episodeData, setEpisodeData] = useState<EpisodeDetail | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const transcriptContainerRef = useRef<HTMLDivElement | null>(null);

  // Fetch episode data on active episode change
  useEffect(() => {
    fetchEpisodeData(activeEpisodeId);
    // Reset player state
    setIsPlaying(false);
    setCurrentTime(0);
  }, [activeEpisodeId]);

  // Handle time update triggers
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(err => console.error("Audio play failed:", err));
      setIsPlaying(true);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const jumpToTime = (seconds: number) => {
    setCurrentTime(seconds);
    if (audioRef.current) {
      audioRef.current.currentTime = seconds;
      if (!isPlaying) {
        audioRef.current.play().catch(err => console.error("Audio play failed:", err));
        setIsPlaying(true);
      }
    }
  };

  const fetchEpisodeData = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/podcast/${id}`);
      if (!response.ok) throw new Error('Failed to fetch podcast audio specifications');
      const data = await response.json();
      setEpisodeData(data);
    } catch (err: any) {
      console.error(err);
      setError('Could not connect to the podcast audio CDN server. Fallback to local synced parameters.');
      fallbackEpisodeData(id);
    } finally {
      setLoading(false);
    }
  };

  const fallbackEpisodeData = (id: string) => {
    // Generate high quality mock data with transcripts and timed annotations
    if (id === 'ep1') {
      setEpisodeData({
        episode_id: 'ep1',
        title_slug: 'household-chemistry-basics',
        audio_cdn_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        duration_seconds: 180,
        linked_research_papers: ['https://pubchem.ncbi.nlm.nih.gov'],
        annotations: [
          {
            id: 1, start_seconds: 0, end_seconds: 15, compound: { compound_uuid: 'water', common_name: 'Water', molecular_formula: 'H2O', safety_tier_rating: 'Green' },
            annotation: { title: 'Welcome to Everyday Chemistry', body: 'In this episode, we explore the molecular lens of a typical household. We start with water (H2O), the universal solvent that structures our life and cleanses our homes.' }
          },
          {
            id: 2, start_seconds: 16, end_seconds: 45, compound: { compound_uuid: 'acetic_acid', common_name: 'Vinegar', molecular_formula: 'CH3COOH', safety_tier_rating: 'Yellow' },
            annotation: { title: 'The Kitchen Acid: Vinegar', body: 'Moving to the kitchen: vinegar is an aqueous solution of acetic acid (CH3COOH). Diluted to 5%, its mild acidity breaks down mineral scales and preserves foods.' }
          },
          {
            id: 3, start_seconds: 46, end_seconds: 80, compound: { compound_uuid: 'sodium_bicarbonate', common_name: 'Baking Soda', molecular_formula: 'NaHCO3', safety_tier_rating: 'Green' },
            annotation: { title: 'Baking Soda: The Leavening Base', body: 'Baking soda (sodium bicarbonate) is a mild base. When mixed with vinegar, it releases carbon dioxide gas (CO2) in a rapid, bubbling neutralization reaction.' }
          },
          {
            id: 4, start_seconds: 81, end_seconds: 120, compound: { compound_uuid: 'sodium_fluoride', common_name: 'Toothpaste Fluoride', molecular_formula: 'NaF', safety_tier_rating: 'Red' },
            annotation: { title: 'Bathroom Chemistry: Fluoride', body: 'Next, the bathroom: toothpaste contains sodium fluoride, a critical compound that replaces hydroxide ions in tooth enamel with acid-resistant fluorapatite.' }
          }
        ],
        transcript: [
          { start_seconds: 0, end_seconds: 15, text: 'Welcome to Everyday Chemistry. In this episode, we explore the molecular lens of a typical household. We start with water (H2O), the universal solvent that structures our life.' },
          { start_seconds: 16, end_seconds: 45, text: 'Moving to the kitchen: vinegar is an aqueous solution of acetic acid (CH3COOH). Diluted to 5%, its mild acidity breaks down mineral scales and preserves foods.' },
          { start_seconds: 46, end_seconds: 80, text: 'Baking soda (sodium bicarbonate) is a mild base. When mixed with vinegar, it releases carbon dioxide gas (CO2) in a rapid, bubbling neutralization reaction.' },
          { start_seconds: 81, end_seconds: 120, text: 'Next, the bathroom: toothpaste contains sodium fluoride, a critical compound that replaces hydroxide ions in tooth enamel with acid-resistant fluorapatite.' }
        ]
      });
    } else {
      setEpisodeData({
        episode_id: id,
        title_slug: 'sample-track',
        audio_cdn_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        duration_seconds: 240,
        linked_research_papers: [],
        annotations: [
          {
            id: 1, start_seconds: 0, end_seconds: 30, compound: { compound_uuid: 'citric_acid', common_name: 'Citric Acid', molecular_formula: 'C6H8O7', safety_tier_rating: 'Green' },
            annotation: { title: 'Acid preservation parameters', body: 'Citric acid acts as a natural antioxidant and acidity buffer, inhibiting bacterial fermentation channels.' }
          }
        ],
        transcript: [
          { start_seconds: 0, end_seconds: 30, text: 'We review the enzymatic and chemical pathways involved in preserving foods. Citric acid acts as a natural antioxidant and acidity buffer.' }
        ]
      });
    }
  };

  // Get active annotation based on current playing time
  const activeAnnotation = episodeData?.annotations.find(
    ann => currentTime >= ann.start_seconds && currentTime <= ann.end_seconds
  );

  const formatTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="space-y-1">
        <h2 className="text-3xl font-black font-display text-white m-0">Podcast Hub & Visual Annotations</h2>
        <p className="text-sm text-gray-400">
          Listen to conversational chemistry lectures synced in real-time with visual molecular cards, chemical details, and bibliography details.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
        
        {/* Playlist selector */}
        <div className="lg:col-span-1 bg-[#0b0f19] border border-gray-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
            <ListMusic className="w-5 h-5 text-green-400" />
            <h3 className="text-sm font-bold text-gray-300">Episodes List</h3>
          </div>

          <div className="flex flex-col gap-2.5">
            {episodes.map(ep => (
              <button
                key={ep.id}
                onClick={() => setActiveEpisodeId(ep.id)}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all ${
                  activeEpisodeId === ep.id
                    ? 'bg-green-500/10 border-green-500/30 text-white font-medium'
                    : 'bg-gray-900/30 border-gray-800 hover:border-gray-700 text-gray-400 font-normal'
                }`}
              >
                <h4 className="text-xs font-bold font-display text-white leading-normal m-0">{ep.title}</h4>
                <p className="text-[10px] text-gray-500 leading-normal mt-1 m-0">{ep.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Audio Sync Terminal Panel */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-5 gap-6">
          
          {/* Transcript & Player Panel */}
          <div className="md:col-span-3 bg-[#0b0f19] border border-gray-800 rounded-3xl p-6 flex flex-col justify-between space-y-6">
            {episodeData ? (
              <>
                {/* Audio Engine */}
                <audio
                  ref={audioRef}
                  src={episodeData.audio_cdn_url}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onEnded={handleAudioEnded}
                />

                {/* Header info */}
                <div className="space-y-1 pb-3 border-b border-gray-800/80">
                  <span className="text-[10px] text-green-400 font-extrabold uppercase tracking-widest block">Now Playing</span>
                  <h3 className="text-xl font-bold font-display text-white truncate m-0">
                    {episodes.find(e => e.id === activeEpisodeId)?.title}
                  </h3>
                </div>

                {/* Interactive Transcript */}
                <div 
                  ref={transcriptContainerRef}
                  className="flex-1 space-y-3.5 max-h-[300px] overflow-y-auto pr-1 py-2"
                >
                  {episodeData.transcript.map((seg, idx) => {
                    const isHighlighted = currentTime >= seg.start_seconds && currentTime <= seg.end_seconds;
                    return (
                      <div
                        key={idx}
                        onClick={() => jumpToTime(seg.start_seconds)}
                        className={`p-3.5 rounded-2xl border text-xs cursor-pointer transition-all duration-200 ${
                          isHighlighted
                            ? 'bg-green-500/10 border-green-500/35 text-white font-medium shadow-md shadow-green-500/5'
                            : 'bg-gray-900/35 border-transparent text-gray-400 hover:text-gray-250 hover:bg-gray-900/60'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 text-[9px] font-bold text-gray-500 mb-1.5">
                          <Clock className="w-3 h-3 text-gray-550" />
                          <span>{formatTime(seg.start_seconds)}</span>
                        </div>
                        <p className="leading-relaxed m-0">{seg.text}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Player Controls Bar */}
                <div className="pt-4 border-t border-gray-800/80 space-y-3">
                  {/* Slider Progress Bar */}
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono text-gray-500">{formatTime(currentTime)}</span>
                    <input
                      type="range"
                      min={0}
                      max={duration || episodeData.duration_seconds}
                      value={currentTime}
                      onChange={handleSeek}
                      className="flex-1 accent-green-400 h-1 bg-gray-850 rounded-lg cursor-pointer appearance-none"
                    />
                    <span className="text-[10px] font-mono text-gray-500">
                      {formatTime(duration || episodeData.duration_seconds)}
                    </span>
                  </div>

                  {/* Play Button and indicators */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={togglePlay}
                        className="bg-green-500 hover:bg-green-600 active:scale-95 text-[#070a13] p-3.5 rounded-full transition-all flex items-center justify-center cursor-pointer shadow-lg shadow-green-500/10"
                      >
                        {isPlaying ? (
                          <Pause className="w-5 h-5 fill-current" />
                        ) : (
                          <Play className="w-5 h-5 fill-current ml-0.5" />
                        )}
                      </button>
                      
                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Audio Stream</span>
                        <span className="text-xs text-gray-300 font-semibold flex items-center gap-1.5">
                          {isPlaying ? (
                            <>
                              <Activity className="w-3.5 h-3.5 text-green-400 animate-pulse" />
                              <span>Live Annotation Sync</span>
                            </>
                          ) : (
                            <span>Paused</span>
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-gray-500 text-[10px] font-medium bg-gray-900 border border-gray-850 px-3 py-1.5 rounded-xl">
                      <Volume2 className="w-4 h-4 text-gray-550" />
                      <span>Audio Playback</span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center py-20 text-gray-500 animate-pulse">
                Loading podcast specs...
              </div>
            )}
          </div>

          {/* Sync Annotations Display panel */}
          <div className="md:col-span-2 bg-[#0b0f19] border border-gray-800 rounded-3xl p-6 flex flex-col justify-between">
            {activeAnnotation ? (
              <div className="space-y-6 h-full flex flex-col justify-between animate-fade-in">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-850 pb-3">
                    <span className="text-[10px] text-purple-400 font-extrabold uppercase tracking-widest bg-purple-500/10 border border-purple-500/25 px-2.5 py-1 rounded-lg">
                      Timeline Annotation
                    </span>
                    <span className="text-[10px] text-gray-500 font-mono">
                      {formatTime(activeAnnotation.start_seconds)} - {formatTime(activeAnnotation.end_seconds)}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-bold font-display text-white m-0 leading-tight">
                      {activeAnnotation.annotation.title}
                    </h3>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      {activeAnnotation.annotation.body}
                    </p>
                  </div>

                  {activeAnnotation.compound && (
                    <div className="bg-gray-900/50 border border-gray-850 p-4 rounded-2xl space-y-3 mt-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider leading-none">Related Compound</h4>
                          <span className="text-sm font-extrabold text-white mt-2 block">{activeAnnotation.compound.common_name}</span>
                        </div>
                        <span className="text-[9px] font-mono text-purple-400 bg-gray-900 px-2 py-0.5 rounded border border-gray-800">
                          {activeAnnotation.compound.molecular_formula}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-2.5 border-t border-gray-850">
                        <span className={`text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded ${
                          activeAnnotation.compound.safety_tier_rating === 'Green'
                            ? 'bg-green-500/10 text-green-400'
                            : activeAnnotation.compound.safety_tier_rating === 'Yellow'
                            ? 'bg-yellow-500/10 text-yellow-400'
                            : 'bg-red-500/10 text-red-400'
                        }`}>
                          {activeAnnotation.compound.safety_tier_rating}
                        </span>
                        
                        <button
                          onClick={() => onSearchCompound(activeAnnotation.compound!.compound_uuid)}
                          className="text-[10px] text-green-400 hover:text-green-300 font-bold flex items-center gap-1 cursor-pointer transition-all"
                        >
                          <span>Chemical details</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {episodeData && episodeData.linked_research_papers.length > 0 && (
                  <div className="pt-4 border-t border-gray-800/85">
                    <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-2">Bibliography Sources</h4>
                    {episodeData.linked_research_papers.map((paper, i) => (
                      <a
                        key={i}
                        href={paper}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] text-green-450 hover:text-green-300 truncate flex items-center gap-1 transition-all"
                      >
                        <Link2 className="w-3.5 h-3.5 text-gray-650 shrink-0" />
                        <span>Source publication trail link</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 p-6 py-12">
                <div className="p-3.5 bg-gray-900 border border-gray-800 rounded-full text-gray-600 animate-pulse">
                  <Volume2 className="w-8 h-8" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-xs font-bold text-gray-300">Live annotation deck</h3>
                  <p className="text-[11px] text-gray-550 max-w-xs leading-normal">
                    Audio visualizer is idle. Start playing the audio stream. Annotations detailing compound formulas and links will appear here dynamically.
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
