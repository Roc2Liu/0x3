/**
 * 云同步服务
 * 使用 GitHub Gist API 实现搜索引擎配置的云同步
 */

const GIST_FILENAME = '0x3-search-engines.json'
const SYNC_CONFIG_KEY = '0x3-cloud-sync-config'
const LAST_SYNC_KEY = '0x3-last-sync-time'

/**
 * GitHub Gist API 基础 URL
 */
const GITHUB_API_BASE = 'https://api.github.com'

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
 * 云同步：上传数据
 * @param {string} encryptedData - 加密后的数据
 * @returns {Promise<{success: boolean, message: string, gistId?: string}>}
 */
export async function syncUpload(encryptedData) {
  const config = getSyncConfig()
  if (!config || !config.token) {
    throw new Error('未配置云同步，请先设置 GitHub Token')
  }

  try {
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
  if (!config || !config.token || !config.gistId) {
    throw new Error('未配置云同步或缺少 Gist ID')
  }

  try {
    const data = await downloadFromGist(config.token, config.gistId)
    return {
      success: true,
      data: data
    }
  } catch (error) {
    return {
      success: false,
      message: error.message || '下载失败'
    }
  }
}

