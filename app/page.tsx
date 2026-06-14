'use client'

import { AgentsPage } from '@/components/pages/agents-page'
import { BenchmarkingPage } from '@/components/pages/benchmarking-page'
import { DashboardPage } from '@/components/pages/dashboard-page'
import { FindingsPage } from '@/components/pages/findings-page'
import { InvestigationsPage } from '@/components/pages/investigations-page'
import { ReportPage } from '@/components/pages/report-page'
import { SettingsPage } from '@/components/pages/settings-page'
import { ToolsPage } from '@/components/pages/tools-page'
import { WorkflowPage } from '@/components/pages/workflow-page'
import { Sidebar } from '@/components/sidebar'
import { useState } from 'react'
import { InvestigationProvider, useInvestigation } from '@/contexts/InvestigationContext'

type Section =
  | 'dashboard'
  | 'investigations'
  | 'findings'
  | 'workflow'
  | 'tools'
  | 'benchmarking'
  | 'agents'
  | 'report'
  | 'settings'

function PageContent({ section }: { section: Section }) {
  switch (section) {
    case 'dashboard':
      return <DashboardPage />
    case 'investigations':
      return <InvestigationsPage />
    case 'findings':
      return <FindingsPage />
    case 'workflow':
      return <WorkflowPage />
    case 'tools':
      return <ToolsPage />
    case 'benchmarking':
      return <BenchmarkingPage />
    case 'agents':
      return <AgentsPage />
    case 'report':
      return <ReportPage />
    case 'settings':
      return <SettingsPage />
    default:
      return <DashboardPage />
  }
}

function AppContent() {
  const { loading, error } = useInvestigation()
  const [section, setSection] = useState<Section>('dashboard')
  const [collapsed, setCollapsed] = useState(false)

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#0a0f1a] text-foreground font-mono text-sm">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-primary tracking-wider animate-pulse">Loading investigation...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#0a0f1a] text-foreground font-mono text-sm px-4 text-center">
        <div className="max-w-md p-6 rounded-xl border border-red-500/30 bg-red-500/5 glow-border space-y-4 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
          <p className="text-red-400 font-semibold text-lg">Unable to connect to SentinelSIFT-X backend</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Please ensure the FastAPI server is running on <code className="text-red-300 font-bold">http://127.0.0.1:8000</code> and try refreshing the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 rounded-lg text-xs transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background network-bg">
      <Sidebar
        activeSection={section}
        onNavigate={(s) => setSection(s as Section)}
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
      />
      <main className="flex-1 overflow-y-auto p-5">
        <PageContent section={section} />
      </main>
    </div>
  )
}

export default function App() {
  return (
    <InvestigationProvider>
      <AppContent />
    </InvestigationProvider>
  )
}

