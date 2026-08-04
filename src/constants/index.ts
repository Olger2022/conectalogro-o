import {
  Incidencia,
  Tramite,
  TramiteCatalogoItem,
  Usuario,
  ParroquiaLogrono,
  IncidenciaCategory,
  AuditoriaLog
} from '../types';

export const INSTITUCION_INFO = {
  nombre: 'Gobierno Autónomo Descentralizado Municipal del Cantón Logroño',
  siglas: 'GAD Municipal de Logroño',
  plataforma: 'LOGROÑO CONECTA',
  slogan: 'Participación Ciudadana y Gestión Municipal Transparente',
  provincia: 'Morona Santiago',
  canton: 'Logroño',
  pais: 'Ecuador',
  alcaldia: 'Alcaldía de Logroño',
  direccion: 'Av. Miguel Tinoco y Calle Amazonas, Logroño - Morona Santiago, Ecuador',
  telefono: '(07) 271-0120 / (07) 271-0125',
  email: 'contacto@logrono.gob.ec',
  horario: 'Lunes a Viernes: 08:00 - 12:30 y 13:30 - 17:00',
  emergenciasPhone: '911 / (07) 271-0115 (Bomberos Logroño)',
  runc: '1460001230001',
  coordenadasLogrono: {
    lat: -2.6231,
    lng: -78.1924,
  },
};

export const PARROQUIAS_LOGRONO: ParroquiaLogrono[] = [
  'Logroño (Centro)',
  'Yaupi',
  'Shimpis',
  'Comunidad Shuar / Sector Rural',
];

export const CATEGORIAS_INCIDENCIA: IncidenciaCategory[] = [
  'Alumbrado Público',
  'Agua Potable',
  'Alcantarillado',
  'Vialidad',
  'Basura',
  'Ambiente',
  'Parques',
  'Seguridad',
  'Emergencias',
  'Otros',
];

export const CATALOGO_TRAMITES_INITIAL: TramiteCatalogoItem[] = [
  {
    id: 'TRAM-001',
    codigo: 'CERT-NO-ADEUDAR',
    titulo: 'Certificado de No Adeudar al Municipio de Logroño',
    descripcion: 'Documento oficial que acredita que el ciudadano no posee haberes pendientes ni obligaciones fiscales vencidas con el GAD Municipal.',
    departamento: 'Dirección Financiera / Tesorería',
    tiempoEstimadoDias: 1,
    costoUSD: 2.50,
    requisitos: [
      'Cédula de Identidad del solicitante (PDF)',
      'Número de teléfono celular y correo electrónico actualizado',
      'Comprobante de pago de la tasa administrativa ($2.50)'
    ],
    iconoName: 'FileCheck',
    camposRequeridos: [
      { id: 'motivoSolicitud', label: 'Motivo de la solicitud', tipo: 'select', opciones: ['Trámite vehicular', 'Trámite de tierras / escrituras', 'Permiso comercial', 'Uso personal', 'Otro'], required: true },
      { id: 'observacionesCiudadano', label: 'Detalles adicionales o número de predio (si aplica)', tipo: 'textarea', required: false }
    ]
  },
  {
    id: 'TRAM-002',
    codigo: 'PERMISO-CONSTRUCCION',
    titulo: 'Permiso de Construcción Menor y Cerramiento',
    descripcion: 'Autorización municipal para obras menores, remodelaciones, cerramientos perimetrales y adecondicionamiento en áreas urbanas y rurales.',
    departamento: 'Dirección de Planificación Urbano-Rural',
    tiempoEstimadoDias: 3,
    costoUSD: 15.00,
    requisitos: [
      'Cédula y papeleta de votación del propietario',
      'Copia simple de la Escritura Pública inscrita en el Registro de la Propiedad',
      'Croquis o plano sencillo de la obra a ejecutar (PDF/Imagen)',
      'Certificado de No Adeudar al Municipio'
    ],
    iconoName: 'Home',
    camposRequeridos: [
      { id: 'direccionObra', label: 'Dirección exacta del inmueble o predio', tipo: 'texto', required: true },
      { id: 'areaMetrosCuadrados', label: 'Área aproximada a intervenir (m²)', tipo: 'numero', required: true },
      { id: 'tipoObra', label: 'Tipo de intervención', tipo: 'select', opciones: ['Cerramiento perimetral', 'Remodelación interior', 'Construcción menor (hasta 40m²)', 'Pintado y fachada'], required: true },
      { id: 'presupuestoEstimado', label: 'Presupuesto estimado de la obra ($)', tipo: 'numero', required: true }
    ]
  },
  {
    id: 'TRAM-003',
    codigo: 'AGUA-CONEXION-NUEVA',
    titulo: 'Solicitud de Conexión de Agua Potable y Alcantarillado',
    descripcion: 'Trámite para instalar un nuevo medidor de agua potable o acometida sanitaria en viviendas de Logroño Centro, Yaupi o Shimpis.',
    departamento: 'Dirección de Agua Potable y Alcantarillado',
    tiempoEstimadoDias: 5,
    costoUSD: 35.00,
    requisitos: [
      'Cédula de Identidad del solicitante',
      'Certificado de Propiedad o Contrato de Arrendamiento',
      'Croquis de ubicación de la vivienda',
      'Certificado de No Adeudar'
    ],
    iconoName: 'Droplets',
    camposRequeridos: [
      { id: 'servicioSolicitado', label: 'Servicio a solicitar', tipo: 'select', opciones: ['Agua Potable y Alcantarillado', 'Solo Agua Potable', 'Solo Alcantarillado Sanitarios'], required: true },
      { id: 'referenciaUbicacion', label: 'Referencia geográfica (calle o sector cercano)', tipo: 'texto', required: true },
      { id: 'habitantesEstimados', label: 'Número de personas que habitarán la propiedad', tipo: 'numero', required: true }
    ]
  },
  {
    id: 'TRAM-004',
    codigo: 'PATENTE-MUNICIPAL',
    titulo: 'Obtención de Patente Municipal y Licencia de Funcionamiento',
    descripcion: 'Registro anual obligatorio para personas naturales o jurídicas que ejercen actividades comerciales, industriales o de servicios en el Cantón Logroño.',
    departamento: 'Dirección Financiera / Comisaría Municipal',
    tiempoEstimadoDias: 2,
    costoUSD: 20.00,
    requisitos: [
      'RUC activo del establecimiento (PDF)',
      'Cédula del representante legal o comerciante',
      'Informe favorable del Cuerpo de Bomberos de Logroño',
      'Certificado de No Adeudar al Municipio'
    ],
    iconoName: 'Store',
    camposRequeridos: [
      { id: 'nombreComercial', label: 'Nombre Comercial del Establecimiento', tipo: 'texto', required: true },
      { id: 'actividadEconomica', label: 'Actividad Económica Principal (RUC)', tipo: 'texto', required: true },
      { id: 'numeroRuc', label: 'Número de RUC', tipo: 'texto', required: true }
    ]
  },
  {
    id: 'TRAM-005',
    codigo: 'AVALUOS-CERTIFICADO',
    titulo: 'Certificado de Avalúos y Catastros de Predio Urbano o Rústico',
    descripcion: 'Certificación oficial con el avalúo comercial, municipal, superficie y linderos del predio registrado en la base catastral del GAD Logroño.',
    departamento: 'Dirección de Avalúos y Catastros',
    tiempoEstimadoDias: 2,
    costoUSD: 5.00,
    requisitos: [
      'Clave Catastral o Nombre del Propietario',
      'Cédula de Identidad del solicitante',
      'Certificado de No Adeudar'
    ],
    iconoName: 'MapPin',
    camposRequeridos: [
      { id: 'claveCatastral', label: 'Clave Catastral (Si se conoce)', tipo: 'texto', required: false },
      { id: 'tipoPredio', label: 'Tipo de predio', tipo: 'select', opciones: ['Urbano (Cabecera cantonal)', 'Rústico / Rural'], required: true }
    ]
  }
];

export const USUARIOS_SEED: Usuario[] = [
  {
    id: 'usr-ciudadano-1',
    uid: 'uid-ciudadano-1',
    cedula: '1400892341',
    nombres: 'María Belén',
    apellidos: 'Espinoza Chuji',
    email: 'maria.espinoza@gmail.com',
    telefono: '0987123456',
    direccion: 'Barrio San José, Av. Miguel Tinoco',
    parroquia: 'Logroño (Centro)',
    role: 'ciudadano',
    createdAt: '2026-01-10T10:00:00.000Z',
    isVerified: true,
  },
  {
    id: 'usr-funcionario-1',
    uid: 'uid-funcionario-1',
    cedula: '1400543219',
    nombres: 'Ing. Carlos',
    apellidos: 'Vargas Saant',
    email: 'carlos.vargas@logrono.gob.ec',
    telefono: '0991234567',
    direccion: 'Calle Sucre y Amazonas',
    parroquia: 'Logroño (Centro)',
    role: 'funcionario',
    departamento: 'Dirección de Agua Potable y Alcantarillado',
    cargo: 'Inspector Técnico de Campo',
    createdAt: '2025-11-01T08:00:00.000Z',
    isVerified: true,
  },
  {
    id: 'usr-admin-1',
    uid: 'uid-admin-1',
    cedula: '1400112233',
    nombres: 'Lcdo. Franklin',
    apellidos: 'Chinkias Tsenkush',
    email: 'admin@logrono.gob.ec',
    telefono: '0984567890',
    direccion: 'Palacio Municipal, Av. Miguel Tinoco',
    parroquia: 'Logroño (Centro)',
    role: 'admin',
    departamento: 'Alcaldía / Coordinación General de Tecnologías y Transparencia',
    cargo: 'Administrador General del Sistema',
    createdAt: '2025-10-15T09:00:00.000Z',
    isVerified: true,
  },
];

export const INCIDENCIAS_SEED: Incidencia[] = [
  {
    id: 'inc-001',
    codigoTracking: 'INC-2026-LOG-0012',
    titulo: 'Fuga de agua potable en tubería principal de Av. Miguel Tinoco',
    descripcion: 'Se evidencia ruptura de abrazadera en la red principal, desperdiciando líquido vital cerca del parque infantil. Riesgo de erosión en la calzada.',
    categoria: 'Agua Potable',
    prioridad: 'Alta',
    estado: 'En proceso',
    ubicacion: {
      lat: -2.6234,
      lng: -78.1921,
      direccionAproximada: 'Av. Miguel Tinoco frente a la Escuela 10 de Agosto',
      parroquia: 'Logroño (Centro)',
      barrioSector: 'Barrio Central',
    },
    fotosUrl: [
      'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80',
    ],
    ciudadanoId: 'usr-ciudadano-1',
    ciudadanoNombre: 'María Belén Espinoza',
    ciudadanoCedula: '1400892341',
    ciudadanoTelefono: '0987123456',
    funcionarioAsignadoId: 'usr-funcionario-1',
    funcionarioAsignadoNombre: 'Ing. Carlos Vargas Saant',
    departamentoResponsable: 'Dirección de Agua Potable y Alcantarillado',
    comentarios: [
      {
        id: 'c-1',
        authorName: 'María Belén Espinoza',
        authorRole: 'ciudadano',
        content: 'Reporto este incidente urgentemente ya que el agua está saliendo con mucha presión desde temprano.',
        timestamp: '2026-08-01T08:30:00.000Z',
      },
      {
        id: 'c-2',
        authorName: 'Ing. Carlos Vargas Saant',
        authorRole: 'funcionario',
        content: 'Reporte asignado a la cuadrilla #2 de Agua Potable. Nos trasladamos con válvulas de repuesto.',
        timestamp: '2026-08-01T10:15:00.000Z',
      },
    ],
    timeline: [
      {
        id: 'tl-1',
        status: 'Registrado',
        title: 'Reporte ingresado en la plataforma',
        description: 'Generado con coordenadas GPS por el ciudadano.',
        updatedBy: 'María Belén Espinoza',
        timestamp: '2026-08-01T08:30:00.000Z',
      },
      {
        id: 'tl-2',
        status: 'Recibido',
        title: 'Validación por Mesa de Servicio Municipal',
        description: 'Categoría confirmada y enviada a EMAPAL Logroño.',
        updatedBy: 'Sistema GAD Logroño',
        timestamp: '2026-08-01T09:00:00.000Z',
      },
      {
        id: 'tl-3',
        status: 'Asignado',
        title: 'Asignación de cuadrilla técnica',
        description: 'Responsables: Ing. Carlos Vargas Saant',
        updatedBy: 'Coordinador Obras Públicas',
        timestamp: '2026-08-01T10:15:00.000Z',
      },
      {
        id: 'tl-4',
        status: 'En proceso',
        title: 'Cuadrilla interviniendo en territorio',
        description: 'Corte temporal de suministro sectorial para sustitución de acople.',
        updatedBy: 'Ing. Carlos Vargas Saant',
        timestamp: '2026-08-02T09:00:00.000Z',
      },
    ],
    createdAt: '2026-08-01T08:30:00.000Z',
    updatedAt: '2026-08-02T09:00:00.000Z',
  },
  {
    id: 'inc-002',
    codigoTracking: 'INC-2026-LOG-0028',
    titulo: 'Luminaria pública quemada en vía hacia la parroquia Yaupi',
    descripcion: 'Dos postes metálicos de alumbrado se encuentran apagados por más de una semana, generando peligro en el tránsito vehicular nocturno.',
    categoria: 'Alumbrado Público',
    prioridad: 'Media',
    estado: 'Registrado',
    ubicacion: {
      lat: -2.6310,
      lng: -78.1880,
      direccionAproximada: 'Vía principal Logroño - Yaupi, km 2.5',
      parroquia: 'Yaupi',
      barrioSector: 'Sector El Puente',
    },
    fotosUrl: [
      'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80',
    ],
    ciudadanoId: 'usr-ciudadano-1',
    ciudadanoNombre: 'María Belén Espinoza',
    ciudadanoCedula: '1400892341',
    ciudadanoTelefono: '0987123456',
    departamentoResponsable: 'Dirección de Servicios Públicos y Electrificación',
    comentarios: [],
    timeline: [
      {
        id: 'tl-21',
        status: 'Registrado',
        title: 'Incidencia ingresada en plataforma',
        description: 'Se remite aviso a servicios públicos para coordinación con Centrosur/GAD.',
        updatedBy: 'María Belén Espinoza',
        timestamp: '2026-08-03T14:20:00.000Z',
      },
    ],
    createdAt: '2026-08-03T14:20:00.000Z',
    updatedAt: '2026-08-03T14:20:00.000Z',
  },
  {
    id: 'inc-003',
    codigoTracking: 'INC-2026-LOG-0005',
    titulo: 'Mantenimiento y desbroce en el Parque Ecológico de Shimpis',
    descripcion: 'Maleza alta en senderos y juegos infantiles. Se requiere intervención de la cuadrilla de áreas verdes del municipio.',
    categoria: 'Parques',
    prioridad: 'Baja',
    estado: 'Resuelto',
    ubicacion: {
      lat: -2.6180,
      lng: -78.2010,
      direccionAproximada: 'Centro Parroquial Shimpis',
      parroquia: 'Shimpis',
      barrioSector: 'Parque Parroquial',
    },
    fotosUrl: [
      'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?auto=format&fit=crop&w=800&q=80',
    ],
    fotografiaResolucionUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb231fc?auto=format&fit=crop&w=800&q=80',
    ciudadanoId: 'usr-ciudadano-1',
    ciudadanoNombre: 'Pedro Tsenkush',
    ciudadanoCedula: '1400998811',
    ciudadanoTelefono: '0982233445',
    funcionarioAsignadoId: 'usr-funcionario-1',
    funcionarioAsignadoNombre: 'Ing. Carlos Vargas Saant',
    departamentoResponsable: 'Gestión Ambiental y Parques',
    comentarios: [
      {
        id: 'c-31',
        authorName: 'Ing. Carlos Vargas Saant',
        authorRole: 'funcionario',
        content: 'Mantenimiento ejecutado satisfactoriamente el día 28 de Julio con personal de la junta parroquial Shimpis.',
        timestamp: '2026-07-28T16:00:00.000Z',
      },
    ],
    timeline: [
      { id: 't3-1', status: 'Registrado', title: 'Registrado', description: 'Ingreso por app', updatedBy: 'Pedro Tsenkush', timestamp: '2026-07-25T10:00:00.000Z' },
      { id: 't3-2', status: 'En proceso', title: 'Cuadrilla enviada', description: 'Mantenimiento de poda', updatedBy: 'Carlos Vargas', timestamp: '2026-07-27T08:00:00.000Z' },
      { id: 't3-3', status: 'Resuelto', title: 'Trabajos concluidos', description: 'Foto de evidencia adjunta', updatedBy: 'Carlos Vargas', timestamp: '2026-07-28T16:00:00.000Z' },
    ],
    createdAt: '2026-07-25T10:00:00.000Z',
    updatedAt: '2026-07-28T16:00:00.000Z',
    resolucionFecha: '2026-07-28T16:00:00.000Z',
    evaluacionCiudadana: {
      calificacion: 5,
      comentario: '¡Excelente atención! Dejaron el parque limpio y seguro para los niños.',
    },
  },
];

export const TRAMITES_SEED: Tramite[] = [
  {
    id: 'trm-001',
    numeroExpediente: 'EXP-2026-LOG-00482',
    tituloTramite: 'Certificado de No Adeudar al Municipio de Logroño',
    codigoCatalogo: 'CERT-NO-ADEUDAR',
    ciudadanoId: 'usr-ciudadano-1',
    ciudadanoNombre: 'María Belén Espinoza Chuji',
    ciudadanoCedula: '1400892341',
    ciudadanoEmail: 'maria.espinoza@gmail.com',
    ciudadanoTelefono: '0987123456',
    parroquia: 'Logroño (Centro)',
    barrioSector: 'Barrio San José',
    camposDinamicos: {
      motivoSolicitud: 'Trámite vehicular',
      observacionesCiudadano: 'Renovación de matrícula en la Agencia de Tránsito.',
    },
    documentos: [
      {
        id: 'doc-1',
        nombre: 'Cedula_Maria_Espinoza.pdf',
        tipo: 'pdf',
        tamanoBytes: 420000,
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        fechaSubida: '2026-08-02T11:00:00.000Z',
        verificado: true,
      },
    ],
    estado: 'Aprobado',
    funcionarioAsignadoId: 'usr-admin-1',
    funcionarioAsignadoNombre: 'Lcdo. Franklin Chinkias',
    departamentoResponsable: 'Dirección Financiera / Tesorería',
    observaciones: 'Aprobado sin observaciones. El comprobante fiscal refleja saldo cero.',
    timeline: [
      { id: 'tl-t1', status: 'Registrado', title: 'Expediente digital aperturado', description: 'Ingreso por portal web', updatedBy: 'María Belén Espinoza', timestamp: '2026-08-02T11:00:00.000Z' },
      { id: 'tl-t2', status: 'En revisión', title: 'Verificación en sistema catastral y tesorería', description: 'Revisión tributaria automatizada', updatedBy: 'Sistema GAD', timestamp: '2026-08-02T11:10:00.000Z' },
      { id: 'tl-t3', status: 'Aprobado', title: 'Certificado digital emitido con Firma QR', description: 'Validez legal de 30 días', updatedBy: 'Lcdo. Franklin Chinkias', timestamp: '2026-08-02T12:00:00.000Z' },
    ],
    comentarios: [],
    documentoResolucionFinalUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    codigoFirmaDigital: 'FIRMA-GAD-LOG-2026-99A82B',
    montoPagoUSD: 2.50,
    pagoRealizado: true,
    createdAt: '2026-08-02T11:00:00.000Z',
    updatedAt: '2026-08-02T12:00:00.000Z',
  },
  {
    id: 'trm-002',
    numeroExpediente: 'EXP-2026-LOG-00501',
    tituloTramite: 'Permiso de Construcción Menor y Cerramiento',
    codigoCatalogo: 'PERMISO-CONSTRUCCION',
    ciudadanoId: 'usr-ciudadano-1',
    ciudadanoNombre: 'María Belén Espinoza Chuji',
    ciudadanoCedula: '1400892341',
    ciudadanoEmail: 'maria.espinoza@gmail.com',
    ciudadanoTelefono: '0987123456',
    parroquia: 'Logroño (Centro)',
    barrioSector: 'Barrio La Unión',
    camposDinamicos: {
      direccionObra: 'Calle Sucre y Av. Miguel Tinoco',
      areaMetrosCuadrados: 35,
      tipoObra: 'Cerramiento perimetral',
      presupuestoEstimado: 1200,
    },
    documentos: [
      {
        id: 'doc-2',
        nombre: 'Croquis_Cerramiento_Solar.pdf',
        tipo: 'pdf',
        tamanoBytes: 1100000,
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        fechaSubida: '2026-08-03T09:30:00.000Z',
        verificado: true,
      },
    ],
    estado: 'En revisión',
    departamentoResponsable: 'Dirección de Planificación Urbano-Rural',
    observaciones: 'Expediente asignado al Arquitecto revisor de turno.',
    timeline: [
      { id: 'tl-t21', status: 'Registrado', title: 'Solicitud enviada exitosamente', description: 'Expediente EXP-2026-LOG-00501', updatedBy: 'María Belén Espinoza', timestamp: '2026-08-03T09:30:00.000Z' },
      { id: 'tl-t22', status: 'En revisión', title: 'Revisión de alineamiento y retiro frontal', description: 'En análisis por Planificación', updatedBy: 'Arq. Comisario Municipal', timestamp: '2026-08-03T10:00:00.000Z' },
    ],
    comentarios: [],
    montoPagoUSD: 15.00,
    pagoRealizado: true,
    createdAt: '2026-08-03T09:30:00.000Z',
    updatedAt: '2026-08-03T10:00:00.000Z',
  },
];

export const AUDITORIA_SEED: AuditoriaLog[] = [
  {
    id: 'aud-1',
    usuarioId: 'usr-admin-1',
    usuarioNombre: 'Lcdo. Franklin Chinkias',
    usuarioRole: 'admin',
    accion: 'APROBACION_TRAMITE',
    entidad: 'Tramite',
    entidadId: 'EXP-2026-LOG-00482',
    detalles: 'Aprobación y firma digital de Certificado de No Adeudar',
    ipAddress: '190.152.14.88',
    timestamp: '2026-08-02T12:00:00.000Z',
  },
  {
    id: 'aud-2',
    usuarioId: 'usr-funcionario-1',
    usuarioNombre: 'Ing. Carlos Vargas Saant',
    usuarioRole: 'funcionario',
    accion: 'CAMBIO_ESTADO_INCIDENCIA',
    entidad: 'Incidencia',
    entidadId: 'INC-2026-LOG-0012',
    detalles: 'Actualizado estado a "En proceso" con asignación de cuadrilla #2',
    ipAddress: '190.152.14.92',
    timestamp: '2026-08-02T09:00:00.000Z',
  },
];
