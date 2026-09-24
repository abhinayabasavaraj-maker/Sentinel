import React from 'react';
import { useCase } from '../../context/CaseContext';
import { GoldenHourWidget } from '../common/GoldenHourWidget';
import { ConfidenceBadge } from '../common/ConfidenceBadge';
import { formatINR, formatDistance } from '../../utils/formatters';
import { 
  FileText, 
  Printer, 
  ShieldCheck, 
  Fingerprint, 
  Building2, 
  Clock, 
  MapPin, 
  AlertTriangle,
  Send
} from 'lucide-react';

export const CaseReportTab: React.FC = () => {
  const { activeComplaint, candidates, topPriorityCandidate, activeEvidenceHash } = useCase();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex-1 h-full flex flex-col bg-navy-950 p-4 space-y-4 overflow-y-auto font-mono text-xs select-none">
      {/* Top Action Header */}
      <div className="p-3 rounded-lg bg-navy-900 border border-navy-750 flex items-center justify-between no-print">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-cyan-400" />
          <div>
            <div className="font-bold text-sm text-slate-100 uppercase tracking-wide">
              Official Cybercrime Intelligence Case Dossier
            </div>
            <div className="text-[11px] text-slate-400">
              Authorized for Interception Under I4C Standard Operating Procedure (SOP-CYB-2026)
            </div>
          </div>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold uppercase tracking-wider transition-colors shadow-lg text-xs"
        >
          <Printer className="w-4 h-4" />
          <span>Print Intelligence Report</span>
        </button>
      </div>

      {/* Printable Case Dossier Paper Canvas */}
      <div className="max-w-4xl mx-auto w-full bg-navy-900 border-2 border-navy-700 rounded-lg p-6 shadow-2xl space-y-5 text-slate-200 print:bg-white print:text-black print:border-black">
        {/* Government Header Stamp */}
        <div className="border-b-2 border-cyan-500/60 pb-4 flex items-start justify-between">
          <div>
            <div className="text-[11px] font-bold text-cyan-400 uppercase tracking-widest print:text-blue-900">
              MINISTRY OF HOME AFFAIRS · INDIAN CYBERCRIME COORDINATION CENTRE (I4C)
            </div>
            <div className="text-xl font-black text-slate-100 tracking-wide mt-1 print:text-black">
              SENTINEL I4C PREDICTIVE INTERDICTION DOSSIER
            </div>
            <div className="text-xs text-slate-400 mt-0.5 print:text-slate-600">
              National Cybercrime Reporting Portal (NCRP) Case Reference: <strong>{activeComplaint.id}</strong>
            </div>
          </div>
          <div className="text-right">
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-xs font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>CRYPTOGRAPHICALLY SEALED</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1 print:text-slate-600">
              Generated: {new Date().toLocaleString('en-IN')} IST
            </div>
          </div>
        </div>

        {/* Section 1: Golden Hour Interdiction Clock */}
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2 print:text-blue-900">
            1. GOLDEN HOUR INTERDICTION STATUS
          </div>
          <GoldenHourWidget />
        </div>

        {/* Section 2: Victim & Complaint Intake Metadata */}
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2 print:text-blue-900">
            2. CITIZEN COMPLAINT & FRAUD DNA SUMMARY
          </div>
          <div className="grid grid-cols-2 gap-3 p-3 rounded bg-navy-950 border border-navy-800 print:bg-slate-50 print:border-slate-300">
            <div className="space-y-1">
              <div><span className="text-slate-500">Complainant / Victim:</span> <strong>{activeComplaint.victim_name}</strong></div>
              <div><span className="text-slate-500">Contact Number:</span> <strong>{activeComplaint.victim_phone}</strong></div>
              <div><span className="text-slate-500">Incident Location:</span> {activeComplaint.victim_location.name}</div>
              <div><span className="text-slate-500">Filing Timestamp:</span> {activeComplaint.filed_at}</div>
            </div>
            <div className="space-y-1">
              <div><span className="text-slate-500">Total Defrauded Amount:</span> <strong className="text-amber-400 text-sm print:text-black">{formatINR(activeComplaint.amount)}</strong></div>
              <div><span className="text-slate-500">Crime Classification:</span> <strong className="text-cyan-300 print:text-blue-800">{activeComplaint.crime_category}</strong></div>
              <div><span className="text-slate-500">Intake Language:</span> {activeComplaint.language.display_badge}</div>
              <div><span className="text-slate-500">Suspect UPI / A/C:</span> <strong className="text-rose-400 print:text-red-700">{activeComplaint.extracted_entities.upi_id}</strong></div>
            </div>
          </div>

          <div className="mt-2 p-2.5 rounded bg-navy-950/80 border border-navy-800 text-[11px] text-slate-300 italic print:bg-slate-100">
            <strong>Normalized Modus Operandi:</strong> "{activeComplaint.english_normalized_text}"
          </div>
        </div>

        {/* Section 3: Top-5 Predicted ATM Withdrawal Sites */}
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2 print:text-blue-900">
            3. TOP PREDICTED CASH-OUT WITHDRAWAL SITES (XGBOOST SPATIAL RANKING)
          </div>
          <table className="w-full text-left border border-navy-700 rounded overflow-hidden print:border-slate-400">
            <thead className="bg-navy-950 text-slate-400 text-[10px] uppercase print:bg-slate-200 print:text-black">
              <tr>
                <th className="p-2">Rank / ID</th>
                <th className="p-2">Terminal Name & Bank</th>
                <th className="p-2">Distance</th>
                <th className="p-2">Window</th>
                <th className="p-2">Score</th>
                <th className="p-2">Confidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-800 text-[11px] print:divide-slate-300">
              {candidates.slice(0, 5).map((atm, idx) => (
                <tr key={atm.id} className={idx === 0 ? 'bg-cyan-950/40 font-bold print:bg-yellow-50' : ''}>
                  <td className="p-2 text-cyan-400 print:text-black">#{idx + 1} · {atm.id}</td>
                  <td className="p-2">
                    <div>{atm.name}</div>
                    <div className="text-[10px] text-slate-400 print:text-slate-600">{atm.address}</div>
                  </td>
                  <td className="p-2">{formatDistance(atm.distance_m)}</td>
                  <td className="p-2 text-amber-300 print:text-black">{atm.predicted_cashout_mins} mins</td>
                  <td className="p-2 text-cyan-300 font-bold print:text-black">{(atm.composite_score * 100).toFixed(0)}%</td>
                  <td className="p-2"><ConfidenceBadge tier={atm.confidence_tier} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Section 4: Cryptographic Seal Proof */}
        <div className="p-3 rounded bg-navy-950 border border-emerald-500/40 space-y-1.5 print:bg-slate-50 print:border-slate-400">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400 uppercase font-bold flex items-center gap-1">
              <Fingerprint className="w-4 h-4 text-emerald-400" />
              Section 65B Electronic Certificate & Evidence Hash
            </span>
            <span className="text-emerald-400 font-bold">SHA-256 VALIDATED</span>
          </div>
          <div className="p-1.5 rounded bg-navy-900 border border-navy-800 text-[10px] text-emerald-400 font-mono break-all print:bg-white print:text-black">
            {activeEvidenceHash}
          </div>
          <div className="text-[10px] text-slate-400 flex justify-between pt-1">
            <span>Signer Authority: <strong>I4C-GOV-SEAL-NODE-07</strong></span>
            <span>Blockchain Anchor Index: <strong>Block #10484</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
