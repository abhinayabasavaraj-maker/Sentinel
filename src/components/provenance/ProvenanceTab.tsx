import React from 'react';
import { useCase } from '../../context/CaseContext';
import { truncateHash } from '../../utils/crypto';
import { Layers, ShieldCheck, Link, Fingerprint, Lock, ArrowDown, ExternalLink } from 'lucide-react';

export const ProvenanceTab: React.FC = () => {
  const { evidenceBlocks, activeEvidenceHash, activeComplaint } = useCase();

  return (
    <div className="flex-1 h-full flex flex-col bg-navy-950 p-4 space-y-3 overflow-y-auto select-none font-mono text-xs">
      {/* Header */}
      <div className="p-3 rounded-lg bg-navy-900 border border-navy-750 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-cyan-400" />
          <div>
            <div className="font-bold text-sm text-slate-100 uppercase tracking-wide">
              Cryptographic Provenance & Evidence Hash-Chain Explorer
            </div>
            <div className="text-[11px] text-slate-400 font-normal">
              Immutable Case Ledger (Hyperledger Fabric / Gov-Seal Node Architecture Simulation)
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-navy-950 px-3 py-1 rounded border border-navy-750">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-[10px] text-slate-400 uppercase">Ledger Blocks:</span>
          <span className="font-bold text-cyan-300 text-xs">{evidenceBlocks.length} Blocks Anchored</span>
        </div>
      </div>

      {/* Block Chain Visualizer List */}
      <div className="max-w-4xl mx-auto w-full space-y-3 flex-1">
        {evidenceBlocks.map((block, idx) => {
          const isLatest = idx === evidenceBlocks.length - 1;

          return (
            <React.Fragment key={block.block_index}>
              <div
                className={`p-4 rounded-lg border transition-all ${
                  isLatest
                    ? 'bg-navy-900/95 border-2 border-emerald-500/70 shadow-xl glow-cyan'
                    : 'bg-navy-900/80 border-navy-750'
                }`}
              >
                {/* Block Header */}
                <div className="flex items-center justify-between pb-2 border-b border-navy-800">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded bg-navy-950 text-cyan-400 border border-navy-750 font-bold text-xs">
                      BLOCK #{block.block_index}
                    </span>
                    <span className="font-bold text-slate-200">
                      {block.case_id}
                    </span>
                    {isLatest && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-bold animate-pulse">
                        LATEST SEALED HEAD
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span>{block.timestamp}</span>
                    <span>·</span>
                    <span className="text-emerald-400 font-semibold">{block.status}</span>
                  </div>
                </div>

                {/* Hashes Grid */}
                <div className="grid grid-cols-2 gap-3 mt-3 text-[11px]">
                  {/* Current Block Hash */}
                  <div className="p-2 rounded bg-navy-950 border border-navy-800 space-y-1">
                    <div className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
                      <Fingerprint className="w-3.5 h-3.5 text-cyan-400" />
                      Current Case SHA-256 Digest:
                    </div>
                    <div className="font-bold text-cyan-300 break-all text-[10px] select-all">
                      {block.sha256_hash}
                    </div>
                  </div>

                  {/* Previous Block Hash */}
                  <div className="p-2 rounded bg-navy-950 border border-navy-800 space-y-1">
                    <div className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
                      <Link className="w-3.5 h-3.5 text-slate-500" />
                      Previous Hash Link (Parent):
                    </div>
                    <div className="font-bold text-slate-400 break-all text-[10px] select-all">
                      {block.prior_hash}
                    </div>
                  </div>
                </div>

                {/* Block Summary & Signer */}
                <div className="mt-2.5 pt-2 border-t border-navy-800 flex items-center justify-between text-[10px] text-slate-400">
                  <div>
                    Summary: <span className="text-slate-200">{block.summary}</span>
                  </div>
                  <div>
                    Signer Node: <strong className="text-cyan-400">{block.signer}</strong>
                  </div>
                </div>
              </div>

              {/* Connecting Chain Arrow */}
              {idx < evidenceBlocks.length - 1 && (
                <div className="flex justify-center text-slate-600 my-1">
                  <ArrowDown className="w-4 h-4 text-cyan-400/60 animate-bounce" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
