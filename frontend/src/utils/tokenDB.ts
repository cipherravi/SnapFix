function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("appDB", 1);

    request.onupgradeneeded = () => {
      const db = request.result;
      db.createObjectStore("tokens");
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveToken(token: string) {
  const db = await openDB();
  const tx = db.transaction("tokens", "readwrite");
  tx.objectStore("tokens").put(token, "auth_token");
  return new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}

export async function loadToken() {
  const db = await openDB();
  const tx = db.transaction("tokens", "readonly");
  const request = tx.objectStore("tokens").get("auth_token");
  return new Promise<string | undefined>((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    tx.onabort = () => reject(tx.error);
  });
}

export async function clearToken() {
  const db = await openDB();
  const tx = db.transaction("tokens", "readwrite");
  tx.objectStore("tokens").delete("auth_token");
  return new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}
