'use client'

import { AnimatedCounter } from '@/components/animated-counter'
import { cn } from '@/lib/utils'
import { BarChart3, TrendingUp } from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const trendData = [
  { case: 'C-001', detection: 94, precision: 91, recall: 89, fp: 9 },
  { case: 'C-002', detection: 96, precision: 94, recall: 92, fp: 6 },
  { case: 'C-003', detection: 97, precision: 96, recall: 94, fp: 4 },
  { case: 'C-004', detection: 98, precision: 97, recall: 97, fp: 3 },
  { case: 'C-005', detection: 99, precision: 98, recall: 98, fp: 2 },
  { case: 'C-006', detection: 100, precision: 99, recall: 99, fp: 1 },
  { case: 'C-007', detection: 100, precision: 100, recall: 100, fp: 0 },
]

const barData = [
  { agent: 'Memory', findings: 28, time: 94 },
  { agent: 'Disk', findings: 41, time: 112 },
  { agent: 'Log', findings: 67, time: 98 },
  { agent: 'SIFT', findings: 15, time: 44 },
  { agent: 'Win.Art', findings: 52, time: 163 },
  { agent: 'Correlate', findings: 34, time: 87 },
]

const radialData = [
  { name: 'Detection Rate', value: 100, fill: 'oklch(0.72 0.18 200)' },
  { name: 'Precision', value: 100, fill: 'oklch(0.65 0.20 170)' },
  { name: 'Recall', value: 100, fill: 'oklch(0.62 0.15 240)' },
  { name: 'F1 Score', value: 100, fill: 'oklch(0.64 0.18 155)' },
]

const metrics = [
  { label: 'Detection Rate', value: 100, suffix: '%', color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20', trend: '+5%' },
  { label: 'Precision', value: 100, suffix: '%', color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/20', trend: '+3%' },
  { label: 'Recall', value: 100, suffix: '%', color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20', trend: '+4%' },
  { label: 'False Positive Rate', value: 0, suffix: '%', color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/20', trend: '-100%' },
  { label: 'Cases Evaluated', value: 127, suffix: '', color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20', trend: '+18%' },
]

const tooltipStyle = {
  background: 'oklch(0.14 0.025 240)',
  border: '1px solid oklch(0.72 0.18 200 / 20%)',
  borderRadius: '8px',
  fontSize: '11px',
  color: 'oklch(0.92 0.01 220)',
}

export function BenchmarkingPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Benchmarking</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Performance analytics across 127 evaluated cases
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-5 gap-3">
        {metrics.map((m) => (
          <div key={m.label} className={cn('glass rounded-xl p-3 border', m.border)}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-muted-foreground font-medium">{m.label}</span>
              <span className={cn('text-[10px] font-mono flex items-center gap-0.5', m.color)}>
                <TrendingUp className="w-2.5 h-2.5" />
                {m.trend}
              </span>
            </div>
            <p className={cn('text-2xl font-bold font-mono', m.color)}>
              <AnimatedCounter target={m.value} suffix={m.suffix} />
            </p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-3 gap-4">
        {/* Line Chart */}
        <div className="col-span-2 glass rounded-xl border border-panel-border p-4">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
            <BarChart3 className="w-4 h-4 text-primary" />
            Performance Trend Across Cases
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 5%)" />
              <XAxis dataKey="case" tick={{ fontSize: 10, fill: 'oklch(0.55 0.02 220)' }} axisLine={false} tickLine={false} />
              <YAxis domain={[80, 101]} tick={{ fontSize: 10, fill: 'oklch(0.55 0.02 220)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: '10px' }} />
              <Line type="monotone" dataKey="detection" name="Detection %" stroke="oklch(0.72 0.18 200)" strokeWidth={2} dot={{ r: 3, fill: 'oklch(0.72 0.18 200)' }} />
              <Line type="monotone" dataKey="precision" name="Precision %" stroke="oklch(0.65 0.20 170)" strokeWidth={2} dot={{ r: 3, fill: 'oklch(0.65 0.20 170)' }} />
              <Line type="monotone" dataKey="recall" name="Recall %" stroke="oklch(0.62 0.15 240)" strokeWidth={2} dot={{ r: 3, fill: 'oklch(0.62 0.15 240)' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Radial */}
        <div className="glass rounded-xl border border-panel-border p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3">Score Overview</h3>
          <ResponsiveContainer width="100%" height={160}>
            <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="80%" data={radialData} startAngle={180} endAngle={0}>
              <RadialBar dataKey="value" cornerRadius={4} />
              <Tooltip contentStyle={tooltipStyle} />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {radialData.map((d) => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <span className="w-2 h-2 rounded-full" style={{ background: d.fill }} />
                  {d.name}
                </span>
                <span className="font-mono font-bold text-foreground">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bar chart */}
      <div className="glass rounded-xl border border-panel-border p-4">
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-primary" />
          Agent Findings Distribution
        </h3>
        <ResponsiveContainer width="100%" height={150}>
          <BarChart data={barData} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 5%)" />
            <XAxis dataKey="agent" tick={{ fontSize: 10, fill: 'oklch(0.55 0.02 220)' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: 'oklch(0.55 0.02 220)' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: '10px' }} />
            <Bar dataKey="findings" name="Findings" radius={[3, 3, 0, 0]}>
              {barData.map((_, i) => (
                <Cell key={i} fill={`oklch(${0.65 + i * 0.015} 0.18 ${200 - i * 5})`} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
