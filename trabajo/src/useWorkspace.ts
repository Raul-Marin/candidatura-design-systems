import { useCallback, useEffect, useRef, useState } from 'react'
import { loadWorkspace, saveWorkspace, type WorkspaceSource } from './api'
import type { Workspace } from './types'

export type SaveState = 'idle' | 'saving' | 'saved' | 'error'

export function useWorkspace() {
  const [workspace, setWorkspace] = useState<Workspace | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saveState, setSaveState] = useState<SaveState>('idle')
  const [loadId, setLoadId] = useState(0)
  const [source, setSource] = useState<WorkspaceSource>('file')
  const lastSaved = useRef<string | null>(null)
  const current = useRef<Workspace | null>(null)
  const sourceRef = useRef<WorkspaceSource>('file')
  const chain = useRef(Promise.resolve())

  useEffect(() => {
    current.current = workspace
  }, [workspace])

  useEffect(() => {
    const ac = new AbortController()
    setLoading(true)
    loadWorkspace(ac.signal)
      .then(({ workspace: data, source: next }) => {
        lastSaved.current = JSON.stringify(data)
        sourceRef.current = next
        setSource(next)
        setWorkspace(data)
        setError(null)
      })
      .catch((err: unknown) => {
        if (ac.signal.aborted) return
        const message = err instanceof Error ? err.message : 'No se pudo cargar el espacio de trabajo'
        setError(message)
      })
      .finally(() => {
        if (!ac.signal.aborted) setLoading(false)
      })
    return () => ac.abort()
  }, [loadId])

  useEffect(() => {
    if (!workspace) return
    const text = JSON.stringify(workspace)
    if (text === lastSaved.current) return

    setSaveState('saving')
    const timer = window.setTimeout(() => {
      const snapshot = workspace
      chain.current = chain.current
        .catch(() => undefined)
        .then(() => saveWorkspace(snapshot, sourceRef.current))
        .then((next) => {
          if (JSON.stringify(current.current) !== text) return
          sourceRef.current = next
          setSource(next)
          lastSaved.current = text
          setSaveState('saved')
          setError(null)
        })
        .catch(() => {
          if (JSON.stringify(current.current) !== text) return
          setSaveState('error')
          setError('No se ha podido guardar.')
        })
    }, 400)

    return () => window.clearTimeout(timer)
  }, [workspace])

  const update = useCallback((next: Workspace) => {
    setWorkspace(next)
  }, [])

  const reload = useCallback(() => {
    setLoadId((n) => n + 1)
  }, [])

  return { workspace, loading, error, saveState, inBrowser: source === 'browser', update, reload }
}
