"use client";

const DB_NAME = "pnc-journey-local-media";
const STORE_NAME = "media-previews";
const DB_VERSION = 1;
export const PHOTO_PREVIEW_EVENT = "pnc-photo-preview-updated";

export interface LocalMediaPreview {
  slotId: string;
  dataUrl: string;
  fileName: string;
  mimeType: string;
  updatedAt: number;
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !("indexedDB" in window)) {
      reject(new Error("IndexedDB unavailable"));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "slotId" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getLocalPreview(slotId: string): Promise<LocalMediaPreview | null> {
  try {
    const db = await openDb();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(slotId);
      req.onsuccess = () => resolve((req.result as LocalMediaPreview) ?? null);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return null;
  }
}

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Could not read file"));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export async function saveLocalPreview(slotId: string, file: File): Promise<LocalMediaPreview> {
  const dataUrl = await readFileAsDataUrl(file);
  const record: LocalMediaPreview = {
    slotId,
    dataUrl,
    fileName: file.name,
    mimeType: file.type,
    updatedAt: Date.now(),
  };

  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const req = store.put(record);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });

  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(PHOTO_PREVIEW_EVENT, { detail: { slotId } }));
  }

  return record;
}

export async function removeLocalPreview(slotId: string): Promise<void> {
  try {
    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(slotId);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent(PHOTO_PREVIEW_EVENT, { detail: { slotId } }));
    }
  } catch {
    // ignore cleanup failures
  }
}
