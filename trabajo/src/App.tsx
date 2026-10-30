import { useState } from 'react'
import { CvScore } from './components/CvScore'
import { FigmaPane } from './components/FigmaPane'
import { Ofertas } from './components/Ofertas'
import { Rail } from './components/Rail'
import { Seguimiento } from './components/Seguimiento'
import { PrimaryButton } from './components/ui'
import type { Offer, Step } from './types'
import { emptyTrack } from './types'
import { useWorkspace } from './useWorkspace'

export function App() {
  const { workspace, loading, error, saveState, inBrowser, update, reload } = useWorkspace()
  const [step, setStep] = useState<Step>('ofertas')

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
    <div className="mx-auto flex min-h-[100dvh] w-full max-w-[1440px] flex-col bg-paper text-ink lg:flex-row">
      <Rail
        step={step}
        onStep={setStep}
        selected={selected}
        saveState={saveState}
        inBrowser={inBrowser}
      />
      <main className="min-w-0 flex-1 px-5 py-6 sm:px-8 sm:py-8">
        {error && (
          <p className="mb-4 border border-line px-4 py-2 text-sm text-ink lg:px-6" role="alert">
            {error}
          </p>
        )}
        <div key={step} className="step-in">
          {step === 'ofertas' && (
            <Ofertas
              offers={workspace.offers}
              selectedId={workspace.selectedId}
              onSelect={selectOffer}
              onAdd={addOffer}
              onRemove={removeOffer}
            />
          )}
          {step === 'cv' && <CvScore offer={selected} onAdaptNote={setAdaptNote} />}
          {step === 'seguimiento' && (
            <Seguimiento
              offer={selected}
              track={track}
              onChange={(next) => {
                if (!selected) return
                update({
                  ...workspace,
                  tracks: { ...workspace.tracks, [selected.id]: next },
                })
              }}
            />
          )}
        </div>
      </main>
      <FigmaPane
        cv={workspace.cv}
        onFigmaUrl={(figmaUrl) => update({ ...workspace, cv: { ...workspace.cv, figmaUrl } })}
      />
    </div>
  )
}

function Skeleton() {
  return (
    <div
      className="mx-auto flex min-h-[100dvh] w-full max-w-[1440px] flex-col lg:flex-row"
      aria-busy="true"
    >
      <p className="sr-only">Cargando el espacio de trabajo</p>
      <div className="h-28 animate-pulse border-b border-line bg-line/40 lg:h-auto lg:w-56 lg:border-b-0 lg:border-r" />
      <div className="flex-1 space-y-4 px-5 py-8 sm:px-8">
        <div className="h-3 w-16 animate-pulse bg-line" />
        <div className="h-8 w-40 animate-pulse bg-line" />
        <div className="h-48 animate-pulse bg-line/70" />
      </div>
      <div className="min-h-[320px] w-full animate-pulse border-t border-line bg-line/30 lg:w-[42%] lg:border-t-0 lg:border-l" />
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
