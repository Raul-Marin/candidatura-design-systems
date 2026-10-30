import { ArrowSquareOut, Check, Plus } from '@phosphor-icons/react'
import { useState, type FormEvent } from 'react'
import {
  aiLabel,
  draftToOffer,
  emptyDraft,
  formatPosted,
  locationLabel,
  salaryLabel,
  workTypeLabel,
  type DraftOffer,
} from '../format'
import type { Offer, WorkType } from '../types'
import { Field, PrimaryButton, QuietButton, StepHeading, TextButton, controlClass, linkClass, surfaceClass } from './ui'

export function Ofertas({
  offers,
  selectedId,
  onSelect,
  onAdd,
  onRemove,
}: {
  offers: Offer[]
  selectedId: string | null
  onSelect: (id: string) => void
  onAdd: (offer: Offer) => void
  onRemove: (id: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<DraftOffer>(emptyDraft)
  const [formError, setFormError] = useState<string | null>(null)
  const selected = offers.find((offer) => offer.id === selectedId) ?? null
  const count = offers.length === 1 ? '1 oferta' : `${offers.length} ofertas`

  function patch(partial: Partial<DraftOffer>) {
    setDraft((current) => ({ ...current, ...partial }))
  }

  function submit(event: FormEvent) {
    event.preventDefault()
    if (!draft.posted || !draft.title.trim() || !draft.company.trim()) {
      setFormError('Indica la fecha, el puesto y la empresa.')
      return
    }
    onAdd(draftToOffer(draft, offers.map((offer) => offer.id)))
    setDraft(emptyDraft())
    setFormError(null)
    setOpen(false)
  }

  return (
    <section>
      <StepHeading
        num="01"
        title="Ofertas"
        action={
          open ? null : (
            <PrimaryButton onClick={() => setOpen(true)}>
              <Plus size={16} weight="regular" aria-hidden="true" />
              Añadir oferta
            </PrimaryButton>
          )
        }
      />
      <p className="mb-4 font-mono text-[11px] text-muted">{count}</p>

      {open && (
        <form
          className={`mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 ${surfaceClass}`}
          onSubmit={submit}
          autoComplete="off"
        >
          <Field label="Fecha">
            <input
              className={controlClass}
              type="date"
              value={draft.posted}
              onChange={(event) => patch({ posted: event.target.value })}
              required
            />
          </Field>
          <Field label="Puesto">
            <input
              className={controlClass}
              value={draft.title}
              onChange={(event) => patch({ title: event.target.value })}
            />
          </Field>
          <Field label="Empresa">
            <input
              className={controlClass}
              value={draft.company}
              onChange={(event) => patch({ company: event.target.value })}
            />
          </Field>
          <Field label="Lugar">
            <input
              className={controlClass}
              value={draft.location}
              onChange={(event) => patch({ location: event.target.value })}
            />
          </Field>
          <Field label="Modalidad">
            <select
              className={controlClass}
              value={draft.workType}
              onChange={(event) => patch({ workType: event.target.value as '' | WorkType })}
            >
              <option value="">No indicada</option>
              <option value="hybrid">Híbrido</option>
              <option value="remote">Remoto</option>
              <option value="onsite">Presencial</option>
            </select>
          </Field>
          <Field label="Pide IA">
            <select
              className={controlClass}
              value={draft.aiSkills ? 'si' : 'no'}
              onChange={(event) => patch({ aiSkills: event.target.value === 'si' })}
            >
              <option value="no">No pide IA</option>
              <option value="si">Pide IA</option>
            </select>
          </Field>
          <Field label="Salario" className="sm:col-span-2">
            <input
              className={controlClass}
              value={draft.salary}
              onChange={(event) => patch({ salary: event.target.value })}
              placeholder="Vacío si no está publicado"
            />
          </Field>
          {formError && (
            <p className="text-sm text-ink sm:col-span-2">{formError}</p>
          )}
          <div className="flex flex-wrap gap-2 sm:col-span-2">
            <PrimaryButton type="submit">Guardar oferta</PrimaryButton>
            <QuietButton
              onClick={() => {
                setOpen(false)
                setFormError(null)
              }}
            >
              Cancelar
            </QuietButton>
          </div>
        </form>
      )}

      {offers.length === 0 ? (
        <p className={`${surfaceClass} text-sm text-muted`}>
          No hay ofertas. Añade una para empezar.
        </p>
      ) : (
        <div className="divide-y divide-line border border-line">
          {offers.map((offer) => {
            const active = offer.id === selectedId
            return (
              <button
                key={offer.id}
                type="button"
                onClick={() => onSelect(offer.id)}
                aria-pressed={active}
                className={`flex w-full origin-left cursor-pointer flex-col gap-3 px-4 py-4 text-left text-ink transition-colors duration-150 active:scale-[0.98] lg:px-6 ${
                  active ? 'bg-[#e7e5e4] shadow-[inset_0_0_0_2px_#78716c]' : 'hover:bg-[#fafaf9]'
                }`}
              >
                <span className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                  <span className="min-w-0">
                    <span className="block text-xs text-muted">Puesto</span>
                    <span className="mt-1 flex flex-wrap items-center gap-2 font-medium leading-snug">
                      {offer.title}
                      {active && (
                        <span className="inline-flex items-center gap-1 text-xs font-normal text-ink">
                          <Check size={14} weight="regular" aria-hidden="true" />
                          Seleccionada
                        </span>
                      )}
                    </span>
                  </span>
                  <span className="shrink-0 sm:text-right">
                    <span className="block text-xs text-muted">Fecha</span>
                    <span className="mt-1 block font-mono text-xs">{formatPosted(offer.posted)}</span>
                  </span>
                </span>
                <span>
                  <span className="block text-xs text-muted">Empresa</span>
                  <span className="mt-1 block text-sm">{offer.company}</span>
                </span>
                <span className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4">
                  <span className="min-w-0">
                    <span className="block text-xs text-muted">Lugar</span>
                    <span className={`mt-1 block text-sm ${offer.location ? '' : 'text-muted'}`}>
                      {locationLabel(offer.location)}
                    </span>
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs text-muted">Modalidad</span>
                    <span className="mt-1 block text-sm">{workTypeLabel(offer.workType)}</span>
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs text-muted">Pide IA</span>
                    <span className="mt-1 block text-sm text-ink">{aiLabel(offer.aiSkills)}</span>
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs text-muted">Salario</span>
                    <span className={`mt-1 block text-sm ${offer.salary ? '' : 'text-muted'}`}>
                      {salaryLabel(offer.salary)}
                    </span>
                  </span>
                </span>
                {offer.workNote && (
                  <span className="text-xs leading-snug text-muted">{offer.workNote}</span>
                )}
              </button>
            )
          })}
        </div>
      )}

      {selected && (
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-4">
          {selected.detailUrl && (
            <a className={linkClass} href={selected.detailUrl} target="_blank" rel="noreferrer">
              Ficha en el tablero
              <ArrowSquareOut size={16} weight="regular" aria-hidden="true" />
            </a>
          )}
          {selected.applyUrl && (
            <a className={linkClass} href={selected.applyUrl} target="_blank" rel="noreferrer">
              Página de la empresa
              <ArrowSquareOut size={16} weight="regular" aria-hidden="true" />
            </a>
          )}
          <TextButton onClick={() => onRemove(selected.id)}>Quitar de la lista</TextButton>
        </div>
      )}
    </section>
  )
}
