import Dexie, { Table } from 'dexie';
import { Incidencia, Tramite, Notificacion } from '../types';

export interface PendingSyncItem {
  id: string;
  type: 'INCIDENCIA_CREATE' | 'INCIDENCIA_UPDATE' | 'TRAMITE_CREATE' | 'TRAMITE_UPDATE';
  payload: any;
  createdAt: string;
  attempts: number;
}

export class LogronoConectaDexieDB extends Dexie {
  incidencias!: Table<Incidencia>;
  tramites!: Table<Tramite>;
  notificaciones!: Table<Notificacion>;
  syncQueue!: Table<PendingSyncItem>;

  constructor() {
    super('LogronoConectaOfflineDB');
    this.version(1).stores({
      incidencias: 'id, codigoTracking, estado, categoria, parroquia, ciudadanoId, isOfflineCreated',
      tramites: 'id, numeroExpediente, estado, departamentoResponsable, ciudadanoId, isOfflineCreated',
      notificaciones: 'id, usuarioId, leida, tipo',
      syncQueue: 'id, type, createdAt, attempts',
    });
  }
}

export const offlineDB = new LogronoConectaDexieDB();

// Helper to check network connectivity
export const isOnline = (): boolean => {
  return typeof navigator !== 'undefined' ? navigator.onLine : true;
};
