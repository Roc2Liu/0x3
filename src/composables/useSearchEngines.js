import { ref, onMounted } from 'vue'

const ENGINES_KEY = 'search-aggregator-engines'
const CURRENT_ENGINE_KEY = 'search-aggregator-current-engine'

// 默认搜索引擎（必须存在，不可删除）
const defaultEngine = {
  id: 'bing',
  name: 'Bing',
  icon: '🔍',
  url: 'https://www.bing.com/search?q={query}',
  isDefault: true
}

const defaultEngines = [defaultEngine]

export function useSearchEngines() {
  const searchEngines = ref([])
  const currentEngine = ref('bing')

  const loadEngines = () => {
    const saved = localStorage.getItem(ENGINES_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        // 确保 Bing 始终存在
        if (!parsed.some(e => e.id === 'bing')) {
          parsed.unshift(defaultEngine)
        }
        searchEngines.value = parsed
      } catch (e) {
        console.error('Failed to parse saved engines:', e)
        searchEngines.value = [...defaultEngines]
      }
    } else {
      searchEngines.value = [...defaultEngines]
    }
  }

  const saveEngines = () => {
    localStorage.setItem(ENGINES_KEY, JSON.stringify(searchEngines.value))
  }

  const loadCurrentEngine = () => {
    const saved = localStorage.getItem(CURRENT_ENGINE_KEY)
    if (saved && searchEngines.value.some(e => e.id === saved)) {
      currentEngine.value = saved
    } else {
      currentEngine.value = 'bing'
    }
  }

  const initEngines = () => {
    loadEngines()
    loadCurrentEngine()
  }

  const switchEngine = (engineId) => {
    if (searchEngines.value.some(e => e.id === engineId)) {
      currentEngine.value = engineId
      localStorage.setItem(CURRENT_ENGINE_KEY, engineId)
    }
  }

  const addEngine = (engineData, engineId = null) => {
    // 验证 engineData
    if (!engineData || !engineData.name || !engineData.icon || !engineData.url) {
      throw new Error('引擎数据不完整')
    }

    // 如果提供了 engineId，检查是否已存在
    const finalId = engineId || `custom-${Date.now()}`

    // 检查是否已存在相同 ID 的引擎
    if (searchEngines.value.some(e => e.id === finalId)) {
      throw new Error('该搜索引擎已存在')
    }

    const newEngine = {
      id: finalId,
      name: engineData.name,
      icon: engineData.icon,
      url: engineData.url,
      isDefault: false
    }

    searchEngines.value.push(newEngine)
    saveEngines()

    // 切换到新添加的搜索引擎
    switchEngine(newEngine.id)
  }

  const removeEngine = (engineId) => {
    // Bing 是默认引擎，不可删除
    if (engineId === 'bing') {
      throw new Error('Bing 是默认搜索引擎，不能删除')
    }

    searchEngines.value = searchEngines.value.filter(e => e.id !== engineId)
    saveEngines()

    // 如果删除的是当前使用的搜索引擎，切换到 Bing
    if (currentEngine.value === engineId) {
      switchEngine('bing')
    }
  }

  const updateEngine = (engineId, engineData) => {
    const engine = searchEngines.value.find(e => e.id === engineId)

    if (!engine) {
      console.error('Engine not found:', engineId)
      return false
    }

    // 验证 URL（如果有提供）
    if (engineData.url) {
      if (!engineData.url.includes('{query}')) {
        throw new Error('URL 中必须包含 {query} 作为搜索关键词占位符')
      }
      engine.url = engineData.url
    }

    // 更新名称和图标
    engine.name = engineData.name || engine.name
    engine.icon = engineData.icon || engine.icon

    saveEngines()
    return true
  }

  onMounted(() => {
    initEngines()
  })

  return {
    searchEngines,
    currentEngine,
    switchEngine,
    addEngine,
    removeEngine,
    updateEngine,
    initEngines
  }
}

