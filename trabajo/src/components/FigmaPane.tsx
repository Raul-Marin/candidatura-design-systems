import { ArrowSquareOut } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'
import { figmaEmbedSrc } from '../format'
import type { Cv } from '../types'
import { Field, PrimaryButton, controlClass, linkClass } from './ui'

export function FigmaPane({
  cv,
  figmaUrl,
  onFigmaUrl,
}: {
  cv: Cv
  figmaUrl: string
  onFigmaUrl: (url: string) => void
}) {
  const [failed, setFailed] = useState(false)
  const [draft, setDraft] = useState(figmaUrl)
  const [localError, setLocalError] = useState<string | null>(null)
  const url = figmaUrl.trim()

  useEffect(() => {
    setDraft(figmaUrl)
    setFailed(false)
    setLocalError(null)
  }, [figmaUrl])

  function apply() {
    const next = draft.trim()
    if (next && !/^https:\/\/([\w-]+\.)?figma\.com\//.test(next)) {
      setLocalError('Pega una URL https de figma.com.')
      return
    }
    setLocalError(null)
    onFigmaUrl(next)
    setFailed(false)
  }

  return (
    <section>
      <h3 className="text-sm font-medium">CV en Figma</h3>
      <p className="mt-2 text-sm">{cv.name}</p>
      <p className="mt-1 text-xs leading-relaxed text-muted">{cv.note}</p>
      {url && (
        <a className={`${linkClass} mt-3`} href={url} target="_blank" rel="noreferrer">
          Abrir en Figma
          <ArrowSquareOut size={16} weight="regular" aria-hidden="true" />
        </a>
      )}
      <div className="mt-4 max-w-xl">
        <Field label="URL del archivo de Figma">
          <input
            className={controlClass}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            inputMode="url"
            spellCheck={false}
          />
        </Field>
        {localError && <p className="mt-2 text-sm text-ink">{localError}</p>}
        <PrimaryButton className="mt-3" onClick={apply}>
          Usar esta URL
        </PrimaryButton>
      </div>
      {!url && <p className="mt-4 text-sm text-ink">No hay URL de Figma.</p>}
      {failed && url && <p className="mt-4 text-sm text-ink">El embed no ha cargado.</p>}
      {url && !failed && (
        <iframe
          key={url}
          title={`CV de ${cv.name} en Figma`}
          src={figmaEmbedSrc(url)}
          className="mt-4 h-[70vh] min-h-[420px] w-full border border-line bg-panel"
          allowFullScreen
          onError={() => setFailed(true)}
        />
      )}
    </section>
  )
}
