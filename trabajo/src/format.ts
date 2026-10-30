import type { Offer, WorkType } from './types'

export function todayISO(): string {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}

export function formatPosted(iso: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso)
  if (!match) return iso
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

export function formatScore(value: number): string {
  return new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: Number.isInteger(value) ? 0 : 1,
    maximumFractionDigits: 1,
  }).format(value)
}

export function workTypeLabel(workType: WorkType | null): string {
  if (workType === 'hybrid') return 'Híbrido'
  if (workType === 'remote') return 'Remoto'
  if (workType === 'onsite') return 'Presencial'
  return 'No indicada'
}

export function salaryLabel(salary: string | null): string {
  if (salary === null || salary.trim() === '') return 'No publicado'
  return salary
}

export function locationLabel(location: string | null): string {
  if (location === null || location.trim() === '') return 'No indicado'
  return location
}

export function aiLabel(aiSkills: boolean): string {
  return aiSkills ? 'Pide IA' : 'No pide IA'
}

export function offerId(company: string, title: string, existing: string[]): string {
  const base =
    `${company} ${title}`
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 60) || 'oferta'
  let id = base
  let n = 2
  while (existing.includes(id)) {
    id = `${base}-${n}`
    n += 1
  }
  return id
}

export function figmaEmbedSrc(fileUrl: string): string {
  const trimmed = fileUrl.trim()
  if (trimmed.includes('figma.com/embed')) return trimmed
  let decoded = trimmed
  try {
    decoded = decodeURIComponent(trimmed)
  } catch {
    decoded = trimmed
  }
  return `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(decoded)}`
}

export type DraftOffer = {
  posted: string
  title: string
  company: string
  location: string
  workType: '' | WorkType
  aiSkills: boolean
  salary: string
}

export function emptyDraft(): DraftOffer {
  return {
    posted: todayISO(),
    title: '',
    company: '',
    location: '',
    workType: '',
    aiSkills: false,
    salary: '',
  }
}

export function draftToOffer(draft: DraftOffer, existingIds: string[]): Offer {
  return {
    id: offerId(draft.company, draft.title, existingIds),
    posted: draft.posted,
    title: draft.title.trim(),
    company: draft.company.trim(),
    location: draft.location.trim() || null,
    workType: draft.workType || null,
    workNote: null,
    salary: draft.salary.trim() || null,
    aiSkills: draft.aiSkills,
    applyUrl: null,
    detailUrl: null,
    score: { value: 0, of: 0, basis: 'CV original' },
    requirements: [],
  }
}
