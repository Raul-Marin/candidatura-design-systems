import { useEffect, useId, useRef, useState, type RefObject } from 'react'
import { catalog } from '../catalog'
import {
  aiLabel,
  formatPosted,
  locationLabel,
  salaryLabel,
  workTypeLabel,
} from '../format'
import type { Offer } from '../types'
import { PrimaryButton, QuietButton, controlClass, surfaceClass } from './ui'

export function CatalogSheet({
  open,
  offers,
  onAdd,
  onClose,
  returnFocus,
}: {
  open: boolean
  offers: Offer[]
  onAdd: (offer: Offer) => void
  onClose: () => void
  returnFocus: RefObject<HTMLButtonElement | null>
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const titleId = useId()
  const [query, setQuery] = useState('')
  const [notice, setNotice] = useState<string | null>(null)
  const needle = query.trim().toLocaleLowerCase('es')
  const listed = catalog.filter((offer) => {
    if (!needle) return true
    return (
      offer.title.toLocaleLowerCase('es').includes(needle) ||
      offer.company.toLocaleLowerCase('es').includes(needle)
    )
  })
  const count = catalog.length === 1 ? '1 oferta' : `${catalog.length} ofertas`

  useEffect(() => {
    if (!open) return
    function onKey(event: KeyboardEvent) {
      if (event.key !== 'Escape') return
      event.preventDefault()
      onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open) {
      if (!dialog.open) dialog.showModal()
      setQuery('')
      setNotice(null)
      searchRef.current?.focus()
    } else if (dialog.open) {
      dialog.close()
      returnFocus.current?.focus()
    }
  }, [open, returnFocus])

  function add(offer: Offer) {
    if (offers.some((item) => item.id === offer.id)) return
    onAdd({
      ...offer,
      score: offer.score ? { ...offer.score } : null,
      requirements: offer.requirements.map((item) => ({ ...item })),
    })
    setNotice(`${offer.company} añadida a mis candidaturas.`)
  }

  return (
    <dialog
      ref={dialogRef}
      className="catalog-sheet"
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onKeyDown={(event) => {
        if (event.key !== 'Escape') return
        event.preventDefault()
        onClose()
      }}
    >
      <div className="flex h-full min-h-0 flex-col">
        <div className="flex items-start justify-between gap-4 px-4 py-4 lg:px-6">
          <div className="min-w-0">
            <h2 id={titleId} className="text-xl font-medium leading-tight">
              Buscar ofertas
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {count} de la semana. Añadir copia la oferta a mis candidaturas.
            </p>
          </div>
          <QuietButton className="shrink-0" onClick={onClose}>
            Cerrar
          </QuietButton>
        </div>

        <div className="px-4 lg:px-6">
          <label className="flex max-w-md flex-col gap-2">
            <span className="text-xs text-muted">Buscar</span>
            <input
              ref={searchRef}
              className={controlClass}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Puesto o empresa"
            />
          </label>
          {notice && (
            <p className="mt-4 text-sm text-ink" role="status">
              {notice}
            </p>
          )}
        </div>

        <div className="mt-4 min-h-0 flex-1 overflow-y-auto px-4 pb-6 lg:px-6">
          {listed.length === 0 ? (
            <p className={`${surfaceClass} text-sm text-ink`}>
              Ninguna oferta coincide con la búsqueda.
            </p>
          ) : (
            <div className="divide-y divide-line border border-line">
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
                      <PrimaryButton className="w-full shrink-0 sm:w-auto" onClick={() => add(offer)}>
                        Añadir
                      </PrimaryButton>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </dialog>
  )
}
