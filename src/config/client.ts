import { drizzle } from 'drizzle-orm/expo-sqlite';
import EventEmitter from 'eventemitter3';
import { openDatabaseSync } from 'expo-sqlite';

import * as schema from '../database/schema';
import AudioService from '../service/audio/AudioService';
import type { Events } from '../type/struct';
import { DATABASE_NAME } from './constant';

export const eventEmitter = new EventEmitter<Events>();

export const expoDatabase = openDatabaseSync(DATABASE_NAME, { enableChangeListener: true });
export const db = drizzle(expoDatabase, { schema });

export const audioService = new AudioService();
