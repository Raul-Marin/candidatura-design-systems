import { Plus } from '@phosphor-icons/react'
import { todayISO } from '../format'
import type { DiarioEntry, Estado, Track } from '../types'
import { Field, PrimaryButton, TextButton, areaClass, controlClass, surfaceClass } from './ui'

const estados: { value: Estado; label: string }[] = [
  { value: '', label: 'Sin estado' },
  { value: 'En preparación', label: 'En preparación' },
  { value: 'Lista para enviar', label: 'Lista para enviar' },
  { value: 'Enviada', label: 'Enviada' },
  { value: 'Seguimiento', label: 'Seguimiento' },
  { value: 'Cerrada', label: 'Cerrada' },
]

export function Seguimiento({ track, onChange }: { track: Track; onChange: (track: Track) => void }) {
  function setField<K extends keyof Track>(key: K, value: Track[K]) {
    onChange({ ...track, [key]: value })
  }

  function setLine(index: number, patch: Partial<DiarioEntry>) {
    setField(
      'diario',
      track.diario.map((line, i) => (i === index ? { ...line, ...patch } : line)),
    )
  }

  return (
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

      <div className="flex flex-col gap-3 sm:col-span-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-sm font-medium">Diario</h3>
          <PrimaryButton
            onClick={() => setField('diario', [...track.diario, { date: todayISO(), text: '' }])}
          >
            <Plus size={16} weight="regular" aria-hidden="true" />
            Añadir línea
          </PrimaryButton>
        </div>
        {track.diario.length === 0 && <p className="text-sm text-ink">Sin líneas en el diario.</p>}
        <div className="divide-y divide-line border-y border-line">
          {track.diario.map((line, index) => (
            <div key={`${line.date}-${index}`} className="grid grid-cols-1 gap-3 py-4">
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
      </div>
    </div>
  )
}
