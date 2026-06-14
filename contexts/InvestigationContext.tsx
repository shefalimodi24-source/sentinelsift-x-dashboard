'use client'

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'

import {
  getInvestigationData,
  type InvestigationData,
} from '@/lib/api'

interface InvestigationContextType {
  data: InvestigationData | null
  loading: boolean
  error: boolean
  refreshInvestigation: () => Promise<void>
  updateInvestigation: (data: InvestigationData) => void
}

const InvestigationContext =
  createContext<InvestigationContextType | undefined>(
    undefined
  )

export function InvestigationProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [data, setData] =
    useState<InvestigationData | null>(null)

  const [loading, setLoading] =
    useState<boolean>(true)

  const [error, setError] =
    useState<boolean>(false)

  const refreshInvestigation = async () => {
    try {
      setLoading(true)
      setError(false)

      const res =
        await getInvestigationData()

      if (res) {
        setData(res)
      }
    } catch (err) {
      console.error(
        'Failed to fetch investigation data:',
        err
      )
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshInvestigation()
  }, [])

  return (
    <InvestigationContext.Provider
      value={{
        data,
        loading,
        error,
        refreshInvestigation,
        updateInvestigation: setData,
      }}
    >
      {children}
    </InvestigationContext.Provider>
  )
}

export function useInvestigation() {
  const context =
    useContext(InvestigationContext)

  if (context === undefined) {
    throw new Error(
      'useInvestigation must be used within an InvestigationProvider'
    )
  }

  return context
}
