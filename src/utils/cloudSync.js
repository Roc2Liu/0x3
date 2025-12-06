/**
 * 云同步服务
 * 支持 GitHub Gist、坚果云 WebDAV 和匿名口令同步三种同步方式
 */

const GIST_FILENAME = '0x3-search-engines.json'
const SYNC_CONFIG_KEY = '0x3-cloud-sync-config'
const LAST_SYNC_KEY = '0x3-last-sync-time'

/**
 * GitHub Gist API 基础 URL
 */
const GITHUB_API_BASE = 'https://api.github.com'

/**
 * 坚果云 WebDAV 基础 URL
 */
const JIANGUOYUN_DAV_BASE = 'https://dav.jianguoyun.com/dav/'

/**
 * 匿名口令同步服务器基础 URL
 */
const ANONYMOUS_SYNC_BASE = 'https://sync.0x3.im:8443/api'

/**
 * 生成带日期的文件名
 * 格式：YY-MM-DD-search-engines.json
 * @returns {string} 文件名
 */
function generateFileNameWithDate() {
  const now = new Date()
  const year = String(now.getFullYear()).slice(-2) // 后两位年份
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}-search-engines.json`
}

/**
 * 获取存储的同步配置
 */
export function getSyncConfig() {
  const config = localStorage.getItem(SYNC_CONFIG_KEY)
  if (!config) return null

  try {
    return JSON.parse(config)
  } catch (e) {
    console.error('Failed to parse sync config:', e)
    return null
  }
}

/**
 * 保存同步配置
 */
export function saveSyncConfig(config) {
  localStorage.setItem(SYNC_CONFIG_KEY, JSON.stringify(config))
}

/**
 * 清除同步配置
 */
export function clearSyncConfig() {
  localStorage.removeItem(SYNC_CONFIG_KEY)
  localStorage.removeItem(LAST_SYNC_KEY)
}

/**
 * 检查是否已配置云同步
 */
export function isCloudSyncEnabled() {
  return getSyncConfig() !== null
}

/**
 * 获取最后同步时间
 */
export function getLastSyncTime() {
  const time = localStorage.getItem(LAST_SYNC_KEY)
  return time ? new Date(time) : null
}

/**
 * 保存最后同步时间
 */
function saveLastSyncTime() {
  localStorage.setItem(LAST_SYNC_KEY, new Date().toISOString())
}

/**
 * 使用 GitHub Personal Access Token 上传数据到 Gist
 * @param {string} token - GitHub Personal Access Token
 * @param {string} gistId - Gist ID（如果已存在）
 * @param {string} encryptedData - 加密后的数据
 * @returns {Promise<{gistId: string, url: string}>}
 */
export async function uploadToGist(token, gistId, encryptedData) {
  try {
    const url = gistId
      ? `${GITHUB_API_BASE}/gists/${gistId}`
      : `${GITHUB_API_BASE}/gists`

    const payload = {
      description: '0x3 搜索引擎配置 - 加密存储',
      public: false, // 私有 Gist
      files: {
        [GIST_FILENAME]: {
          content: encryptedData
        }
      }
    }

    // 如果是更新现有 Gist，添加所有现有文件
    if (gistId) {
      // 先获取现有 Gist 信息
      const existingResponse = await fetch(`${GITHUB_API_BASE}/gists/${gistId}`, {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      })

      if (!existingResponse.ok) {
        throw new Error('无法访问现有的 Gist，请检查权限')
      }

      const existingGist = await existingResponse.json()
      // 保留其他文件，只更新目标文件
      Object.keys(existingGist.files).forEach(filename => {
        if (filename !== GIST_FILENAME) {
          payload.files[filename] = existingGist.files[filename]
        }
      })
    }

    const response = await fetch(url, {
      method: gistId ? 'PATCH' : 'POST',
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || '上传失败')
    }

    const gist = await response.json()
    saveLastSyncTime()

    return {
      gistId: gist.id,
      url: gist.html_url
    }
  } catch (error) {
    console.error('Upload to Gist failed:', error)
    throw error
  }
}

/**
 * 从 Gist 下载数据
 * @param {string} token - GitHub Personal Access Token
 * @param {string} gistId - Gist ID
 * @returns {Promise<string>} 加密后的数据
 */
export async function downloadFromGist(token, gistId) {
  try {
    const response = await fetch(`${GITHUB_API_BASE}/gists/${gistId}`, {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    })

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Gist 不存在，请检查 Gist ID')
      }
      if (response.status === 403) {
        throw new Error('没有访问权限，请检查 Token 权限')
      }
      const error = await response.json()
      throw new Error(error.message || '下载失败')
    }

    const gist = await response.json()
    const file = gist.files[GIST_FILENAME]

    if (!file) {
      throw new Error('Gist 中未找到配置文件')
    }

    saveLastSyncTime()
    return file.content
  } catch (error) {
    console.error('Download from Gist failed:', error)
    throw error
  }
}

/**
 * 验证 GitHub Token 是否有效
 * @param {string} token - GitHub Personal Access Token
 * @returns {Promise<{valid: boolean, username?: string, error?: string}>}
 */
export async function validateGitHubToken(token) {
  try {
    const response = await fetch(`${GITHUB_API_BASE}/user`, {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    })

    if (!response.ok) {
      if (response.status === 401) {
        return { valid: false, error: 'Token 无效或已过期' }
      }
      return { valid: false, error: '验证失败' }
    }

    const user = await response.json()
    return {
      valid: true,
      username: user.login
    }
  } catch (error) {
    console.error('Token validation failed:', error)
    return {
      valid: false,
      error: error.message || '网络错误，请检查连接'
    }
  }
}

/**
 * 创建 Basic Auth 头部
 * @param {string} username - 用户名
 * @param {string} password - 密码
 * @returns {string} Authorization 头部值
 */
function createBasicAuth(username, password) {
  const credentials = btoa(`${username}:${password}`)
  return `Basic ${credentials}`
}

/**
 * 上传数据到坚果云 WebDAV
 * @param {string} username - 坚果云用户名
 * @param {string} password - 坚果云应用密码
 * @param {string} filePath - 文件路径（如：/0x3/25-12-05search-engines.json）
 * @param {string} encryptedData - 加密后的数据
 * @param {boolean} useDateInFilename - 是否在文件名中使用日期（默认 true）
 * @returns {Promise<{success: boolean, message?: string, filePath?: string}>}
 */
export async function uploadToJianguoyun(username, password, filePath, encryptedData, useDateInFilename = true) {
  try {
    let finalPath = filePath

    // 如果启用日期文件名，自动生成带日期的文件名
    if (useDateInFilename) {
      const fileName = generateFileNameWithDate()
      // 如果路径是目录（以 / 结尾），直接添加文件名
      if (filePath.endsWith('/')) {
        finalPath = `${filePath}${fileName}`
      } else {
        // 如果路径包含文件名，替换为带日期的文件名
        const pathParts = filePath.split('/')
        const directory = pathParts.slice(0, -1).join('/') || '/'
        finalPath = `${directory}/${fileName}`
      }
    }

    // 确保文件路径以 / 开头
    const normalizedPath = finalPath.startsWith('/') ? finalPath : `/${finalPath}`
    const url = `${JIANGUOYUN_DAV_BASE}${normalizedPath}`

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': createBasicAuth(username, password),
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: encryptedData
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('用户名或密码错误，请检查应用密码')
      }
      if (response.status === 403) {
        throw new Error('没有访问权限，请检查应用密码权限')
      }
      if (response.status === 404) {
        throw new Error('路径不存在，请检查文件路径')
      }
      throw new Error(`上传失败：HTTP ${response.status}`)
    }

    saveLastSyncTime()
    return { success: true, filePath: normalizedPath }
  } catch (error) {
    console.error('Upload to Jianguoyun failed:', error)
    throw error
  }
}

/**
 * 从目录路径生成当前日期的文件路径
 * @param {string} directory - 目录路径
 * @returns {string} 完整的文件路径
 */
function getCurrentDateFilePath(directory) {
  const fileName = generateFileNameWithDate()
  const normalizedDir = directory.endsWith('/') ? directory : `${directory}/`
  return `${normalizedDir}${fileName}`
}

/**
 * 从坚果云 WebDAV 下载数据
 * @param {string} username - 坚果云用户名
 * @param {string} password - 坚果云应用密码
 * @param {string} filePath - 文件路径或目录路径
 * @returns {Promise<string>} 加密后的数据
 */
export async function downloadFromJianguoyun(username, password, filePath) {
  try {
    let finalPath = filePath

    // 如果路径是目录（以 / 结尾），使用当前日期的文件名
    if (filePath.endsWith('/')) {
      finalPath = getCurrentDateFilePath(filePath)
    }

    // 确保文件路径以 / 开头
    const normalizedPath = finalPath.startsWith('/') ? finalPath : `/${finalPath}`
    const url = `${JIANGUOYUN_DAV_BASE}${normalizedPath}`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': createBasicAuth(username, password)
      }
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('用户名或密码错误，请检查应用密码')
      }
      if (response.status === 403) {
        throw new Error('没有访问权限，请检查应用密码权限')
      }
      if (response.status === 404) {
        throw new Error('文件不存在，请先上传一次')
      }
      throw new Error(`下载失败：HTTP ${response.status}`)
    }

    const data = await response.text()
    saveLastSyncTime()
    return data
  } catch (error) {
    console.error('Download from Jianguoyun failed:', error)
    throw error
  }
}

/**
 * 验证坚果云 WebDAV 凭据是否有效
 * @param {string} username - 坚果云用户名
 * @param {string} password - 坚果云应用密码
 * @returns {Promise<{valid: boolean, username?: string, error?: string}>}
 */
export async function validateJianguoyunCredentials(username, password) {
  try {
    // 使用 PROPFIND 请求验证凭据
    const response = await fetch(`${JIANGUOYUN_DAV_BASE}/`, {
      method: 'PROPFIND',
      headers: {
        'Authorization': createBasicAuth(username, password),
        'Depth': '0'
      }
    })

    if (!response.ok) {
      if (response.status === 401) {
        return { valid: false, error: '用户名或密码错误，请检查应用密码' }
      }
      if (response.status === 403) {
        return { valid: false, error: '没有访问权限，请检查应用密码权限' }
      }
      return { valid: false, error: '验证失败' }
    }

    return {
      valid: true,
      username: username
    }
  } catch (error) {
    console.error('Jianguoyun validation failed:', error)
    return {
      valid: false,
      error: error.message || '网络错误，请检查连接'
    }
  }
}

/**
 * 检查匿名口令同步服务器状态
 * @returns {Promise<{success: boolean, message?: string}>}
 */
export async function checkAnonymousSyncStatus() {
  try {
    const response = await fetch(`${ANONYMOUS_SYNC_BASE}/status`)
    if (!response.ok) {
      throw new Error('服务器不可用')
    }
    const data = await response.json()
    return { success: true, message: data.message || '服务器正常' }
  } catch (error) {
    console.error('Check anonymous sync status failed:', error)
    return {
      success: false,
      message: error.message || '无法连接到服务器'
    }
  }
}

/**
 * 上传数据到匿名口令同步服务器
 * @param {string} password - 口令
 * @param {string} encryptedData - 加密后的数据
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function uploadToAnonymousSync(password, encryptedData) {
  try {
    // 创建 Blob 对象
    const blob = new Blob([encryptedData], { type: 'application/json' })
    const file = new File([blob], '0x3-search-engines.json', { type: 'application/json' })

    const formData = new FormData()
    formData.append('password', password)
    formData.append('file', file)

    const response = await fetch(`${ANONYMOUS_SYNC_BASE}/upload`, {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: '上传失败' }))
      throw new Error(error.message || '上传失败')
    }

    const data = await response.json()
    saveLastSyncTime()
    return {
      success: true,
      message: data.message || '上传成功'
    }
  } catch (error) {
    console.error('Upload to anonymous sync failed:', error)
    throw error
  }
}

/**
 * 从匿名口令同步服务器下载数据
 * @param {string} password - 口令
 * @returns {Promise<string>} 加密后的数据
 */
export async function downloadFromAnonymousSync(password) {
  try {
    const response = await fetch(`${ANONYMOUS_SYNC_BASE}/download/${password}`)

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('文件不存在，请先上传一次')
      }
      const error = await response.json().catch(() => ({ message: '下载失败' }))
      throw new Error(error.message || '下载失败')
    }

    const blob = await response.blob()
    const text = await blob.text()
    saveLastSyncTime()
    return text
  } catch (error) {
    console.error('Download from anonymous sync failed:', error)
    throw error
  }
}

/**
 * 验证匿名口令同步服务器连接
 * @returns {Promise<{valid: boolean, error?: string}>}
 */
export async function validateAnonymousSync() {
  try {
    const result = await checkAnonymousSyncStatus()
    if (result.success) {
      return { valid: true }
    } else {
      return { valid: false, error: result.message }
    }
  } catch (error) {
    return {
      valid: false,
      error: error.message || '无法连接到服务器'
    }
  }
}

/**
 * 云同步：上传数据
 * @param {string} encryptedData - 加密后的数据
 * @returns {Promise<{success: boolean, message: string, gistId?: string}>}
 */
export async function syncUpload(encryptedData) {
  const config = getSyncConfig()
  if (!config) {
    throw new Error('未配置云同步')
  }

  try {
    if (config.type === 'anonymous') {
      // 匿名口令同步
      if (!config.password) {
        throw new Error('未配置口令，请先设置口令')
      }

      const result = await uploadToAnonymousSync(config.password, encryptedData)
      return {
        success: true,
        message: result.message || '上传成功'
      }
    } else if (config.type === 'jianguoyun') {
      // 坚果云 WebDAV
      if (!config.username || !config.password || !config.filePath) {
        throw new Error('坚果云配置不完整，请检查用户名、密码和文件路径')
      }

      const result = await uploadToJianguoyun(
        config.username,
        config.password,
        config.filePath,
        encryptedData,
        true // 使用日期文件名
      )

      // 保存目录路径（不保存完整文件路径，因为文件名包含日期）
      // 下载时会自动查找最新的文件

      return {
        success: true,
        message: '上传成功',
        filePath: result.filePath
      }
    } else {
      // GitHub Gist（默认）
      if (!config.token) {
        throw new Error('未配置云同步，请先设置 GitHub Token')
      }

      const result = await uploadToGist(
        config.token,
        config.gistId || null,
        encryptedData
      )

      // 更新配置中的 Gist ID
      if (!config.gistId) {
        config.gistId = result.gistId
        saveSyncConfig(config)
      }

      return {
        success: true,
        message: '上传成功',
        gistId: result.gistId,
        url: result.url
      }
    }
  } catch (error) {
    return {
      success: false,
      message: error.message || '上传失败'
    }
  }
}

/**
 * 云同步：下载数据
 * @returns {Promise<{success: boolean, data?: string, message?: string}>}
 */
export async function syncDownload() {
  const config = getSyncConfig()
  if (!config) {
    throw new Error('未配置云同步')
  }

  try {
    if (config.type === 'anonymous') {
      // 匿名口令同步
      if (!config.password) {
        throw new Error('未配置口令，请先设置口令')
      }

      const data = await downloadFromAnonymousSync(config.password)
      return {
        success: true,
        data: data
      }
    } else if (config.type === 'jianguoyun') {
      // 坚果云 WebDAV
      if (!config.username || !config.password || !config.filePath) {
        throw new Error('坚果云配置不完整，请检查用户名、密码和文件路径')
      }

      const data = await downloadFromJianguoyun(
        config.username,
        config.password,
        config.filePath
      )

      return {
        success: true,
        data: data
      }
    } else {
      // GitHub Gist（默认）
      if (!config.token || !config.gistId) {
        throw new Error('未配置云同步或缺少 Gist ID')
      }

      const data = await downloadFromGist(config.token, config.gistId)
      return {
        success: true,
        data: data
      }
    }
  } catch (error) {
    return {
      success: false,
      message: error.message || '下载失败'
    }
  }
}

