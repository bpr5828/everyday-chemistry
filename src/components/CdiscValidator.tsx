import React, { useState } from 'react';
import { Upload, CheckCircle2, AlertTriangle, XCircle, Activity, FileJson, RefreshCw, Server } from 'lucide-react';

interface ValidationResult {
  status: 'passed' | 'warnings' | 'failed';
  errors: string[];
  warnings: string[];
  conformance: number;
}

export default function CdiscValidator() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [result, setResult] = useState<ValidationResult | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const simulateValidation = () => {
    if (!file) return;
    setIsValidating(true);
    setResult(null);
    
    // Simulate API delay
    setTimeout(() => {
      setIsValidating(false);
      // Mock result based on random chance or file name
      const isGood = file.name.includes('clean') || Math.random() > 0.6;
      
      if (isGood) {
        setResult({
          status: 'warnings',
          errors: [],
          warnings: ['SD0082: Missing standard unit for VSRESU in domain VS', 'CG0145: Age is derived but --DTC is missing'],
          conformance: 94
        });
      } else {
        setResult({
          status: 'failed',
          errors: ['SD1022: Required variable USUBJID not found in domain DM', 'SD0063: Duplicate records found for key variables'],
          warnings: ['SD0082: Missing standard unit for VSRESU in domain VS'],
          conformance: 72
        });
      }
    }, 2000);
  };

  const loadSample = (type: 'clean' | 'dirty') => {
    // Create a mock file
    const mockFile = new File(['mock data'], `sample_sdtm_dm_${type}.csv`, { type: 'text/csv' });
    setFile(mockFile);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="space-y-2">
        <h2 className="text-3xl font-black font-display text-slate-800">CDISC SDTM Validator</h2>
        <p className="text-sm text-slate-500 max-w-2xl leading-relaxed">
          The FDA requires clinical trial data to be submitted in standard formats (CDISC SDTM). Use this tool to simulate the validation pipeline and learn how data quality is strictly evaluated.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Zone */}
        <div className="space-y-6">
          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center text-center transition-all bg-white ${
              isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-slate-400'
            }`}
          >
            <div className={`p-4 rounded-full mb-4 ${file ? 'bg-green-100 text-green-600' : 'bg-blue-50 text-blue-500'}`}>
              {file ? <FileJson className="w-8 h-8" /> : <Upload className="w-8 h-8" />}
            </div>
            
            {file ? (
              <div className="space-y-2">
                <p className="text-sm font-bold text-slate-700">{file.name}</p>
                <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
                <button 
                  onClick={() => { setFile(null); setResult(null); }}
                  className="text-xs text-red-500 hover:text-red-600 font-medium underline mt-2"
                >
                  Remove file
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm font-bold text-slate-700">Drag & drop your SDTM dataset here</p>
                <p className="text-xs text-slate-500">Supports .csv, .json, or .sas7bdat</p>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => loadSample('clean')}
              className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors border border-slate-200"
            >
              Load 'Clean' Sample
            </button>
            <button
              onClick={() => loadSample('dirty')}
              className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors border border-slate-200"
            >
              Load 'Dirty' Sample
            </button>
          </div>

          <button
            onClick={simulateValidation}
            disabled={!file || isValidating}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none text-white font-bold py-3.5 rounded-xl shadow-sm transition-all active:scale-[0.99] flex justify-center items-center gap-2"
          >
            {isValidating ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Processing Pipeline...
              </>
            ) : (
              <>
                <Server className="w-5 h-5" />
                Run Validation Rules Engine
              </>
            )}
          </button>
        </div>

        {/* Results Pane */}
        <div>
          {result ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6 h-full animate-fade-in-up">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-800">Validation Report</h3>
                <span className="text-xs font-mono text-slate-400">Pinnacle 21 Community Ruleset</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-center items-center">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Status</span>
                  {result.status === 'passed' && (
                    <div className="flex items-center gap-2 text-green-600"><CheckCircle2 className="w-6 h-6" /><span className="font-bold">Passed</span></div>
                  )}
                  {result.status === 'warnings' && (
                    <div className="flex items-center gap-2 text-yellow-600"><AlertTriangle className="w-6 h-6" /><span className="font-bold">Warnings</span></div>
                  )}
                  {result.status === 'failed' && (
                    <div className="flex items-center gap-2 text-red-600"><XCircle className="w-6 h-6" /><span className="font-bold">Rejected</span></div>
                  )}
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-center items-center">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Conformance</span>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-3xl font-black font-display ${result.conformance >= 90 ? 'text-green-600' : 'text-red-600'}`}>
                      {result.conformance}%
                    </span>
                  </div>
                </div>
              </div>

              {result.errors.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-red-700 uppercase tracking-wider flex items-center gap-2">
                    <XCircle className="w-4 h-4" /> FDA Reject Criteria ({result.errors.length})
                  </h4>
                  <ul className="space-y-2">
                    {result.errors.map((err, i) => (
                      <li key={i} className="text-sm text-slate-700 bg-red-50/50 p-3 rounded-lg border border-red-100 font-mono text-xs">
                        {err}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {result.warnings.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-yellow-700 uppercase tracking-wider flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> Data Quality Warnings ({result.warnings.length})
                  </h4>
                  <ul className="space-y-2">
                    {result.warnings.map((warn, i) => (
                      <li key={i} className="text-sm text-slate-700 bg-yellow-50/50 p-3 rounded-lg border border-yellow-100/50 font-mono text-xs">
                        {warn}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {result.status === 'warnings' && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800 leading-relaxed mt-4">
                  <strong>Learning Note:</strong> In real regulatory submissions, warnings must be documented in a Reviewer's Guide (cSDRG). They do not automatically result in rejection, unlike errors.
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 border-dashed rounded-3xl h-full min-h-[300px] flex items-center justify-center p-8 text-center">
              <div className="space-y-3">
                <Activity className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-sm font-medium text-slate-500">Pipeline Ready</p>
                <p className="text-xs text-slate-400">Upload a dataset to run validation checks against CDISC terminology and SDTMIG rules.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
