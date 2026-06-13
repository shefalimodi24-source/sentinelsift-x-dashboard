'use client'

import { cn } from '@/lib/utils'
import { Bell, Key, Monitor, Save, Shield, User } from 'lucide-react'
import { useState } from 'react'

const settingsSections = [
  {
    id: 'profile',
    label: 'Analyst Profile',
    icon: User,
    fields: [
      { label: 'Name', value: 'Analyst — SOC Tier 2', type: 'text' },
      { label: 'Organization', value: 'SentinelSIFT-X Enterprise', type: 'text' },
      { label: 'Role', value: 'DFIR Investigator', type: 'text' },
    ],
  },
  {
    id: 'platform',
    label: 'Platform Settings',
    icon: Monitor,
    toggles: [
      { label: 'Auto-launch investigation on artifact upload', enabled: true },
      { label: 'Enable AI agent auto-retry on failure', enabled: true },
      { label: 'Parallel agent execution', enabled: true },
      { label: 'Real-time evidence streaming', enabled: true },
      { label: 'Verbose agent logging', enabled: false },
    ],
  },
  {
    id: 'security',
    label: 'Security & Auth',
    icon: Key,
    toggles: [
      { label: 'Two-factor authentication', enabled: true },
      { label: 'Session timeout (30 min)', enabled: true },
      { label: 'Audit trail logging', enabled: true },
    ],
  },
  {
    id: 'alerts',
    label: 'Alert Settings',
    icon: Bell,
    toggles: [
      { label: 'Critical findings — immediate alert', enabled: true },
      { label: 'Agent failure notifications', enabled: true },
      { label: 'Investigation completion notification', enabled: false },
      { label: 'Daily summary digest', enabled: false },
    ],
  },
]

function ToggleSwitch({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
  return (
    <button
      role="switch"
      aria-checked={enabled}
      onClick={onChange}
      className={cn(
        'relative inline-flex h-5 w-9 rounded-full transition-colors duration-200',
        enabled ? 'bg-primary' : 'bg-muted'
      )}
    >
      <span
        className={cn(
          'absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white transition-transform duration-200 shadow-sm',
          enabled ? 'translate-x-4' : 'translate-x-0'
        )}
      />
    </button>
  )
}

export function SettingsPage() {
  const [toggleStates, setToggleStates] = useState<Record<string, boolean>>({})

  const getToggle = (sectionId: string, label: string, defaultValue: boolean) => {
    const key = `${sectionId}-${label}`
    return key in toggleStates ? toggleStates[key] : defaultValue
  }

  const setToggle = (sectionId: string, label: string) => {
    const key = `${sectionId}-${label}`
    setToggleStates((prev) => ({ ...prev, [key]: !getToggle(sectionId, label, false) }))
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Platform configuration and analyst preferences
        </p>
      </div>

      {/* Platform version badge */}
      <div className="flex items-center gap-3 glass rounded-xl border border-primary/20 p-3">
        <Shield className="w-5 h-5 text-primary" />
        <div>
          <p className="text-sm font-semibold text-foreground">SentinelSIFT-X Platform</p>
          <p className="text-xs text-muted-foreground">Version 2.4.1 · Build 20240613 · Enterprise License</p>
        </div>
        <div className="ml-auto text-xs font-mono text-green-400 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          All systems operational
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {settingsSections.map((section) => (
          <div key={section.id} className="glass rounded-xl border border-panel-border p-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3 pb-2 border-b border-border">
              <section.icon className="w-4 h-4 text-primary" />
              {section.label}
            </h3>

            {'fields' in section && section.fields && (
              <div className="space-y-3">
                {section.fields.map((field) => (
                  <div key={field.label}>
                    <label className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">{field.label}</label>
                    <input
                      type={field.type}
                      defaultValue={field.value}
                      className="mt-1 w-full bg-muted/30 border border-border rounded-md px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/40"
                    />
                  </div>
                ))}
                <button className="flex items-center gap-1.5 text-xs text-primary font-medium hover:text-primary/80 transition-colors mt-2">
                  <Save className="w-3.5 h-3.5" />
                  Save Changes
                </button>
              </div>
            )}

            {'toggles' in section && section.toggles && (
              <div className="space-y-3">
                {section.toggles.map((toggle) => {
                  const isEnabled = getToggle(section.id, toggle.label, toggle.enabled)
                  return (
                    <div key={toggle.label} className="flex items-center justify-between gap-3">
                      <span className="text-xs text-muted-foreground">{toggle.label}</span>
                      <ToggleSwitch
                        enabled={isEnabled}
                        onChange={() => setToggle(section.id, toggle.label)}
                      />
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
