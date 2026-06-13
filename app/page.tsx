'use client'

import { AgentsPage } from '@/components/pages/agents-page'
import { BenchmarkingPage } from '@/components/pages/benchmarking-page'
import { DashboardPage } from '@/components/pages/dashboard-page'
import { FindingsPage } from '@/components/pages/findings-page'
import { InvestigationsPage } from '@/components/pages/investigations-page'
import { ReportPage } from '@/components/pages/report-page'
import { SettingsPage } from '@/components/pages/settings-page'
import { ToolsPage } from '@/components/pages/tools-page'
import { Sidebar } from '@/components/sidebar'
import { useState } from 'react'

type Section =
  | 'dashboard'
  | 'investigations'
  | 'findings'
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

export default function App() {
  const [section, setSection] = useState<Section>('dashboard')
  const [collapsed, setCollapsed] = useState(false)

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
