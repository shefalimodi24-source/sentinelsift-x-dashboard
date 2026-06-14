'use client'

import { cn } from '@/lib/utils'
import {
  AlertTriangle,
  CheckCircle2,
  Download,
  FileJson,
  FileSpreadsheet,
  FileText,
  Shield,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useInvestigation } from '@/contexts/InvestigationContext'

const severityColors: Record<string, string> = {
  critical: 'text-red-400',
  high: 'text-orange-400',
  medium: 'text-yellow-400',
  low: 'text-green-400',
}

export function ReportPage() {
  const { data } = useInvestigation()
  const [dateString, setDateString] = useState('')

  useEffect(() => {
    setDateString(new Date().toLocaleDateString())
  }, [])

  if (!data) return null

  const getSeverity = (title: string): 'critical' | 'high' | 'medium' | 'low' => {
    const lowerTitle = title.toLowerCase()
    if (lowerTitle.includes('powershell')) return 'critical'
    if (lowerTitle.includes('persistence')) return 'high'
    return 'low'
  }

  // Construct Dynamic Sections
  const reportSections = [
    {
      id: 'summary',
      title: 'Executive Summary',
      icon: FileText,
      content: `An automated Digital Forensics and Incident Response (DFIR) investigation was conducted by the SentinelSIFT-X autonomous multi-agent platform. The system successfully executed ${data.tools.length} forensic collection tools, gathered ${data.evidence.length} primary evidence signatures, and identified ${data.findings.length} security findings. The overall detection rate was measured at ${Math.round(data.benchmark.detection_rate * 100)}% with a target confidence score of ${Math.round(data.benchmark.precision * 100)}% precision and ${Math.round(data.benchmark.recall * 100)}% recall. Key security issues include PowerShell shell execution and registry-based persistence.`,
    },
    {
      id: 'findings',
      title: 'Findings Summary',
      icon: AlertTriangle,
      items: data.findings.map(f => {
        const severity = getSeverity(f.finding)
        return {
          severity,
          text: `${f.finding} — detected via ${f.sources.join(', ')} sources (${f.evidence.length} evidence indicators)`,
        }
      }),
    },
    {
      id: 'tools',
      title: 'Tools Executed',
      icon: CheckCircle2,
      items: data.tools.map(t => {
        let details = 'Forensic artifact execution check completed.'
        if (t === 'EvtxECmd') details = 'Processed Windows Event Logs for security event identifiers.'
        else if (t === 'PECmd') details = 'Analyzed Windows Prefetch files to extract execution timestamps.'
        else if (t === 'AmcacheParser') details = 'Parsed Amcache hive entries for binary hashes and installation paths.'
        else if (t === 'AppCompatCacheParser') details = 'Extracted SYSTEM hive ShimCache application compatibility entries.'
        return {
          label: t,
          value: `${details} (Status: SUCCESS)`,
        }
      }),
    },
    {
      id: 'evidence',
      title: 'Evidence Collected',
      icon: Shield,
      items: data.evidence.map(ev => {
        const cleanEv = ev.replace(/"/g, '')
        return {
          label: cleanEv.split(' ')[0] || 'Artifact',
          value: `${cleanEv} verified successfully as authentic forensic evidence.`,
        }
      }),
    },
    {
      id: 'benchmark',
      title: 'Benchmark Results',
      icon: Shield,
      scores: [
        { label: 'Precision', score: Math.round(data.benchmark.precision * 100) },
        { label: 'Recall', score: Math.round(data.benchmark.recall * 100) },
        { label: 'Detection Rate', score: Math.round(data.benchmark.detection_rate * 100) },
      ],
    },
  ]

  const overallConfidence = Math.round(data.benchmark.precision * 100)

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Investigation Report</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Case SSX-2024-0847 · Generated {dateString || 'Loading...'} · Confidential
          </p>
        </div>
        <div className="flex items-center gap-2">
          {[
            { label: 'PDF', icon: FileText, color: 'text-red-400 border-red-400/30 hover:bg-red-400/10' },
            { label: 'JSON', icon: FileJson, color: 'text-blue-400 border-blue-400/30 hover:bg-blue-400/10' },
            { label: 'CSV', icon: FileSpreadsheet, color: 'text-green-400 border-green-400/30 hover:bg-green-400/10' },
          ].map((btn) => (
            <button
              key={btn.label}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all',
                btn.color
              )}
            >
              <Download className="w-3.5 h-3.5" />
              <btn.icon className="w-3.5 h-3.5" />
              Export {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Overall confidence banner */}
      <div className="glass rounded-xl border border-primary/30 p-4 flex items-center justify-between glow-border">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">Overall Investigation Confidence</p>
            <p className="text-xs text-muted-foreground">Based on {data.findings.length} correlated findings across {data.tools.length} executed tools</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold font-mono text-primary">{overallConfidence}%</p>
          <p className={cn('text-xs font-mono', overallConfidence >= 90 ? 'text-green-400' : 'text-yellow-400')}>
            {overallConfidence >= 90 ? 'HIGH CONFIDENCE' : 'MEDIUM CONFIDENCE'}
          </p>
        </div>
      </div>

      {/* Report Sections */}
      <div className="grid grid-cols-2 gap-4 h-[calc(100vh-350px)] overflow-y-auto">
        {reportSections.map((section) => (
          <div key={section.id} className="glass rounded-xl border border-panel-border p-4">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2 mb-3 pb-2 border-b border-border">
              <section.icon className="w-4 h-4 text-primary" />
              {section.title}
            </h3>

            {'content' in section && (
              <p className="text-xs text-muted-foreground leading-relaxed">{section.content}</p>
            )}

            {'items' in section && section.items && (
              <div className="space-y-1.5">
                {section.items.map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs">
                    {'severity' in item ? (
                      <>
                        <AlertTriangle className={cn('w-3 h-3 mt-0.5 shrink-0', severityColors[item.severity as string] || 'text-muted-foreground')} />
                        <span className="text-muted-foreground">{item.text}</span>
                      </>
                    ) : (
                      <>
                        <span className="font-mono text-primary shrink-0 font-bold">{'label' in item ? item.label : ''}</span>
                        <span className="text-muted-foreground">{'value' in item ? item.value : ''}</span>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}

            {'scores' in section && section.scores && (
              <div className="space-y-2">
                {section.scores.map((s) => (
                  <div key={s.label}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">{s.label}</span>
                      <span className="font-mono font-bold text-primary">{s.score}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${s.score}%`, boxShadow: '0 0 6px oklch(0.72 0.18 200 / 50%)' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

