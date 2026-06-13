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

const reportSections = [
  {
    id: 'summary',
    title: 'Incident Summary',
    icon: FileText,
    content: `A sophisticated multi-stage intrusion was detected on host WORKSTATION-047 (10.0.1.47). Initial access was achieved via a spear-phishing email delivering a malicious PowerShell payload. The threat actor subsequently established persistence via registry Run key modification and executed lateral movement across the internal network.`,
  },
  {
    id: 'findings',
    title: 'Key Findings',
    icon: AlertTriangle,
    items: [
      { severity: 'critical', text: 'Obfuscated PowerShell reverse shell executed (Event ID 4688)' },
      { severity: 'critical', text: 'Persistence via HKCU Run key — svchost32.exe implant' },
      { severity: 'high', text: 'Lateral movement via SMB and WMI to 3 additional hosts' },
      { severity: 'high', text: 'Data staging in C:\\ProgramData\\Temp before exfiltration' },
      { severity: 'medium', text: 'Event log tampering — Security log partially cleared' },
    ],
  },
  {
    id: 'evidence',
    title: 'Evidence Collected',
    icon: Shield,
    items: [
      { label: 'Security.evtx', value: '67 relevant events extracted' },
      { label: 'Amcache.hve', value: '23 suspicious executable entries' },
      { label: 'SYSTEM Hive', value: 'Registry persistence artifact confirmed' },
      { label: 'Prefetch Files', value: '18 execution artifacts recovered' },
      { label: 'Memory Dump', value: '12 injected code regions identified' },
    ],
  },
  {
    id: 'tools',
    title: 'Tools Executed',
    icon: CheckCircle2,
    items: [
      { label: 'EvtxECmd', value: '67 events processed' },
      { label: 'AmcacheParser', value: '23 entries extracted' },
      { label: 'PECmd', value: '18 prefetch records parsed' },
      { label: 'AppCompatCacheParser', value: '31 cache entries' },
      { label: 'Volatility', value: '12 memory artifacts (in progress)' },
    ],
  },
  {
    id: 'timeline',
    title: 'Investigation Timeline',
    icon: FileText,
    events: [
      { time: '09:14:03', event: 'Initial PowerShell execution detected' },
      { time: '09:14:47', event: 'Lateral movement initiated via SMB' },
      { time: '09:15:44', event: 'Registry persistence mechanism installed' },
      { time: '09:16:01', event: 'Data staging activity observed' },
      { time: '09:17:22', event: 'Potential data exfiltration attempt' },
      { time: '09:25:38', event: 'Cross-artifact correlation ongoing' },
    ],
  },
  {
    id: 'confidence',
    title: 'Confidence Assessment',
    icon: Shield,
    scores: [
      { label: 'Evidence Quality', score: 97 },
      { label: 'Attribution Confidence', score: 89 },
      { label: 'Timeline Accuracy', score: 94 },
      { label: 'Indicator Reliability', score: 98 },
    ],
  },
  {
    id: 'next-steps',
    title: 'Recommended Next Steps',
    icon: AlertTriangle,
    items: [
      { label: '1', value: 'Isolate WORKSTATION-047 from network immediately' },
      { label: '2', value: 'Hunt for svchost32.exe across all endpoints' },
      { label: '3', value: 'Block C2 IP 192.168.99.254 at perimeter firewall' },
      { label: '4', value: 'Reset credentials for affected user accounts' },
      { label: '5', value: 'Enable enhanced PowerShell logging via GPO' },
      { label: '6', value: 'Complete Volatility analysis on full memory image' },
    ],
  },
]

const severityColors: Record<string, string> = {
  critical: 'text-red-400',
  high: 'text-orange-400',
  medium: 'text-yellow-400',
}

export function ReportPage() {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Investigation Report</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Case SSX-2024-0847 · Generated {new Date().toLocaleDateString()} · Confidential
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
            <p className="text-xs text-muted-foreground">Based on {342} correlated evidence items across 12 agents</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold font-mono text-primary">97%</p>
          <p className="text-xs text-green-400 font-mono">HIGH CONFIDENCE</p>
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

            {'events' in section && section.events && (
              <div className="space-y-1.5">
                {section.events.map((ev, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <span className="font-mono text-primary w-16 shrink-0">{ev.time}</span>
                    <span className="text-muted-foreground">{ev.event}</span>
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
