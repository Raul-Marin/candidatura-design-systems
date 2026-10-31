import { ArrowSquareOut } from '@phosphor-icons/react'
import { useId, useState, type KeyboardEvent } from 'react'
import { locationLabel, salaryLabel, workTypeLabel } from '../format'
import type { Cv, Offer, Track } from '../types'
import { CvScore } from './CvScore'
import { Resumen } from './Resumen'
import { Seguimiento } from './Seguimiento'
import { TextButton, linkClass } from './ui'

const tabs = [
  { id: 'resumen', label: 'Resumen' },
  { id: 'cv', label: 'CV' },
  { id: 'seguimiento', label: 'Seguimiento' },
] as const

type TabId = (typeof tabs)[number]['id']

export function OfferWorkspace({
  offer,
  track,
  cv,
  onRemove,
  onTrack,
  onAdaptNote,
  onFigmaUrl,
}: {
  offer: Offer
  track: Track
  cv: Cv
  onRemove: () => void
  onTrack: (track: Track) => void
  onAdaptNote: (note: string) => void
  onFigmaUrl: (url: string) => void
}) {
  const [tab, setTab] = useState<TabId>('resumen')
  const [tabOfferId, setTabOfferId] = useState(offer.id)
  const baseId = useId()

  if (tabOfferId !== offer.id) {
    setTabOfferId(offer.id)
    setTab('resumen')
  }

  function onTabKey(event: KeyboardEvent<HTMLButtonElement>, id: TabId) {
    const index = tabs.findIndex((item) => item.id === id)
    let next = index
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length
    else if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = tabs.length - 1
    else return
    event.preventDefault()
    const nextId = tabs[next].id
    setTab(nextId)
    document.getElementById(`${baseId}-${nextId}`)?.focus()
  }

  return (
    <article>
      <header>
        <h2 className="text-xl font-medium leading-tight break-words">{offer.title}</h2>
        <p className="mt-2 text-sm break-words">{offer.company}</p>
        <p className="mt-2 text-sm leading-relaxed break-words">
          {locationLabel(offer.location)}
          {' · '}
          {workTypeLabel(offer.workType)}
          {' · '}
          {salaryLabel(offer.salary)}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
          {offer.detailUrl && (
            <a className={linkClass} href={offer.detailUrl} target="_blank" rel="noreferrer">
              La oferta
              <ArrowSquareOut size={16} weight="regular" aria-hidden="true" />
            </a>
          )}
          {offer.applyUrl && (
            <a className={linkClass} href={offer.applyUrl} target="_blank" rel="noreferrer">
              Solicitar
              <ArrowSquareOut size={16} weight="regular" aria-hidden="true" />
            </a>
          )}
          <TextButton onClick={onRemove}>Quitar de mis candidaturas</TextButton>
        </div>
      </header>

      <div className="-mx-4 mt-6 overflow-x-auto px-4 lg:mx-0 lg:px-0">
        <div
          role="tablist"
          aria-label="Ficha de la candidatura"
          className="inline-flex w-max gap-1 rounded-[2px] border border-stone-500 bg-white p-1"
        >
          {tabs.map((item) => {
            const selected = tab === item.id
            return (
              <button
                key={item.id}
                id={`${baseId}-${item.id}`}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={`${baseId}-panel-${item.id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setTab(item.id)}
                onKeyDown={(event) => onTabKey(event, item.id)}
                className={`inline-flex min-h-10 shrink-0 cursor-pointer items-center justify-center whitespace-nowrap rounded-[2px] px-4 text-sm font-medium transition-colors ${
                  selected ? 'bg-ink text-paper' : 'text-ink hover:bg-stone-200 active:bg-stone-300'
                }`}
              >
                {item.label}
              </button>
            )
          })}
        </div>
      </div>

      <div
        className="mt-6"
        id={`${baseId}-panel-${tab}`}
        role="tabpanel"
        aria-labelledby={`${baseId}-${tab}`}
        tabIndex={0}
      >
        {tab === 'resumen' && (
          <Resumen
            offer={offer}
            track={track}
            onOpenCv={() => setTab('cv')}
            onOpenTrack={() => setTab('seguimiento')}
          />
        )}
        {tab === 'cv' && (
          <CvScore offer={offer} cv={cv} onAdaptNote={onAdaptNote} onFigmaUrl={onFigmaUrl} />
        )}
        {tab === 'seguimiento' && <Seguimiento track={track} onChange={onTrack} />}
      </div>
    </article>
  )
}
