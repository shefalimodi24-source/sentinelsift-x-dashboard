'use client'

import { cn } from '@/lib/utils'
import { Activity, Cpu } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const agents = [
  {
    name: 'Memory Agent',
    status: 'complete',
    findings: 28,
    execTime: '94s',
    confidence: 97,
    desc: 'Heap analysis, process listing, code injection detection',
    color: 'oklch(0.72 0.18 200)',
  },
  {
    name: 'Disk Agent',
    status: 'complete',
    findings: 41,
    execTime: '112s',
    confidence: 98,
    desc: 'MFT parsing, file system artifact extraction, timeline',
    color: 'oklch(0.65 0.20 170)',
  },
  {
    name: 'Log Agent',
    status: 'complete',
    findings: 67,
    execTime: '98s',
    confidence: 99,
    desc: 'Event log correlation, IOC matching, SIEM enrichment',
    color: 'oklch(0.62 0.15 240)',
  },
  {
    name: 'Protocol SIFT Agent',
    status: 'complete',
    findings: 15,
    execTime: '44s',
    confidence: 100,
    desc: 'SIFT methodology application, investigation plan generation',
    color: 'oklch(0.64 0.18 155)',
  },
  {
    name: 'Windows Artifact Agent',
    status: 'complete',
    findings: 52,
    execTime: '163s',
    confidence: 96,
    desc: 'Amcache, Prefetch, ShimCache, registry artifact analysis',
    color: 'oklch(0.60 0.18 210)',
  },
  {
    name: 'Correlation Agent',
    status: 'running',
    findings: 34,
    execTime: '87s',
    confidence: 94,
    desc: 'Cross-artifact correlation, timeline reconstruction',
    color: 'oklch(0.72 0.18 200)',
  },
  {
    name: 'Challenge Agent',
    status: 'pending',
    findings: 0,
    execTime: '—',
    confidence: 0,
    desc: 'Hypothesis challenging and adversarial validation',
    color: 'oklch(0.55 0.02 220)',
  },
  {
    name: 'Contradiction Agent',
    status: 'pending',
    findings: 0,
    execTime: '—',
    confidence: 0,
    desc: 'Evidence contradiction detection and resolution',
    color: 'oklch(0.55 0.02 220)',
  },
  {
    name: 'Verifier Agent',
    status: 'pending',
    findings: 0,
    execTime: '—',
    confidence: 0,
    desc: 'Final evidence verification and confidence scoring',
    color: 'oklch(0.55 0.02 220)',
  },
  {
    name: 'Tool Selection Agent',
    status: 'pending',
    findings: 0,
    execTime: '—',
    confidence: 0,
    desc: 'Optimal tool selection from forensics toolkit',
    color: 'oklch(0.55 0.02 220)',
  },
  {
    name: 'Tool Execution Agent',
    status: 'pending',
    findings: 0,
    execTime: '—',
    confidence: 0,
    desc: 'Automated tool invocation and output parsing',
    color: 'oklch(0.55 0.02 220)',
  },
  {
    name: 'Report Agent',
    status: 'pending',
    findings: 0,
    execTime: '—',
    confidence: 0,
    desc: 'Executive report generation with evidence summaries',
    color: 'oklch(0.55 0.02 220)',
  },
]

const chartData = agents
  .filter((a) => a.findings > 0)
  .map((a) => ({ name: a.name.replace(' Agent', ''), findings: a.findings, confidence: a.confidence, fill: a.color }))

const tooltipStyle = {
  background: 'oklch(0.14 0.025 240)',
  border: '1px solid oklch(0.72 0.18 200 / 20%)',
  borderRadius: '8px',
  fontSize: '11px',
  color: 'oklch(0.92 0.01 220)',
}

const statusConfig = {
  complete: { badge: 'text-green-400 bg-green-400/10 border-green-400/25', dot: 'bg-green-400' },
  running: { badge: 'text-primary bg-primary/10 border-primary/25', dot: 'bg-primary animate-pulse' },
  pending: { badge: 'text-muted-foreground bg-muted/20 border-border', dot: 'bg-muted-foreground/40' },
}

export function AgentsPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Agent Performance</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Multi-agent system — {agents.filter((a) => a.status === 'complete').length} complete · {agents.filter((a) => a.status === 'running').length} running · {agents.filter((a) => a.status === 'pending').length} pending
        </p>
      </div>

      <div className="grid grid-cols-5 gap-4 h-[calc(100vh-210px)]">
        {/* Agent Cards */}
        <div className="col-span-3 overflow-y-auto pr-1">
          <div className="grid grid-cols-2 gap-2">
            {agents.map((agent) => {
              const cfg = statusConfig[agent.status as keyof typeof statusConfig]
              return (
                <div key={agent.name} className="glass rounded-xl border border-panel-border p-3 hover:border-primary/25 transition-all">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <div className="p-1.5 rounded bg-primary/10 border border-primary/20">
                          <Cpu className="w-3.5 h-3.5 text-primary" />
                        </div>
                        <span className={cn('absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full border border-background', cfg.dot)} />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-foreground leading-tight">{agent.name}</p>
                        <span className={cn('text-[9px] font-mono px-1 py-0.5 rounded border uppercase', cfg.badge)}>
                          {agent.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-relaxed mb-2">{agent.desc}</p>
                  <div className="grid grid-cols-3 gap-1 text-center border-t border-border pt-2">
                    <div>
                      <p className="text-sm font-bold font-mono text-primary">{agent.findings}</p>
                      <p className="text-[9px] text-muted-foreground">Findings</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold font-mono text-foreground">{agent.execTime}</p>
                      <p className="text-[9px] text-muted-foreground">Exec Time</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold font-mono text-green-400">
                        {agent.confidence > 0 ? `${agent.confidence}%` : '—'}
                      </p>
                      <p className="text-[9px] text-muted-foreground">Confidence</p>
                    </div>
                  </div>
                  {agent.confidence > 0 && (
                    <div className="mt-2">
                      <div className="h-1 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{ width: `${agent.confidence}%`, background: agent.color }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Charts */}
        <div className="col-span-2 space-y-4">
          <div className="glass rounded-xl border border-panel-border p-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
              <Activity className="w-4 h-4 text-primary" />
              Findings per Agent
            </h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={chartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 5%)" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 9, fill: 'oklch(0.55 0.02 220)' }} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 9, fill: 'oklch(0.55 0.02 220)' }} axisLine={false} tickLine={false} width={60} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="findings" radius={[0, 3, 3, 0]}>
                  {chartData.map((d, i) => (
                    <Cell key={i} fill={d.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="glass rounded-xl border border-panel-border p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">Confidence Contributions</h3>
            <div className="space-y-2">
              {agents.filter((a) => a.confidence > 0).map((agent) => (
                <div key={agent.name} className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground w-28 truncate">{agent.name.replace(' Agent', '')}</span>
                  <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${agent.confidence}%`, background: agent.color }}
                    />
                  </div>
                  <span className="text-[10px] font-mono w-8 text-right" style={{ color: agent.color }}>
                    {agent.confidence}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
