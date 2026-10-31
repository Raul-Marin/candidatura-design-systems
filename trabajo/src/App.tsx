import { useRef, useState } from 'react'
import { Candidaturas } from './components/Candidaturas'
import { CatalogSheet } from './components/CatalogSheet'
import { OfferWorkspace } from './components/OfferWorkspace'
import { TopBar } from './components/TopBar'
import { PrimaryButton } from './components/ui'
import type { Offer } from './types'
import { emptyTrack } from './types'
import { useWorkspace } from './useWorkspace'

export function App() {
  const { workspace, loading, error, saveState, inBrowser, update, reload } = useWorkspace()
  const [sheetOpen, setSheetOpen] = useState(false)
  const searchRef = useRef<HTMLButtonElement>(null)

  if (loading && !workspace) return <Skeleton />
  if (!workspace) return <LoadError message={error} onRetry={reload} />

  const selected = workspace.offers.find((offer) => offer.id === workspace.selectedId) ?? null
  const track = selected ? (workspace.tracks[selected.id] ?? emptyTrack()) : null

  function selectOffer(id: string) {
    if (workspace!.selectedId === id && workspace!.tracks[id]) return
    const tracks = workspace!.tracks[id]
      ? workspace!.tracks
      : { ...workspace!.tracks, [id]: emptyTrack() }
    update({ ...workspace!, selectedId: id, tracks })
  }

  function addOffer(offer: Offer) {
    const already = workspace!.offers.some((item) => item.id === offer.id)
    if (already) {
      update({ ...workspace!, selectedId: offer.id })
      return
    }
    const tracks = workspace!.tracks[offer.id]
      ? workspace!.tracks
      : { ...workspace!.tracks, [offer.id]: emptyTrack() }
    update({
      ...workspace!,
      offers: [offer, ...workspace!.offers],
      selectedId: offer.id,
      tracks,
    })
  }

  function removeOffer(id: string) {
    const offers = workspace!.offers.filter((offer) => offer.id !== id)
    const tracks = { ...workspace!.tracks }
    delete tracks[id]
    const selectedId = workspace!.selectedId === id ? (offers[0]?.id ?? null) : workspace!.selectedId
    if (selectedId && !tracks[selectedId]) tracks[selectedId] = emptyTrack()
    update({ ...workspace!, offers, tracks, selectedId })
  }

  function setAdaptNote(note: string) {
    if (!selected) return
    update({
      ...workspace!,
      offers: workspace!.offers.map((offer) =>
        offer.id === selected.id ? { ...offer, adaptNote: note } : offer,
      ),
    })
  }

  return (
    <div className="mx-auto flex min-h-[100dvh] w-full max-w-[1440px] flex-col bg-paper text-ink">
      <TopBar
        saveState={saveState}
        inBrowser={inBrowser}
        onSearch={() => setSheetOpen(true)}
        searchRef={searchRef}
      />
      {error && (
        <p className="border-b border-line px-4 py-3 text-sm text-ink lg:px-8" role="alert">
          {error}
        </p>
      )}
      <div className="flex min-w-0 flex-1 flex-col lg:flex-row">
        <Candidaturas
          offers={workspace.offers}
          tracks={workspace.tracks}
          selectedId={workspace.selectedId}
          onSelect={selectOffer}
        />
        <main className="min-w-0 flex-1 px-4 py-6 lg:px-8 lg:py-8">
          {selected && track ? (
            <OfferWorkspace
              offer={selected}
              track={track}
              cv={workspace.cv}
              onRemove={() => removeOffer(selected.id)}
              onTrack={(next) =>
                update({
                  ...workspace,
                  tracks: { ...workspace.tracks, [selected.id]: next },
                })
              }
              onAdaptNote={setAdaptNote}
              onFigmaUrl={(figmaUrl) =>
                update({
                  ...workspace,
                  offers: workspace.offers.map((offer) =>
                    offer.id === selected.id
                      ? { ...offer, cvFigmaUrl: figmaUrl }
                      : offer,
                  ),
                })
              }
            />
          ) : (
            <p className="max-w-md text-sm leading-relaxed text-ink">
              No hay una candidatura abierta. Usa Buscar ofertas para traer una del tablón.
            </p>
          )}
        </main>
      </div>
      <CatalogSheet
        open={sheetOpen}
        offers={workspace.offers}
        onAdd={addOffer}
        onClose={() => setSheetOpen(false)}
        returnFocus={searchRef}
      />
    </div>
  )
}

function Skeleton() {
  return (
    <div className="mx-auto flex min-h-[100dvh] w-full max-w-[1440px] flex-col" aria-busy="true">
      <p className="sr-only">Cargando el espacio de trabajo</p>
      <div className="h-16 animate-pulse border-b border-line bg-line/40" />
      <div className="flex flex-1 flex-col lg:flex-row">
        <div className="h-28 animate-pulse border-b border-line bg-line/30 lg:h-auto lg:w-80 lg:border-b-0 lg:border-r" />
        <div className="flex-1 space-y-4 px-4 py-8 lg:px-8">
          <div className="h-8 w-64 animate-pulse bg-line" />
          <div className="h-4 w-40 animate-pulse bg-line" />
          <div className="h-48 animate-pulse bg-line/70" />
        </div>
      </div>
    </div>
  )
}

function LoadError({ message, onRetry }: { message: string | null; onRetry: () => void }) {
  return (
    <div className="mx-auto flex min-h-[100dvh] w-full max-w-[1440px] flex-col justify-center bg-paper px-8 text-ink">
      <h1 className="text-2xl font-medium tracking-tight">Candidatura</h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
        {message ?? 'No se ha podido cargar el espacio de trabajo.'}
      </p>
      <PrimaryButton className="mt-6 self-start" onClick={onRetry}>
        Reintentar
      </PrimaryButton>
    </div>
  )
}
