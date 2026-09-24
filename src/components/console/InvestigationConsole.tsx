import React from 'react';
import { RiskMapCanvas } from './RiskMapCanvas';
import { CandidateIntelligencePanel } from './CandidateIntelligencePanel';
import { MapStyle, ViewMode } from '../layout/SecondaryToolbar';

interface InvestigationConsoleProps {
  mapStyle: MapStyle;
  viewMode: ViewMode;
}

export const InvestigationConsole: React.FC<InvestigationConsoleProps> = ({ mapStyle, viewMode }) => {
  return (
    <main className="flex-1 flex w-full h-full overflow-hidden relative">
      {/* Zone 1: Visual GIS Risk Canvas */}
      <RiskMapCanvas mapStyle={mapStyle} viewMode={viewMode} />

      {/* Zone 2: Ranked Candidate Intelligence Panel */}
      <CandidateIntelligencePanel />
    </main>
  );
};
