import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Sliders, CheckCircle2, ShieldAlert, BookOpen, HelpCircle } from 'lucide-react';

interface MapPoint {
  record_id: number;
  location_bucket: string;
  metric_type: string;
  numeric_value: number;
  device_calibration_flag: boolean;
}

interface CitizenMapProps {
  onSubmissionSuccess: () => void;
}

export default function CitizenMap({ onSubmissionSuccess }: CitizenMapProps) {
  const [mapPoints, setMapPoints] = useState<MapPoint[]>([]);
  const [locationBucket, setLocationBucket] = useState('');
  const [pHValue, setPHValue] = useState(7.0);
  const [calibrated, setCalibrated] = useState(false);
  const [deviceMethod, setDeviceMethod] = useState('Strip');
  
  const [submitting, setSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<{
    status: 'success' | 'warning' | 'error' | null;
    message: string;
  }>({ status: null, message: '' });

  useEffect(() => {
    fetchMapData();
  }, []);

  const fetchMapData = async () => {
    try {
      const response = await fetch('/api/metrics/map');
      if (!response.ok) throw new Error('Failed to load map data');
      const data = await response.json();
      setMapPoints(data);
    } catch (err) {
      console.error(err);
      // Fallback local points
      setMapPoints([
        { record_id: 1, location_bucket: '10001', metric_type: 'pH', numeric_value: 7.2, device_calibration_flag: true },
        { record_id: 2, location_bucket: '90210', metric_type: 'pH', numeric_value: 7.8, device_calibration_flag: true },
        { record_id: 3, location_bucket: '60611', metric_type: 'pH', numeric_value: 7.4, device_calibration_flag: true },
        { record_id: 4, location_bucket: '30301', metric_type: 'pH', numeric_value: 6.8, device_calibration_flag: true },
        { record_id: 5, location_bucket: '75001', metric_type: 'pH', numeric_value: 8.1, device_calibration_flag: true }
      ]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!locationBucket.trim()) return;
    setSubmitting(true);
    setSubmissionStatus({ status: null, message: '' });
    try {
      const response = await fetch('/api/metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location_bucket: locationBucket,
          numeric_value: pHValue,
          device_calibration_flag: calibrated
        })
      });
      if (!response.ok) throw new Error('Submission failed');
      const data = await response.json();
      
      if (data.verification_status === 'approved') {
        setSubmissionStatus({
          status: 'success',
          message: 'Approved! Your calibrated, typical measurement has been added to the public map.'
        });
        fetchMapData();
      } else {
        setSubmissionStatus({
          status: 'warning',
          message: 'Submitted! Your measurement is pending review as an outlier (typical tap water pH is 6.0-8.5) or due to calibration status.'
        });
      }
      // Reset form
      setLocationBucket('');
      setPHValue(7.0);
      setCalibrated(false);
      onSubmissionSuccess();
    } catch (err) {
      console.error(err);
      setSubmissionStatus({
        status: 'error',
        message: 'Could not connect to the citizen science server to record submission.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Helper for pH colors
  const pHColor = (val: number) => {
    if (val < 4) return 'bg-[#ef4444] text-white'; // Strongly Acidic (Red)
    if (val < 6) return 'bg-[#f97316] text-white'; // Weak Acidic (Orange)
    if (val < 8) return 'bg-[#22c55e] text-white font-bold'; // Neutral (Green)
    if (val < 10) return 'bg-[#3b82f6] text-white'; // Weak Alkaline (Blue)
    return 'bg-[#8b5cf6] text-white'; // Strongly Alkaline (Purple)
  };

  const pHSuggestedScale = [
    { ph: 3, label: 'Lemon juice (Acidic)', color: 'bg-red-500' },
    { ph: 5, label: 'Rain water (Acidic)', color: 'bg-orange-500' },
    { ph: 7, label: 'Pure water (Neutral)', color: 'bg-green-500' },
    { ph: 8.5, label: 'Baking Soda buffer', color: 'bg-blue-500' },
    { ph: 11, label: 'Household Bleach', color: 'bg-purple-500' }
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="space-y-1">
        <h2 className="text-3xl font-black font-display text-slate-800 m-0">Citizen Chemistry pH Map</h2>
        <p className="text-sm text-slate-500">
          A collective community effort mapping local tap-water pH variances to observe water hardness, mineral leaching, and municipal buffering.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        
        {/* Submission Form Panel */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col justify-between space-y-6 shadow-sm">
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
              <Plus className="w-5 h-5 text-green-700" />
              <h3 className="text-sm font-bold text-slate-750">Submit pH Reading</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Location Bucket */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500">Location Bucket (Zip Code / City)</label>
                <input
                  type="text"
                  placeholder="e.g. 10001 or Boston"
                  value={locationBucket}
                  onChange={(e) => setLocationBucket(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 focus:border-green-500/50 focus:bg-white outline-none rounded-xl py-3 px-4 text-xs text-slate-800 placeholder-slate-400 font-medium"
                />
                <span className="text-[10px] text-slate-450 block leading-normal">
                  To protect privacy, do not enter your home address. Enter zip code or city.
                </span>
              </div>

              {/* pH Level Slider */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between items-baseline">
                  <label className="text-xs font-semibold text-slate-500">Measured pH Level</label>
                  <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded-md ${pHColor(pHValue)}`}>
                    pH {pHValue.toFixed(1)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="14"
                  step="0.1"
                  value={pHValue}
                  onChange={(e) => setPHValue(parseFloat(e.target.value))}
                  className="w-full accent-green-600 h-1 bg-slate-200 rounded-lg cursor-pointer appearance-none mt-2"
                />
              </div>

              {/* Device Method */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500">Measurement Device</label>
                <select
                  value={deviceMethod}
                  onChange={(e) => setDeviceMethod(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-green-500/50 focus:bg-white outline-none rounded-xl py-3 px-4 text-xs text-slate-800 font-medium"
                >
                  <option value="Strip">pH Test Strips</option>
                  <option value="Digital">Digital pH Meter</option>
                  <option value="Litmus">Litmus Paper Indicators</option>
                </select>
              </div>

              {/* Calibration Checked */}
              <div className="flex items-start gap-2.5 pt-2">
                <input
                  type="checkbox"
                  id="calibrate-check"
                  checked={calibrated}
                  onChange={(e) => setCalibrated(e.target.checked)}
                  className="mt-0.5 rounded border-slate-350 bg-slate-50 text-green-600 focus:ring-green-500/30"
                />
                <label htmlFor="calibrate-check" className="text-xs text-slate-600 leading-normal select-none cursor-pointer">
                  <strong>Meter Calibrated / Strip Fresh:</strong> I calibrated my digital pH meter or verified test strips are within expiration.
                </label>
              </div>

              <button
                type="submit"
                disabled={submitting || !locationBucket.trim()}
                className="w-full bg-green-600 hover:bg-green-700 active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-xs transition-all duration-150 shadow-sm"
              >
                <span>Upload Measurement</span>
              </button>

            </form>
          </div>

          {/* Feedback states */}
          {submissionStatus.status && (
            <div className={`p-4 rounded-2xl border text-xs leading-relaxed ${
              submissionStatus.status === 'success'
                ? 'bg-green-50 border-green-200 text-green-800'
                : submissionStatus.status === 'warning'
                ? 'bg-yellow-50 border-yellow-250 text-yellow-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              <div className="flex items-center gap-2 font-bold mb-1.5 uppercase tracking-wider text-[10px]">
                {submissionStatus.status === 'success' && <CheckCircle2 className="w-4 h-4 shrink-0 text-green-600" />}
                {submissionStatus.status === 'warning' && <ShieldAlert className="w-4 h-4 shrink-0 text-yellow-600" />}
                <span>{submissionStatus.status} Alert</span>
              </div>
              <p className="m-0">{submissionStatus.message}</p>
            </div>
          )}
        </div>

        {/* Interactive SVG Mapping & Scale panel */}
        <div className="lg:col-span-2 space-y-6 flex flex-col justify-between">
          
          {/* Schematic Regional pH Dashboard Map */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col items-center justify-center relative min-h-[300px] shadow-sm">
            <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] opacity-25" />
            
            <div className="absolute top-4 left-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Interactive Database Map</h3>
            </div>

            {/* US coordinate schematic plotting averages */}
            <div className="w-full max-w-md aspect-[1.6/1] relative bg-slate-50/50 border border-slate-200 rounded-2xl p-4 flex items-center justify-center mt-6">
              
              {/* Draft US shape */}
              <svg viewBox="0 0 100 60" className="w-full h-full text-slate-305 opacity-70">
                <path d="M 5,20 Q 20,5 50,12 Q 80,5 95,20 L 90,45 Q 85,55 50,55 Q 15,55 5,45 Z" fill="none" stroke="currentColor" strokeWidth="1"/>
                <path d="M 50,12 L 50,55" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2"/>
              </svg>

              {/* Verified points markers */}
              {mapPoints.map((pt, index) => {
                // Approximate coordinate offset map based on zip code values
                let top = '40%';
                let left = '50%';
                if (pt.location_bucket === '10001' || pt.location_bucket.toLowerCase().includes('nyc') || pt.location_bucket.toLowerCase().includes('new york')) {
                  top = '25%'; left = '82%';
                } else if (pt.location_bucket === '90210' || pt.location_bucket.toLowerCase().includes('beverly') || pt.location_bucket.toLowerCase().includes('la') || pt.location_bucket.toLowerCase().includes('los')) {
                  top = '45%'; left = '15%';
                } else if (pt.location_bucket === '60611' || pt.location_bucket.toLowerCase().includes('chicago')) {
                  top = '30%'; left = '60%';
                } else if (pt.location_bucket === '30301' || pt.location_bucket.toLowerCase().includes('atlanta')) {
                  top = '48%'; left = '72%';
                } else if (pt.location_bucket === '75001' || pt.location_bucket.toLowerCase().includes('dallas') || pt.location_bucket.toLowerCase().includes('texas')) {
                  top = '52%'; left = '48%';
                } else {
                  // Pseudo-random coordinates for user submissions based on record ID
                  const hash = pt.record_id * 17;
                  top = `${30 + (hash % 25)}%`;
                  left = `${25 + ((hash * 7) % 55)}%`;
                }

                return (
                  <div
                    key={pt.record_id}
                    style={{ top, left }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-20"
                  >
                    <span className={`h-4 w-4 rounded-full border border-white flex items-center justify-center text-[8px] text-white font-bold ${pHColor(pt.numeric_value)} shadow-md`}>
                      {Math.round(pt.numeric_value)}
                    </span>
                    
                    {/* Hover Card */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block bg-slate-800 border border-slate-700 p-2.5 rounded-xl text-[10px] whitespace-nowrap shadow-md z-30">
                      <p className="font-bold text-white leading-none">Loc: {pt.location_bucket}</p>
                      <p className="text-purple-300 font-mono mt-1">pH level: {pt.numeric_value.toFixed(1)}</p>
                      <p className="text-[8px] text-slate-400 mt-0.5">Calibrated: {pt.device_calibration_flag ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                );
              })}

            </div>
          </div>

          {/* Reference pH scale context */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm">
            <h3 className="text-xs font-bold text-slate-450 uppercase tracking-widest block border-b border-slate-200 pb-2">
              pH Environmental Indicators
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {pHSuggestedScale.map((scale, i) => (
                <div key={i} className="bg-slate-50 border border-slate-200 p-3 rounded-2xl space-y-1.5 shadow-xs">
                  <div className="flex items-center gap-2">
                    <span className={`w-3.5 h-3.5 rounded-full ${scale.color}`} />
                    <span className="text-xs font-mono font-bold text-slate-805">pH {scale.ph}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block leading-tight">{scale.label}</span>
                </div>
              ))}
            </div>

            {/* Ethics notice */}
            <div className="bg-blue-50 border border-blue-200 p-4.5 rounded-2xl flex items-start gap-3 shadow-xs">
              <BookOpen className="w-5 h-5 text-blue-700 mt-0.5 shrink-0" />
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-blue-805 uppercase tracking-wider">Ethical Science Safeguard</h4>
                <p className="text-[11px] text-slate-655 leading-relaxed">
                  We bucket geographic coordinate indices to zip codes, stripping precise geolocation variables to maintain volunteer anonymity. Flagged outlier reports (pH less than 5.5 or greater than 9.0) enter moderation to prevent telemetry tampering.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
