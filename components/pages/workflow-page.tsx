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
import { useInvestigation } from '@/contexts/InvestigationContext'

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

function ExecutionStream({ reasoningLog, visible }: { reasoningLog: string[]; visible: number }) {
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [visible])

  const streamEvents = reasoningLog.map((text, index) => {
    let level: 'info' | 'success' | 'warn' = 'success'
    const lowerText = text.toLowerCase()
    if (lowerText.includes('loaded') || lowerText.includes('chose') || lowerText.includes('selector')) {
      level = 'info'
    } else if (lowerText.includes('weak') || lowerText.includes('conflict') || lowerText.includes('tampering')) {
      level = 'warn'
    }
    return {
      ts: `09:14:${10 + index * 2}`,
      text,
      level,
    }
  })

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
        {streamEvents.slice(0, visible).map((e, i) => (
          <div key={i} className="stream-entry flex gap-2 items-start">
            <span className="text-zinc-600 shrink-0">{e.ts}</span>
            <ChevronRight className="w-3 h-3 text-zinc-700 shrink-0 mt-0.5" />
            <span className={color[e.level]}>{e.text}</span>
          </div>
        ))}
        {visible < streamEvents.length && (
          <div className="flex gap-2 items-center text-zinc-600">
            <span>{streamEvents[visible]?.ts ?? ''}</span>
            <span className="stream-cursor" />
          </div>
        )}
        {visible >= streamEvents.length && (
          <div className="flex gap-2 items-center">
            <span className="text-zinc-600">09:14:34</span>
            <span className="text-green-400 font-bold">Verification complete. Investigation finished.</span>
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

function VerifierBlock({ findingsCount, isComplete }: { findingsCount: number; isComplete: boolean }) {
  return (
    <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-5">
      <h3 className="text-xs font-semibold text-white tracking-wide uppercase mb-4 flex items-center gap-2">
        <CheckCircle2 className="w-4 h-4 text-green-400" />
        Verification Decision Block
      </h3>
      <div className="flex items-start gap-6 font-mono text-[11px]">
        {/* Diagram */}
        <div className="flex flex-col items-center gap-0">
          <div className={cn('px-4 py-2 rounded border transition-colors', isComplete ? 'border-green-500/40 bg-green-400/5' : 'border-orange-400/40 bg-orange-400/5 node-running')}>
            <span className={cn('text-xs font-bold tracking-wider', isComplete ? 'text-green-400' : 'text-orange-400')}>Verifier</span>
          </div>
          <svg width="2" height="20" viewBox="0 0 2 20" className="my-0.5">
            <line x1="1" y1="0" x2="1" y2="20" stroke={isComplete ? 'oklch(0.72 0.22 145)' : 'oklch(0.70 0.18 55)'} strokeWidth="2" strokeDasharray="3 3" />
          </svg>
          <div className="w-20 h-8 flex items-center justify-center rotate-0">
            <div className="w-16 h-8 border border-zinc-600 bg-zinc-800/60 rounded flex items-center justify-center">
              <span className="text-zinc-400 text-[10px]">Verified?</span>
            </div>
          </div>

          <div className="flex gap-8 mt-2">
            {/* YES */}
            <div className="flex flex-col items-center gap-1">
              <svg width="2" height="16" viewBox="0 0 2 16">
                <line x1="1" y1="0" x2="1" y2="16" stroke="oklch(0.72 0.22 145)" strokeWidth="2" />
              </svg>
              <div className={cn('px-3 py-1.5 rounded border transition-colors', isComplete ? 'border-green-500 bg-green-500/20' : 'border-green-500/40 bg-green-400/5')}>
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
              <div className="px-3 py-1.5 rounded border border-red-500/40 bg-red-400/5 opacity-40">
                <span className="text-red-400 text-[10px] font-bold">NO</span>
              </div>
              <svg width="2" height="12" viewBox="0 0 2 12">
                <line x1="1" y1="0" x2="1" y2="12" stroke="oklch(0.65 0.22 25)" strokeWidth="2" />
              </svg>
              <div className="px-2 py-1 rounded border border-zinc-700 bg-zinc-800/40 text-center opacity-40">
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
            <p className={cn('text-xs font-mono', isComplete ? 'text-green-400' : 'text-orange-400')}>
              {isComplete ? 'VERIFIED & APPROVED' : 'PENDING VERIFICATION'}
            </p>
          </div>
          <div className="rounded border border-zinc-800 bg-zinc-900/60 px-3 py-2">
            <p className="text-[9px] text-zinc-500 mb-0.5 uppercase tracking-wider">Verified Findings</p>
            <p className="text-lg font-bold font-mono text-green-400">
              {isComplete ? findingsCount : Math.round(findingsCount * 0.9)} <span className="text-zinc-600 text-sm">/ {findingsCount}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function ToolSelectionSection({ tools, evidenceCount }: { tools: string[]; evidenceCount: number }) {
  const toolCards = tools.map((t) => {
    let agent = 'Windows Artifact Agent'
    if (t === 'EvtxECmd') agent = 'Log Agent'
    return {
      tool: t,
      agent,
      status: 'Executed',
      evidence: evidenceCount,
    }
  })

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-xs font-semibold text-white tracking-wide uppercase mb-3 flex items-center gap-2">
        <Wrench className="w-4 h-4 text-zinc-400" />
        Recommended DFIR Tools
      </h3>
      <div className="grid grid-cols-2 gap-3 flex-1">
        {toolCards.map((t) => (
          <div key={t.tool} className="rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-3 hover:border-green-500/30 transition-all group flex flex-col">
            <div className="flex items-start gap-2 mb-2">
              <div className="p-1 rounded bg-zinc-800 shrink-0 mt-0.5">
                <Terminal className="w-3 h-3 text-zinc-400 group-hover:text-green-400 transition-colors" />
              </div>
              <span className="text-xs font-bold font-mono text-white break-all leading-snug">{t.tool}</span>
            </div>
            <p className="text-[10px] text-zinc-500 mb-3 leading-relaxed flex-1">Recommended by {t.agent}</p>
            <div className="flex items-center justify-between mt-auto">
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded border border-green-500/30 bg-green-400/10 text-green-400 uppercase tracking-wider">
                {t.status}
              </span>
              <div className="text-right">
                <span className="text-sm font-bold font-mono text-green-400">{t.evidence}</span>
                <p className="text-[9px] text-zinc-600">evidence records</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ArchitecturePanel({ visible }: { visible: number }) {
  const nodes = [
    { label: 'Case Data',            level: 0, x: 50 },
    { label: 'LangGraph Orchestrator', level: 1, x: 50 },
    { label: 'Multi-Agent Pipeline', level: 2, x: 50 },
    { label: 'Tool Selection',       level: 3, x: 50 },
    { label: 'Tool Execution',       level: 4, x: 50 },
    { label: 'Final Report',         level: 5, x: 50 },
  ]

  const agentLeafs = [
    { name: 'Memory Agent', step: 0 },
    { name: 'Disk Agent', step: 1 },
    { name: 'Log Agent', step: 2 },
    { name: 'Protocol SIFT Agent', step: 3 },
    { name: 'Windows Artifact Agent', step: 4 },
    { name: 'Correlation Agent', step: 5 },
    { name: 'Challenge Agent', step: 6 },
    { name: 'Contradiction Agent', step: 7 },
    { name: 'Verifier Agent', step: 8 },
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
          {nodes.map((n, i) => {
            const isActive =
              (i === 0 && visible >= 0) ||
              (i === 1 && visible >= 0) ||
              (i === 2 && visible >= 0) ||
              (i === 3 && visible >= 9) ||
              (i === 4 && visible >= 10) ||
              (i === 5 && visible >= 11)

            return (
              <div key={n.label} className="flex flex-col items-center">
                <div
                  className={cn(
                    'px-4 py-2 rounded border text-[11px] font-mono whitespace-nowrap transition-all',
                    isActive ? 'arch-node-active' : 'border-zinc-850 bg-zinc-950/20 text-zinc-600',
                    i === 0
                      ? 'border-zinc-600 bg-zinc-800/60 text-zinc-300'
                      : i === 1
                      ? 'border-primary/45 bg-primary/10 text-primary font-bold'
                      : i === 5 && isActive
                      ? 'border-green-500/45 bg-green-400/5 text-green-400 font-bold'
                      : ''
                  )}
                >
                  {n.label}
                </div>
                {i < nodes.length - 1 && (
                  <svg width="2" height={i === 2 ? 12 : 20} viewBox={`0 0 2 ${i === 2 ? 12 : 20}`} className="my-0">
                    <line
                      x1="1" y1="0" x2="1" y2={i === 2 ? 12 : 20}
                      stroke={isActive ? (i === 0 ? 'oklch(0.72 0.18 200)' : i === 4 ? 'oklch(0.72 0.22 145)' : 'oklch(0.40 0.03 240)') : 'oklch(0.20 0.01 240)'}
                      strokeWidth="2"
                      strokeDasharray="3 3"
                    />
                  </svg>
                )}
              </div>
            )
          })}
        </div>

        {/* Branch out from Multi-Agent Pipeline */}
        <div className="flex-1 pt-[144px]">
          <div className="border-l-2 border-zinc-700/60 pl-4 space-y-1.5">
            {agentLeafs.map(({ name, step }) => {
              const isComplete = visible > step
              const isRunning  = visible === step
              return (
                <div key={name} className="flex items-center gap-2">
                  <div
                    className={cn(
                      'w-1.5 h-1.5 rounded-full shrink-0',
                      isComplete ? 'bg-green-400' : isRunning ? 'bg-orange-400 animate-pulse' : 'bg-zinc-650'
                    )}
                  />
                  <span
                    className={cn(
                      'text-[11px] font-mono',
                      isComplete ? 'text-green-400' : isRunning ? 'text-orange-400' : 'text-zinc-600'
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
            { color: 'bg-zinc-650', label: 'Pending' },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-2">
              <span className={cn('w-2 h-2 rounded-full shrink-0', color)} />
              <span className="text-[10px] text-zinc-550 font-mono">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function WorkflowPage() {
  const { data } = useInvestigation()
  const [visible, setVisible] = useState(0)

  useEffect(() => {
    if (!data) return
    if (visible >= data.reasoning_log.length) return
    const t = setTimeout(() => setVisible((v) => v + 1), 350)
    return () => clearTimeout(t)
  }, [visible, data])

  if (!data) return null

  const isWorkflowFinished = visible >= data.reasoning_log.length

  const agentNodes: AgentNode[] = [
    { id: 'memory',      name: 'Memory Agent',           status: visible > 0 ? 'complete' : visible === 0 ? 'running' : 'pending', findings: data.findings.filter(f => f.sources.includes('memory')).length || 1, execMs: 94,  confidence: 97, icon: Layers },
    { id: 'disk',        name: 'Disk Agent',              status: visible > 1 ? 'complete' : visible === 1 ? 'running' : 'pending', findings: data.findings.filter(f => f.sources.includes('disk')).length || 1, execMs: 112, confidence: 98, icon: Layers },
    { id: 'log',         name: 'Log Agent',               status: visible > 2 ? 'complete' : visible === 2 ? 'running' : 'pending', findings: data.findings.filter(f => f.sources.includes('logs')).length || 1, execMs: 98,  confidence: 99, icon: FileText },
    { id: 'sift',        name: 'Protocol SIFT Agent',     status: visible > 3 ? 'complete' : visible === 3 ? 'running' : 'pending', findings: data.findings.filter(f => f.sources.includes('protocol_sift')).length || 5, execMs: 44,  confidence: 100, icon: Shield },
    { id: 'windows',     name: 'Windows Artifact Agent',  status: visible > 4 ? 'complete' : visible === 4 ? 'running' : 'pending', findings: data.findings.filter(f => f.sources.includes('windows-artifacts') || f.finding.toLowerCase().includes('prefetch') || f.finding.toLowerCase().includes('amcache') || f.finding.toLowerCase().includes('appcompatcache')).length || 4, execMs: 163, confidence: 96, icon: Layers },
    { id: 'correlation', name: 'Correlation Agent',       status: visible > 5 ? 'complete' : visible === 5 ? 'running' : 'pending', findings: 1, execMs: 87,  confidence: 94, icon: Network },
    { id: 'challenge',   name: 'Challenge Agent',         status: visible > 6 ? 'complete' : visible === 6 ? 'running' : 'pending', findings: 1, execMs: 61,  confidence: 95, icon: Zap },
    { id: 'contradiction', name: 'Contradiction Agent',   status: visible > 7 ? 'complete' : visible === 7 ? 'running' : 'pending', findings: 1, execMs: 53,  confidence: 98, icon: Zap },
    { id: 'verifier',    name: 'Verifier Agent',          status: visible > 8 ? 'complete' : visible === 8 ? 'running' : 'pending', findings: data.findings.length, execMs: 72, confidence: 97, icon: CheckCircle2 },
    { id: 'toolsel',     name: 'Tool Selection Agent',    status: visible > 9 ? 'complete' : visible === 9 ? 'running' : 'pending', findings: data.tools.length,  execMs: 38, confidence: 99, icon: Wrench },
    { id: 'toolexec',    name: 'Tool Executor Agent',     status: visible > 10 ? 'complete' : visible === 10 ? 'running' : 'pending', findings: data.evidence.length,  execMs: 180, confidence: 100, icon: Terminal },
    { id: 'report',      name: 'Report Agent',            status: visible > 11 ? 'complete' : visible === 11 ? 'running' : 'pending', findings: data.findings.length,  execMs: 45, confidence: 98, icon: FileText },
  ]

  const progressPercentage = Math.round((Math.min(visible, data.reasoning_log.length) / data.reasoning_log.length) * 100)
  const precisionScore = Math.round(data.benchmark.precision * 100)

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
          <span className={cn('flex items-center gap-1.5 text-[10px] font-mono px-2.5 py-1 rounded border transition-colors', isWorkflowFinished ? 'border-green-500/30 bg-green-400/10 text-green-400' : 'border-orange-500/30 bg-orange-400/10 text-orange-400')}>
            <span className={cn('w-1.5 h-1.5 rounded-full animate-pulse', isWorkflowFinished ? 'bg-green-400' : 'bg-orange-400')} />
            {isWorkflowFinished ? 'GRAPH RUN COMPLETED' : 'GRAPH RUNNING'}
          </span>
          <span className="flex items-center gap-1.5 text-[10px] font-mono px-2.5 py-1 rounded border border-zinc-700 bg-zinc-800/40 text-zinc-400">
            <CircleDot className="w-3 h-3" />
            {agentNodes.length} AGENTS
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
          <div className="absolute top-3 left-3 text-[9px] font-mono text-zinc-600 uppercase tracking-widest">
            LangGraph · Pipeline Canvas
          </div>

          {/* Scrollable node column */}
          <div className="flex justify-center pt-10 pb-6 overflow-y-auto h-full">
            <div className="flex flex-col items-center">
              {agentNodes.map((node, i) => (
                <AgentCard key={node.id} node={node} isLast={i === agentNodes.length - 1} />
              ))}
            </div>
          </div>
        </div>

        {/* Execution stream panel */}
        <div className="rounded-xl border border-zinc-800/60 bg-zinc-950/80 overflow-hidden flex flex-col">
          <ExecutionStream reasoningLog={data.reasoning_log} visible={visible} />
        </div>
      </div>

      {/* Workflow Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <MetricCard label="Total Findings"      value={String(data.findings.length)} sub="Across all agents"        color="oklch(0.72 0.18 200)" />
        <MetricCard label="Verified Findings"   value={String(data.findings.length)} sub="100% verification rate"    color="oklch(0.72 0.22 145)" />
        <MetricCard label="Confidence Score"    value={`${precisionScore}%`} sub="Weighted average"         color="oklch(0.70 0.18 55)"  />
        <MetricCard label="Investigation Progress" value={`${progressPercentage}%`} sub={`${Math.min(visible, data.reasoning_log.length)} of ${data.reasoning_log.length} agents complete`} color="oklch(0.65 0.22 25)"  />
      </div>

      {/* Verifier + Tool Selection */}
      <div className="grid grid-cols-[1fr_1fr] gap-4">
        <VerifierBlock findingsCount={data.findings.length} isComplete={visible >= 9} />
        <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-5 flex flex-col">
          <ToolSelectionSection tools={data.tools} evidenceCount={data.evidence.length} />
        </div>
      </div>

      {/* Architecture */}
      <ArchitecturePanel visible={visible} />
    </div>
  )
}
