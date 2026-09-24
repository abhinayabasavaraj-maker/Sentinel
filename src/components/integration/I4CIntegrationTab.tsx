import React, { useState } from 'react';
import { useCase } from '../../context/CaseContext';
import { 
  Cpu, 
  Send, 
  Building2, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  Server, 
  ArrowRight, 
  Clock, 
  Radio 
} from 'lucide-react';

export const I4CIntegrationTab: React.FC = () => {
  const { 
    activeComplaint, 
    topPriorityCandidate, 
    bankFreezeApproved, 
    setBankFreezeApproved,
    showToast 
  } = useCase();

  const [cfcfrmsStatus, setCfcfrmsStatus] = useState<'IDLE' | 'TRANSMITTING' | 'SYNCED'>('IDLE');
  const [transmissionLogs, setTransmissionLogs] = useState<string[]>([
    `[${new Date().toLocaleTimeString('en-IN')}] Initialized secure mTLS session with I4C CFCFRMS Gateway (Endpoint: https://cfcfrms.i4c.gov.in/v2/api)`,
    `[${new Date().toLocaleTimeString('en-IN')}] Loaded Bank Gateway profile for ${activeComplaint.extracted_entities.bank_name}`,
  ]);

  const handleSendCFCFRMS = () => {
    setCfcfrmsStatus('TRANSMITTING');
    showToast('Transmitting to National CFCFRMS', 'Connecting to 1930 / MHA National Cyber Fraud System...', 'info');

    setTimeout(() => {
      setCfcfrmsStatus('SYNCED');
      const time = new Date().toLocaleTimeString('en-IN');
      setTransmissionLogs(prev => [
        `[${time}] SUCCESS: Injunction payload delivered to CFCFRMS National Ledger. Freeze Reference: #FRZ-2026-${Math.floor(100000 + Math.random() * 900000)}`,
        `[${time}] SMS alert dispatched to registered nodal officer at ${activeComplaint.extracted_entities.bank_name}`,
        ...prev
      ]);
      showToast('CFCFRMS Injunction Active', `Beneficiary A/C ${activeComplaint.extracted_entities.beneficiary_account} freeze lock transmitted successfully!`, 'success');
    }, 1500);
  };

  const handleToggleBankFreeze = (approved: boolean) => {
    setBankFreezeApproved(approved);
    const time = new Date().toLocaleTimeString('en-IN');
    if (approved) {
      setTransmissionLogs(prev => [
        `[${time}] OFFICER OVERRIDE: Freeze recommendation APPROVED by Investigating Officer. Core Banking REST Injunction committed (HTTP 201 Created).`,
        ...prev
      ]);
      showToast('Core Banking Freeze Dispatched', `Injunction committed for ${activeComplaint.extracted_entities.bank_name}`, 'success');
    } else {
      setTransmissionLogs(prev => [
        `[${time}] OFFICER OVERRIDE: Freeze recommendation REVOKED / PENDING secondary review.`,
        ...prev
      ]);
      showToast('Freeze Action Suspended', 'Recommendation set to manual review state', 'warning');
    }
  };

  const cbsPayload = {
    action: "RESTRICT_DEBIT_AND_ATM_WITHDRAWAL",
    case_ref: activeComplaint.id,
    jurisdiction_authority: "Ministry of Home Affairs / I4C",
    mandate_statute: "Section 91 CrPC / IT Act 2000",
    account_details: {
      bank_name: activeComplaint.extracted_entities.bank_name,
      beneficiary_account_number: activeComplaint.extracted_entities.beneficiary_account,
      ifsc_code: activeComplaint.extracted_entities.ifsc,
      upi_vpa: activeComplaint.extracted_entities.upi_id,
    },
    threat_intel: {
      predicted_target_atm: topPriorityCandidate?.id || 'ATM_014',
      predicted_atm_name: topPriorityCandidate?.name || 'SBI E-Corner',
      estimated_withdrawal_window_mins: topPriorityCandidate?.predicted_cashout_mins || 14,
      model_confidence_score: topPriorityCandidate?.composite_score || 0.87,
    },
    requested_by_officer: "Investigator Cyber Crime Cell",
    signature_token: "HMAC-SHA256-I4C-99182"
  };

  return (
    <div className="flex-1 h-full flex flex-col bg-navy-950 p-4 space-y-3 overflow-y-auto select-none font-mono text-xs">
      {/* Header */}
      <div className="p-3 rounded-lg bg-navy-900 border border-amber-500/40 shadow-lg shadow-amber-950/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-amber-400" />
          <div>
            <div className="font-bold text-sm text-slate-100 uppercase tracking-wide">
              I4C & National CFCFRMS Outbound Interoperability Gateway
            </div>
            <div className="text-[11px] text-slate-400 font-normal">
              Simulated Outbound API Integration with National Fund-Freeze Ledger & Core Banking Systems
            </div>
          </div>
        </div>

        <span className="text-[10px] px-2.5 py-1 rounded bg-amber-950 text-amber-300 border border-amber-500/50 font-bold uppercase tracking-wider flex items-center gap-1.5">
          <Radio className="w-3.5 h-3.5 animate-pulse" />
          <span>mTLS REST CHANNEL READY</span>
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 flex-1">
        {/* Left: Core Banking System (CBS) Freeze Recommendation Panel */}
        <div className="p-3 rounded-lg bg-navy-900/90 border border-navy-750 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between pb-1.5 border-b border-navy-800">
              <div className="flex items-center gap-1.5 font-bold text-slate-200 uppercase text-[11px]">
                <Building2 className="w-4 h-4 text-cyan-400" />
                <span>Bank CBS "Freeze Recommendation" Payload</span>
              </div>
              <span className="text-[10px] text-cyan-400">{activeComplaint.extracted_entities.bank_name}</span>
            </div>

            <div className="mt-2 text-[10px] text-slate-400 mb-1">
              JSON Injunction Payload prepared for Core Banking System gateway:
            </div>

            <pre className="p-2.5 rounded bg-navy-950 border border-navy-800 text-cyan-300 text-[10px] overflow-x-auto max-h-64 leading-relaxed">
{JSON.stringify(cbsPayload, null, 2)}
            </pre>
          </div>

          {/* Human-In-The-Loop Approval Switch */}
          <div className="p-2.5 rounded bg-navy-950 border border-navy-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-200">
                Human-in-the-Loop Officer Authorization:
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                bankFreezeApproved ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' : 'bg-amber-950 text-amber-300 border border-amber-500/40'
              }`}>
                {bankFreezeApproved ? 'APPROVED & SEALED' : 'PENDING APPROVAL'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleToggleBankFreeze(true)}
                className={`flex-1 py-1.5 px-3 rounded font-bold text-xs uppercase flex items-center justify-center gap-1 transition-colors ${
                  bankFreezeApproved
                    ? 'bg-emerald-500 text-navy-950 border border-emerald-400 shadow-md'
                    : 'bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/40'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Approve Freeze Injunction</span>
              </button>

              <button
                onClick={() => handleToggleBankFreeze(false)}
                className={`flex-1 py-1.5 px-3 rounded font-bold text-xs uppercase flex items-center justify-center gap-1 transition-colors ${
                  !bankFreezeApproved
                    ? 'bg-rose-500 text-navy-950 border border-rose-400 shadow-md'
                    : 'bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-500/40'
                }`}
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Reject / Hold</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: CFCFRMS National Ledger Broadcast & Transmission Logs */}
        <div className="p-3 rounded-lg bg-navy-900/90 border border-navy-750 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between pb-1.5 border-b border-navy-800">
              <div className="flex items-center gap-1.5 font-bold text-slate-200 uppercase text-[11px]">
                <Server className="w-4 h-4 text-amber-400" />
                <span>National CFCFRMS 1930 Integration Hub</span>
              </div>
              <span className="text-[10px] text-amber-400 font-bold">API v2.4</span>
            </div>

            <div className="mt-2 text-[10px] text-slate-400 mb-2 leading-relaxed">
              Broadcast case record, suspect UPI endpoints, and predicted ATM cashout coordinate telemetry directly to the MHA National Cybercrime Bureau for instant multi-bank freeze coordination.
            </div>

            <button
              onClick={handleSendCFCFRMS}
              disabled={cfcfrmsStatus === 'TRANSMITTING'}
              className="w-full py-2 px-3 rounded bg-amber-500 hover:bg-amber-400 text-navy-950 font-bold text-xs uppercase tracking-wider transition-colors shadow-lg flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{cfcfrmsStatus === 'TRANSMITTING' ? 'Transmitting Injunction...' : 'Send (Simulated) To CFCFRMS'}</span>
            </button>
          </div>

          {/* Live Delivery Receipt & Transmission Terminal */}
          <div className="space-y-1.5">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Transmission Receipt & Audit Log</span>
              <span className="text-emerald-400 font-bold">HTTP 200 OK</span>
            </div>
            <div className="p-2.5 rounded bg-navy-950 border border-navy-800 text-[10px] text-slate-300 max-h-48 overflow-y-auto space-y-1 font-mono">
              {transmissionLogs.map((log, i) => (
                <div key={i} className="leading-relaxed text-slate-300">
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
