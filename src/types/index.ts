export type UserRole = 'ciudadano' | 'funcionario' | 'admin';

export interface Usuario {
  id: string;
  uid: string;
  cedula: string; // Ecuadorian National ID
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string;
  direccion: string;
  parroquia: ParroquiaLogrono;
  role: UserRole;
  departamento?: string; // For officers (e.g. Obras Públicas, Agua Potable, Avalúos)
  cargo?: string;
  avatarUrl?: string;
  createdAt: string;
  isVerified?: boolean;
}

export type ParroquiaLogrono = 'Logroño (Centro)' | 'Yaupi' | 'Shimpis' | 'Comunidad Shuar / Sector Rural';

export type IncidenciaCategory =
  | 'Alumbrado Público'
  | 'Agua Potable'
  | 'Alcantarillado'
  | 'Vialidad'
  | 'Basura'
  | 'Ambiente'
  | 'Parques'
  | 'Seguridad'
  | 'Emergencias'
  | 'Otros';

export type IncidenciaPriority = 'Baja' | 'Media' | 'Alta' | 'Urgente';

export type IncidenciaStatus =
  | 'Registrado'
  | 'Recibido'
  | 'En revisión'
  | 'Asignado'
  | 'En proceso'
  | 'Resuelto'
  | 'Cerrado';

export interface LocationGPS {
  lat: number;
  lng: number;
  direccionAproximada: string;
  parroquia: ParroquiaLogrono;
  barrioSector?: string;
}

export interface CommentItem {
  id: string;
  authorName: string;
  authorRole: UserRole;
  authorAvatar?: string;
  content: string;
  timestamp: string;
  isInternal?: boolean;
  attachments?: string[];
}

export interface StatusTimelineEvent {
  id: string;
  status: IncidenciaStatus | TramiteStatus;
  title: string;
  description: string;
  updatedBy: string;
  timestamp: string;
}

export interface Incidencia {
  id: string;
  codigoTracking: string; // e.g. INC-2026-LOG-0142
  titulo: string;
  descripcion: string;
  categoria: IncidenciaCategory;
  prioridad: IncidenciaPriority;
  estado: IncidenciaStatus;
  ubicacion: LocationGPS;
  fotosUrl: string[];
  fotografiaResolucionUrl?: string;
  ciudadanoId: string;
  ciudadanoNombre: string;
  ciudadanoCedula: string;
  ciudadanoTelefono: string;
  funcionarioAsignadoId?: string;
  funcionarioAsignadoNombre?: string;
  departamentoResponsable: string;
  comentarios: CommentItem[];
  timeline: StatusTimelineEvent[];
  isOfflineCreated?: boolean;
  syncedAt?: string;
  createdAt: string;
  updatedAt: string;
  resolucionFecha?: string;
  evaluacionCiudadana?: {
    calificacion: number; // 1 to 5 stars
    comentario?: string;
  };
}

export type TramiteStatus =
  | 'Registrado'
  | 'En revisión'
  | 'Requiere corrección'
  | 'En inspección'
  | 'Aprobado'
  | 'Rechazado'
  | 'Finalizado';

export interface DocumentoAdjunto {
  id: string;
  nombre: string;
  tipo: 'pdf' | 'imagen' | 'otro';
  tamanoBytes: number;
  url: string;
  fechaSubida: string;
  verificado?: boolean;
}

export interface Tramite {
  id: string;
  numeroExpediente: string; // e.g. EXP-2026-LOG-00891
  tituloTramite: string;
  codigoCatalogo: string;
  ciudadanoId: string;
  ciudadanoNombre: string;
  ciudadanoCedula: string;
  ciudadanoEmail: string;
  ciudadanoTelefono: string;
  parroquia: ParroquiaLogrono;
  barrioSector: string;
  camposDinamicos: Record<string, string | number | boolean>;
  documentos: DocumentoAdjunto[];
  estado: TramiteStatus;
  funcionarioAsignadoId?: string;
  funcionarioAsignadoNombre?: string;
  departamentoResponsable: string;
  observaciones?: string;
  timeline: StatusTimelineEvent[];
  comentarios: CommentItem[];
  documentoResolucionFinalUrl?: string; // PDF resolution or approval certificate
  codigoFirmaDigital?: string; // Hash or certificate validation code
  montoPagoUSD?: number;
  pagoRealizado?: boolean;
  comprobantePagoUrl?: string;
  createdAt: string;
  updatedAt: string;
  isOfflineCreated?: boolean;
}

export interface TramiteCatalogoItem {
  id: string;
  codigo: string;
  titulo: string;
  descripcion: string;
  departamento: string;
  tiempoEstimadoDias: number;
  costoUSD: number;
  requisitos: string[];
  iconoName: string;
  camposRequeridos: Array<{
    id: string;
    label: string;
    tipo: 'texto' | 'numero' | 'fecha' | 'select' | 'textarea' | 'checkbox';
    opciones?: string[];
    required: boolean;
    helperText?: string;
  }>;
}

export interface Notificacion {
  id: string;
  usuarioId: string;
  titulo: string;
  mensaje: string;
  tipo: 'incidencia' | 'tramite' | 'comunicado' | 'sistema';
  referenciaId?: string;
  leida: boolean;
  createdAt: string;
  urlAccion?: string;
}

export interface AuditoriaLog {
  id: string;
  usuarioId: string;
  usuarioNombre: string;
  usuarioRole: UserRole;
  accion: string; // e.g. "CAMBIO_ESTADO_INCIDENCIA", "APROBACION_TRAMITE"
  entidad: 'Incidencia' | 'Tramite' | 'Usuario' | 'Configuracion';
  entidadId: string;
  detalles: string;
  ipAddress: string;
  timestamp: string;
}

export interface AccessibilitySettings {
  highContrast: boolean;
  fontSizeMultiplier: number; // 1, 1.15, 1.3
  screenReaderOptimized: boolean;
  darkMode: boolean;
}

export interface FilterIncidenciasState {
  search: string;
  categoria: string;
  estado: string;
  prioridad: string;
  parroquia: string;
  misIncidenciasSolo: boolean;
}

export interface FilterTramitesState {
  search: string;
  estado: string;
  departamento: string;
  misTramitesSolo: boolean;
}
