import React from 'react';
import { useCase } from '../../../context/CaseContext';
import { Send, CheckCircle2, ShieldCheck, Building2, Radio, Smartphone, Server } from 'lucide-react';

export const Stage07AlertDispatch: React.FC = () => {
  const { activeComplaint, topPriorityCandidate } = useCase();

  const dispatches = [
    {
      channel: 'SMS Gateway (Gov-NIC)',
      icon: <Smartphone className="w-4 h-4 text-cyan-400" />,
      recipient: `${topPriorityCandidate?.jurisdiction.nearest_ps || 'Local Cyber Cell'} (SHO / Duty Officer)`,
      status: 'DELIVERED (HTTP 200 OK)',
      time: '14:14:02 IST',
      payload: `URGENT INTERCEPT: Head to ${topPriorityCandidate?.id} (${topPriorityCandidate?.bank}) - Cashout expected in ${topPriorityCandidate?.predicted_cashout_mins}m. Case: ${activeComplaint.id}`,
    },
    {
      channel: 'Core Banking Freeze API',
      icon: <Building2 className="w-4 h-4 text-amber-400" />,
      recipient: `${activeComplaint.extracted_entities.bank_name} CBS Gateway`,
      status: 'TRANSMITTED (Awaiting 1-Click Seal)',
      time: '14:14:03 IST',
      payload: `POST /v2/injunction/freeze - Beneficiary A/C: ${activeComplaint.extracted_entities.beneficiary_account} (IFSC: ${activeComplaint.extracted_entities.ifsc})`,
    },
    {
      channel: 'I4C National Ledger',
      icon: <Server className="w-4 h-4 text-emerald-400" />,
      recipient: 'MHA National Cyber Crime Reporting Portal (NCRP Central)',
      status: 'SYNCHRONIZED (ACK 99182)',
      time: '14:14:03 IST',
      payload: `Case ${activeComplaint.id} state updated to: 'INTERDICTION_IN_PROGRESS'.`,
    },
    {
      channel: 'Field Patrol Stream',
      icon: <Radio className="w-4 h-4 text-purple-400" />,
      recipient: 'Telangana / Delhi Mobile Patrol Vehicle #04',
      status: 'ACKNOWLEDGED (ETA 6 mins)',
      time: '14:14:05 IST',
      payload: `GPS Vector pushed: (${topPriorityCandidate?.lat.toFixed(4)}, ${topPriorityCandidate?.lng.toFixed(4)})`,
    },
  ];

  return (
    <div className="space-y-3 font-mono text-xs">
      <div className="flex items-center justify-between p-2 rounded bg-navy-900 border border-navy-750">
        <div className="flex items-center gap-2">
          <Send className="w-4 h-4 text-cyan-400" />
          <span className="font-bold text-slate-100 uppercase">
            Stage 07: Automated Multi-Channel Outbound Alert Dispatch
          </span>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-bold">
          4 / 4 TRANSMISSIONS ACTIVE
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {dispatches.map((item, idx) => (
          <div key={idx} className="p-3 rounded bg-navy-900/90 border border-navy-750 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-1.5 border-b border-navy-800 mb-2">
                <div className="flex items-center gap-1.5">
                  {item.icon}
                  <span className="font-bold text-slate-200 text-[11px]">{item.channel}</span>
                </div>
                <span className="text-[9px] text-slate-400">{item.time}</span>
              </div>
              <div className="text-[11px] text-slate-300 font-semibold mb-1">
                To: {item.recipient}
              </div>
              <div className="p-2 rounded bg-navy-950 border border-navy-800 text-[10px] text-cyan-200/90 break-all font-mono leading-relaxed">
                {item.payload}
              </div>
            </div>
            <div className="mt-2 pt-1.5 border-t border-navy-800 text-[9px] text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>{item.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
