'use client'

import { cn } from '@/lib/utils'
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Database,
  FileCode,
  FileText,
  HardDrive,
  MemoryStick,
  Upload,
} from 'lucide-react'
import { useState } from 'react'

const artifacts = [
  {
    name: 'Security.evtx',
    type: 'Windows Event Log',
    size: '124 MB',
    status: 'analyzed',
    timestamp: '2024-06-13 09:14:22',
    icon: FileText,
  },
  {
    name: 'Amcache.hve',
    type: 'Registry Hive',
    size: '8.4 MB',
    status: 'analyzed',
    timestamp: '2024-06-13 09:15:01',
    icon: Database,
  },
  {
    name: 'SYSTEM Registry Hive',
    type: 'Registry Hive',
    size: '16.2 MB',
    status: 'analyzed',
    timestamp: '2024-06-13 09:15:44',
    icon: Database,
  },
  {
    name: 'Prefetch Files',
    type: 'Prefetch Archive',
    size: '4.1 MB',
    status: 'analyzed',
    timestamp: '2024-06-13 09:16:08',
    icon: HardDrive,
  },
  {
    name: 'Memory Dump',
    type: 'Raw Memory Image',
    size: '8.00 GB',
    status: 'processing',
    timestamp: '2024-06-13 09:16:55',
    icon: MemoryStick,
  },
  {
    name: 'MFT.raw',
    type: 'Master File Table',
    size: '2.3 MB',
    status: 'pending',
    timestamp: '2024-06-13 09:17:11',
    icon: FileCode,
  },
]

const timelineAgents = [
  { name: 'Memory Agent', status: 'complete', time: '09:18:04', findings: 28, desc: 'Heap & process analysis complete' },
  { name: 'Disk Agent', status: 'complete', time: '09:19:32', findings: 41, desc: 'MFT & file system artifacts parsed' },
  { name: 'Log Agent', status: 'complete', time: '09:21:11', findings: 67, desc: 'Event logs correlated and indexed' },
  { name: 'Protocol SIFT Agent', status: 'complete', time: '09:22:45', findings: 15, desc: 'SIFT methodology plan generated' },
  { name: 'Windows Artifact Agent', status: 'complete', time: '09:24:03', findings: 52, desc: 'Registry, Prefetch, Amcache parsed' },
  { name: 'Correlation Agent', status: 'current', time: '09:25:38', findings: 34, desc: 'Cross-artifact correlation in progress' },
  { name: 'Challenge Agent', status: 'pending', time: '—', findings: 0, desc: 'Awaiting correlation output' },
  { name: 'Contradiction Agent', status: 'pending', time: '—', findings: 0, desc: 'Awaiting challenge results' },
  { name: 'Verifier Agent', status: 'pending', time: '—', findings: 0, desc: 'Pending evidence verification' },
  { name: 'Tool Selection Agent', status: 'pending', time: '—', findings: 0, desc: 'Tool recommendations pending' },
  { name: 'Tool Execution Agent', status: 'pending', time: '—', findings: 0, desc: 'Execution queue empty' },
  { name: 'Report Agent', status: 'pending', time: '—', findings: 0, desc: 'Final report not started' },
]

const statusConfig = {
  complete: { color: 'bg-green-500', text: 'text-green-400', border: 'border-green-500/30', label: 'COMPLETE' },
  current: { color: 'bg-primary animate-pulse', text: 'text-primary', border: 'border-primary/40', label: 'RUNNING' },
  pending: { color: 'bg-muted-foreground/40', text: 'text-muted-foreground', border: 'border-border', label: 'PENDING' },
}

const artifactStatusConfig = {
  analyzed: 'text-green-400 bg-green-400/10 border-green-400/25',
  processing: 'text-primary bg-primary/10 border-primary/25',
  pending: 'text-muted-foreground bg-muted/20 border-border',
}

export function InvestigationsPage() {
  const [expandedAgent, setExpandedAgent] = useState<number | null>(5)

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Investigations</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Case ID: <span className="font-mono text-primary">SSX-2024-0847</span> · Active Investigation
        </p>
      </div>

      <div className="grid grid-cols-5 gap-4 h-[calc(100vh-220px)]">
        {/* Uploaded Artifacts Panel */}
        <div className="col-span-2 glass rounded-xl border border-panel-border flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Upload className="w-4 h-4 text-primary" />
              Uploaded Artifacts
            </h2>
            <span className="text-xs font-mono text-muted-foreground">{artifacts.length} files</span>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-border">
            {artifacts.map((artifact) => (
              <div key={artifact.name} className="px-3 py-2.5 hover:bg-accent/20 transition-colors">
                <div className="flex items-start gap-2.5">
                  <div className="p-1.5 rounded bg-primary/10 border border-primary/20 mt-0.5">
                    <artifact.icon className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-semibold text-foreground truncate">{artifact.name}</p>
                      <span
                        className={cn(
                          'text-[9px] font-mono px-1 py-0.5 rounded border uppercase tracking-wider shrink-0',
                          artifactStatusConfig[artifact.status as keyof typeof artifactStatusConfig]
                        )}
                      >
                        {artifact.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{artifact.type}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-mono text-primary">{artifact.size}</span>
                      <span className="text-[10px] text-muted-foreground font-mono">{artifact.timestamp}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Upload dropzone */}
          <div className="px-3 py-2 border-t border-border">
            <button className="w-full py-2 rounded-lg border border-dashed border-primary/30 text-xs text-primary/70 hover:border-primary/60 hover:text-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-2">
              <Upload className="w-3.5 h-3.5" />
              Drop artifacts here or click to upload
            </button>
          </div>
        </div>

        {/* Investigation Timeline */}
        <div className="col-span-3 glass rounded-xl border border-panel-border flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              Investigation Timeline
            </h2>
            <div className="flex items-center gap-3 text-[10px] font-mono">
              <span className="flex items-center gap-1 text-green-400"><span className="w-1.5 h-1.5 rounded-full bg-green-400" />COMPLETE</span>
              <span className="flex items-center gap-1 text-primary"><span className="w-1.5 h-1.5 rounded-full bg-primary" />RUNNING</span>
              <span className="flex items-center gap-1 text-muted-foreground"><span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40" />PENDING</span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-3 py-3">
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-[19px] top-2 bottom-2 w-px bg-border" />
              <div className="space-y-1">
                {timelineAgents.map((agent, idx) => {
                  const cfg = statusConfig[agent.status as keyof typeof statusConfig]
                  const isExpanded = expandedAgent === idx
                  return (
                    <div key={agent.name} className="relative pl-11">
                      {/* Dot */}
                      <div
                        className={cn(
                          'absolute left-3.5 top-3 w-3 h-3 rounded-full border-2 border-background z-10',
                          cfg.color
                        )}
                      />
                      {/* Connector arrow between agents */}
                      {idx < timelineAgents.length - 1 && (
                        <div className="absolute left-[14px] top-[22px] w-px h-3 bg-border" />
                      )}
                      <button
                        className={cn(
                          'w-full text-left px-3 py-2 rounded-lg border transition-all',
                          isExpanded
                            ? `${cfg.border} bg-card`
                            : 'border-transparent hover:bg-accent/20'
                        )}
                        onClick={() => setExpandedAgent(isExpanded ? null : idx)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-foreground">{agent.name}</span>
                            <span className={cn('text-[9px] font-mono px-1 py-0.5 rounded', cfg.text, 'bg-current/10')}>
                              {cfg.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            {agent.findings > 0 && (
                              <span className={cn('text-[10px] font-mono font-bold', cfg.text)}>
                                {agent.findings} findings
                              </span>
                            )}
                            <span className="text-[10px] font-mono text-muted-foreground">{agent.time}</span>
                            {isExpanded ? (
                              <ChevronUp className="w-3 h-3 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="w-3 h-3 text-muted-foreground" />
                            )}
                          </div>
                        </div>
                        {isExpanded && (
                          <p className="text-[11px] text-muted-foreground mt-1 pr-4">{agent.desc}</p>
                        )}
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
          {/* Progress bar */}
          <div className="px-4 py-3 border-t border-border">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-muted-foreground font-mono">Investigation Progress</span>
              <span className="text-primary font-mono font-bold">42%</span>
            </div>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-1000"
                style={{ width: '42%', boxShadow: '0 0 8px oklch(0.72 0.18 200 / 60%)' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
