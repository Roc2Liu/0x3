/**
 * 数据加密/解密工具
 * 基于域名 search.0x3.im 和时间戳生成密钥
 */

// 固定域名
const DOMAIN = 'search.0x3.im'

/**
 * 基于域名和时间戳生成加密密钥
 * @param {string} timestamp - 时间戳字符串 (YYYYMMDDHHmmss)
 * @returns {string} 加密密钥
 */
function generateKey(timestamp) {
  // 将域名和时间戳进行多重变换
  const domainReversed = DOMAIN.split('').reverse().join('')
  const timestampReversed = timestamp.split('').reverse().join('')

  // 交错组合：域名字符和时间戳字符交替
  let key = ''
  const maxLen = Math.max(DOMAIN.length, timestamp.length)
  for (let i = 0; i < maxLen; i++) {
    if (i < DOMAIN.length) key += DOMAIN[i]
    if (i < timestamp.length) key += timestamp[i]
  }

  // 再次反转并添加校验
  key = key.split('').reverse().join('')
  const checksum = (DOMAIN.length + timestamp.length).toString(36)

  // 添加更多混淆：将域名和时间戳进行哈希混合
  const hash = simpleHash(DOMAIN + timestamp)
  return key + checksum + domainReversed + hash
}

/**
 * 简单的哈希函数
 */
function simpleHash(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(36).substring(0, 8)
}

/**
 * 获取当前时间戳字符串 (YYYYMMDDHHmmss)
 */
function getCurrentTimestamp() {
  const now = new Date()
  const year = now.getFullYear().toString()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hour = String(now.getHours()).padStart(2, '0')
  const minute = String(now.getMinutes()).padStart(2, '0')
  const second = String(now.getSeconds()).padStart(2, '0')
  return year + month + day + hour + minute + second
}

/**
 * 简单的 XOR 加密
 */
function xorEncrypt(text, key) {
  let result = ''
  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length))
  }
  return result
}

/**
 * 加密数据
 * @param {Object} data - 要加密的数据
 * @returns {string} 加密后的字符串（包含时间戳）
 */
export function encryptData(data) {
  try {
    // 1. 获取当前时间戳
    const timestamp = getCurrentTimestamp()

    // 2. 生成加密密钥
    const key = generateKey(timestamp)

    // 3. 将数据转换为 JSON 字符串
    const jsonString = JSON.stringify(data)

    // 4. 使用 XOR 加密
    const encrypted = xorEncrypt(jsonString, key)

    // 5. 转换为 Base64
    const base64 = btoa(unescape(encodeURIComponent(encrypted)))

    // 6. 添加版本标识、时间戳和校验码
    const version = '0x3v1'
    const checksum = simpleChecksum(base64)

    return `${version}:${timestamp}:${checksum}:${base64}`
  } catch (error) {
    console.error('加密失败:', error)
    throw new Error('数据加密失败')
  }
}

/**
 * 解密数据
 * @param {string} encryptedString - 加密后的字符串
 * @returns {Object} 解密后的数据
 */
export function decryptData(encryptedString) {
  try {
    // 1. 验证格式
    const parts = encryptedString.split(':')
    if (parts.length !== 4) {
      throw new Error('无效的加密格式')
    }

    const [version, timestamp, checksum, base64] = parts

    // 2. 验证版本
    if (version !== '0x3v1') {
      throw new Error('不支持的加密版本')
    }

    // 3. 验证时间戳格式 (YYYYMMDDHHmmss，14位)
    if (!timestamp || timestamp.length !== 14 || !/^\d+$/.test(timestamp)) {
      throw new Error('无效的时间戳格式')
    }

    // 4. 验证校验码
    if (simpleChecksum(base64) !== checksum) {
      throw new Error('数据校验失败，可能已损坏')
    }

    // 5. 使用时间戳生成解密密钥
    const key = generateKey(timestamp)

    // 6. 从 Base64 解码
    const encrypted = decodeURIComponent(escape(atob(base64)))

    // 7. 使用 XOR 解密
    const decrypted = xorEncrypt(encrypted, key)

    // 8. 解析 JSON
    return JSON.parse(decrypted)
  } catch (error) {
    console.error('解密失败:', error)
    throw new Error('数据解密失败，请确认这是有效的导出文件')
  }
}

/**
 * 简单的校验码计算
 */
function simpleChecksum(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // 转换为 32 位整数
  }
  return Math.abs(hash).toString(36).substring(0, 8)
}

