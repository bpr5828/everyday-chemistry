import React, { useState, useEffect } from 'react';
import { ShieldCheck, Check, X, AlertTriangle, RefreshCw, Lock } from 'lucide-react';

interface PendingPoint {
  record_id: number;
  location_bucket: string;
  metric_type: string;
  numeric_value: number;
  device_calibration_flag: boolean;
  verification_status: string;
}

interface AdminDashboardProps {
  onVerificationUpdate: () => void;
  pendingCount: number;
}

export default function AdminDashboard({ onVerificationUpdate, pendingCount }: AdminDashboardProps) {
  const [pendingList, setPendingList] = useState<PendingPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionLogs, setActionLogs] = useState<string[]>([]);

  useEffect(() => {
    fetchPending();
  }, [pendingCount]);

  const fetchPending = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/metrics/pending');
      if (!response.ok) throw new Error('Failed to fetch pending metrics');
      const data = await response.json();
      setPendingList(data);
    } catch (err) {
      console.error(err);
      setError('Could not connect to the moderation database. Using mock pending submissions.');
      // Local mock pending data
      setPendingList([
        { record_id: 101, location_bucket: '10001', metric_type: 'pH', numeric_value: 3.2, device_calibration_flag: false, verification_status: 'pending' },
        { record_id: 102, location_bucket: '90210', metric_type: 'pH', numeric_value: 11.5, device_calibration_flag: true, verification_status: 'pending' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: number, action: 'approve' | 'reject') => {
    try {
      const response = await fetch('/api/metrics/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ record_id: id, action })
      });
      if (!response.ok) throw new Error('Verification request failed');
      
      // Update local logs
      const actedRecord = pendingList.find(p => p.record_id === id);
      const name = actedRecord ? `Record #${id} (pH ${actedRecord.numeric_value} at ${actedRecord.location_bucket})` : `Record #${id}`;
      setActionLogs(prev => [
        `[${new Date().toLocaleTimeString()}] ${action.toUpperCase()}: Approved entry ${name}`,
        ...prev
      ]);
      
      // Remove from list
      setPendingList(prev => prev.filter(p => p.record_id !== id));
      onVerificationUpdate();
    } catch (err) {
      console.error(err);
      // Local fallback action simulation
      const actedRecord = pendingList.find(p => p.record_id === id);
      const name = actedRecord ? `Record #${id} (pH ${actedRecord.numeric_value} at ${actedRecord.location_bucket})` : `Record #${id}`;
      setActionLogs(prev => [
        `[${new Date().toLocaleTimeString()}] MOCK ${action.toUpperCase()}: Processed local ${name}`,
        ...prev
      ]);
      setPendingList(prev => prev.filter(p => p.record_id !== id));
      onVerificationUpdate();
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="space-y-1">
        <h2 className="text-3xl font-black font-display text-slate-800 m-0">Admin Moderation Dashboard</h2>
        <p className="text-sm text-slate-500">
          Simulate the role of an administrative mentor, filtering anomalous, non-calibrated, or outlier submissions before database integration.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Verification Queue */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-green-700" />
              <h3 className="text-sm font-bold text-slate-750">Validation Queue</h3>
            </div>
            <span className="text-xs bg-yellow-50 border border-yellow-200 text-yellow-750 font-extrabold px-2.5 py-1 rounded-lg animate-pulse">
              {pendingList.length} Pending Actions
            </span>
          </div>

          {loading && pendingList.length === 0 ? (
            <div className="text-center py-10 text-xs text-slate-450 animate-pulse flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Querying validation list...</span>
            </div>
          ) : pendingList.length > 0 ? (
            <div className="space-y-3">
              {pendingList.map((item) => (
                <div 
                  key={item.record_id}
                  className="bg-slate-50 border border-slate-200 p-4.5 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:border-slate-350/60 hover:bg-slate-100/50 transition-all shadow-xs"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-450">Record #{item.record_id}</span>
                      <span className="text-xs font-mono font-bold bg-purple-50 text-purple-700 px-2 py-0.5 rounded border border-purple-100">
                        Loc: {item.location_bucket}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="text-slate-550">Measured pH:</span>
                        <span className={`font-black px-2 py-0.5 rounded-md ${
                          item.numeric_value < 5.5 || item.numeric_value > 8.5 
                            ? 'bg-red-50 text-red-700 border border-red-100' 
                            : 'bg-green-55 border border-green-200 text-green-950'
                        }`}>
                          {item.numeric_value.toFixed(1)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <span>Calibration:</span>
                        <span className={`font-bold uppercase tracking-wider ${
                          item.device_calibration_flag ? 'text-green-700' : 'text-yellow-750'
                        }`}>
                          {item.device_calibration_flag ? 'Calibrated' : 'Uncalibrated'}
                        </span>
                      </div>
                    </div>

                    {/* Alert trigger */}
                    {(item.numeric_value < 5.5 || item.numeric_value > 8.5) && (
                      <div className="flex items-center gap-1.5 text-[10px] text-red-700 font-bold uppercase tracking-wider">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Anomalous Value Outlier Flagged</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button
                      onClick={() => handleAction(item.record_id, 'reject')}
                      className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 p-3.5 rounded-xl cursor-pointer transition-all hover:scale-105 shadow-xs"
                      title="Reject submission"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleAction(item.record_id, 'approve')}
                      className="bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 p-3.5 rounded-xl cursor-pointer transition-all hover:scale-105 shadow-xs"
                      title="Approve submission"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-450">
              Zero pending items in validation queues.
            </div>
          )}
        </div>

        {/* Security / Action logs side */}
        <div className="space-y-6">
          {/* Ethics guidelines */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-4 shadow-sm">
            <h4 className="text-xs font-bold text-slate-450 uppercase tracking-widest block border-b border-slate-200 pb-2">
              Verification Protocols
            </h4>
            <div className="space-y-3">
              <div className="flex items-start gap-2.5">
                <Lock className="w-4 h-4 text-purple-700 mt-0.5 shrink-0" />
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-805 leading-none">Standard deviation filter</span>
                  <p className="text-[10px] text-slate-500 leading-normal">
                    Measurements deviating by more than 3 standard deviations from local means are flagged for double-checking.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Lock className="w-4 h-4 text-purple-700 mt-0.5 shrink-0" />
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-805 leading-none">Device calibration requirement</span>
                  <p className="text-[10px] text-slate-500 leading-normal">
                    Uncalibrated sensors or strips are marked for manual validation review before showing publicly on client screens.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Log terminal */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-4 flex flex-col shadow-sm">
            <h4 className="text-xs font-bold text-slate-450 uppercase tracking-widest block border-b border-slate-200 pb-2">
              Moderator Action Logs
            </h4>
            <div className="bg-slate-900 border border-slate-950 rounded-2xl p-4 min-h-[150px] max-h-[220px] overflow-y-auto font-mono text-[10px] text-slate-300 space-y-2 leading-relaxed shadow-inner">
              {actionLogs.length > 0 ? (
                actionLogs.map((log, idx) => (
                  <div key={idx} className="border-l-2 border-green-500 pl-2">
                    {log}
                  </div>
                ))
              ) : (
                <div className="text-center text-slate-500 py-10">
                  // No actions logged in this session
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
