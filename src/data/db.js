import uuid from 'uuid/v4'

export const getDatabase = () => {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error('Browser does not appear to support IndexedDB.'))
    }

    const request = window.indexedDB.open('DealView', 1)

    request.onsuccess = () => {
      resolve(request.result)
    }
    request.onerror = () => {
      reject(request.error)
    }
    request.onblocked = event => {
      reject(new Error('Database cannot be loaded as it is currently in use.'))
    }
    request.onupgradeneeded = event => {
      const db = event.target.result
      if (!event.oldVersion || event.oldVersion < 1) {
        db.createObjectStore('Asset', { keyPath: 'id' })
        db.createObjectStore('Asset.RealEstate', { keyPath: 'id' })
        db.createObjectStore('Liability', { keyPath: 'id' })
        db.createObjectStore('Liability.Loan', { keyPath: 'id' })
        db.createObjectStore('BalanceSheet')
      }
    }
  })
}

export const getObject = (storeName, key) => {
  return new Promise((resolve, reject) => {
    getDatabase()
      .then(db => {
        const transaction = db.transaction([storeName], 'readonly')
        const store = transaction.objectStore(storeName)
        const request = store.get(key)
        request.onsuccess = event => {
          resolve(event.target.result)
        }
        request.onerror = () => {
          reject(request.error)
        }
      })
      .catch(error => {
        reject(error)
      })
  })
}

export const getAllObjects = storeName => {
  return new Promise((resolve, reject) => {
    getDatabase()
      .then(db => {
        const transaction = db.transaction([storeName], 'readonly')
        const store = transaction.objectStore(storeName)
        const objects = {}
        const request = store.openCursor()
        request.onsuccess = event => {
          const cursor = event.target.result
          if (cursor) {
            objects[cursor.key] = cursor.value
            cursor.continue()
          } else {
            resolve(objects)
          }
        }
        request.onerror = () => {
          reject(request.error)
        }
      })
      .catch(error => {
        reject(error)
      })
  })
}

export const putObject = (storeName, object, key) => {
  return new Promise((resolve, reject) => {
    getDatabase()
      .then(db => {
        const transaction = db.transaction([storeName], 'readwrite')
        const store = transaction.objectStore(storeName)
        if (!object.id) {
          object.id = uuid()
        }
        const request = key ? store.put(object, key) : store.put(object)
        request.onsuccess = event => {
          const saved = { ...object, id: event.target.result }
          resolve(saved)
        }
        request.onerror = () => {
          reject(request.error)
        }
      })
      .catch(error => {
        reject(error)
      })
  })
}

export const deleteObject = (storeName, key) => {
  return new Promise((resolve, reject) => {
    getDatabase()
      .then(db => {
        const transaction = db.transaction([storeName], 'readwrite')
        const store = transaction.objectStore(storeName)
        const request = store.delete(key)
        request.onsuccess = event => {
          resolve(key)
        }
        request.onerror = () => {
          reject(request.error)
        }
      })
      .catch(error => {
        reject(error)
      })
  })
}
