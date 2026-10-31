import { formatScore } from '../format'
import type { Cv, Offer } from '../types'
import { FigmaPane } from './FigmaPane'
import { Field, areaClass, surfaceClass } from './ui'

export function CvScore({
  offer,
  cv,
  onAdaptNote,
  onFigmaUrl,
}: {
  offer: Offer
  cv: Cv
  onAdaptNote: (note: string) => void
  onFigmaUrl: (url: string) => void
}) {
  return (
    <div className="flex flex-col gap-8">
      <div className={surfaceClass}>
        {offer.score ? (
          <>
            <p className="font-mono text-xs text-ink">{offer.score.basis}</p>
            <p className="mt-2 font-mono text-2xl font-medium text-ink">
              {formatScore(offer.score.value)}
              <span className="text-base">/{offer.score.of}</span>
            </p>
          </>
        ) : (
          <p className="text-sm text-ink">Sin puntuación guardada.</p>
        )}

        {offer.requirements.length > 0 ? (
          <div className="mt-6">
            <h3 className="mb-1 text-sm font-medium">Requisitos</h3>
            <div className="grid grid-cols-[4.5rem_1fr] gap-3 border-b border-line py-3.5 text-xs text-ink">
              <span>Puntos</span>
              <span>Requisito</span>
            </div>
            <ul className="divide-y divide-line">
              {offer.requirements.map((requirement) => (
                <li key={requirement.text} className="grid grid-cols-[4.5rem_1fr] gap-3 py-3.5">
                  <span className="font-mono text-sm text-ink tabular-nums">
                    {formatScore(requirement.points)}
                  </span>
                  <span className="text-sm leading-relaxed break-words text-ink">{requirement.text}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="mt-6 text-sm text-ink">Sin desglose línea a línea.</p>
        )}
      </div>

      <Field label="Notas de adaptación">
        <textarea
          className={areaClass}
          value={offer.adaptNote ?? ''}
          onChange={(event) => onAdaptNote(event.target.value)}
          rows={4}
        />
      </Field>

      <FigmaPane cv={cv} figmaUrl={offer.cvFigmaUrl || cv.figmaUrl} onFigmaUrl={onFigmaUrl} />
    </div>
  )
}
