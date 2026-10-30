import type { Workspace } from './types'

const STORAGE_KEY = 'candidatura.workspace'

export type WorkspaceSource = 'file' | 'browser'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function isWorkspace(value: unknown): value is Workspace {
  if (!isRecord(value)) return false
  if (!isRecord(value.cv)) return false
  if (typeof value.cv.name !== 'string' || typeof value.cv.figmaUrl !== 'string') return false
  if (typeof value.cv.note !== 'string') return false
  if (!Array.isArray(value.offers)) return false
  if (!isRecord(value.tracks)) return false
  if (!(typeof value.selectedId === 'string' || value.selectedId === null)) return false
  return true
}

function readStored(): Workspace | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const data: unknown = JSON.parse(raw)
    return isWorkspace(data) ? data : null
  } catch {
    return null
  }
}

function writeStored(workspace: Workspace) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(workspace))
}

async function loadSeed(signal?: AbortSignal): Promise<Workspace> {
  const url = new URL('../data/workspace.json', import.meta.url)
  const response = await fetch(url, { signal })
  if (!response.ok) {
    throw new Error('No se pudo leer el espacio de trabajo')
  }
  const data: unknown = await response.json()
  if (!isWorkspace(data)) {
    throw new Error('El archivo de trabajo no tiene la forma esperada')
  }
  return data
}

function aborted(signal: AbortSignal | undefined, err: unknown) {
  return signal?.aborted === true || (err instanceof DOMException && err.name === 'AbortError')
}

export async function loadWorkspace(
  signal?: AbortSignal,
): Promise<{ workspace: Workspace; source: WorkspaceSource }> {
  try {
    const response = await fetch('/api/workspace', {
      signal,
      headers: { Accept: 'application/json' },
    })
    if (!response.ok) throw new Error('http')
    const data: unknown = await response.json()
    if (!isWorkspace(data)) {
      throw new Error('El archivo de trabajo no tiene la forma esperada')
    }
    return { workspace: data, source: 'file' }
  } catch (err) {
    if (aborted(signal, err)) throw err
    if (err instanceof Error && err.message === 'El archivo de trabajo no tiene la forma esperada') {
      throw err
    }
    const stored = readStored()
    if (stored) return { workspace: stored, source: 'browser' }
    return { workspace: await loadSeed(signal), source: 'browser' }
  }
}

export async function saveWorkspace(
  workspace: Workspace,
  source: WorkspaceSource,
): Promise<WorkspaceSource> {
  if (source === 'browser') {
    writeStored(workspace)
    return 'browser'
  }
  try {
    const response = await fetch('/api/workspace', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(workspace),
    })
    if (!response.ok) throw new Error('http')
    return 'file'
  } catch {
    writeStored(workspace)
    return 'browser'
  }
}
