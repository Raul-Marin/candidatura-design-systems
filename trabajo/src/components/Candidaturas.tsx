import { formatScore } from '../format'
import type { Offer, Track } from '../types'
import { controlClass } from './ui'

export function estadoLabel(estado: string | undefined) {
  return estado && estado.trim() ? estado : 'Sin estado'
}

export function Candidaturas({
  offers,
  tracks,
  selectedId,
  onSelect,
}: {
  offers: Offer[]
  tracks: Record<string, Track>
  selectedId: string | null
  onSelect: (id: string) => void
}) {
  const count = offers.length === 1 ? '1 candidatura' : `${offers.length} candidaturas`

  return (
    <aside className="border-b border-line px-4 py-4 lg:w-80 lg:shrink-0 lg:border-b-0 lg:border-r lg:px-0 lg:py-6">
      <div className="lg:px-6">
        <h2 className="text-sm font-medium">Mis candidaturas</h2>
        <p className="mt-1 text-xs text-muted">{count}</p>
      </div>

      {offers.length === 0 ? (
        <p className="mt-4 text-sm leading-relaxed text-ink lg:px-6">
          No hay candidaturas. Usa Buscar ofertas para traer una del tablón.
        </p>
      ) : (
        <>
          <label className="mt-4 flex flex-col gap-2 lg:hidden">
            <span className="text-xs text-muted">Elegir candidatura</span>
            <select
              className={controlClass}
              value={selectedId ?? ''}
              onChange={(event) => onSelect(event.target.value)}
            >
              {offers.map((offer) => (
                <option key={offer.id} value={offer.id}>
                  {offer.company} · {offer.title}
                </option>
              ))}
            </select>
          </label>

          <ul className="mt-4 hidden flex-col lg:flex">
            {offers.map((offer) => {
              const selected = offer.id === selectedId
              const track = tracks[offer.id]
              return (
                <li key={offer.id}>
                  <button
                    type="button"
                    onClick={() => onSelect(offer.id)}
                    aria-current={selected ? 'true' : undefined}
                    className={`w-full cursor-pointer px-6 py-4 text-left text-ink ${
                      selected ? 'bg-[#e7e5e4] font-medium' : 'hover:bg-panel'
                    }`}
                  >
                    <span className="block text-sm break-words">{offer.company}</span>
                    <span className="mt-1 block text-sm font-normal leading-snug break-words">
                      {offer.title}
                    </span>
                    <span className="mt-2 block text-xs font-normal leading-relaxed text-muted">
                      {estadoLabel(track?.estado)}
                      {offer.score
                        ? ` · ${formatScore(offer.score.value)}/${offer.score.of}`
                        : ''}
                    </span>
                    {selected && (
                      <span className="mt-2 block text-xs font-medium text-ink">Seleccionada</span>
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        </>
      )}
    </aside>
  )
}
