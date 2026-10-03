import type { BackupPayload, Catalog, Progress } from "./types";
import { book, lesson as lessonOne } from "./lesson-data";
import { lessonTwo } from "./lesson-two";
import { grammarBook, grammarLessons } from "./grammar-book";

const DB_NAME = "oboeru";
const DB_VERSION = 1;
const STORE = "appState";
const PROGRESS_KEY = "lesson-01-progress";
const CATALOG_KEY = "catalog";

const initialCatalog = (): Catalog => ({ books: [book, grammarBook], lessons: [lessonOne, lessonTwo, ...grammarLessons] });

function mergeBuiltInCatalog(stored: Catalog): Catalog {
  const builtIn = initialCatalog();
  const bookIds = new Set(stored.books.map((item) => item.id));
  const lessonIds = new Set(stored.lessons.map((item) => item.id));
  const builtInLessons = new Map(builtIn.lessons.map((item) => [item.id, item]));
  return {
    ...stored,
    books: [...stored.books, ...builtIn.books.filter((item) => !bookIds.has(item.id))],
    lessons: [
      ...stored.lessons.map((item) => item.contentStatus === "index_only" && !stored.editedLessonIds?.includes(item.id) && builtInLessons.has(item.id) ? builtInLessons.get(item.id)! : item),
      ...builtIn.lessons.filter((item) => !lessonIds.has(item.id) && !stored.deletedLessonIds?.includes(item.id)),
    ],
  };
}

export const emptyProgress = (): Progress => ({
  learnedIds: [], attempts: [], lastSection: "overview", updatedAt: new Date().toISOString(),
});

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE)) request.result.createObjectStore(STORE);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function run<T>(mode: IDBTransactionMode, operation: (store: IDBObjectStore) => IDBRequest<T>) {
  const database = await openDatabase();
  return new Promise<T>((resolve, reject) => {
    const tx = database.transaction(STORE, mode);
    const request = operation(tx.objectStore(STORE));
    let result: T;
    request.onsuccess = () => { result = request.result; };
    tx.oncomplete = () => { database.close(); resolve(result); };
    tx.onerror = () => { database.close(); reject(tx.error); };
    tx.onabort = () => { database.close(); reject(tx.error); };
  });
}

export const progressRepository = {
  async get(): Promise<Progress> {
    return (await run<Progress | undefined>("readonly", (store) => store.get(PROGRESS_KEY))) ?? emptyProgress();
  },
  async save(progress: Progress): Promise<void> {
    await run<IDBValidKey>("readwrite", (store) => store.put(progress, PROGRESS_KEY));
  },
  async restore(backup: BackupPayload): Promise<Progress> {
    if (backup.format !== "oboeru-backup" || (backup.version !== 1 && backup.version !== 2)) throw new Error("ไฟล์นี้ไม่ใช่ Oboeru backup เวอร์ชันที่รองรับ");
    if (!Array.isArray(backup.progress?.learnedIds) || !Array.isArray(backup.progress?.attempts)) throw new Error("ข้อมูล progress ในไฟล์ไม่สมบูรณ์");
    const restored = { ...backup.progress, updatedAt: new Date().toISOString() };
    await this.save(restored);
    return restored;
  },
};

export const catalogRepository = {
  async get(): Promise<Catalog> {
    const stored = await run<Catalog | undefined>("readonly", (store) => store.get(CATALOG_KEY));
    if (stored) {
      const merged = mergeBuiltInCatalog(stored);
      if (JSON.stringify(merged) !== JSON.stringify(stored)) await this.save(merged);
      return merged;
    }
    const seed = initialCatalog();
    await this.save(seed);
    return seed;
  },
  async save(catalog: Catalog): Promise<void> {
    await run<IDBValidKey>("readwrite", (store) => store.put(catalog, CATALOG_KEY));
  },
};

export async function saveLearningState(catalog: Catalog, progress: Progress): Promise<void> {
  const database = await openDatabase();
  await new Promise<void>((resolve, reject) => {
    const tx = database.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(catalog, CATALOG_KEY);
    tx.objectStore(STORE).put(progress, PROGRESS_KEY);
    tx.oncomplete = () => { database.close(); resolve(); };
    tx.onerror = () => { database.close(); reject(tx.error); };
    tx.onabort = () => { database.close(); reject(tx.error); };
  });
}

export async function restoreBackup(backup: BackupPayload): Promise<{ progress: Progress; catalog: Catalog }> {
  if (backup.format !== "oboeru-backup" || (backup.version !== 1 && backup.version !== 2)) throw new Error("ไฟล์นี้ไม่ใช่ Oboeru backup เวอร์ชันที่รองรับ");
  if (!Array.isArray(backup.progress?.learnedIds) || !Array.isArray(backup.progress?.attempts)) throw new Error("ข้อมูล progress ในไฟล์ไม่สมบูรณ์");
  if (backup.catalog && (!Array.isArray(backup.catalog.books) || !Array.isArray(backup.catalog.lessons)
    || (backup.catalog.deletedLessonIds !== undefined && (!Array.isArray(backup.catalog.deletedLessonIds) || backup.catalog.deletedLessonIds.some((id) => typeof id !== "string")))
    || (backup.catalog.editedLessonIds !== undefined && (!Array.isArray(backup.catalog.editedLessonIds) || backup.catalog.editedLessonIds.some((id) => typeof id !== "string")))
    || backup.catalog.books.some((item) => typeof item.id !== "string" || typeof item.title !== "string")
    || backup.catalog.lessons.some((item) => typeof item.id !== "string" || typeof item.bookId !== "string"
      || !Array.isArray(item.vocabularyGroups) || !Array.isArray(item.examples) || !Array.isArray(item.exercises)))) {
    throw new Error("Catalog ในไฟล์สำรองไม่สมบูรณ์");
  }
  const catalog = backup.catalog ?? await catalogRepository.get();
  const progress = { ...backup.progress, updatedAt: new Date().toISOString() };
  const database = await openDatabase();
  await new Promise<void>((resolve, reject) => {
    const tx = database.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(progress, PROGRESS_KEY);
    tx.objectStore(STORE).put(catalog, CATALOG_KEY);
    tx.oncomplete = () => { database.close(); resolve(); };
    tx.onerror = () => { database.close(); reject(tx.error); };
  });
  return { progress, catalog };
}

export function createBackup(progress: Progress, catalog: Catalog): BackupPayload {
  return { format: "oboeru-backup", version: 2, exportedAt: new Date().toISOString(), progress, catalog };
}
