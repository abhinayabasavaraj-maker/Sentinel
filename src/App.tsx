import React, { useState } from 'react';
import { CaseProvider, useCase } from './context/CaseContext';
import { TopBar } from './components/layout/TopBar';
import { SecondaryToolbar, MapStyle, ViewMode } from './components/layout/SecondaryToolbar';
import { BottomPipelineStrip } from './components/layout/BottomPipelineStrip';
import { InvestigationConsole } from './components/console/InvestigationConsole';
import { PipelineVisualizer } from './components/pipeline/PipelineVisualizer';
import { CriminalGraphTab } from './components/graph/CriminalGraphTab';
import { ModelExplainabilityTab } from './components/explainability/ModelExplainabilityTab';
import { CaseReportTab } from './components/report/CaseReportTab';
import { I4CIntegrationTab } from './components/integration/I4CIntegrationTab';
import { ExportDossierTab } from './components/export/ExportDossierTab';
import { ProvenanceTab } from './components/provenance/ProvenanceTab';
import { ToastContainer } from './components/common/Toast';

const AppContent: React.FC = () => {
  const { activeTab } = useCase();
  const [mapStyle, setMapStyle] = useState<MapStyle>('dark');
  const [viewMode, setViewMode] = useState<ViewMode>('overview');

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'investigation':
        return <InvestigationConsole mapStyle={mapStyle} viewMode={viewMode} />;
      case 'pipeline':
        return <PipelineVisualizer />;
      case 'graph':
        return <CriminalGraphTab />;
      case 'model':
        return <ModelExplainabilityTab />;
      case 'report':
        return <CaseReportTab />;
      case 'integration':
        return <I4CIntegrationTab />;
      case 'export':
        return <ExportDossierTab />;
      case 'provenance':
        return <ProvenanceTab />;
      default:
        return <InvestigationConsole mapStyle={mapStyle} viewMode={viewMode} />;
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-navy-950 text-slate-200">
      {/* 1. Persistent Top Bar */}
      <TopBar />

      {/* 2. Secondary Toolbar (visible across console/map operations) */}
      <SecondaryToolbar
        mapStyle={mapStyle}
        setMapStyle={setMapStyle}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {/* 3. Main Workspace Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {renderActiveTabContent()}
      </div>

      {/* 4. Full-Width Persistent Bottom Pipeline Stepper & Playback Strip */}
      <BottomPipelineStrip />

      {/* Toast Notification Container */}
      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <CaseProvider>
      <AppContent />
    </CaseProvider>
  );
}

export default App;
