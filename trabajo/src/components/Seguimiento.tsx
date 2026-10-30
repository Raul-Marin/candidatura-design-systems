import { Plus } from '@phosphor-icons/react'
import { todayISO } from '../format'
import type { DiarioEntry, Estado, Offer, Track } from '../types'
import { Field, PrimaryButton, StepHeading, TextButton, areaClass, controlClass, surfaceClass } from './ui'

const estados: { value: Estado; label: string }[] = [
  { value: '', label: 'vacío' },
  { value: 'En preparación', label: 'En preparación' },
  { value: 'Lista para enviar', label: 'Lista para enviar' },
  { value: 'Enviada', label: 'Enviada' },
  { value: 'Seguimiento', label: 'Seguimiento' },
  { value: 'Cerrada', label: 'Cerrada' },
]

export function Seguimiento({
  offer,
  track,
  onChange,
}: {
  offer: Offer | null
  track: Track | null
  onChange: (track: Track) => void
}) {
  if (!offer || !track) {
    return (
      <section>
        <StepHeading num="03" title="Seguimiento" />
        <p className={`${surfaceClass} text-sm text-muted`}>Elige una oferta en Ofertas para abrir su ficha.</p>
      </section>
    )
  }

  function setField<K extends keyof Track>(key: K, value: Track[K]) {
    onChange({ ...track!, [key]: value })
  }

  function setLine(index: number, patch: Partial<DiarioEntry>) {
    setField(
      'diario',
      track!.diario.map((line, i) => (i === index ? { ...line, ...patch } : line)),
    )
  }

  return (
    <section>
      <StepHeading num="03" title="Seguimiento" />
      <div className="mb-6">
        <p className="text-base font-medium tracking-tight">{offer.title}</p>
        <p className="mt-1 text-sm text-muted">{offer.company}</p>
      </div>

      <div className={`grid grid-cols-1 gap-5 sm:grid-cols-2 ${surfaceClass}`}>
        <Field label="Estado">
          <select
            className={controlClass}
            value={track.estado}
            onChange={(event) => setField('estado', event.target.value as Estado)}
          >
            {estados.map((estado) => (
              <option key={estado.label} value={estado.value}>
                {estado.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Lugar">
          <input
            className={controlClass}
            name="lugar"
            value={track.lugar}
            onChange={(event) => setField('lugar', event.target.value)}
          />
        </Field>
        <Field label="Puesto">
          <input
            className={controlClass}
            value={track.puesto}
            onChange={(event) => setField('puesto', event.target.value)}
          />
        </Field>
        <Field label="Tipo de empresa">
          <input
            className={controlClass}
            value={track.tipo}
            onChange={(event) => setField('tipo', event.target.value)}
          />
        </Field>
        <Field label="Web" className="sm:col-span-2">
          <input
            className={controlClass}
            inputMode="url"
            value={track.web}
            onChange={(event) => setField('web', event.target.value)}
          />
        </Field>
        <Field label="E-mails" className="sm:col-span-2">
          <textarea
            className={areaClass}
            rows={2}
            value={track.emails}
            onChange={(event) => setField('emails', event.target.value)}
          />
        </Field>
        <Field label="Primer e-mail" className="sm:col-span-2">
          <textarea
            className={areaClass}
            rows={4}
            value={track.primerEmail}
            onChange={(event) => setField('primerEmail', event.target.value)}
          />
        </Field>
        <Field label="Followup" className="sm:col-span-2">
          <textarea
            className={areaClass}
            rows={4}
            value={track.followup}
            onChange={(event) => setField('followup', event.target.value)}
          />
        </Field>
        <Field label="Primera actividad">
          <input
            className={controlClass}
            type="date"
            value={track.primeraActividad}
            onChange={(event) => setField('primeraActividad', event.target.value)}
          />
        </Field>
        <Field label="Última actividad">
          <input
            className={controlClass}
            type="date"
            value={track.ultimaActividad}
            onChange={(event) => setField('ultimaActividad', event.target.value)}
          />
        </Field>

        <div className="flex flex-col gap-2 sm:col-span-2">
          <span className="text-xs text-muted">Diario</span>
          {track.diario.length === 0 && <p className="text-sm text-muted">Sin líneas en el diario.</p>}
          <div className="divide-y divide-line border-y border-line">
            {track.diario.map((line, index) => (
              <div key={`${line.date}-${index}`} className="grid grid-cols-1 gap-3 py-3.5">
                <Field label="Fecha">
                  <input
                    className={controlClass}
                    type="date"
                    value={line.date}
                    onChange={(event) => setLine(index, { date: event.target.value })}
                  />
                </Field>
                <Field label="Texto">
                  <textarea
                    className={areaClass}
                    rows={2}
                    value={line.text}
                    onChange={(event) => setLine(index, { text: event.target.value })}
                  />
                </Field>
                <TextButton
                  onClick={() =>
                    setField(
                      'diario',
                      track.diario.filter((_, i) => i !== index),
                    )
                  }
                >
                  Quitar línea
                </TextButton>
              </div>
            ))}
          </div>
          <PrimaryButton
            className="self-start"
            onClick={() => setField('diario', [...track.diario, { date: todayISO(), text: '' }])}
          >
            <Plus size={16} weight="regular" aria-hidden="true" />
            Añadir línea
          </PrimaryButton>
        </div>

        {offer.notStated && (
          <p className="border-t border-line pt-4 text-sm leading-relaxed text-muted sm:col-span-2">
            {offer.notStated}
          </p>
        )}
      </div>
    </section>
  )
}
