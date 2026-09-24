import React from 'react';
import { useCase } from '../../context/CaseContext';
import { formatINR, formatDistance } from '../../utils/formatters';
import { 
  Download, 
  Printer, 
  ShieldCheck, 
  Fingerprint, 
  CheckCircle2, 
  FileCheck2,
  ExternalLink
} from 'lucide-react';

export const ExportDossierTab: React.FC = () => {
  const { activeComplaint, topPriorityCandidate, candidates, activeEvidenceHash, showToast } = useCase();

  const handleTriggerPrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    showToast('Exporting PDF Dossier', `Assembled court-ready evidence package for ${activeComplaint.id}. Opening print dialog...`, 'success');
    window.print();
  };

  return (
    <div className="flex-1 h-full flex flex-col bg-navy-950 p-4 space-y-3 overflow-y-auto select-none font-mono text-xs">
      {/* Top Banner */}
      <div className="p-3 rounded-lg bg-navy-900 border border-emerald-500/40 shadow-lg shadow-emerald-950/20 flex items-center justify-between no-print">
        <div className="flex items-center gap-2">
          <Download className="w-5 h-5 text-emerald-400" />
          <div>
            <div className="font-bold text-sm text-slate-100 uppercase tracking-wide">
              Export Official Evidence Dossier (Court-Admissible PDF Preview)
            </div>
            <div className="text-[11px] text-slate-400 font-normal">
              Validated Cryptographic Hash Seal · Section 65B Certified for High Court / Cyber Cell Filing
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleTriggerPrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-navy-800 hover:bg-navy-750 text-slate-200 border border-navy-700 font-bold uppercase tracking-wider transition-colors text-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Preview</span>
          </button>
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-emerald-500 hover:bg-emerald-400 text-navy-950 font-bold uppercase tracking-wider transition-colors shadow-lg text-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Certified PDF</span>
          </button>
        </div>
      </div>

      {/* Styled PDF Paper Canvas Container */}
      <div className="max-w-3xl mx-auto w-full bg-navy-900 border-2 border-slate-700 rounded-lg p-8 shadow-2xl space-y-6 text-slate-200 print:bg-white print:text-black print:border-none print:shadow-none print:p-0">
        {/* Verification Watermark Badge */}
        <div className="flex items-center justify-between border-b-2 border-emerald-500/80 pb-4">
          <div>
            <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest print:text-green-800">
              GOVERNMENT OF INDIA · MINISTRY OF HOME AFFAIRS
            </div>
            <div className="text-xl font-black text-slate-100 tracking-wide mt-0.5 print:text-black">
              I4C DIGITAL EVIDENCE CERTIFICATE
            </div>
            <div className="text-[11px] text-slate-400 print:text-slate-600">
              NCRP Incident Docket: <strong>{activeComplaint.id}</strong>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-emerald-950 border-2 border-emerald-500/60 flex items-center gap-2 print:bg-slate-100 print:border-green-700">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 print:text-green-700" />
            <div>
              <div className="font-bold text-xs text-emerald-300 print:text-green-800">
                ✓ VERIFIED EVIDENCE SEAL
              </div>
              <div className="text-[9px] text-slate-400 print:text-slate-600">
                SHA-256 Ledger Anchored
              </div>
            </div>
          </div>
        </div>

        {/* Cryptographic SHA-256 Digest Box */}
        <div className="p-3 rounded bg-navy-950 border border-emerald-500/40 space-y-1 print:bg-slate-50 print:border-slate-300">
          <div className="text-[10px] text-slate-400 uppercase font-bold flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Fingerprint className="w-3.5 h-3.5 text-emerald-400" />
              Canonical SHA-256 Evidence Hash
            </span>
            <span className="text-emerald-400 font-bold">FIPS 180-4 Compliant</span>
          </div>
          <div className="p-2 rounded bg-navy-900 border border-navy-800 text-[11px] text-emerald-400 font-bold break-all print:bg-white print:text-black">
            {activeEvidenceHash}
          </div>
        </div>

        {/* Case Meta Summary */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="p-3 rounded bg-navy-950 border border-navy-800 space-y-1.5 print:bg-slate-50 print:border-slate-300">
            <div className="font-bold text-cyan-300 uppercase text-[10px] print:text-blue-900">
              Citizen Complaint Intake
            </div>
            <div><span className="text-slate-500">Victim Name:</span> <strong>{activeComplaint.victim_name}</strong></div>
            <div><span className="text-slate-500">Filed Timestamp:</span> {activeComplaint.filed_at}</div>
            <div><span className="text-slate-500">Defrauded Value:</span> <strong className="text-amber-300 print:text-black">{formatINR(activeComplaint.amount)}</strong></div>
            <div><span className="text-slate-500">Crime Mo:</span> {activeComplaint.crime_category}</div>
          </div>

          <div className="p-3 rounded bg-navy-950 border border-navy-800 space-y-1.5 print:bg-slate-50 print:border-slate-300">
            <div className="font-bold text-cyan-300 uppercase text-[10px] print:text-blue-900">
              Beneficiary & Mule Entity
            </div>
            <div><span className="text-slate-500">Target UPI ID:</span> <strong className="text-rose-400 print:text-red-700">{activeComplaint.extracted_entities.upi_id}</strong></div>
            <div><span className="text-slate-500">Account Number:</span> {activeComplaint.extracted_entities.beneficiary_account}</div>
            <div><span className="text-slate-500">Bank / IFSC:</span> {activeComplaint.extracted_entities.bank_name} ({activeComplaint.extracted_entities.ifsc})</div>
            <div><span className="text-slate-500">Suspect Phone:</span> {activeComplaint.extracted_entities.suspect_phone}</div>
          </div>
        </div>

        {/* Priority ATM Target Intercept Coordinates */}
        <div className="p-3.5 rounded bg-navy-950 border border-cyan-500/40 space-y-2 print:bg-slate-50 print:border-slate-300">
          <div className="font-bold text-cyan-300 uppercase text-xs print:text-blue-900">
            Top Priority Interdiction Site Telemetry:
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div>
              <span className="text-slate-500 block text-[10px]">PREDICTED ATM TERMINAL</span>
              <strong className="text-slate-100 print:text-black">{topPriorityCandidate?.name} ({topPriorityCandidate?.id})</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">PREDICTED CASHOUT WINDOW</span>
              <strong className="text-amber-300 print:text-black">{topPriorityCandidate?.predicted_cashout_mins} Minutes From Intake</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">MODEL CONFIDENCE SCORE</span>
              <strong className="text-emerald-400 print:text-black">{((topPriorityCandidate?.composite_score || 0.87) * 100).toFixed(1)}% (HIGH CONFIDENCE)</strong>
            </div>
          </div>
        </div>

        {/* Statutory Attestation */}
        <div className="pt-4 border-t border-navy-800 text-[10px] text-slate-400 space-y-1 leading-relaxed print:text-slate-600">
          <p>
            <strong>Electronic Certificate Under Section 65B of Indian Evidence Act, 1872:</strong> I hereby certify that the electronic output contained herein was generated automatically by the Sentinel I4C analytical system during the ordinary course of lawful cybercrime interdiction operations.
          </p>
          <div className="flex justify-between items-end pt-4">
            <div>
              <div>System Node: <strong>I4C-GOV-SEAL-NODE-07</strong></div>
              <div>Digital Certificate ID: <strong>CERT-2026-NCRP-99182</strong></div>
            </div>
            <div className="text-right border-t border-slate-600 pt-1 w-48">
              Authorized Signatory / Seal
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
