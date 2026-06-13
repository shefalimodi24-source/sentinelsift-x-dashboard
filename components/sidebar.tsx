'use client'

import { cn } from '@/lib/utils'
import {
  Activity,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  FileSearch,
  Folders,
  Gauge,
  LayoutDashboard,
  Settings,
  Shield,
  Wrench,
} from 'lucide-react'

interface SidebarProps {
  activeSection: string
  onNavigate: (section: string) => void
  collapsed: boolean
  onToggle: () => void
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'investigations', label: 'Investigations', icon: FileSearch },
  { id: 'findings', label: 'Findings', icon: Shield },
  { id: 'tools', label: 'Forensic Tools', icon: Wrench },
  { id: 'benchmarking', label: 'Benchmarking', icon: BarChart3 },
  { id: 'agents', label: 'Agent Performance', icon: Activity },
  { id: 'report', label: 'Investigation Report', icon: Folders },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export function Sidebar({ activeSection, onNavigate, collapsed, onToggle }: SidebarProps) {
  return (
    <aside
      className={cn(
        'relative flex flex-col h-full bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out shrink-0',
        collapsed ? 'w-16' : 'w-56'
      )}
    >
      {/* Branding */}
      <div className="flex items-center gap-3 px-3 py-4 border-b border-sidebar-border min-h-[64px]">
        <div className="flex items-center justify-center w-9 h-9 shrink-0 rounded-lg bg-primary/10 border border-primary/30 glow-border">
          <Gauge className="w-5 h-5 text-primary" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="text-xs font-bold tracking-widest text-primary glow-text leading-tight">
              SENTINELSIFT-X
            </p>
            <p className="text-[9px] text-muted-foreground leading-tight mt-0.5 tracking-wide">
              AI-Powered DFIR Investigator
            </p>
          </div>
        )}
      </div>

      {/* Live status bar */}
      {!collapsed && (
        <div className="flex items-center gap-2 mx-3 my-2 px-2 py-1.5 rounded bg-primary/5 border border-primary/15">
          <span className="relative flex h-2 w-2">
            <span className="pulse-cyan absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
          <span className="text-[10px] font-mono text-primary tracking-wider">LIVE INVESTIGATION</span>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className={cn(
              'w-full flex items-center gap-3 px-2 py-2 rounded-md text-sm transition-all duration-150 group',
              activeSection === id
                ? 'bg-primary/10 text-primary border border-primary/25 glow-border'
                : 'text-sidebar-foreground hover:bg-accent hover:text-accent-foreground border border-transparent'
            )}
          >
            <Icon
              className={cn(
                'w-4 h-4 shrink-0 transition-colors',
                activeSection === id ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'
              )}
            />
            {!collapsed && (
              <span className="truncate font-medium tracking-wide text-xs">{label}</span>
            )}
            {!collapsed && activeSection === id && (
              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            )}
          </button>
        ))}
      </nav>

      {/* Version tag */}
      {!collapsed && (
        <div className="px-3 py-3 border-t border-sidebar-border">
          <p className="text-[9px] font-mono text-muted-foreground tracking-wider">
            v2.4.1 · BUILD 20240613
          </p>
        </div>
      )}

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-[72px] w-6 h-6 rounded-full bg-sidebar border border-sidebar-border flex items-center justify-center hover:border-primary/50 hover:text-primary transition-colors z-10 text-muted-foreground"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>
    </aside>
  )
}
