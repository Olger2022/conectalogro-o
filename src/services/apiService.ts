import {
  Incidencia,
  Tramite,
  Notificacion,
  AuditoriaLog,
  CommentItem,
  StatusTimelineEvent,
  IncidenciaStatus,
  TramiteStatus,
  IncidenciaPriority,
  IncidenciaCategory
} from '../types';
import { INCIDENCIAS_SEED, TRAMITES_SEED, AUDITORIA_SEED } from '../constants';
import { offlineDB, isOnline } from '../db/dexieDB';
import { db, auth, testFirestoreConnection } from '../firebase/firebaseConfig';
import {
  collection,
  doc,
  setDoc,
  getDocs,
  onSnapshot,
  Unsubscribe
} from 'firebase/firestore';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

class ApiService {
  private incidenciasInMemory: Incidencia[] = [...INCIDENCIAS_SEED];
  private tramitesInMemory: Tramite[] = [...TRAMITES_SEED];
  private notificacionesInMemory: Notificacion[] = [
    {
      id: 'notif-1',
      usuarioId: 'usr-ciudadano-1',
      titulo: 'Actualización de Incidencia INC-2026-LOG-0012',
      mensaje: 'Su reporte de Fuga de Agua ha cambiado a estado "En proceso". Cuadrilla asignada.',
      tipo: 'incidencia',
      referenciaId: 'inc-001',
      leida: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'notif-2',
      usuarioId: 'usr-ciudadano-1',
      titulo: 'Certificado de No Adeudar Aprobado',
      mensaje: 'Su trámite EXP-2026-LOG-00482 ha sido APROBADO. Ya puede descargar su certificado firmado.',
      tipo: 'tramite',
      referenciaId: 'trm-001',
      leida: true,
      createdAt: new Date().toISOString(),
    },
  ];
  private auditoriaInMemory: AuditoriaLog[] = [...AUDITORIA_SEED];

  private unsubscribes: Unsubscribe[] = [];
  public isFirestoreLive = false;

  constructor() {
    this.initDexieCache();
    this.initFirestoreRealtimeSync();
  }

  private async initDexieCache() {
    try {
      const incCount = await offlineDB.incidencias.count();
      if (incCount === 0) {
        await offlineDB.incidencias.bulkAdd(this.incidenciasInMemory);
      }
      const trmCount = await offlineDB.tramites.count();
      if (trmCount === 0) {
        await offlineDB.tramites.bulkAdd(this.tramitesInMemory);
      }
    } catch (err) {
      console.warn('Dexie DB initialization notice:', err);
    }
  }

  /**
   * Automatic Real-Time Synchronization with Firebase Firestore
   */
  public async initFirestoreRealtimeSync() {
    try {
      // Test connection
      await testFirestoreConnection();

      // 1. Sync Incidencias
      const incRef = collection(db, 'incidencias');
      const unsubInc = onSnapshot(
        incRef,
        async (snapshot) => {
          this.isFirestoreLive = true;
          if (!snapshot.empty) {
            const remoteIncidencias: Incidencia[] = [];
            snapshot.forEach((docSnap) => {
              remoteIncidencias.push(docSnap.data() as Incidencia);
            });
            
            // Merge with local items
            const mergedMap = new Map<string, Incidencia>();
            this.incidenciasInMemory.forEach(item => mergedMap.set(item.id, item));
            remoteIncidencias.forEach(item => mergedMap.set(item.id, item));
            
            this.incidenciasInMemory = Array.from(mergedMap.values()).sort(
              (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );

            // Update Dexie
            try {
              await offlineDB.incidencias.clear();
              await offlineDB.incidencias.bulkAdd(this.incidenciasInMemory);
            } catch (e) {}
          } else {
            // Seed initial data to Firestore if completely empty
            for (const inc of this.incidenciasInMemory) {
              await setDoc(doc(db, 'incidencias', inc.id), inc).catch(() => {});
            }
          }
        },
        (error) => {
          console.warn('Firestore incidencias subscription error:', error);
        }
      );
      this.unsubscribes.push(unsubInc);

      // 2. Sync Trámites
      const trmRef = collection(db, 'tramites');
      const unsubTrm = onSnapshot(
        trmRef,
        async (snapshot) => {
          if (!snapshot.empty) {
            const remoteTramites: Tramite[] = [];
            snapshot.forEach((docSnap) => {
              remoteTramites.push(docSnap.data() as Tramite);
            });

            const mergedMap = new Map<string, Tramite>();
            this.tramitesInMemory.forEach(item => mergedMap.set(item.id, item));
            remoteTramites.forEach(item => mergedMap.set(item.id, item));

            this.tramitesInMemory = Array.from(mergedMap.values()).sort(
              (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );

            try {
              await offlineDB.tramites.clear();
              await offlineDB.tramites.bulkAdd(this.tramitesInMemory);
            } catch (e) {}
          } else {
            for (const trm of this.tramitesInMemory) {
              await setDoc(doc(db, 'tramites', trm.id), trm).catch(() => {});
            }
          }
        },
        (error) => {
          console.warn('Firestore tramites subscription error:', error);
        }
      );
      this.unsubscribes.push(unsubTrm);

      // 3. Sync Notificaciones
      const notifRef = collection(db, 'notificaciones');
      const unsubNotif = onSnapshot(
        notifRef,
        (snapshot) => {
          if (!snapshot.empty) {
            const remoteNotifs: Notificacion[] = [];
            snapshot.forEach((docSnap) => {
              remoteNotifs.push(docSnap.data() as Notificacion);
            });

            const mergedMap = new Map<string, Notificacion>();
            this.notificacionesInMemory.forEach(item => mergedMap.set(item.id, item));
            remoteNotifs.forEach(item => mergedMap.set(item.id, item));

            this.notificacionesInMemory = Array.from(mergedMap.values()).sort(
              (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          }
        },
        (error) => {
          console.warn('Firestore notificaciones subscription error:', error);
        }
      );
      this.unsubscribes.push(unsubNotif);

      // 4. Sync Auditoría
      const auditRef = collection(db, 'auditoria');
      const unsubAudit = onSnapshot(
        auditRef,
        (snapshot) => {
          if (!snapshot.empty) {
            const remoteAudit: AuditoriaLog[] = [];
            snapshot.forEach((docSnap) => {
              remoteAudit.push(docSnap.data() as AuditoriaLog);
            });

            const mergedMap = new Map<string, AuditoriaLog>();
            this.auditoriaInMemory.forEach(item => mergedMap.set(item.id, item));
            remoteAudit.forEach(item => mergedMap.set(item.id, item));

            this.auditoriaInMemory = Array.from(mergedMap.values()).sort(
              (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            );
          }
        },
        (error) => {
          console.warn('Firestore auditoria subscription error:', error);
        }
      );
      this.unsubscribes.push(unsubAudit);

    } catch (err) {
      console.warn('Firestore initialization fallback:', err);
    }
  }

  // INCIDENCIAS METHODS
  async getIncidencias(): Promise<Incidencia[]> {
    try {
      const dexieItems = await offlineDB.incidencias.toArray();
      if (dexieItems && dexieItems.length > 0) {
        return dexieItems.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
    } catch (e) {
      console.warn('Reading from memory fallback:', e);
    }
    return this.incidenciasInMemory.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getIncidenciaById(id: string): Promise<Incidencia | null> {
    try {
      const found = await offlineDB.incidencias.get(id);
      if (found) return found;
    } catch (e) {}
    return this.incidenciasInMemory.find((i) => i.id === id) || null;
  }

  async createIncidencia(data: {
    titulo: string;
    descripcion: string;
    categoria: IncidenciaCategory;
    prioridad: IncidenciaPriority;
    lat: number;
    lng: number;
    direccionAproximada: string;
    parroquia: any;
    barrioSector?: string;
    fotosUrl: string[];
    ciudadano: {
      id: string;
      nombre: string;
      cedula: string;
      telefono: string;
    };
  }): Promise<Incidencia> {
    const trackingSeq = Math.floor(1000 + Math.random() * 9000);
    const newIncidencia: Incidencia = {
      id: `inc-${Date.now()}`,
      codigoTracking: `INC-2026-LOG-${trackingSeq}`,
      titulo: data.titulo,
      descripcion: data.descripcion,
      categoria: data.categoria,
      prioridad: data.prioridad,
      estado: 'Registrado',
      ubicacion: {
        lat: data.lat,
        lng: data.lng,
        direccionAproximada: data.direccionAproximada,
        parroquia: data.parroquia,
        barrioSector: data.barrioSector,
      },
      fotosUrl: data.fotosUrl,
      ciudadanoId: data.ciudadano.id,
      ciudadanoNombre: data.ciudadano.nombre,
      ciudadanoCedula: data.ciudadano.cedula,
      ciudadanoTelefono: data.ciudadano.telefono,
      departamentoResponsable: this.getDepartmentForCategory(data.categoria),
      comentarios: [],
      timeline: [
        {
          id: `tl-${Date.now()}`,
          status: 'Registrado',
          title: 'Incidencia ingresada en la plataforma municipal',
          description: 'Apertura de caso con evidencias e imágenes adjuntas.',
          updatedBy: data.ciudadano.nombre,
          timestamp: new Date().toISOString(),
        },
      ],
      isOfflineCreated: !isOnline(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.incidenciasInMemory.unshift(newIncidencia);

    // Save locally
    try {
      await offlineDB.incidencias.add(newIncidencia);
    } catch (e) {}

    // Save to Firestore
    if (isOnline()) {
      try {
        await setDoc(doc(db, 'incidencias', newIncidencia.id), newIncidencia);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `incidencias/${newIncidencia.id}`);
      }
    } else {
      try {
        await offlineDB.syncQueue.add({
          id: `sync-${Date.now()}`,
          type: 'INCIDENCIA_CREATE',
          payload: newIncidencia,
          createdAt: new Date().toISOString(),
          attempts: 0,
        });
      } catch (e) {}
    }

    this.recordAuditLog({
      usuarioId: data.ciudadano.id,
      usuarioNombre: data.ciudadano.nombre,
      usuarioRole: 'ciudadano',
      accion: 'CREACION_INCIDENCIA',
      entidad: 'Incidencia',
      entidadId: newIncidencia.codigoTracking,
      detalles: `Reporte de ${newIncidencia.categoria}: ${newIncidencia.titulo}`,
    });

    return newIncidencia;
  }

  async updateIncidenciaStatus(
    incidenciaId: string,
    nuevoEstado: IncidenciaStatus,
    observacion: string,
    updatedBy: { id: string; nombre: string; role: any },
    fotografiaResolucionUrl?: string
  ): Promise<Incidencia> {
    const inc = await this.getIncidenciaById(incidenciaId);
    if (!inc) throw new Error('Incidencia no encontrada');

    const timelineEvent: StatusTimelineEvent = {
      id: `tl-${Date.now()}`,
      status: nuevoEstado,
      title: `Cambio de estado a: ${nuevoEstado}`,
      description: observacion,
      updatedBy: updatedBy.nombre,
      timestamp: new Date().toISOString(),
    };

    const updatedInc: Incidencia = {
      ...inc,
      estado: nuevoEstado,
      timeline: [...inc.timeline, timelineEvent],
      fotografiaResolucionUrl: fotografiaResolucionUrl || inc.fotografiaResolucionUrl,
      resolucionFecha: nuevoEstado === 'Resuelto' ? new Date().toISOString() : inc.resolucionFecha,
      updatedAt: new Date().toISOString(),
    };

    this.updateInMemoryIncidencia(updatedInc);

    try {
      await offlineDB.incidencias.put(updatedInc);
    } catch (e) {}

    if (isOnline()) {
      try {
        await setDoc(doc(db, 'incidencias', updatedInc.id), updatedInc);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `incidencias/${updatedInc.id}`);
      }
    }

    // Add notification to citizen
    this.createNotification({
      usuarioId: inc.ciudadanoId,
      titulo: `Actualización en Incidencia ${inc.codigoTracking}`,
      mensaje: `Su reporte "${inc.titulo}" ha cambiado al estado: ${nuevoEstado}`,
      tipo: 'incidencia',
      referenciaId: inc.id,
    });

    this.recordAuditLog({
      usuarioId: updatedBy.id,
      usuarioNombre: updatedBy.nombre,
      usuarioRole: updatedBy.role,
      accion: 'CAMBIO_ESTADO_INCIDENCIA',
      entidad: 'Incidencia',
      entidadId: inc.codigoTracking,
      detalles: `Nuevo estado: ${nuevoEstado}. Observación: ${observacion}`,
    });

    return updatedInc;
  }

  async addIncidenciaComment(
    incidenciaId: string,
    comment: Omit<CommentItem, 'id' | 'timestamp'>
  ): Promise<Incidencia> {
    const inc = await this.getIncidenciaById(incidenciaId);
    if (!inc) throw new Error('Incidencia no encontrada');

    const newComment: CommentItem = {
      ...comment,
      id: `comm-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };

    const updatedInc: Incidencia = {
      ...inc,
      comentarios: [...inc.comentarios, newComment],
      updatedAt: new Date().toISOString(),
    };

    this.updateInMemoryIncidencia(updatedInc);

    try {
      await offlineDB.incidencias.put(updatedInc);
    } catch (e) {}

    if (isOnline()) {
      try {
        await setDoc(doc(db, 'incidencias', updatedInc.id), updatedInc);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `incidencias/${updatedInc.id}`);
      }
    }

    return updatedInc;
  }

  // TRAMITES METHODS
  async getTramites(): Promise<Tramite[]> {
    try {
      const items = await offlineDB.tramites.toArray();
      if (items && items.length > 0) {
        return items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }
    } catch (e) {}
    return this.tramitesInMemory.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getTramiteById(id: string): Promise<Tramite | null> {
    try {
      const found = await offlineDB.tramites.get(id);
      if (found) return found;
    } catch (e) {}
    return this.tramitesInMemory.find((t) => t.id === id) || null;
  }

  async submitTramite(data: {
    tituloTramite: string;
    codigoCatalogo: string;
    departamentoResponsable: string;
    montoPagoUSD: number;
    parroquia: any;
    barrioSector: string;
    camposDinamicos: Record<string, any>;
    documentos: any[];
    ciudadano: {
      id: string;
      nombre: string;
      cedula: string;
      email: string;
      telefono: string;
    };
  }): Promise<Tramite> {
    const expSeq = Math.floor(10000 + Math.random() * 90000);
    const newTramite: Tramite = {
      id: `trm-${Date.now()}`,
      numeroExpediente: `EXP-2026-LOG-${expSeq}`,
      tituloTramite: data.tituloTramite,
      codigoCatalogo: data.codigoCatalogo,
      ciudadanoId: data.ciudadano.id,
      ciudadanoNombre: data.ciudadano.nombre,
      ciudadanoCedula: data.ciudadano.cedula,
      ciudadanoEmail: data.ciudadano.email,
      ciudadanoTelefono: data.ciudadano.telefono,
      parroquia: data.parroquia,
      barrioSector: data.barrioSector,
      camposDinamicos: data.camposDinamicos,
      documentos: data.documentos,
      estado: 'Registrado',
      departamentoResponsable: data.departamentoResponsable,
      montoPagoUSD: data.montoPagoUSD,
      pagoRealizado: true,
      comentarios: [],
      timeline: [
        {
          id: `tl-trm-${Date.now()}`,
          status: 'Registrado',
          title: 'Expediente Municipal aperturado',
          description: 'Documentación requerida recibida y en cola de revisión.',
          updatedBy: data.ciudadano.nombre,
          timestamp: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.tramitesInMemory.unshift(newTramite);

    try {
      await offlineDB.tramites.add(newTramite);
    } catch (e) {}

    if (isOnline()) {
      try {
        await setDoc(doc(db, 'tramites', newTramite.id), newTramite);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `tramites/${newTramite.id}`);
      }
    }

    this.recordAuditLog({
      usuarioId: data.ciudadano.id,
      usuarioNombre: data.ciudadano.nombre,
      usuarioRole: 'ciudadano',
      accion: 'APERTURA_TRAMITE',
      entidad: 'Tramite',
      entidadId: newTramite.numeroExpediente,
      detalles: `Ingreso de trámite: ${newTramite.tituloTramite}`,
    });

    return newTramite;
  }

  async updateTramiteStatus(
    tramiteId: string,
    nuevoEstado: TramiteStatus,
    observacion: string,
    updatedBy: { id: string; nombre: string; role: any },
    documentoResolucionFinalUrl?: string
  ): Promise<Tramite> {
    const tramite = await this.getTramiteById(tramiteId);
    if (!tramite) throw new Error('Trámite no encontrado');

    const timelineEvent: StatusTimelineEvent = {
      id: `tl-${Date.now()}`,
      status: nuevoEstado,
      title: `Estado del expediente: ${nuevoEstado}`,
      description: observacion,
      updatedBy: updatedBy.nombre,
      timestamp: new Date().toISOString(),
    };

    const firmaDigital = nuevoEstado === 'Aprobado'
      ? `FIRMA-GAD-LOG-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
      : tramite.codigoFirmaDigital;

    const updatedTramite: Tramite = {
      ...tramite,
      estado: nuevoEstado,
      observaciones: observacion,
      timeline: [...tramite.timeline, timelineEvent],
      codigoFirmaDigital: firmaDigital,
      documentoResolucionFinalUrl: documentoResolucionFinalUrl || tramite.documentoResolucionFinalUrl,
      updatedAt: new Date().toISOString(),
    };

    this.updateInMemoryTramite(updatedTramite);

    try {
      await offlineDB.tramites.put(updatedTramite);
    } catch (e) {}

    if (isOnline()) {
      try {
        await setDoc(doc(db, 'tramites', updatedTramite.id), updatedTramite);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `tramites/${updatedTramite.id}`);
      }
    }

    this.createNotification({
      usuarioId: tramite.ciudadanoId,
      titulo: `Trámite ${tramite.numeroExpediente} - ${nuevoEstado}`,
      mensaje: `Su trámite "${tramite.tituloTramite}" ha cambiado a estado: ${nuevoEstado}. ${observacion}`,
      tipo: 'tramite',
      referenciaId: tramite.id,
    });

    this.recordAuditLog({
      usuarioId: updatedBy.id,
      usuarioNombre: updatedBy.nombre,
      usuarioRole: updatedBy.role,
      accion: 'CAMBIO_ESTADO_TRAMITE',
      entidad: 'Tramite',
      entidadId: tramite.numeroExpediente,
      detalles: `Nuevo estado: ${nuevoEstado}`,
    });

    return updatedTramite;
  }

  // NOTIFICATIONS
  async getNotifications(usuarioId: string): Promise<Notificacion[]> {
    return this.notificacionesInMemory
      .filter((n) => n.usuarioId === usuarioId || n.usuarioId === 'todos')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async markNotificationRead(id: string): Promise<void> {
    const notif = this.notificacionesInMemory.find((n) => n.id === id);
    if (notif) {
      notif.leida = true;
      if (isOnline()) {
        try {
          await setDoc(doc(db, 'notificaciones', notif.id), notif);
        } catch (e) {}
      }
    }
  }

  private async createNotification(data: Omit<Notificacion, 'id' | 'leida' | 'createdAt'>): Promise<void> {
    const notif: Notificacion = {
      ...data,
      id: `notif-${Date.now()}`,
      leida: false,
      createdAt: new Date().toISOString(),
    };
    this.notificacionesInMemory.unshift(notif);

    if (isOnline()) {
      try {
        await setDoc(doc(db, 'notificaciones', notif.id), notif);
      } catch (e) {}
    }
  }

  // AUDIT LOGS
  async getAuditLogs(): Promise<AuditoriaLog[]> {
    return this.auditoriaInMemory.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  private async recordAuditLog(data: Omit<AuditoriaLog, 'id' | 'ipAddress' | 'timestamp'>): Promise<void> {
    const log: AuditoriaLog = {
      ...data,
      id: `aud-${Date.now()}`,
      ipAddress: '190.152.14.88',
      timestamp: new Date().toISOString(),
    };
    this.auditoriaInMemory.unshift(log);

    if (isOnline()) {
      try {
        await setDoc(doc(db, 'auditoria', log.id), log);
      } catch (e) {}
    }
  }

  // HELPER METHODS
  private getDepartmentForCategory(cat: IncidenciaCategory): string {
    switch (cat) {
      case 'Agua Potable':
      case 'Alcantarillado':
        return 'Dirección de Agua Potable y Alcantarillado';
      case 'Alumbrado Público':
        return 'Dirección de Servicios Públicos y Electrificación';
      case 'Vialidad':
      case 'Parques':
        return 'Dirección de Obras Públicas y Áreas Verdes';
      case 'Basura':
      case 'Ambiente':
        return 'Dirección de Gestión Ambiental y Aseo Cantonal';
      case 'Seguridad':
      case 'Emergencias':
        return 'Comisaría Municipal y Seguridad Ciudadana';
      default:
        return 'Atención Ciudadana y Coordinación Municipal';
    }
  }

  private updateInMemoryIncidencia(inc: Incidencia) {
    const idx = this.incidenciasInMemory.findIndex((i) => i.id === inc.id);
    if (idx !== -1) this.incidenciasInMemory[idx] = inc;
  }

  private updateInMemoryTramite(trm: Tramite) {
    const idx = this.tramitesInMemory.findIndex((t) => t.id === trm.id);
    if (idx !== -1) this.tramitesInMemory[idx] = trm;
  }

  // OFFLINE SYNC PROCESSOR
  async processSyncQueue(): Promise<number> {
    try {
      const items = await offlineDB.syncQueue.toArray();
      if (!items || items.length === 0) return 0;

      let syncedCount = 0;
      for (const item of items) {
        if (item.type === 'INCIDENCIA_CREATE' && item.payload) {
          await setDoc(doc(db, 'incidencias', item.payload.id), item.payload).catch(() => {});
        } else if (item.type === 'TRAMITE_CREATE' && item.payload) {
          await setDoc(doc(db, 'tramites', item.payload.id), item.payload).catch(() => {});
        }
        syncedCount++;
        await offlineDB.syncQueue.delete(item.id);
      }
      return syncedCount;
    } catch (e) {
      return 0;
    }
  }
}

export const apiService = new ApiService();
