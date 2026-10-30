import { ArrowSquareOut, Plus } from '@phosphor-icons/react'
import { useState, type FormEvent } from 'react'
import { catalog } from '../catalog'
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
  const [query, setQuery] = useState('')
  const selected = offers.find((offer) => offer.id === selectedId) ?? null
  const count = offers.length === 1 ? '1 oferta' : `${offers.length} ofertas`
  const needle = query.trim().toLocaleLowerCase('es')
  const listed = catalog.filter((offer) => {
    if (!needle) return true
    const title = offer.title.toLocaleLowerCase('es')
    const company = offer.company.toLocaleLowerCase('es')
    return title.includes(needle) || company.includes(needle)
  })

  function addFromCatalog(offer: Offer) {
    if (offers.some((item) => item.id === offer.id)) return
    onAdd({
      ...offer,
      score: offer.score ? { ...offer.score } : null,
      requirements: offer.requirements.map((item) => ({ ...item })),
    })
  }

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
      {selected && (
        <div className="mb-8 border border-line px-4 py-4 lg:px-6">
          <p className="text-sm leading-relaxed">
            <span className="font-medium">{selected.company}</span>
            {' · '}
            {selected.title}
            {' · '}
            Seleccionada
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
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
        </div>
      )}

      <h3 className="text-base font-medium">Mesa</h3>
      <p className="mt-1 text-xs text-muted">{count}</p>

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
        <p className="mt-3 text-sm text-ink">No hay ofertas en la mesa.</p>
      ) : (
        <ul className="mt-3 flex flex-col gap-2">
          {offers.map((offer) => (
            <li key={offer.id}>
              <button
                type="button"
                onClick={() => onSelect(offer.id)}
                aria-pressed={offer.id === selectedId}
                className="max-w-full cursor-pointer text-left text-sm leading-snug text-ink"
              >
                {offer.company}
                {' · '}
                {offer.title}
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-10">
        <h3 className="text-base font-medium">Tablón</h3>
        <p className="mt-1 text-xs text-muted">
          {catalog.length === 1 ? '1 oferta' : `${catalog.length} ofertas`}
        </p>
        <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted">
          Listado externo. Añadir copia la oferta a la mesa.
        </p>
        <label className="mt-4 flex max-w-md flex-col gap-2">
          <span className="text-xs text-muted">Buscar</span>
          <input
            className={controlClass}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Puesto o empresa"
          />
        </label>

        {listed.length === 0 ? (
          <p className={`${surfaceClass} mt-4 text-sm text-ink`}>
            Ninguna oferta coincide con la búsqueda.
          </p>
        ) : (
          <div className="mt-4 divide-y divide-line border border-line">
            {listed.map((offer) => {
              const inMesa = offers.some((item) => item.id === offer.id)
              return (
                <div
                  key={offer.id}
                  className="flex flex-col gap-4 px-4 py-4 lg:flex-row lg:items-start lg:justify-between lg:px-6"
                >
                  <div className="min-w-0">
                    <p className="font-medium leading-snug break-words">{offer.title}</p>
                    <p className="mt-1 text-sm break-words">{offer.company}</p>
                    <p className="mt-1 text-sm leading-relaxed break-words">
                      {formatPosted(offer.posted)}
                      {' · '}
                      {locationLabel(offer.location)}
                      {' · '}
                      {workTypeLabel(offer.workType)}
                      {' · '}
                      {aiLabel(offer.aiSkills)}
                      {' · '}
                      {salaryLabel(offer.salary)}
                    </p>
                  </div>
                  {inMesa ? (
                    <p className="shrink-0 text-sm text-ink">En la mesa</p>
                  ) : (
                    <PrimaryButton
                      className="w-full shrink-0 sm:w-auto"
                      onClick={() => addFromCatalog(offer)}
                    >
                      Añadir
                    </PrimaryButton>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
