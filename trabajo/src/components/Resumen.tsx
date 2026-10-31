import {
  aiLabel,
  formatPosted,
  locationLabel,
  salaryLabel,
  workTypeLabel,
} from '../format'
import type { Offer, Track } from '../types'
import { QuietButton, surfaceClass } from './ui'
import { estadoLabel } from './Candidaturas'

function missingFields(track: Track): string[] {
  const missing: string[] = []
  if (!track.estado) missing.push('Estado')
  if (!track.puesto.trim()) missing.push('Puesto')
  if (!track.lugar.trim()) missing.push('Lugar')
  if (!track.web.trim()) missing.push('Web')
  if (!track.primeraActividad) missing.push('Primera actividad')
  if (!track.ultimaActividad) missing.push('Última actividad')
  if (!track.emails.trim()) missing.push('E-mails')
  if (track.diario.length === 0) missing.push('Diario')
  return missing
}

export function Resumen({
  offer,
  track,
  onOpenCv,
  onOpenTrack,
}: {
  offer: Offer
  track: Track
  onOpenCv: () => void
  onOpenTrack: () => void
}) {
  const missing = missingFields(track)
  const next = !offer.score
    ? { label: 'Puntúa el CV', onClick: onOpenCv }
    : missing.length > 0
      ? { label: 'Abre la ficha de seguimiento', onClick: onOpenTrack }
      : null

  const facts: { label: string; value: string }[] = [
    { label: 'Fecha', value: formatPosted(offer.posted) },
    { label: 'Lugar', value: locationLabel(offer.location) },
    { label: 'Modalidad', value: workTypeLabel(offer.workType) },
    { label: 'Salario', value: salaryLabel(offer.salary) },
    { label: 'Pide IA', value: aiLabel(offer.aiSkills) },
    { label: 'Estado', value: estadoLabel(track.estado) },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className={surfaceClass}>
        <h3 className="text-sm font-medium">Datos publicados</h3>
        <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {facts.map((fact) => (
            <div key={fact.label} className="min-w-0">
              <dt className="text-xs text-muted">{fact.label}</dt>
              <dd className="mt-1 text-sm leading-relaxed break-words text-ink">{fact.value}</dd>
            </div>
          ))}
        </dl>
        {offer.workNote && (
          <p className="mt-4 text-sm leading-relaxed text-ink">{offer.workNote}</p>
        )}
        {offer.note && <p className="mt-4 text-sm leading-relaxed text-ink">{offer.note}</p>}
        {offer.notStated && (
          <p className="mt-4 border-t border-line pt-4 text-sm leading-relaxed text-ink">
            {offer.notStated}
          </p>
        )}
      </div>

      <div className={surfaceClass}>
        <h3 className="text-sm font-medium">En el seguimiento</h3>
        {missing.length > 0 ? (
          <p className="mt-3 text-sm leading-relaxed text-ink">
            Falta rellenar: {missing.join(', ')}.
          </p>
        ) : (
          <p className="mt-3 text-sm leading-relaxed text-ink">
            Estado, puesto, lugar, web, fechas, e-mails y diario están rellenos.
          </p>
        )}
        {next && (
          <QuietButton className="mt-4" onClick={next.onClick}>
            {next.label}
          </QuietButton>
        )}
      </div>
    </div>
  )
}
