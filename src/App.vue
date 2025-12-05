<template>
  <div class="app">
    <a 
      href="#search-input" 
      class="skip-link"
      @click.prevent="handleSkipToMain"
    >
      跳转到搜索框
    </a>
    
    <header class="header" role="banner">
      <div class="header-content">
        <div class="logo-section">
          <h1 class="logo">0x3</h1>
        </div>
        <nav class="header-actions" aria-label="主要操作">
          <button 
            class="theme-toggle" 
            @click="toggleTheme" 
            :aria-label="themeText"
            :title="themeText"
          >
            <!-- 浅色模式图标 -->
            <svg v-if="theme === 'light'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
            <!-- 深色模式图标 -->
            <svg v-else-if="theme === 'dark'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
            <!-- 自动模式图标：半黑半白圆圈 -->
            <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.2"></circle>
              <path d="M12 2A10 10 0 0 0 12 22" fill="currentColor" opacity="0.8"></path>
            </svg>
            <span class="visually-hidden">{{ themeText }}</span>
          </button>
          <button 
            class="about-btn" 
            @click="showAbout = !showAbout" 
            :aria-label="showAbout ? '关闭关于' : '打开关于'"
            :aria-expanded="showAbout"
            :title="showAbout ? '关闭关于' : '打开关于'"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            <span class="visually-hidden">关于</span>
          </button>
          <button 
            class="settings-btn" 
            @click="showSettings = !showSettings" 
            :aria-label="showSettings ? '关闭设置' : '打开设置'"
            :aria-expanded="showSettings"
            :title="showSettings ? '关闭设置' : '打开设置'"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
            <span class="visually-hidden">设置</span>
          </button>
        </nav>
      </div>
    </header>

    <main id="main-content" class="main-content" role="main">
      <!-- ARIA live 区域用于屏幕阅读器 -->
      <div aria-live="polite" aria-atomic="true" class="visually-hidden">
        <span id="live-region">当前搜索引擎：{{ currentEngineName }}</span>
      </div>
      
      <div v-if="!showSettings && !showAbout" class="home-view">
        <SearchBox 
          :engines="searchEngines"
          :current-engine="currentEngine"
          @switch-engine="switchEngine"
          @search="handleSearch"
        />
      </div>
      
      <Settings
        v-if="showSettings"
        :engines="searchEngines"
        @add-engine="handleAddEngine"
        @remove-engine="handleRemoveEngine"
        @update-engine="handleUpdateEngine"
        @import-engines="handleImportEngines"
        @close="showSettings = false"
      />
      
      <About
        v-if="showAbout"
        @close="showAbout = false"
      />
    </main>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch, onBeforeUnmount, nextTick } from 'vue'
import SearchBox from './components/SearchBox.vue'
import Settings from './components/Settings.vue'
import About from './components/About.vue'
import { useTheme } from './composables/useTheme'
import { useSearchEngines } from './composables/useSearchEngines'
import { alert, error, success } from './utils/notify.js'

export default {
  name: 'App',
  components: {
    SearchBox,
    Settings,
    About
  },
  setup() {
    const { theme, themeIcon, themeText, toggleTheme } = useTheme()
    const { searchEngines, currentEngine, switchEngine, addEngine, removeEngine, updateEngine, initEngines } = useSearchEngines()
    const showSettings = ref(false)
    const showAbout = ref(false)

    onMounted(() => {
      initEngines()
    })

    // 处理设置面板打开时的滚动条隐藏
    // 监听设置和关于页面的打开，隐藏滚动条
    watch([showSettings, showAbout], ([settingsOpen, aboutOpen]) => {
      const isOpen = settingsOpen || aboutOpen
      if (isOpen) {
        // 隐藏滚动条但保留滚动功能
        document.documentElement.classList.add('hide-scrollbar')
      } else {
        // 恢复滚动条
        document.documentElement.classList.remove('hide-scrollbar')
      }
    })

    onBeforeUnmount(() => {
      // 组件卸载时恢复滚动条
      document.documentElement.classList.remove('hide-scrollbar')
    })

    const handleSearch = (query) => {
      const engine = searchEngines.value.find(e => e.id === currentEngine.value)
      if (engine && query.trim()) {
        window.open(engine.url.replace('{query}', encodeURIComponent(query)), '_blank')
      }
    }

    const handleAddEngine = async (engineData, engineId) => {
      try {
        addEngine(engineData, engineId)
        await success(`成功添加搜索引擎：${engineData.name}`)
      } catch (err) {
        console.error('Error adding engine:', err)
        await error('添加搜索引擎失败：' + err.message)
      }
    }

    const handleImportEngines = async (engines) => {
      try {
        engines.forEach(engine => {
          // 使用引擎的 ID 导入，如果已存在则更新
          const existingIndex = searchEngines.value.findIndex(e => e.id === engine.id)
          if (existingIndex !== -1) {
            // 如果已存在且不是 Bing，则更新
            if (engine.id !== 'bing') {
              updateEngine(engine.id, {
                name: engine.name,
                icon: engine.icon,
                url: engine.url
              })
            }
          } else {
            // 如果不存在，则添加
            addEngine({
              name: engine.name,
              icon: engine.icon,
              url: engine.url
            }, engine.id)
          }
        })
        // 导入成功后显示成功通知
        await success(`成功导入 ${engines.length} 个搜索引擎`)
      } catch (err) {
        console.error('Error importing engines:', err)
        await error('导入搜索引擎失败：' + err.message)
      }
    }

    const handleRemoveEngine = async (engineId) => {
      try {
        removeEngine(engineId)
      } catch (err) {
        console.error('Error removing engine:', err)
        await error(err.message)
      }
    }

    const handleUpdateEngine = async (engineId, engineData) => {
      try {
        updateEngine(engineId, engineData)
      } catch (err) {
        console.error('Error updating engine:', err)
        await error(err.message)
      }
    }

    const isImageIcon = (icon) => {
      // 判断是否为图片数据 URL（base64 编码的 SVG）
      return icon && (icon.startsWith('data:image/svg+xml') || icon.startsWith('data:image/'))
    }

    const handleSkipToMain = async (e) => {
      e.preventDefault()
      // 等待 DOM 更新完成
      await nextTick()
      setTimeout(() => {
        // 优先尝试聚焦到搜索框（桌面端或移动端）
        const searchInput = document.querySelector('#search-input') || document.querySelector('#search-input-mobile')
        if (searchInput) {
          // 滚动到搜索框
          searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' })
          // 聚焦到搜索框
          setTimeout(() => {
            searchInput.focus()
          }, 100)
        } else {
          // 如果没有找到搜索框，回退到主内容区域
          const mainContent = document.getElementById('main-content')
          if (mainContent) {
            mainContent.scrollIntoView({ behavior: 'smooth', block: 'start' })
            setTimeout(() => {
              mainContent.setAttribute('tabindex', '-1')
              mainContent.focus()
              mainContent.removeAttribute('tabindex')
            }, 100)
          }
        }
      }, 50)
    }

    const currentEngineName = computed(() => {
      const engine = searchEngines.value.find(e => e.id === currentEngine.value)
      return engine?.name || 'Bing'
    })

    return {
      theme,
      themeIcon,
      themeText,
      toggleTheme,
      searchEngines,
      currentEngine,
      switchEngine,
      addEngine,
      removeEngine,
      updateEngine,
      showSettings,
      handleSearch,
      handleAddEngine,
      handleImportEngines,
      handleRemoveEngine,
      handleUpdateEngine,
      currentEngineName,
      showAbout,
      isImageIcon,
      handleSkipToMain
    }
  }
}
</script>

<style scoped>
.app {
  min-height: 100vh;
  background-color: var(--bg-primary);
  display: flex;
  flex-direction: column;
  position: relative;
}

.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--accent-color);
  color: white;
  padding: 8px 16px;
  text-decoration: none;
  z-index: 1000;
  border-radius: 0 0 4px 0;
  font-weight: 500;
}

.skip-link:focus {
  top: 0;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.header {
  background-color: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  padding: var(--spacing-md) 0;
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(12px);
  background-color: rgba(255, 255, 255, 0.85);
  box-shadow: var(--shadow-sm);
  transition: background-color var(--transition-base) var(--transition-timing),
              border-color var(--transition-base) var(--transition-timing);
}

[data-theme="dark"] .header {
  background-color: rgba(22, 27, 34, 0.85);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-md);
}

.logo-section {
  display: flex;
  align-items: center;
}

.logo {
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.3px;
  margin: 0;
  line-height: 1.2;
  transition: color var(--transition-base) var(--transition-timing);
  opacity: 0.9;
}

.header-actions {
  display: flex;
  gap: var(--spacing-sm);
  align-items: center;
}

.about-btn,
.theme-toggle,
.settings-btn {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-sm);
  background-color: transparent;
  border: 1px solid transparent;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-base) var(--transition-timing);
  cursor: pointer;
  position: relative;
}

.about-btn svg,
.theme-toggle svg,
.settings-btn svg {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.about-btn:hover,
.theme-toggle:hover,
.settings-btn:hover {
  background-color: var(--bg-hover);
  border-color: var(--border-color);
}

.about-btn:focus-visible,
.theme-toggle:focus-visible,
.settings-btn:focus-visible {
  outline: 2px solid var(--accent-color);
  outline-offset: 2px;
}

.about-btn:active,
.theme-toggle:active,
.settings-btn:active {
  transform: scale(0.95);
}

.main-content {
  flex: 1;
  padding: var(--spacing-3xl) var(--spacing-lg);
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  scroll-margin-top: 0;
  transition: padding var(--transition-base) var(--transition-timing);
}

.main-content:focus {
  outline: none;
}

.home-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 200px);
  padding: var(--spacing-2xl) 0;
  animation: fadeIn 0.4s var(--transition-timing);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .header-content {
    padding: 0 var(--spacing-md);
  }
  
  .main-content {
    padding: var(--spacing-2xl) var(--spacing-md);
  }
  
  .home-view {
    min-height: 50vh;
  }
}
</style>
