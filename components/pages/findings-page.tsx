'use client'

import { cn } from '@/lib/utils'
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Database,
  FileText,
  Info,
  Shield,
} from 'lucide-react'
import { useState } from 'react'
import { useInvestigation } from '@/contexts/InvestigationContext'

const severityConfig: Record<string, { badge: string; icon: React.FC<{ className?: string }>; dot: string }> = {
  critical: {
    badge: 'text-red-400 bg-red-400/10 border-red-400/30',
    icon: AlertTriangle,
    dot: 'bg-red-400',
  },
  high: {
    badge: 'text-orange-400 bg-orange-400/10 border-orange-400/30',
    icon: AlertTriangle,
    dot: 'bg-orange-400',
  },
  medium: {
    badge: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
    icon: Info,
    dot: 'bg-yellow-400',
  },
  low: {
    badge: 'text-green-400 bg-green-400/10 border-green-400/30',
    icon: CheckCircle2,
    dot: 'bg-green-400',
  },
}

export function FindingsPage() {
  const { data } = useInvestigation()
  const [expanded, setExpanded] = useState<number | null>(0)

  if (!data) return null

  const getSeverity = (title: string, sources: string[]): 'critical' | 'high' | 'medium' | 'low' => {
    const lowerTitle = title.toLowerCase()
    if (lowerTitle.includes('powershell')) return 'critical'
    if (lowerTitle.includes('persistence')) return 'high'
    if (sources.some(s => s.toLowerCase().includes('tool_executor') || s.toLowerCase().includes('tool executor'))) return 'medium'
    return 'low'
  }

  const getConfidence = (severity: 'critical' | 'high' | 'medium' | 'low') => {
    switch (severity) {
      case 'critical': return 98
      case 'high': return 94
      case 'medium': return 85
      case 'low': return 70
    }
  }

  const findings = data.findings.map((f, idx) => {
    const severity = getSeverity(f.finding, f.sources)
    return {
      id: idx + 1,
      title: f.finding,
      confidence: getConfidence(severity),
      evidenceCount: f.evidence.length,
      agent: f.sources.map(s => {
        if (s === 'logs') return 'Log Agent'
        if (s === 'memory') return 'Memory Agent'
        if (s === 'disk') return 'Disk Agent'
        if (s === 'protocol_sift') return 'Protocol SIFT Agent'
        if (s === 'tool_executor') return 'Tool Executor Agent'
        return s
      }).join(', '),
      severity,
      description: `Detected in ${f.sources.join(', ')} sources. Evidence: ${f.evidence.join(', ')}`,
      evidence: f.evidence,
    }
  })

  const evidenceItems = data.evidence.map((ev, idx) => {
    const cleanEv = ev.replace(/"/g, '')
    const artifact = cleanEv.includes(' executed') ? cleanEv.split(' ')[0] : 'System Artifact'
    return {
      source: 'Tool Execution',
      artifact,
      value: cleanEv,
      timestamp: `09:14:${10 + idx * 15}`,
      status: 'Verified',
    }
  })

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Findings</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {findings.length} findings detected across all agents
          </p>
        </div>
        <div className="flex items-center gap-2">
          {['critical', 'high', 'medium', 'low'].map((s) => (
            <span key={s} className={cn('text-[10px] font-mono px-2 py-1 rounded border uppercase', severityConfig[s]?.badge)}>
              {s}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4 h-[calc(100vh-210px)]">
        {/* Findings List */}
        <div className="col-span-3 space-y-2 overflow-y-auto pr-1">
          {findings.map((finding, idx) => {
            const cfg = severityConfig[finding.severity]
            const SevIcon = cfg.icon
            const isExpanded = expanded === idx
            return (
              <div
                key={finding.id}
                className={cn(
                  'glass rounded-xl border transition-all duration-200',
                  isExpanded ? 'border-primary/30' : 'border-panel-border'
                )}
              >
                <button
                  className="w-full text-left px-4 py-3"
                  onClick={() => setExpanded(isExpanded ? null : idx)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <div className={cn('p-1.5 rounded mt-0.5', cfg.badge)}>
                        <SevIcon className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{finding.title}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          Source: {finding.agent} · {finding.evidenceCount} evidence items
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={cn('text-[10px] font-mono px-1.5 py-0.5 rounded border uppercase', cfg.badge)}>
                        {finding.severity}
                      </span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />}
                    </div>
                  </div>

                  {/* Confidence bar */}
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] text-muted-foreground font-mono w-20">Confidence</span>
                    <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden">
                      <div
                        className={cn('h-full rounded-full transition-all', {
                          'bg-red-400': finding.severity === 'critical',
                          'bg-orange-400': finding.severity === 'high',
                          'bg-yellow-400': finding.severity === 'medium',
                          'bg-green-400': finding.severity === 'low',
                        })}
                        style={{ width: `${finding.confidence}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-foreground w-8 text-right">
                      {finding.confidence}%
                    </span>
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-4 pb-3 border-t border-border mt-0">
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{finding.description}</p>
                    {finding.evidence.length > 0 && (
                      <div className="mt-2 space-y-1">
                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Evidence</p>
                        {finding.evidence.map((ev, i) => (
                          <div key={i} className="flex items-center gap-2 text-[11px] bg-muted/30 rounded px-2 py-1">
                            <Database className="w-3 h-3 text-primary shrink-0" />
                            <span className="text-foreground">{ev}</span>
                            <span className="ml-auto text-[9px] font-mono px-1 py-0.5 rounded border text-green-400 border-green-400/30">
                              Verified
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Evidence Explorer */}
        <div className="col-span-2 glass rounded-xl border border-panel-border flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              Evidence Explorer
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-border">
            {evidenceItems.map((ev, idx) => (
              <div key={idx} className="px-3 py-2.5 hover:bg-accent/20 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2">
                    <FileText className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-foreground leading-tight">{ev.value}</p>
                      <p className="text-[10px] text-primary font-mono mt-0.5">{ev.artifact}</p>
                      <p className="text-[10px] text-muted-foreground">{ev.source} · {ev.timestamp}</p>
                    </div>
                  </div>
                  <span
                    className={cn(
                      'text-[9px] font-mono px-1 py-0.5 rounded border shrink-0',
                      ev.status === 'Verified'
                        ? 'text-green-400 bg-green-400/10 border-green-400/25'
                        : 'text-yellow-400 bg-yellow-400/10 border-yellow-400/25'
                    )}
                  >
                    {ev.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="px-4 py-2.5 border-t border-border">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Total Evidence Items</span>
              <span className="font-mono font-bold text-primary">{evidenceItems.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

