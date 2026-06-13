'use client'
import { useEffect, useState } from "react"
import { getInvestigationData } from "@/lib/api"
import { AnimatedCounter } from '@/components/animated-counter'
import { cn } from '@/lib/utils'
import {
  Activity,
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Clock,
  Cpu,
  Search,
  Shield,
  TrendingUp,
  Zap,
} from 'lucide-react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const activityData = [
  { time: '00:00', events: 12, threats: 2 },
  { time: '04:00', events: 8, threats: 1 },
  { time: '08:00', events: 34, threats: 7 },
  { time: '10:00', events: 67, threats: 12 },
  { time: '12:00', events: 89, threats: 18 },
  { time: '14:00', events: 123, threats: 24 },
  { time: '16:00', events: 145, threats: 31 },
  { time: '18:00', events: 98, threats: 19 },
  { time: '20:00', events: 72, threats: 14 },
  { time: '22:00', events: 45, threats: 8 },
  { time: '23:59', events: 38, threats: 6 },
]

const recentAlerts = [
  { id: 1, title: 'PowerShell Execution Detected', severity: 'critical', time: '2m ago', agent: 'Log Agent' },
  { id: 2, title: 'Persistence Mechanism Found', severity: 'high', time: '8m ago', agent: 'Windows Artifact Agent' },
  { id: 3, title: 'Suspicious Registry Modification', severity: 'high', time: '15m ago', agent: 'Disk Agent' },
  { id: 4, title: 'Memory Injection Indicator', severity: 'critical', time: '22m ago', agent: 'Memory Agent' },
  { id: 5, title: 'Event Log Tampering Detected', severity: 'medium', time: '35m ago', agent: 'Correlation Agent' },
]

const severityColors: Record<string, string> = {
  critical: 'text-red-400 bg-red-400/10 border-red-400/30',
  high: 'text-orange-400 bg-orange-400/10 border-orange-400/30',
  medium: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
  low: 'text-green-400 bg-green-400/10 border-green-400/30',
}

const metrics = [
  {
    label: 'Cases Analyzed',
    value: 127,
    trend: '+18%',
    icon: Search,
    suffix: '',
    color: 'text-primary',
    bg: 'bg-primary/10',
    border: 'border-primary/20',
  },
  {
    label: 'Findings Detected',
    value: 342,
    trend: '+23%',
    icon: AlertTriangle,
    suffix: '',
    color: 'text-orange-400',
    bg: 'bg-orange-400/10',
    border: 'border-orange-400/20',
  },
  {
    label: 'Tools Executed',
    value: 89,
    trend: '+31%',
    icon: Zap,
    suffix: '',
    color: 'text-yellow-400',
    bg: 'bg-yellow-400/10',
    border: 'border-yellow-400/20',
  },
  {
    label: 'Detection Rate',
    value: 100,
    trend: '+5%',
    icon: CheckCircle2,
    suffix: '%',
    color: 'text-green-400',
    bg: 'bg-green-400/10',
    border: 'border-green-400/20',
  },
]

const agentStatus = [
  { name: 'Memory Agent', status: 'active', findings: 28 },
  { name: 'Disk Agent', status: 'active', findings: 41 },
  { name: 'Log Agent', status: 'active', findings: 67 },
  { name: 'Protocol SIFT Agent', status: 'idle', findings: 15 },
  { name: 'Correlation Agent', status: 'active', findings: 34 },
  { name: 'Verifier Agent', status: 'running', findings: 12 },
]

const [data, setData] = useState<any>(null)

useEffect(() => {
  getInvestigationData()
    .then(setData)
    .catch(console.error)
}, [])

export function DashboardPage() {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground glow-text">
            SentinelSIFT-X
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Autonomous Digital Forensics &amp; Incident Response Platform
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="flex items-center gap-1.5 px-2 py-1 rounded border border-primary/25 bg-primary/5 text-primary">
            <span className="w-1.5 h-1.5 rounded-full bg-primary pulse-cyan" />
            ACTIVE INVESTIGATION
          </span>
          <span className="px-2 py-1 rounded border border-border bg-muted/30 text-muted-foreground">
            <Clock className="w-3 h-3 inline mr-1" />
            {new Date().toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-4 gap-3">
        {metrics.map((m) => (
          <div
            key={m.label}
            className={cn(
              'glass rounded-xl p-4 border glow-border relative overflow-hidden',
              m.border
            )}
          >
            <div className="absolute inset-0 network-bg opacity-30" />
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className={cn('p-2 rounded-lg', m.bg)}>
                  <m.icon className={cn('w-4 h-4', m.color)} />
                </div>
                <span className={cn('text-xs font-mono flex items-center gap-1', m.color)}>
                  <TrendingUp className="w-3 h-3" />
                  {m.trend}
                </span>
              </div>
              <p className={cn('text-3xl font-bold tracking-tight', m.color)}>
                <AnimatedCounter target={m.value} suffix={m.suffix} />
              </p>
              <p className="text-xs text-muted-foreground mt-1 font-medium">{m.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-3 gap-3">
        {/* Activity Chart */}
        <div className="col-span-2 glass rounded-xl p-4 border border-panel-border">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" />
                Event Activity Timeline
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">Security events and threats — last 24h</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-primary">
                <span className="w-2 h-2 rounded-full bg-primary" />
                Events
              </span>
              <span className="flex items-center gap-1 text-red-400">
                <span className="w-2 h-2 rounded-full bg-red-400" />
                Threats
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={activityData}>
              <defs>
                <linearGradient id="eventsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.72 0.18 200)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="oklch(0.72 0.18 200)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="threatsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.65 0.22 25)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="oklch(0.65 0.22 25)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 5%)" />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: 'oklch(0.55 0.02 220)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'oklch(0.55 0.02 220)' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: 'oklch(0.14 0.025 240)',
                  border: '1px solid oklch(0.72 0.18 200 / 20%)',
                  borderRadius: '8px',
                  fontSize: '11px',
                  color: 'oklch(0.92 0.01 220)',
                }}
              />
              <Area type="monotone" dataKey="events" stroke="oklch(0.72 0.18 200)" strokeWidth={2} fill="url(#eventsGrad)" />
              <Area type="monotone" dataKey="threats" stroke="oklch(0.65 0.22 25)" strokeWidth={2} fill="url(#threatsGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Agent Status */}
        <div className="glass rounded-xl p-4 border border-panel-border">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
            <Cpu className="w-4 h-4 text-primary" />
            Agent Status
          </h3>
          <div className="space-y-2">
            {agentStatus.map((agent) => (
              <div key={agent.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className={cn('w-1.5 h-1.5 rounded-full', {
                      'bg-green-400 animate-pulse': agent.status === 'active',
                      'bg-primary animate-pulse': agent.status === 'running',
                      'bg-muted-foreground': agent.status === 'idle',
                    })}
                  />
                  <span className="text-muted-foreground truncate max-w-[110px]">{agent.name}</span>
                </div>
                <span className="font-mono text-primary">{agent.findings}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-border">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Total Findings</span>
              <span className="font-mono font-bold text-primary">
                <AnimatedCounter target={197} duration={2000} />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="glass rounded-xl border border-panel-border overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            Recent Security Alerts
          </h3>
          <span className="text-xs text-muted-foreground font-mono">
            <AnimatedCounter target={5} duration={800} /> active alerts
          </span>
        </div>
        <div className="divide-y divide-border">
          {recentAlerts.map((alert) => (
            <div key={alert.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-accent/30 transition-colors">
              <AlertTriangle
                className={cn('w-3.5 h-3.5 shrink-0', {
                  'text-red-400': alert.severity === 'critical',
                  'text-orange-400': alert.severity === 'high',
                  'text-yellow-400': alert.severity === 'medium',
                })}
              />
              <span className="text-sm text-foreground flex-1">{alert.title}</span>
              <span className={cn('text-[10px] font-mono px-1.5 py-0.5 rounded border uppercase tracking-wider', severityColors[alert.severity])}>
                {alert.severity}
              </span>
              <span className="text-xs text-muted-foreground w-16 text-right font-mono">{alert.time}</span>
              <span className="text-[10px] text-muted-foreground hidden lg:block w-32 text-right">{alert.agent}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom stats bar */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'IOCs Identified', value: '47', icon: BarChart3, color: 'text-primary' },
          { label: 'Evidence Artifacts', value: '1,284', icon: Shield, color: 'text-orange-400' },
          { label: 'MITRE Techniques', value: '23', icon: AlertTriangle, color: 'text-yellow-400' },
          { label: 'Avg Investigation', value: '4.2h', icon: Clock, color: 'text-green-400' },
        ].map((stat) => (
          <div key={stat.label} className="glass rounded-lg px-3 py-2.5 border border-panel-border flex items-center gap-3">
            <stat.icon className={cn('w-4 h-4 shrink-0', stat.color)} />
            <div>
              <p className={cn('text-lg font-bold font-mono', stat.color)}>{stat.value}</p>
              <p className="text-[10px] text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
