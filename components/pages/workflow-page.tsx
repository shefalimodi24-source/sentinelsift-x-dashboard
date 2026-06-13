'use client'

import { cn } from '@/lib/utils'
import {
  CheckCircle2,
  ChevronRight,
  CircleDot,
  Clock,
  FileText,
  Layers,
  Loader2,
  Network,
  Shield,
  Terminal,
  Wrench,
  Zap,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

// ─── Mock data (swap with API later) ────────────────────────────────────────

const PIPELINE_DATA: {
  findings: { id: string; agent: string; text: string }[]
  verified_findings: { id: string; text: string }[]
  tool_recommendations: { tool: string; agent: string; evidence: number }[]
  new_evidence: { id: string; source: string; count: number }[]
  reasoning_log: { ts: string; text: string; level: 'info' | 'warn' | 'success' }[]
} = {
  findings: [],
  verified_findings: [],
  tool_recommendations: [],
  new_evidence: [],
  reasoning_log: [],
}

type NodeStatus = 'complete' | 'running' | 'pending' | 'failed'

interface AgentNode {
  id: string
  name: string
  status: NodeStatus
  findings: number
  execMs: number | null
  confidence: number | null
  icon: React.ElementType
}

const AGENT_NODES: AgentNode[] = [
  { id: 'memory',      name: 'Memory Agent',           status: 'complete', findings: 28, execMs: 94,  confidence: 97, icon: Layers },
  { id: 'disk',        name: 'Disk Agent',              status: 'complete', findings: 41, execMs: 112, confidence: 98, icon: Layers },
  { id: 'log',         name: 'Log Agent',               status: 'complete', findings: 67, execMs: 98,  confidence: 99, icon: FileText },
  { id: 'sift',        name: 'Protocol SIFT Agent',     status: 'complete', findings: 15, execMs: 44,  confidence: 100, icon: Shield },
  { id: 'windows',     name: 'Windows Artifact Agent',  status: 'complete', findings: 52, execMs: 163, confidence: 96, icon: Layers },
  { id: 'correlation', name: 'Correlation Agent',       status: 'complete', findings: 34, execMs: 87,  confidence: 94, icon: Network },
  { id: 'challenge',   name: 'Challenge Agent',         status: 'complete', findings: 22, execMs: 61,  confidence: 95, icon: Zap },
  { id: 'contradiction', name: 'Contradiction Agent',   status: 'complete', findings: 11, execMs: 53,  confidence: 98, icon: Zap },
  { id: 'verifier',    name: 'Verifier Agent',          status: 'running',  findings: 42, execMs: null, confidence: 97, icon: CheckCircle2 },
  { id: 'toolsel',     name: 'Tool Selection Agent',    status: 'pending',  findings: 0,  execMs: null, confidence: null, icon: Wrench },
  { id: 'toolexec',    name: 'Tool Executor Agent',     status: 'pending',  findings: 0,  execMs: null, confidence: null, icon: Terminal },
  { id: 'report',      name: 'Report Agent',            status: 'pending',  findings: 0,  execMs: null, confidence: null, icon: FileText },
]

const TOOL_CARDS = [
  { tool: 'EvtxECmd',             agent: 'Log Agent',              status: 'Executed', evidence: 67 },
  { tool: 'PECmd',                agent: 'Windows Artifact Agent', status: 'Executed', evidence: 18 },
  { tool: 'AmcacheParser',        agent: 'Windows Artifact Agent', status: 'Executed', evidence: 23 },
  { tool: 'AppCompatCacheParser', agent: 'Windows Artifact Agent', status: 'Executed', evidence: 31 },
]

const STREAM_EVENTS = [
  { ts: '09:14:02', text: 'Memory Agent started',                   level: 'info' },
  { ts: '09:14:03', text: 'Memory Agent produced 28 findings',      level: 'success' },
  { ts: '09:14:05', text: 'Disk Agent started',                     level: 'info' },
  { ts: '09:14:07', text: 'Disk Agent completed — 41 findings',     level: 'success' },
  { ts: '09:14:09', text: 'Log Agent started',                      level: 'info' },
  { ts: '09:14:11', text: 'Log Agent detected PowerShell execution', level: 'warn' },
  { ts: '09:14:13', text: 'Log Agent completed — 67 findings',      level: 'success' },
  { ts: '09:14:15', text: 'Protocol SIFT Agent completed',          level: 'success' },
  { ts: '09:14:17', text: 'Windows Artifact Agent started',         level: 'info' },
  { ts: '09:14:20', text: 'Windows Artifact Agent — 52 findings',   level: 'success' },
  { ts: '09:14:22', text: 'Correlation Agent completed',            level: 'success' },
  { ts: '09:14:24', text: 'Challenge Agent validated 22 hypotheses', level: 'success' },
  { ts: '09:14:26', text: 'Contradiction Agent resolved 11 conflicts', level: 'success' },
  { ts: '09:14:28', text: 'Verifier Agent started verification',    level: 'info' },
  { ts: '09:14:29', text: 'Verifier scoring confidence…',           level: 'info' },
] as const

// ─── Sub-components ──────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: NodeStatus }) {
  const cfg = {
    complete: 'text-green-400 border-green-400/30 bg-green-400/10',
    running:  'text-orange-400 border-orange-400/30 bg-orange-400/10',
    pending:  'text-zinc-500 border-zinc-700/40 bg-zinc-800/20',
    failed:   'text-red-400 border-red-400/30 bg-red-400/10',
  }
  return (
    <span className={cn('text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase tracking-widest', cfg[status])}>
      {status}
    </span>
  )
}

function EdgeSVG({ status }: { status: 'complete' | 'running' | 'pending' }) {
  return (
    <div className={cn('flex justify-center my-0', `edge-${status}`)}>
      <svg width="2" height="32" viewBox="0 0 2 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line
          className="edge-line"
          x1="1" y1="0" x2="1" y2="32"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}

function AgentCard({ node, isLast }: { node: AgentNode; isLast: boolean }) {
  const [hovered, setHovered] = useState(false)
  const Icon = node.icon

  const borderColor = {
    complete: 'border-green-500/40',
    running:  'border-orange-400/50',
    pending:  'border-zinc-700/40',
    failed:   'border-red-500/40',
  }[node.status]

  const headerColor = {
    complete: 'text-green-400',
    running:  'text-orange-400',
    pending:  'text-zinc-500',
    failed:   'text-red-400',
  }[node.status]

  const bgColor = {
    complete: 'bg-green-400/5',
    running:  'bg-orange-400/5',
    pending:  'bg-zinc-900/40',
    failed:   'bg-red-400/5',
  }[node.status]

  const nodeClass = {
    complete: 'node-complete',
    running:  'node-running',
    pending:  '',
    failed:   'node-failed',
  }[node.status]

  // Edge to next node
  const edgeStatus: 'complete' | 'running' | 'pending' =
    node.status === 'complete' ? 'complete' :
    node.status === 'running'  ? 'running'  : 'pending'

  return (
    <div className="flex flex-col items-center">
      <div
        className={cn(
          'w-56 rounded-xl border transition-all duration-300 cursor-default',
          bgColor, borderColor, nodeClass,
          hovered && 'scale-105'
        )}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Header */}
        <div className="flex items-center gap-2 px-3 pt-3 pb-2 border-b border-zinc-800/60">
          <div className={cn('p-1 rounded', node.status === 'complete' ? 'bg-green-400/10' : node.status === 'running' ? 'bg-orange-400/10' : 'bg-zinc-800/60')}>
            <Icon className={cn('w-3 h-3', headerColor)} />
          </div>
          <span className="text-xs font-semibold text-white tracking-tight flex-1 truncate">{node.name}</span>
          {node.status === 'running' && (
            <Loader2 className="w-3 h-3 text-orange-400 animate-spin shrink-0" />
          )}
        </div>

        {/* Stats */}
        <div className="px-3 py-2.5">
          <div className="flex items-center justify-between mb-2">
            <StatusBadge status={node.status} />
            {node.execMs !== null && (
              <span className="text-[9px] font-mono text-zinc-500 flex items-center gap-1">
                <Clock className="w-2.5 h-2.5" />
                {node.execMs} ms
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="bg-black/30 rounded px-1.5 py-1">
              <p className={cn('text-sm font-bold font-mono', headerColor)}>
                {node.findings > 0 ? node.findings : '—'}
              </p>
              <p className="text-[9px] text-zinc-600">Findings</p>
            </div>
            <div className="bg-black/30 rounded px-1.5 py-1">
              <p className={cn('text-sm font-bold font-mono', node.confidence !== null ? headerColor : 'text-zinc-600')}>
                {node.confidence !== null ? `${node.confidence}%` : '—'}
              </p>
              <p className="text-[9px] text-zinc-600">Confidence</p>
            </div>
          </div>
          {node.confidence !== null && (
            <div className="mt-2 h-0.5 rounded-full bg-zinc-800 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${node.confidence}%`,
                  background: node.status === 'complete'
                    ? 'oklch(0.72 0.22 145)'
                    : node.status === 'running'
                    ? 'oklch(0.70 0.18 55)'
                    : 'oklch(0.30 0.02 240)',
                }}
              />
            </div>
          )}
        </div>
      </div>

      {!isLast && <EdgeSVG status={edgeStatus} />}
    </div>
  )
}

function ExecutionStream() {
  const [visible, setVisible] = useState(0)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (visible >= STREAM_EVENTS.length) return
    const t = setTimeout(() => setVisible((v) => v + 1), 350)
    return () => clearTimeout(t)
  }, [visible])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [visible])

  const color = { info: 'text-zinc-400', warn: 'text-yellow-400', success: 'text-green-400' }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-zinc-800/60">
        <Terminal className="w-3.5 h-3.5 text-green-400" />
        <span className="text-xs font-semibold text-white tracking-wide">Execution Stream</span>
        <span className="ml-auto text-[9px] font-mono text-green-400 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          LIVE
        </span>
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5 font-mono text-[11px] leading-relaxed">
        {STREAM_EVENTS.slice(0, visible).map((e, i) => (
          <div key={i} className="stream-entry flex gap-2 items-start">
            <span className="text-zinc-600 shrink-0">{e.ts}</span>
            <ChevronRight className="w-3 h-3 text-zinc-700 shrink-0 mt-0.5" />
            <span className={color[e.level]}>{e.text}</span>
          </div>
        ))}
        {visible < STREAM_EVENTS.length && (
          <div className="flex gap-2 items-center text-zinc-600">
            <span>{STREAM_EVENTS[visible]?.ts ?? ''}</span>
            <span className="stream-cursor" />
          </div>
        )}
        {visible >= STREAM_EVENTS.length && (
          <div className="flex gap-2 items-center">
            <span className="text-zinc-600">09:14:30</span>
            <span className="text-green-400">Awaiting verifier completion…</span>
            <span className="stream-cursor" />
          </div>
        )}
        <div ref={endRef} />
      </div>
    </div>
  )
}

function MetricCard({ label, value, sub, color }: { label: string; value: string; sub?: string; color: string }) {
  return (
    <div className="relative rounded-xl border border-zinc-800/60 bg-zinc-900/40 px-4 py-4 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{ background: `radial-gradient(ellipse at top left, ${color}, transparent 70%)` }}
      />
      <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-1">{label}</p>
      <p className="text-3xl font-bold font-mono" style={{ color }}>{value}</p>
      {sub && <p className="text-[10px] text-zinc-600 mt-1">{sub}</p>}
    </div>
  )
}

function VerifierBlock() {
  return (
    <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-5">
      <h3 className="text-xs font-semibold text-white tracking-wide uppercase mb-4 flex items-center gap-2">
        <CheckCircle2 className="w-4 h-4 text-green-400" />
        Verification Decision Block
      </h3>
      <div className="flex items-start gap-6 font-mono text-[11px]">
        {/* Diagram */}
        <div className="flex flex-col items-center gap-0">
          {/* Verifier box */}
          <div className="px-4 py-2 rounded border border-orange-400/40 bg-orange-400/5 node-running">
            <span className="text-orange-400 text-xs font-bold tracking-wider">Verifier</span>
          </div>
          {/* Arrow down */}
          <svg width="2" height="20" viewBox="0 0 2 20" className="my-0.5">
            <line x1="1" y1="0" x2="1" y2="20" stroke="oklch(0.70 0.18 55)" strokeWidth="2" strokeDasharray="3 3" />
          </svg>
          {/* Diamond */}
          <div className="w-20 h-8 flex items-center justify-center rotate-0">
            <div className="w-16 h-8 border border-zinc-600 bg-zinc-800/60 rounded flex items-center justify-center">
              <span className="text-zinc-400 text-[10px]">Verified?</span>
            </div>
          </div>

          {/* YES / NO branches */}
          <div className="flex gap-8 mt-2">
            {/* YES */}
            <div className="flex flex-col items-center gap-1">
              <svg width="2" height="16" viewBox="0 0 2 16">
                <line x1="1" y1="0" x2="1" y2="16" stroke="oklch(0.72 0.22 145)" strokeWidth="2" />
              </svg>
              <div className="px-3 py-1.5 rounded border border-green-500/40 bg-green-400/5">
                <span className="text-green-400 text-[10px] font-bold">YES</span>
              </div>
              <svg width="2" height="12" viewBox="0 0 2 12">
                <line x1="1" y1="0" x2="1" y2="12" stroke="oklch(0.72 0.22 145)" strokeWidth="2" />
              </svg>
              <div className="px-2 py-1 rounded border border-zinc-700 bg-zinc-800/40 text-center">
                <span className="text-zinc-300 text-[9px]">Tool Selector</span>
              </div>
            </div>
            {/* NO */}
            <div className="flex flex-col items-center gap-1">
              <svg width="2" height="16" viewBox="0 0 2 16">
                <line x1="1" y1="0" x2="1" y2="16" stroke="oklch(0.65 0.22 25)" strokeWidth="2" />
              </svg>
              <div className="px-3 py-1.5 rounded border border-red-500/40 bg-red-400/5">
                <span className="text-red-400 text-[10px] font-bold">NO</span>
              </div>
              <svg width="2" height="12" viewBox="0 0 2 12">
                <line x1="1" y1="0" x2="1" y2="12" stroke="oklch(0.65 0.22 25)" strokeWidth="2" />
              </svg>
              <div className="px-2 py-1 rounded border border-zinc-700 bg-zinc-800/40 text-center">
                <span className="text-zinc-300 text-[9px]">Retry Analysis</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-col gap-3 pt-1">
          <div className="rounded border border-zinc-800 bg-zinc-900/60 px-3 py-2">
            <p className="text-[9px] text-zinc-500 mb-0.5 uppercase tracking-wider">Retries Used</p>
            <p className="text-lg font-bold font-mono text-white">0 <span className="text-zinc-600 text-sm">/ 3</span></p>
          </div>
          <div className="rounded border border-zinc-800 bg-zinc-900/60 px-3 py-2">
            <p className="text-[9px] text-zinc-500 mb-0.5 uppercase tracking-wider">Current Decision</p>
            <p className="text-xs font-mono text-orange-400">PENDING VERIFICATION</p>
          </div>
          <div className="rounded border border-zinc-800 bg-zinc-900/60 px-3 py-2">
            <p className="text-[9px] text-zinc-500 mb-0.5 uppercase tracking-wider">Verified Findings</p>
            <p className="text-lg font-bold font-mono text-green-400">318 <span className="text-zinc-600 text-sm">/ 342</span></p>
          </div>
        </div>
      </div>
    </div>
  )
}

function ToolSelectionSection() {
  return (
    <div>
      <h3 className="text-xs font-semibold text-white tracking-wide uppercase mb-3 flex items-center gap-2">
        <Wrench className="w-4 h-4 text-zinc-400" />
        Recommended DFIR Tools
      </h3>
      <div className="grid grid-cols-4 gap-3">
        {TOOL_CARDS.map((t) => (
          <div key={t.tool} className="rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-3 hover:border-green-500/30 transition-all group">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1 rounded bg-zinc-800">
                <Terminal className="w-3 h-3 text-zinc-400 group-hover:text-green-400 transition-colors" />
              </div>
              <span className="text-xs font-bold font-mono text-white">{t.tool}</span>
            </div>
            <p className="text-[10px] text-zinc-500 mb-2">Recommended by {t.agent}</p>
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded border border-green-500/30 bg-green-400/10 text-green-400 uppercase tracking-wider">
                {t.status}
              </span>
              <span className="text-xs font-bold font-mono text-green-400">{t.evidence}</span>
            </div>
            <p className="text-[9px] text-zinc-600 mt-1 text-right">evidence records</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function ArchitecturePanel() {
  const nodes = [
    { label: 'Case Data',            level: 0, x: 50 },
    { label: 'LangGraph Orchestrator', level: 1, x: 50 },
    { label: 'Multi-Agent Pipeline', level: 2, x: 50 },
    { label: 'Tool Selection',       level: 3, x: 50 },
    { label: 'Tool Execution',       level: 4, x: 50 },
    { label: 'Final Report',         level: 5, x: 50 },
  ]

  const agentLeafs = [
    'Memory Agent', 'Disk Agent', 'Log Agent',
    'Protocol SIFT Agent', 'Windows Artifact Agent',
    'Correlation Agent', 'Challenge Agent', 'Contradiction Agent', 'Verifier Agent',
  ]

  return (
    <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-5">
      <h3 className="text-xs font-semibold text-white tracking-wide uppercase mb-5 flex items-center gap-2">
        <Network className="w-4 h-4 text-zinc-400" />
        LangGraph Architecture
      </h3>
      <div className="flex gap-8 items-start">
        {/* Main pipeline column */}
        <div className="flex flex-col items-center gap-0 shrink-0">
          {nodes.map((n, i) => (
            <div key={n.label} className="flex flex-col items-center">
              <div
                className={cn(
                  'px-4 py-2 rounded border text-[11px] font-mono whitespace-nowrap transition-all arch-node-active',
                  i === 0
                    ? 'border-zinc-600 bg-zinc-800/60 text-zinc-300'
                    : i === 1
                    ? 'border-primary/40 bg-primary/10 text-primary font-bold'
                    : i === 5
                    ? 'border-green-500/40 bg-green-400/5 text-green-400 font-bold'
                    : 'border-zinc-700 bg-zinc-800/40 text-zinc-300'
                )}
              >
                {n.label}
              </div>
              {/* Arrow down to next, except last */}
              {i < nodes.length - 1 && (
                <svg width="2" height={i === 2 ? 12 : 20} viewBox={`0 0 2 ${i === 2 ? 12 : 20}`} className="my-0">
                  <line
                    x1="1" y1="0" x2="1" y2={i === 2 ? 12 : 20}
                    stroke={i === 0 ? 'oklch(0.72 0.18 200)' : i === 4 ? 'oklch(0.72 0.22 145)' : 'oklch(0.40 0.03 240)'}
                    strokeWidth="2"
                    strokeDasharray="3 3"
                  />
                </svg>
              )}
            </div>
          ))}
        </div>

        {/* Branch out from Multi-Agent Pipeline */}
        <div className="flex-1 pt-[144px]">
          <div className="border-l-2 border-zinc-700/60 pl-4 space-y-1.5">
            {agentLeafs.map((name, i) => {
              const isComplete = i <= 7
              const isRunning  = i === 8
              return (
                <div key={name} className="flex items-center gap-2">
                  <div
                    className={cn(
                      'w-1.5 h-1.5 rounded-full shrink-0',
                      isComplete ? 'bg-green-400' : isRunning ? 'bg-orange-400 animate-pulse' : 'bg-zinc-600'
                    )}
                  />
                  <span
                    className={cn(
                      'text-[11px] font-mono',
                      isComplete ? 'text-green-400' : isRunning ? 'text-orange-400' : 'text-zinc-500'
                    )}
                  >
                    {name}
                  </span>
                  {isComplete && (
                    <CheckCircle2 className="w-2.5 h-2.5 text-green-400/60 shrink-0" />
                  )}
                  {isRunning && (
                    <Loader2 className="w-2.5 h-2.5 text-orange-400 animate-spin shrink-0" />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="shrink-0 space-y-2 pt-4">
          <p className="text-[9px] text-zinc-600 uppercase tracking-widest mb-2 font-mono">Legend</p>
          {[
            { color: 'bg-green-400', label: 'Complete' },
            { color: 'bg-orange-400', label: 'Running' },
            { color: 'bg-zinc-600', label: 'Pending' },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-2">
              <span className={cn('w-2 h-2 rounded-full shrink-0', color)} />
              <span className="text-[10px] text-zinc-500 font-mono">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export function WorkflowPage() {
  return (
    <div className="space-y-6 pb-6" style={{ background: 'transparent' }}>
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Workflow Visualization</h1>
          <p className="text-sm text-zinc-500 mt-0.5 font-mono">Real-time LangGraph Investigation Pipeline</p>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="flex items-center gap-1.5 text-[10px] font-mono px-2.5 py-1 rounded border border-orange-400/30 bg-orange-400/10 text-orange-400">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
            ACTIVE CASE
          </span>
          <span className="flex items-center gap-1.5 text-[10px] font-mono px-2.5 py-1 rounded border border-green-500/30 bg-green-400/10 text-green-400">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            GRAPH RUNNING
          </span>
          <span className="flex items-center gap-1.5 text-[10px] font-mono px-2.5 py-1 rounded border border-zinc-700 bg-zinc-800/40 text-zinc-400">
            <CircleDot className="w-3 h-3" />
            12 AGENTS
          </span>
        </div>
      </div>

      {/* Main canvas: pipeline + stream */}
      <div className="grid grid-cols-[1fr_280px] gap-4" style={{ minHeight: 720 }}>
        {/* Graph canvas */}
        <div
          className="rounded-xl border border-zinc-800/60 bg-zinc-950/60 relative overflow-hidden"
          style={{
            backgroundImage: `
              linear-gradient(oklch(0.72 0.22 145 / 2%) 1px, transparent 1px),
              linear-gradient(90deg, oklch(0.72 0.22 145 / 2%) 1px, transparent 1px)
            `,
            backgroundSize: '28px 28px',
          }}
        >
          {/* Corner label */}
          <div className="absolute top-3 left-3 text-[9px] font-mono text-zinc-600 uppercase tracking-widest">
            LangGraph · Pipeline Canvas
          </div>

          {/* Scrollable node column */}
          <div className="flex justify-center pt-10 pb-6 overflow-y-auto h-full">
            <div className="flex flex-col items-center">
              {AGENT_NODES.map((node, i) => (
                <AgentCard key={node.id} node={node} isLast={i === AGENT_NODES.length - 1} />
              ))}
            </div>
          </div>
        </div>

        {/* Execution stream panel */}
        <div className="rounded-xl border border-zinc-800/60 bg-zinc-950/80 overflow-hidden flex flex-col">
          <ExecutionStream />
        </div>
      </div>

      {/* Workflow Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <MetricCard label="Total Findings"      value="342" sub="Across all agents"        color="oklch(0.72 0.18 200)" />
        <MetricCard label="Verified Findings"   value="318" sub="93% verification rate"    color="oklch(0.72 0.22 145)" />
        <MetricCard label="Confidence Score"    value="97%" sub="Weighted average"         color="oklch(0.70 0.18 55)"  />
        <MetricCard label="Investigation Progress" value="75%" sub="9 of 12 agents complete" color="oklch(0.65 0.22 25)"  />
      </div>

      {/* Verifier + Tool Selection */}
      <div className="grid grid-cols-[1fr_1fr] gap-4">
        <VerifierBlock />
        <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-5 flex flex-col">
          <ToolSelectionSection />
        </div>
      </div>

      {/* Architecture */}
      <ArchitecturePanel />
    </div>
  )
}
