import { FileText, ListBullets, Path, type Icon } from '@phosphor-icons/react'
import type { SaveState } from '../useWorkspace'
import type { Offer, Step } from '../types'

const steps: { id: Step; num: string; label: string; icon: Icon }[] = [
  { id: 'ofertas', num: '01', label: 'Ofertas', icon: ListBullets },
  { id: 'cv', num: '02', label: 'CV', icon: FileText },
  { id: 'seguimiento', num: '03', label: 'Seguimiento', icon: Path },
]

const saveLabels: Record<SaveState, string> = {
  idle: 'En disco',
  saving: 'Guardando',
  saved: 'Guardado',
  error: 'Sin guardar',
}

const press =
  'cursor-pointer transition-transform duration-150 ease-out active:scale-[0.98]'

function saveLabel(state: SaveState, inBrowser: boolean) {
  if (inBrowser && state === 'idle') return 'En el navegador'
  return saveLabels[state]
}

export function Rail({
  step,
  onStep,
  selected,
  saveState,
  inBrowser = false,
}: {
  step: Step
  onStep: (step: Step) => void
  selected: Offer | null
  saveState: SaveState
  inBrowser?: boolean
}) {
  const saveClass = saveState === 'error' ? 'font-medium text-ink' : 'text-muted'
  const label = saveLabel(saveState, inBrowser)

  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-line lg:w-56 lg:border-b-0 lg:border-r lg:px-4 lg:py-6">
      <div className="flex items-baseline justify-between gap-3 px-4 pt-4 lg:px-0 lg:pt-0">
        <h1 className="text-base font-medium tracking-tight">Candidatura</h1>
        <p aria-live="polite" className={`font-mono text-[11px] lg:hidden ${saveClass}`}>
          {label}
        </p>
      </div>

      <nav className="mt-3 flex overflow-x-auto lg:mt-8 lg:flex-col lg:gap-1 lg:overflow-visible">
        {steps.map((item) => {
          const active = step === item.id
          const Icon = item.icon
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onStep(item.id)}
              aria-current={active ? 'page' : undefined}
              className={`flex shrink-0 items-center gap-2 whitespace-nowrap px-3 py-3 text-left text-sm text-ink lg:w-full lg:rounded-[2px] lg:px-2 lg:py-2 ${press} ${
                active ? 'bg-[#e7e5e4] font-medium' : ''
              }`}
            >
              <Icon className="hidden shrink-0 lg:block" size={18} weight="regular" aria-hidden="true" />
              <span className="font-mono text-[11px]">{item.num}</span>
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>

      <div className="px-4 py-3 lg:mt-auto lg:border-t lg:border-line lg:px-0 lg:pt-4">
        <p aria-live="polite" className={`hidden font-mono text-[11px] lg:block ${saveClass}`}>
          {label}
        </p>
        {inBrowser && (
          <p className="mt-3 text-xs leading-relaxed text-muted">
            En el sitio publicado los datos se quedan en este navegador.
          </p>
        )}
        <p className="font-mono text-[11px] text-muted lg:mt-4">Oferta seleccionada</p>
        {selected ? (
          <>
            <p className="mt-1 text-sm leading-snug">{selected.title}</p>
            <p className="mt-1 text-xs text-muted">{selected.company}</p>
          </>
        ) : (
          <p className="mt-1 text-sm text-muted">Ninguna</p>
        )}
      </div>
    </aside>
  )
}
