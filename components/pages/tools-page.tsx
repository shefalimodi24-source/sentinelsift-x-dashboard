'use client'

import { cn } from '@/lib/utils'
import { CheckCircle2, Clock, Terminal, Wrench } from 'lucide-react'
import { useState } from 'react'
import { useInvestigation } from '@/contexts/InvestigationContext'

const statusConfig = {
  success: 'text-green-400 bg-green-400/10 border-green-400/25',
  running: 'text-primary bg-primary/10 border-primary/25',
  pending: 'text-muted-foreground bg-muted/20 border-border',
}

const categoryColors: Record<string, string> = {
  'Log Analysis': 'text-blue-400 bg-blue-400/10 border-blue-400/25',
  Registry: 'text-purple-400 bg-purple-400/10 border-purple-400/25',
  Execution: 'text-orange-400 bg-orange-400/10 border-orange-400/25',
  Memory: 'text-primary bg-primary/10 border-primary/25',
  Timeline: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/25',
}

export function ToolsPage() {
  const { data } = useInvestigation()
  const [selected, setSelected] = useState<number | null>(null)

  if (!data) return null

  const getToolMetadata = (name: string) => {
    switch (name) {
      case 'EvtxECmd':
        return {
          purpose: 'Windows Event Log Parser',
          description: 'Parses .evtx files and extracts structured event log data with IOC enrichment.',
          executionTime: '4.2s',
          category: 'Log Analysis',
        }
      case 'PECmd':
        return {
          purpose: 'Prefetch File Analyzer',
          description: 'Parses Windows Prefetch files to recover execution timestamps and loaded DLLs.',
          executionTime: '0.9s',
          category: 'Execution',
        }
      case 'AmcacheParser':
        return {
          purpose: 'Amcache Registry Parser',
          description: 'Extracts execution artifacts from Amcache.hve including file hashes and first-run times.',
          executionTime: '1.8s',
          category: 'Registry',
        }
      case 'AppCompatCacheParser':
        return {
          purpose: 'ShimCache Parser',
          description: 'Parses application compatibility cache (ShimCache) from SYSTEM registry hive.',
          executionTime: '2.1s',
          category: 'Registry',
        }
      default:
        return {
          purpose: 'Forensic Artifact Parser',
          description: 'Parses system files to recover forensic evidence.',
          executionTime: '1.5s',
          category: 'Registry',
        }
    }
  }

  // Get dynamic tools from data.tools
  const toolsList = data.tools.map((name) => {
    const meta = getToolMetadata(name)
    let evidenceGenerated = 1
    if (name === 'EvtxECmd') evidenceGenerated = 67
    else if (name === 'PECmd') evidenceGenerated = 18
    else if (name === 'AmcacheParser') evidenceGenerated = 23
    else if (name === 'AppCompatCacheParser') evidenceGenerated = 31

    return {
      name,
      status: 'success',
      evidenceGenerated,
      ...meta,
    }
  })

  // Build terminal execution logs based on data.evidence
  const terminalLogs = data.evidence.map((ev, idx) => {
    const cleanEv = ev.replace(/"/g, '')
    const toolName = cleanEv.includes(' executed') ? cleanEv.split(' ')[0] : cleanEv

    let detail = 'evidence record collected'
    if (toolName === 'EvtxECmd') detail = '67 events processed'
    else if (toolName === 'PECmd') detail = '18 prefetch records parsed'
    else if (toolName === 'AmcacheParser') detail = '23 entries extracted'
    else if (toolName === 'AppCompatCacheParser') detail = '31 cache entries parsed'

    return {
      time: `09:20:${10 + idx * 15}`,
      status: 'success',
      msg: `${toolName} executed successfully — ${detail}`,
    }
  })

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Forensic Tools</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Tool Selection &amp; Execution Engine — {toolsList.filter((t) => t.status === 'success').length} of {toolsList.length} tools completed
        </p>
      </div>

      <div className="grid grid-cols-5 gap-4 h-[calc(100vh-210px)]">
        {/* Tool Cards */}
        <div className="col-span-3 grid grid-cols-2 gap-3 content-start overflow-y-auto pr-1">
          {toolsList.map((tool, idx) => (
            <button
              key={tool.name}
              onClick={() => setSelected(selected === idx ? null : idx)}
              className={cn(
                'glass rounded-xl border p-3 text-left transition-all duration-200 hover:border-primary/30',
                selected === idx ? 'border-primary/40 bg-card' : 'border-panel-border'
              )}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="p-1.5 rounded bg-primary/10 border border-primary/20">
                  <Wrench className="w-3.5 h-3.5 text-primary" />
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={cn('text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase', statusConfig[tool.status as keyof typeof statusConfig])}>
                    {tool.status}
                  </span>
                  <span className={cn('text-[9px] font-mono px-1 py-0.5 rounded border', categoryColors[tool.category])}>
                    {tool.category}
                  </span>
                </div>
              </div>
              <p className="text-sm font-bold text-foreground">{tool.name}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{tool.purpose}</p>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-border">
                <span className="text-[10px] text-muted-foreground">
                  Evidence: <span className="font-mono text-primary font-bold">{tool.evidenceGenerated}</span>
                </span>
                <span className="text-[10px] font-mono text-muted-foreground flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5" />
                  {tool.executionTime}
                </span>
              </div>
              {selected === idx && (
                <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed border-t border-border pt-2">
                  {tool.description}
                </p>
              )}
            </button>
          ))}
        </div>

        {/* Terminal Execution Feed */}
        <div className="col-span-2 glass rounded-xl border border-panel-border flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center gap-2">
            <Terminal className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">Execution Feed</h2>
            <span className="relative flex h-2 w-2 ml-auto">
              <span className="pulse-cyan absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
          </div>
          <div className="flex-1 overflow-y-auto p-3 bg-background/50">
            <div className="terminal-text space-y-1">
              {terminalLogs.map((log, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-muted-foreground shrink-0">{log.time}</span>
                  <span
                    className={cn('shrink-0 font-bold', {
                      'text-green-400': log.status === 'success',
                      'text-primary': log.status === 'running',
                      'text-blue-400': log.status === 'info',
                    })}
                  >
                    {log.status === 'success' ? '[✓]' : log.status === 'running' ? '[~]' : '[i]'}
                  </span>
                  <span className="text-muted-foreground leading-relaxed">{log.msg}</span>
                </div>
              ))}
              {/* Blinking cursor */}
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">09:21:00</span>
                <span className="text-green-400">[✓]</span>
                <span className="text-green-400">All tools executed successfully</span>
              </div>
            </div>
          </div>
          <div className="px-4 py-2.5 border-t border-border">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
              <span className="text-xs text-muted-foreground">
                <span className="text-green-400 font-mono font-bold">{toolsList.length}</span> completed ·{' '}
                <span className="text-primary font-mono font-bold">0</span> running ·{' '}
                <span className="text-muted-foreground font-mono">0</span> pending
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

