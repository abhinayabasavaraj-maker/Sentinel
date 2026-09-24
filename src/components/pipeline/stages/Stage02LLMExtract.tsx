import React from 'react';
import { useCase } from '../../../context/CaseContext';
import { Languages, Sparkles, Cpu, CheckCircle2, ArrowRight } from 'lucide-react';

export const Stage02LLMExtract: React.FC = () => {
  const { activeComplaint } = useCase();

  return (
    <div className="space-y-3 font-mono text-xs">
      <div className="flex items-center justify-between p-2 rounded bg-navy-900 border border-navy-750">
        <div className="flex items-center gap-2">
          <Languages className="w-4 h-4 text-purple-400" />
          <span className="font-bold text-slate-100 uppercase">
            Stage 02: Indic LLM Multilingual Normalization & "Fraud DNA" Extraction
          </span>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/40 font-bold flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          {activeComplaint.language.display_badge}
        </span>
      </div>

      {/* Multilingual Side-by-Side View */}
      <div className="grid grid-cols-2 gap-3">
        {/* Left: Original Indic / Regional Text */}
        <div className="p-3 rounded bg-navy-900/90 border border-navy-750 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-1.5 border-b border-navy-800 mb-2">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                Original Citizen Narrative ({activeComplaint.language.raw_lang})
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-navy-950 text-slate-400 border border-navy-800">
                UTF-8 Raw
              </span>
            </div>
            <div className="p-2.5 rounded bg-navy-950 border border-navy-800 font-sans text-xs text-slate-200 leading-relaxed italic border-l-2 border-l-purple-400">
              "{activeComplaint.raw_text}"
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-navy-800 text-[10px] text-slate-400 flex items-center gap-1">
            <Cpu className="w-3 h-3 text-purple-400" />
            <span>IndicTrans-2 + Bhashini Tokenizer (Zero shot dialect parsing)</span>
          </div>
        </div>

        {/* Right: Normalized English Extraction */}
        <div className="p-3 rounded bg-navy-900/90 border border-navy-750 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-1.5 border-b border-navy-800 mb-2">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                Standardized English Semantic Normalization
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-bold">
                Normalized
              </span>
            </div>
            <div className="p-2.5 rounded bg-navy-950 border border-navy-800 font-sans text-xs text-cyan-200 leading-relaxed border-l-2 border-l-cyan-400">
              "{activeComplaint.english_normalized_text}"
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-navy-800 text-[10px] text-slate-400 flex items-center justify-between">
            <span>Modus Operandi Vector:</span>
            <span className="text-purple-300 font-bold">{activeComplaint.crime_category}</span>
          </div>
        </div>
      </div>

      {/* Structured Fraud DNA JSON Output */}
      <div className="p-3 rounded bg-navy-900 border border-navy-750">
        <div className="flex items-center justify-between pb-1.5 border-b border-navy-800 mb-2">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            Structured Fraud DNA Entity Graph (JSON-LD)
          </span>
          <span className="text-[9px] text-slate-500">Schema: i4c.gov.in/v2/fraud-dna</span>
        </div>
        <pre className="p-2.5 rounded bg-navy-950 border border-navy-800 text-emerald-400 text-[11px] overflow-x-auto leading-relaxed">
{JSON.stringify({
  case_id: activeComplaint.id,
  detected_language: activeComplaint.language.raw_lang,
  language_confidence_score: activeComplaint.language.confidence,
  fraud_category: activeComplaint.crime_category,
  named_entities: {
    victim: activeComplaint.victim_name,
    amount_inr: activeComplaint.amount,
    mule_upi: activeComplaint.extracted_entities.upi_id,
    beneficiary_account: activeComplaint.extracted_entities.beneficiary_account,
    ifsc: activeComplaint.extracted_entities.ifsc,
    apk_hash: activeComplaint.extracted_entities.apk_or_link || 'N/A'
  },
  modus_operandi_dna: activeComplaint.modus_operandi
}, null, 2)}
        </pre>
      </div>
    </div>
  );
};
