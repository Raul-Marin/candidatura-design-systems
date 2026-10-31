import type { RefObject } from 'react'
import type { SaveState } from '../useWorkspace'
import { PrimaryButton } from './ui'

const saveLabels: Record<SaveState, string> = {
  idle: 'En disco',
  saving: 'Guardando',
  saved: 'Guardado',
  error: 'Sin guardar',
}

function saveLabel(state: SaveState, inBrowser: boolean) {
  if (inBrowser && state === 'idle') return 'En el navegador'
  return saveLabels[state]
}

export function TopBar({
  saveState,
  inBrowser,
  onSearch,
  searchRef,
}: {
  saveState: SaveState
  inBrowser: boolean
  onSearch: () => void
  searchRef: RefObject<HTMLButtonElement | null>
}) {
  const label = saveLabel(saveState, inBrowser)
  const saveClass = saveState === 'error' ? 'font-medium text-ink' : 'text-muted'

  return (
    <header className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-b border-line bg-paper px-4 py-4 lg:px-8">
      <div className="min-w-0">
        <h1 className="text-base font-medium tracking-tight">Candidatura</h1>
        <p aria-live="polite" className={`mt-1 font-mono text-[11px] ${saveClass}`}>
          {label}
        </p>
        {inBrowser && (
          <p className="mt-2 max-w-sm text-xs leading-relaxed text-muted">
            En el sitio publicado los datos se quedan en este navegador.
          </p>
        )}
      </div>
      <div className="flex w-full flex-wrap items-center gap-x-6 gap-y-3 sm:w-auto">
        <a
          href={`${import.meta.env.BASE_URL}candidatura-agente-skills.zip`}
          download
          className="text-xs text-ink underline underline-offset-4 hover:no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          Descargar agente y skills
        </a>
        <PrimaryButton ref={searchRef} className="w-full sm:w-auto" onClick={onSearch}>
          Buscar ofertas
        </PrimaryButton>
      </div>
    </header>
  )
}
