export type WorkType = 'hybrid' | 'remote' | 'onsite'

export type Requirement = {
  text: string
  points: number
}

export type Score = {
  value: number
  of: number
  basis: string
}

export type Offer = {
  id: string
  posted: string
  title: string
  company: string
  location: string | null
  workType: WorkType | null
  workNote: string | null
  salary: string | null
  aiSkills: boolean
  applyUrl: string | null
  detailUrl: string | null
  score: Score | null
  requirements: Requirement[]
  note?: string
  notStated?: string
  adaptNote?: string
  cvFigmaUrl?: string
}

export type DiarioEntry = {
  date: string
  text: string
}

export type Estado =
  | ''
  | 'En preparación'
  | 'Lista para enviar'
  | 'Enviada'
  | 'Seguimiento'
  | 'Cerrada'

export type Track = {
  estado: Estado
  lugar: string
  puesto: string
  tipo: string
  web: string
  emails: string
  primerEmail: string
  followup: string
  primeraActividad: string
  ultimaActividad: string
  diario: DiarioEntry[]
}

export type Cv = {
  name: string
  figmaUrl: string
  note: string
}

export type Workspace = {
  cv: Cv
  selectedId: string | null
  offers: Offer[]
  tracks: Record<string, Track>
}

export function emptyTrack(): Track {
  return {
    estado: '',
    lugar: '',
    puesto: '',
    tipo: '',
    web: '',
    emails: '',
    primerEmail: '',
    followup: '',
    primeraActividad: '',
    ultimaActividad: '',
    diario: [],
  }
}
