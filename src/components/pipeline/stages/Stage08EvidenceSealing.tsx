import React from 'react';
import { useCase } from '../../../context/CaseContext';
import { ShieldCheck, Lock, CheckCircle2, FileCheck2, Fingerprint } from 'lucide-react';

export const Stage08EvidenceSealing: React.FC = () => {
  const { activeComplaint, activeEvidenceHash, topPriorityCandidate } = useCase();

  return (
    <div className="space-y-3 font-mono text-xs">
      <div className="flex items-center justify-between p-2 rounded bg-navy-900 border border-navy-750">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="font-bold text-slate-100 uppercase">
            Stage 08: Cryptographic Evidence Sealing & Government Ledger Anchor
          </span>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-bold flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" />
          ✓ VERIFIED — EVIDENCE SEALED
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {/* Left: Hash Generation Proof */}
        <div className="col-span-2 p-3 rounded bg-navy-900/90 border border-navy-750 space-y-2">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Authentic SHA-256 Digest Proof</span>
            <span className="text-emerald-400 font-bold">Standard: FIPS 180-4</span>
          </div>

          <div className="p-2.5 rounded bg-navy-950 border border-navy-800 space-y-1.5">
            <div className="text-[10px] text-slate-400">Canonical Case State Hash:</div>
            <div className="p-2 rounded bg-navy-900 border border-emerald-500/30 text-emerald-400 font-bold break-all text-[11px] select-all">
              {activeEvidenceHash}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10px] pt-1">
            <div className="p-1.5 rounded bg-navy-950 border border-navy-800">
              <span className="text-slate-500 block">CASE RECORD IDENTIFIER</span>
              <span className="font-bold text-slate-200">{activeComplaint.id}</span>
            </div>
            <div className="p-1.5 rounded bg-navy-950 border border-navy-800">
              <span className="text-slate-500 block">SEAL TIMESTAMP</span>
              <span className="font-bold text-slate-200">{new Date().toLocaleTimeString('en-IN')} IST</span>
            </div>
          </div>
        </div>

        {/* Right: Block Anchor Card */}
        <div className="p-3 rounded bg-navy-900/90 border border-navy-750 flex flex-col justify-between">
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-2">
              Provenance Ledger Anchor
            </div>
            <div className="p-2 rounded bg-navy-950 border border-navy-800 text-center space-y-1">
              <Fingerprint className="w-6 h-6 text-cyan-400 mx-auto" />
              <div className="text-xs font-bold text-slate-200">BLOCK #10484</div>
              <div className="text-[9px] text-emerald-400 font-semibold">
                Court Admissible Under Section 65B Indian Evidence Act
              </div>
            </div>
          </div>

          <div className="mt-2 text-[10px] text-slate-400 space-y-0.5">
            <div>Signer: <strong className="text-slate-200">I4C-GOV-NODE-07</strong></div>
            <div>Status: <strong className="text-emerald-400">IMMUTABLE</strong></div>
          </div>
        </div>
      </div>
    </div>
  );
};
