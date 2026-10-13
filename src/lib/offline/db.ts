import Dexie, { Table } from 'dexie';

export interface OfflineSOSRecord {
  id?: number;
  localId: string; // e.g. DRAFT-SOS-12345
  emergencyType: string;
  description: string;
  latitude: number;
  longitude: number;
  address: string;
  peopleCount: number;
  hasVulnerable: boolean;
  contactName: string;
  contactPhone: string;
  synced: boolean;
  serverRequestId?: string;
  createdAt: string;
}

export interface CachedShelter {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  totalCapacity: number;
  occupiedCapacity: number;
  availableBeds: number;
  contactPhone?: string | null;
  hasFood: boolean;
  hasDrinkingWater: boolean;
  hasMedical: boolean;
  isAccessible: boolean;
}

export interface CachedBundle {
  key: string;
  data: any;
  cachedAt: string;
}

export class AapdaSetuDexieDB extends Dexie {
  offlineSOS!: Table<OfflineSOSRecord, number>;
  shelters!: Table<CachedShelter, string>;
  bundle!: Table<CachedBundle, string>;

  constructor() {
    super('AapdaSetuDB');
    this.version(1).stores({
      offlineSOS: '++id, localId, synced, createdAt',
      shelters: 'id, name, availableBeds',
      bundle: 'key, cachedAt',
    });
  }
}

export const offlineDB = typeof window !== 'undefined' ? new AapdaSetuDexieDB() : (null as any);

