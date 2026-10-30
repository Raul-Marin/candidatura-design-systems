import { ArrowSquareOut } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'
import { figmaEmbedSrc } from '../format'
import type { Cv } from '../types'
import { Field, PrimaryButton, QuietButton, controlClass, linkClass } from './ui'

export function FigmaPane({ cv, onFigmaUrl }: { cv: Cv; onFigmaUrl: (url: string) => void }) {
  const [failed, setFailed] = useState(false)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(cv.figmaUrl)
  const [localError, setLocalError] = useState<string | null>(null)
  const url = cv.figmaUrl.trim()

  useEffect(() => {
    setDraft(cv.figmaUrl)
    setFailed(false)
    setLocalError(null)
  }, [cv.figmaUrl])

  function apply() {
    const next = draft.trim()
    if (next && !/^https:\/\/([\w-]+\.)?figma\.com\//.test(next)) {
      setLocalError('Pega una URL https de figma.com.')
      return
    }
    setLocalError(null)
    onFigmaUrl(next)
    setEditing(false)
    setFailed(false)
  }

  const showFrame = Boolean(url) && !failed
  const showFallback = !url || failed || editing

  return (
    <aside className="flex w-full shrink-0 flex-col border-t border-line bg-panel lg:w-[42%] lg:border-t-0 lg:border-l">
      <div className="flex flex-col gap-3 px-4 py-4">
        <div>
          <p className="font-mono text-xs text-muted">CV en Figma</p>
          <p className="mt-1 text-sm font-medium">{cv.name}</p>
          <p className="mt-1 text-xs leading-relaxed text-muted">{cv.note}</p>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          {url && (
            <a className={linkClass} href={url} target="_blank" rel="noreferrer">
              Abrir en Figma
              <ArrowSquareOut size={16} weight="regular" aria-hidden="true" />
            </a>
          )}
          <QuietButton onClick={() => setEditing((open) => !open)}>Cambiar URL</QuietButton>
        </div>
      </div>

      {showFallback && (
        <div className="mx-4 mb-4 flex flex-col gap-3 border border-dashed border-line px-3 py-3">
          {!url && <p className="text-sm text-muted">No hay URL de Figma.</p>}
          {failed && url && <p className="text-sm text-muted">El embed no ha cargado.</p>}
          <Field label="URL del archivo de Figma">
            <input
              className={controlClass}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              inputMode="url"
              spellCheck={false}
            />
          </Field>
          {localError && (
            <p className="text-sm text-ink">{localError}</p>
          )}
          <PrimaryButton className="self-start" onClick={apply}>
            Usar esta URL
          </PrimaryButton>
        </div>
      )}

      {showFrame && (
        <div className="min-h-[560px] flex-1">
          <iframe
            key={url}
            title={`CV de ${cv.name} en Figma`}
            src={figmaEmbedSrc(url)}
            className="h-full min-h-[560px] w-full border-0 bg-panel"
            allowFullScreen
            onError={() => setFailed(true)}
          />
        </div>
      )}
    </aside>
  )
}
