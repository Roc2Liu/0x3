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
          <h1 class="logo" @click="goToHome" role="button" tabindex="0" @keydown.enter="goToHome" @keydown.space.prevent="goToHome">0x3</h1>
        </div>
        <nav class="header-actions" aria-label="主要操作">
          <div class="header-actions-group">
            <div class="slider" :class="{ 'slider-home': !showAbout && !showSettings, 'slider-about': showAbout, 'slider-settings': showSettings }"></div>
            <button 
              class="home-btn" 
              ref="homeBtnRef"
              :disabled="!showAbout && !showSettings"
              @click="goToHome" 
              aria-label="返回首页"
              title="返回首页"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              <span class="visually-hidden">首页</span>
            </button>
            <button 
              class="about-btn" 
              ref="aboutBtnRef"
              :disabled="showAbout"
              @click="handleAboutClick" 
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
              ref="settingsBtnRef"
              :disabled="showSettings"
              @click="handleSettingsClick" 
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
          </div>
          <button 
            class="theme-toggle" 
            @click="toggleTheme" 
            :aria-label="themeToggleText"
            :title="themeToggleText"
          >
            <!-- 自动模式：显示黑白各半的圆圈，高对比度 -->
            <svg v-if="theme === 'auto'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10" fill="currentColor" stroke="currentColor" stroke-width="2"/>
              <path d="M12 2 A10 10 0 0 1 12 22 Z" fill="white"/>
              <line x1="12" y1="2" x2="12" y2="22" stroke="currentColor" stroke-width="2.5"/>
            </svg>
            <!-- 下一个主题是 dark：显示月亮图标 -->
            <svg v-else-if="nextTheme === 'dark'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
            <!-- 下一个主题是 light：显示太阳图标 -->
            <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
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
            <span class="visually-hidden">{{ themeToggleText }}</span>
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
        @background-changed="handleBackgroundChanged"
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
import { getBackgroundImage, setBackgroundImage } from './utils/backgroundImage.js'

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
    const backgroundImage = ref(null)
    const homeBtnRef = ref(null)
    const aboutBtnRef = ref(null)
    const settingsBtnRef = ref(null)

    // 获取当前实际显示的主题（考虑 auto 模式）
    const currentDisplayTheme = computed(() => {
      if (theme.value === 'auto') {
        // 根据时间判断：20:00-06:00 为 dark，06:00-20:00 为 light
        const now = new Date()
        const hour = now.getHours()
        return (hour >= 20 || hour < 6) ? 'dark' : 'light'
      }
      return theme.value
    })
    
    // 获取下一个主题（用于显示图标和提示）
    const nextTheme = computed(() => {
      const themes = ['light', 'dark', 'auto']
      const currentIndex = themes.indexOf(theme.value)
      const nextIndex = (currentIndex + 1) % themes.length
      return themes[nextIndex]
    })
    
    // 获取主题切换提示文本（显示点击后将要切换到的模式）
    const themeToggleText = computed(() => {
      if (theme.value === 'auto') {
        return '自动模式（20:00-06:00 暗色）'
      }
      // 根据下一个主题显示提示
      if (nextTheme.value === 'dark') {
        return '切换到夜晚模式'
      } else if (nextTheme.value === 'light') {
        return '切换到白天模式'
      } else {
        return '切换到自动模式'
      }
    })
    
    // 处理关于按钮点击
    const handleAboutClick = () => {
      if (showSettings.value) {
        // 如果设置页面打开，关闭设置并打开关于
        showSettings.value = false
        showAbout.value = true
      } else {
        // 否则切换关于页面
        showAbout.value = !showAbout.value
      }
    }
    
    // 处理设置按钮点击
    const handleSettingsClick = () => {
      if (showAbout.value) {
        // 如果关于页面打开，关闭关于并打开设置
        showAbout.value = false
        showSettings.value = true
      } else {
        // 否则切换设置页面
        showSettings.value = !showSettings.value
      }
    }
    
    // 跳转到首页（关闭设置和关于）
    const goToHome = () => {
      showSettings.value = false
      showAbout.value = false
    }

    onMounted(async () => {
      initEngines()
      // 加载背景图片
      backgroundImage.value = await getBackgroundImage()
      applyBackgroundImage(backgroundImage.value)
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
      // 判断是否为图片：数据 URL（base64 编码的 SVG）或 SVG 文件路径
      return icon && (
        icon.startsWith('data:image/svg+xml') || 
        icon.startsWith('data:image/') ||
        icon.endsWith('.svg') ||
        icon.startsWith('/') && icon.includes('.svg')
      )
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

    const applyBackgroundImage = (imageUrl) => {
      const app = document.querySelector('.app')
      if (app) {
        if (imageUrl) {
          app.style.backgroundImage = `url(${imageUrl})`
          app.style.backgroundSize = 'cover'
          app.style.backgroundPosition = 'center'
          app.style.backgroundRepeat = 'no-repeat'
          app.style.backgroundAttachment = 'fixed'
        } else {
          app.style.backgroundImage = ''
          app.style.backgroundSize = ''
          app.style.backgroundPosition = ''
          app.style.backgroundRepeat = ''
          app.style.backgroundAttachment = ''
        }
      }
    }

    const handleBackgroundChanged = (imageUrl) => {
      backgroundImage.value = imageUrl
      applyBackgroundImage(imageUrl)
    }

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
      currentDisplayTheme,
      nextTheme,
      themeToggleText,
      handleAboutClick,
      handleSettingsClick,
      goToHome,
      isImageIcon,
      handleSkipToMain,
      backgroundImage,
      handleBackgroundChanged,
      homeBtnRef,
      aboutBtnRef,
      settingsBtnRef
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

/* 深色模式下背景图片遮罩 */
.app::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: transparent;
  pointer-events: none;
  z-index: 0;
  transition: background-color var(--transition-base) var(--transition-timing);
}

[data-theme="dark"] .app::before {
  background-color: var(--bg-overlay-dark);
}

.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--accent-color);
  color: white;
  padding: var(--spacing-sm) var(--spacing-md);
  text-decoration: none;
  z-index: var(--z-tooltip);
  border-radius: 0 0 var(--radius-xs) 0;
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
  border-bottom: 1px solid var(--border-color);
  padding: var(--spacing-lg) 0;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: var(--z-sticky);
  backdrop-filter: blur(var(--frosted-blur));
  -webkit-backdrop-filter: blur(var(--frosted-blur));
  background-color: var(--frosted-bg-light);
  box-shadow: var(--shadow-sm);
  transition: background-color var(--transition-base) var(--transition-timing),
              border-color var(--transition-base) var(--transition-timing),
              box-shadow var(--transition-base) var(--transition-timing);
}

[data-theme="dark"] .header {
  background-color: var(--frosted-bg-dark);
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
  cursor: pointer;
  transition: opacity var(--transition-base) var(--transition-timing);
  user-select: none;
}

.logo:hover {
  opacity: 0.7;
}

.logo:focus-visible {
  outline: 2px solid var(--accent-color);
  outline-offset: 2px;
  border-radius: var(--radius-xs);
}

.header-actions {
  display: flex;
  gap: var(--spacing-sm);
  align-items: center;
}

.header-actions-group {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px;
  background-color: rgba(224, 224, 224, 0.6);
  border-radius: 24px;
  box-shadow: 
    0 2px 4px rgba(0, 0, 0, 0.05),
    inset 0 1px 2px rgba(255, 255, 255, 0.8);
  transition: background-color var(--transition-base) var(--transition-timing);
  position: relative;
}

[data-theme="dark"] .header-actions-group {
  background-color: rgba(60, 60, 60, 0.6);
  box-shadow: 
    0 2px 4px rgba(0, 0, 0, 0.2),
    inset 0 1px 2px rgba(255, 255, 255, 0.1);
}

.slider {
  position: absolute;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: #ffffff;
  box-shadow: 
    0 2px 4px rgba(0, 0, 0, 0.1),
    0 1px 2px rgba(0, 0, 0, 0.05);
  transition: 
    left 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94),
    width 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94),
    height 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94),
    border-radius 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  left: 4px;
  z-index: 0;
  will-change: left, width, height, border-radius;
}

[data-theme="dark"] .slider {
  background-color: rgba(255, 255, 255, 0.15);
  box-shadow: 
    0 2px 4px rgba(0, 0, 0, 0.3),
    0 1px 2px rgba(0, 0, 0, 0.2);
}

.slider-home {
  left: 4px;
}

.slider-about {
  left: 48px;
}

.slider-settings {
  left: 92px;
}

.home-btn,
.about-btn,
.settings-btn {
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: transparent;
  border: none;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  padding: 0;
  z-index: 1;
  transition: opacity var(--transition-base) var(--transition-timing);
}

.home-btn:disabled,
.about-btn:disabled,
.settings-btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
  pointer-events: none;
}

.home-btn svg,
.about-btn svg,
.settings-btn svg {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.home-btn:focus-visible:not(:disabled),
.about-btn:focus-visible:not(:disabled),
.settings-btn:focus-visible:not(:disabled) {
  outline: 2px solid var(--accent-color);
  outline-offset: 2px;
}

.theme-toggle {
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
  margin-left: var(--spacing-sm);
}

.theme-toggle svg {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  display: block;
}

.theme-toggle:hover {
  background-color: var(--bg-hover);
  border-color: var(--border-color);
}

.theme-toggle:focus-visible {
  outline: 2px solid var(--accent-color);
  outline-offset: 2px;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0;
  padding-top: 80px; /* 为固定定位的 header 留出空间 */
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  scroll-margin-top: 0;
  transition: padding var(--transition-base) var(--transition-timing);
  position: relative;
  z-index: var(--z-base);
}

.main-content:focus {
  outline: none;
}

.home-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 80px);
  padding: var(--spacing-4xl) var(--spacing-lg);
  animation: fadeIn var(--transition-slow) var(--transition-timing);
  width: 100%;
  box-sizing: border-box;
  overflow: hidden; /* 禁用滚动 */
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(var(--spacing-md));
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
    padding-top: 70px; /* 移动端 header 高度较小 */
  }
  
  .home-view {
    height: calc(100vh - 70px);
    padding: var(--spacing-2xl) var(--spacing-md);
  }
}
</style>
