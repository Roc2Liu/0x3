/**
 * 背景图片管理工具
 * 使用 IndexedDB 存储背景图片和历史记录
 * 注意：图片以原始质量存储，不进行压缩
 */

const DB_NAME = '0x3-background-images'
const DB_VERSION = 1
const STORE_NAME = 'images'
const CURRENT_KEY = 'current'
const HISTORY_KEY = 'history'
const MAX_HISTORY_COUNT = 5 // 最多保存 5 张历史背景

let dbInstance = null
let migrationDone = false

/**
 * 从 localStorage 迁移数据到 IndexedDB
 */
async function migrateFromLocalStorage() {
  // 如果已经迁移过，直接返回
  if (migrationDone) {
    return
  }

  try {
    const oldCurrent = localStorage.getItem('0x3-background-image')
    const oldHistory = localStorage.getItem('0x3-background-history')

    // 如果没有旧数据，标记为已迁移
    if (!oldCurrent && !oldHistory) {
      migrationDone = true
      return
    }

    const db = await openDB()

    // 迁移当前背景图片
    if (oldCurrent) {
      await new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite')
        const store = transaction.objectStore(STORE_NAME)
        const request = store.put(oldCurrent, CURRENT_KEY)

        request.onsuccess = () => resolve()
        request.onerror = () => reject(request.error)
      })
    }

    // 迁移历史记录
    if (oldHistory) {
      try {
        const parsed = JSON.parse(oldHistory)
        if (Array.isArray(parsed) && parsed.length > 0) {
          await new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readwrite')
            const store = transaction.objectStore(STORE_NAME)
            const request = store.put(parsed, HISTORY_KEY)

            request.onsuccess = () => resolve()
            request.onerror = () => reject(request.error)
          })
        }
      } catch (e) {
        console.error('Failed to parse old history:', e)
      }
    }

    // 迁移完成后，删除 localStorage 中的数据
    try {
      localStorage.removeItem('0x3-background-image')
      localStorage.removeItem('0x3-background-history')
    } catch (e) {
      console.error('Failed to remove old localStorage data:', e)
    }

    migrationDone = true
    console.log('Background images migrated from localStorage to IndexedDB')
  } catch (e) {
    console.error('Failed to migrate from localStorage:', e)
  }
}

/**
 * 打开 IndexedDB 数据库
 * @returns {Promise<IDBDatabase>}
 */
async function openDB() {
  return new Promise((resolve, reject) => {
    // 如果已经有打开的数据库实例，直接返回
    if (dbInstance) {
      resolve(dbInstance)
      return
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => {
      console.error('Failed to open IndexedDB:', request.error)
      reject(request.error)
    }

    request.onsuccess = async () => {
      dbInstance = request.result
      // 首次打开数据库时，尝试从 localStorage 迁移数据
      if (!migrationDone) {
        await migrateFromLocalStorage()
      }
      resolve(dbInstance)
    }

    request.onupgradeneeded = (event) => {
      const db = event.target.result
      // 创建对象存储（如果不存在）
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME)
      }
    }
  })
}

/**
 * 获取当前背景图片
 * @returns {Promise<string|null>} 背景图片的 data URL 或 null
 */
export async function getBackgroundImage() {
  try {
    const db = await openDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.get(CURRENT_KEY)

      request.onsuccess = () => {
        resolve(request.result || null)
      }

      request.onerror = () => {
        console.error('Failed to get background image:', request.error)
        reject(request.error)
      }
    })
  } catch (e) {
    console.error('Failed to get background image:', e)
    return null
  }
}

/**
 * 设置背景图片（原始质量，不压缩）
 * @param {string} imageDataUrl - 图片的 data URL
 * @returns {Promise<string>} 原始图片的 data URL
 */
export async function setBackgroundImage(imageDataUrl) {
  try {
    const db = await openDB()

    // 存储当前背景图片
    await new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.put(imageDataUrl, CURRENT_KEY)

      request.onsuccess = () => resolve()
      request.onerror = () => {
        console.error('Failed to save background image:', request.error)
        reject(request.error)
      }
    })

    // 添加到历史记录
    await addToHistory(imageDataUrl)

    return imageDataUrl
  } catch (e) {
    console.error('Failed to set background image:', e)
    if (e.name === 'QuotaExceededError' || e.name === 'QuotaError') {
      throw new Error('存储空间不足，请删除一些历史背景图片')
    }
    throw new Error('保存背景图片失败：' + e.message)
  }
}

/**
 * 清除背景图片
 */
export async function clearBackgroundImage() {
  try {
    const db = await openDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.delete(CURRENT_KEY)

      request.onsuccess = () => resolve()
      request.onerror = () => {
        console.error('Failed to clear background image:', request.error)
        reject(request.error)
      }
    })
  } catch (e) {
    console.error('Failed to clear background image:', e)
  }
}

/**
 * 获取背景图片历史记录
 * @returns {Promise<string[]>} 历史背景图片数组
 */
export async function getBackgroundImagesHistory() {
  try {
    const db = await openDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.get(HISTORY_KEY)

      request.onsuccess = () => {
        const history = request.result
        if (!history) {
          resolve([])
          return
        }

        // 确保是数组格式
        if (!Array.isArray(history)) {
          resolve([])
          return
        }

        // 过滤掉无效的数据
        const validHistory = history.filter(
          img => img && typeof img === 'string' && img.startsWith('data:image')
        )
        resolve(validHistory)
      }

      request.onerror = () => {
        console.error('Failed to get background history:', request.error)
        reject(request.error)
      }
    })
  } catch (e) {
    console.error('Failed to get background history:', e)
    return []
  }
}

/**
 * 添加到历史记录
 * @param {string} imageDataUrl - 图片的 data URL
 */
async function addToHistory(imageDataUrl) {
  try {
    let history = await getBackgroundImagesHistory()

    // 如果已存在，先移除
    history = history.filter(img => img !== imageDataUrl)

    // 添加到开头
    history.unshift(imageDataUrl)

    // 限制历史记录数量
    if (history.length > MAX_HISTORY_COUNT) {
      // 移除最旧的记录
      history = history.slice(0, MAX_HISTORY_COUNT)
    }

    const db = await openDB()
    await new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.put(history, HISTORY_KEY)

      request.onsuccess = () => resolve()
      request.onerror = () => {
        console.error('Failed to save history:', request.error)
        reject(request.error)
      }
    })
  } catch (e) {
    console.error('Failed to add to history:', e)
    // 如果存储失败，尝试清理一些空间
    if (e.name === 'QuotaExceededError' || e.name === 'QuotaError') {
      try {
        // 只保留最新的 5 张
        let history = await getBackgroundImagesHistory()
        history = history.filter(img => img !== imageDataUrl)
        history.unshift(imageDataUrl)
        history = history.slice(0, 5)

        const db = await openDB()
        await new Promise((resolve, reject) => {
          const transaction = db.transaction([STORE_NAME], 'readwrite')
          const store = transaction.objectStore(STORE_NAME)
          const request = store.put(history, HISTORY_KEY)

          request.onsuccess = () => resolve()
          request.onerror = () => reject(request.error)
        })
      } catch (retryError) {
        console.error('Failed to retry add to history:', retryError)
      }
    }
  }
}

/**
 * 从历史记录中移除
 * @param {string} imageDataUrl - 要移除的图片 data URL
 */
export async function removeFromHistory(imageDataUrl) {
  try {
    let history = await getBackgroundImagesHistory()
    history = history.filter(img => img !== imageDataUrl)

    const db = await openDB()
    await new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.put(history, HISTORY_KEY)

      request.onsuccess = () => resolve()
      request.onerror = () => {
        console.error('Failed to remove from history:', request.error)
        reject(request.error)
      }
    })
  } catch (e) {
    console.error('Failed to remove from history:', e)
    if (e.name === 'QuotaExceededError' || e.name === 'QuotaError') {
      // 如果存储空间不足，尝试清理更多空间
      try {
        // 只保留最新的 5 张
        let history = await getBackgroundImagesHistory()
        history = history.filter(img => img !== imageDataUrl)
        history = history.slice(0, 5)

        const db = await openDB()
        await new Promise((resolve, reject) => {
          const transaction = db.transaction([STORE_NAME], 'readwrite')
          const store = transaction.objectStore(STORE_NAME)
          const request = store.put(history, HISTORY_KEY)

          request.onsuccess = () => resolve()
          request.onerror = () => reject(request.error)
        })
      } catch (retryError) {
        console.error('Failed to retry remove from history:', retryError)
      }
    }
  }
}

/**
 * 清除所有历史记录
 */
export async function clearHistory() {
  try {
    const db = await openDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.delete(HISTORY_KEY)

      request.onsuccess = () => resolve()
      request.onerror = () => {
        console.error('Failed to clear history:', request.error)
        reject(request.error)
      }
    })
  } catch (e) {
    console.error('Failed to clear history:', e)
  }
}
