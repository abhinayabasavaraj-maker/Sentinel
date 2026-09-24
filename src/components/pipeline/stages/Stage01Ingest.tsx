import React from 'react';
import { useCase } from '../../../context/CaseContext';
import { formatINR } from '../../../utils/formatters';
import { Database, Terminal, FileCode, CheckCircle2, ArrowRight } from 'lucide-react';

export const Stage01Ingest: React.FC = () => {
  const { activeComplaint } = useCase();

  return (
    <div className="space-y-3 font-mono text-xs">
      <div className="flex items-center justify-between p-2 rounded bg-navy-900 border border-navy-750">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-cyan-400" />
          <span className="font-bold text-slate-100 uppercase">
            Stage 01: NCRP Complaint Stream Ingestion
          </span>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-bold">
          ● REDIS STREAM ACTIVE
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Raw Ingestion Payload */}
        <div className="p-3 rounded bg-navy-900/90 border border-navy-750">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Raw Inbound NCRP Citizen Complaint</span>
            <span className="text-cyan-400 font-bold">{activeComplaint.id}</span>
          </div>
          <div className="p-2 rounded bg-navy-950 border border-navy-800 text-slate-300 font-sans text-xs leading-relaxed italic border-l-2 border-l-cyan-400">
            "{activeComplaint.raw_text}"
          </div>
          <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-between">
            <span>Intake Channel: 1930 / cybercrime.gov.in</span>
            <span>Language: {activeComplaint.language.raw_lang}</span>
          </div>
        </div>

        {/* Structured Token Extraction Chips */}
        <div className="p-3 rounded bg-navy-900/90 border border-navy-750">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Parsed Key-Value Structured Metadata</span>
            <span className="text-emerald-400 font-bold">Tokenized</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="bg-navy-950 p-1.5 rounded border border-navy-800">
              <span className="text-slate-500 block text-[9px]">VICTIM</span>
              <span className="font-bold text-slate-200">{activeComplaint.victim_name}</span>
            </div>
            <div className="bg-navy-950 p-1.5 rounded border border-navy-800">
              <span className="text-slate-500 block text-[9px]">AMOUNT DEBITED</span>
              <span className="font-bold text-amber-300">{formatINR(activeComplaint.amount)}</span>
            </div>
            <div className="bg-navy-950 p-1.5 rounded border border-navy-800">
              <span className="text-slate-500 block text-[9px]">SUSPECT UPI ID</span>
              <span className="font-bold text-cyan-300 truncate block">
                {activeComplaint.extracted_entities.upi_id}
              </span>
            </div>
            <div className="bg-navy-950 p-1.5 rounded border border-navy-800">
              <span className="text-slate-500 block text-[9px]">BENEFICIARY IFSC</span>
              <span className="font-bold text-slate-200">{activeComplaint.extracted_entities.ifsc}</span>
            </div>
            <div className="bg-navy-950 p-1.5 rounded border border-navy-800 col-span-2">
              <span className="text-slate-500 block text-[9px]">ORIGIN DISTRICT / PS BOUND</span>
              <span className="font-bold text-slate-200">{activeComplaint.victim_location.name}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
