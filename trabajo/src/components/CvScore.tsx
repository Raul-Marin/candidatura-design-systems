import { formatScore } from '../format'
import type { Offer } from '../types'
import { Field, StepHeading, areaClass, surfaceClass } from './ui'

export function CvScore({
  offer,
  onAdaptNote,
}: {
  offer: Offer | null
  onAdaptNote: (note: string) => void
}) {
  return (
    <section>
      <StepHeading num="02" title="CV" />
      {!offer ? (
        <p className={`${surfaceClass} text-sm text-muted`}>
          Elige una oferta en Ofertas para ver la puntuación del CV original.
        </p>
      ) : (
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-base font-medium tracking-tight">{offer.title}</p>
            <p className="mt-1 text-sm text-muted">{offer.company}</p>
          </div>

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

            {offer.requirements.length > 0 && (
              <div className="mt-6">
                <h3 className="mb-1 text-sm font-medium">Requisitos</h3>
                <div className="grid grid-cols-[4.5rem_1fr] gap-3 border-b border-line py-3.5 text-xs text-ink">
                  <span>Puntos</span>
                  <span>Requisito</span>
                </div>
                <ul className="divide-y divide-line">
                  {offer.requirements.map((requirement) => (
                    <li key={requirement.text} className="grid grid-cols-[4.5rem_1fr] gap-3 py-3.5">
                      <span className="font-mono text-sm text-ink tabular-nums">{formatScore(requirement.points)}</span>
                      <span className="text-sm leading-relaxed text-ink">{requirement.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {offer.requirements.length === 0 && (
              <p className="mt-6 text-sm text-ink">Sin desglose línea a línea.</p>
            )}

            {offer.note && (
              <p className="mt-6 border-t border-line pt-4 text-sm leading-relaxed text-ink">{offer.note}</p>
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
        </div>
      )}
    </section>
  )
}
