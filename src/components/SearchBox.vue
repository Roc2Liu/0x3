<template>
  <div class="search-container">
    <!-- 移动端遮罩层 -->
    <div 
      v-if="showEngineList" 
      class="engine-list-backdrop mobile-only"
      @click="showEngineList = false"
    ></div>
    
    <!-- 桌面端布局 -->
    <div class="search-wrapper desktop-layout">
      <div 
        class="engine-selector" 
        role="combobox"
        :aria-expanded="showEngineList"
        aria-haspopup="listbox"
        aria-label="选择搜索引擎"
        tabindex="0"
        @click.stop="showEngineList = !showEngineList"
        @keydown.enter.prevent="showEngineList = !showEngineList"
        @keydown.space.prevent="showEngineList = !showEngineList"
        @keydown.escape="showEngineList = false"
        @keydown.arrow-down.prevent="showEngineList = true"
        @keydown.arrow-up.prevent="showEngineList = true"
      >
        <span class="engine-icon" aria-hidden="true">
          <img v-if="isImageIcon(currentEngineIcon)" :src="currentEngineIcon" :alt="`${currentEngineName} 图标`" class="engine-icon-img" />
          <span v-else>{{ currentEngineIcon }}</span>
        </span>
        <span class="dropdown-arrow" aria-hidden="true">▼</span>
        
        <div 
          v-if="showEngineList" 
          class="engine-list" 
          role="listbox"
          @click.stop
        >
          <div v-if="engines.length > 6" class="engine-list-search">
            <label for="engine-filter" class="visually-hidden">搜索引擎</label>
            <input
              id="engine-filter"
              v-model="engineFilter"
              type="text"
              class="engine-filter-input"
              placeholder="搜索引擎..."
              @click.stop
              @keydown.escape.stop="showEngineList = false"
            />
          </div>
          <div
            v-for="engine in filteredEngines"
            :key="engine.id"
            class="engine-item"
            :class="{ active: engine.id === currentEngine }"
            role="option"
            :aria-selected="engine.id === currentEngine"
            :aria-label="`选择 ${engine.name}`"
            tabindex="0"
            @click="selectEngine(engine.id)"
            @keydown.enter="selectEngine(engine.id)"
            @keydown.space.prevent="selectEngine(engine.id)"
            @keydown.escape="showEngineList = false"
          >
            <span class="engine-icon" aria-hidden="true">
              <img v-if="isImageIcon(engine.icon)" :src="engine.icon" :alt="`${engine.name} 图标`" class="engine-icon-img" />
              <span v-else>{{ engine.icon }}</span>
            </span>
            <span class="engine-name">{{ engine.name }}</span>
            <span v-if="engine.id === currentEngine" class="checkmark" aria-hidden="true">✓</span>
          </div>
          <div v-if="filteredEngines.length === 0" class="engine-list-empty">
            没有找到匹配的引擎
          </div>
        </div>
      </div>

      <form 
        class="search-form" 
        role="search"
        aria-label="搜索"
        @submit.prevent="handleSearch"
      >
        <label for="search-input" class="visually-hidden">搜索关键词</label>
        <input
          id="search-input"
          v-model="query"
          type="search"
          class="search-input"
          :placeholder="`在 ${currentEngineName} 中搜索...`"
          :aria-label="`在 ${currentEngineName} 中搜索`"
          autocomplete="off"
          autofocus
        />
        <button 
          type="submit" 
          class="search-btn"
          aria-label="搜索"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <span class="visually-hidden">搜索</span>
        </button>
      </form>
    </div>

    <!-- 移动端合并布局 -->
    <form 
      class="search-wrapper mobile-layout"
      role="search"
      aria-label="搜索"
      @submit.prevent="handleSearch"
    >
      <div 
        class="engine-selector-mobile" 
        role="combobox"
        :aria-expanded="showEngineList"
        aria-haspopup="listbox"
        aria-label="选择搜索引擎"
        tabindex="0"
        @click.stop="showEngineList = !showEngineList"
        @keydown.enter.prevent="showEngineList = !showEngineList"
        @keydown.space.prevent="showEngineList = !showEngineList"
        @keydown.escape="showEngineList = false"
        @keydown.arrow-down.prevent="showEngineList = true"
        @keydown.arrow-up.prevent="showEngineList = true"
      >
        <span class="engine-icon-mobile" aria-hidden="true">
          <img v-if="isImageIcon(currentEngineIcon)" :src="currentEngineIcon" :alt="`${currentEngineName} 图标`" class="engine-icon-img" />
          <span v-else>{{ currentEngineIcon }}</span>
        </span>
        
        <div 
          v-if="showEngineList" 
          class="engine-list engine-list-mobile" 
          role="listbox"
          @click.stop
        >
          <div v-if="engines.length > 6" class="engine-list-search">
            <label for="engine-filter-mobile" class="visually-hidden">搜索引擎</label>
            <input
              id="engine-filter-mobile"
              v-model="engineFilter"
              type="text"
              class="engine-filter-input"
              placeholder="搜索引擎..."
              @click.stop
              @keydown.escape.stop="showEngineList = false"
            />
          </div>
          <div
            v-for="engine in filteredEngines"
            :key="engine.id"
            class="engine-item"
            :class="{ active: engine.id === currentEngine }"
            role="option"
            :aria-selected="engine.id === currentEngine"
            :aria-label="`选择 ${engine.name}`"
            tabindex="0"
            @click="selectEngine(engine.id)"
            @keydown.enter="selectEngine(engine.id)"
            @keydown.space.prevent="selectEngine(engine.id)"
            @keydown.escape="showEngineList = false"
          >
            <span class="engine-icon" aria-hidden="true">
              <img v-if="isImageIcon(engine.icon)" :src="engine.icon" :alt="`${engine.name} 图标`" class="engine-icon-img" />
              <span v-else>{{ engine.icon }}</span>
            </span>
            <span class="engine-name">{{ engine.name }}</span>
            <span v-if="engine.id === currentEngine" class="checkmark" aria-hidden="true">✓</span>
          </div>
          <div v-if="filteredEngines.length === 0" class="engine-list-empty">
            没有找到匹配的引擎
          </div>
        </div>
      </div>

      <label for="search-input-mobile" class="visually-hidden">搜索关键词</label>
      <input
        id="search-input-mobile"
        v-model="query"
        type="search"
        class="search-input-mobile"
        :placeholder="`在 ${currentEngineName} 中搜索...`"
        :aria-label="`在 ${currentEngineName} 中搜索`"
        autocomplete="off"
      />
      
      <button 
        type="submit" 
        class="search-btn-mobile"
        aria-label="搜索"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
        <span class="visually-hidden">搜索</span>
      </button>
    </form>
  </div>
</template>

<script>
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'

export default {
  name: 'SearchBox',
  props: {
    engines: {
      type: Array,
      required: true
    },
    currentEngine: {
      type: String,
      required: true
    }
  },
  emits: ['switch-engine', 'search'],
  setup(props, { emit }) {
    const query = ref('')
    const showEngineList = ref(false)
    const engineFilter = ref('')
    const focusedIndex = ref(0)
    const engineItemRefs = ref([])

    const currentEngineData = computed(() => {
      return props.engines.find(e => e.id === props.currentEngine) || props.engines[0]
    })

    const currentEngineName = computed(() => currentEngineData.value?.name || '')
    const currentEngineIcon = computed(() => currentEngineData.value?.icon || '🔍')

    const filteredEngines = computed(() => {
      if (!engineFilter.value.trim()) {
        return props.engines
      }
      const filter = engineFilter.value.toLowerCase().trim()
      return props.engines.filter(engine => 
        engine.name.toLowerCase().includes(filter)
      )
    })

    const selectEngine = (engineId) => {
      emit('switch-engine', engineId)
      showEngineList.value = false
      engineFilter.value = ''
      focusedIndex.value = 0
    }

    const handleArrowKey = (direction, currentIndex = 0) => {
      if (!showEngineList.value || filteredEngines.value.length === 0) return

      let newIndex = currentIndex

      switch (direction) {
        case 'up':
          newIndex = currentIndex > 0 ? currentIndex - 1 : filteredEngines.value.length - 1
          break
        case 'down':
          newIndex = currentIndex < filteredEngines.value.length - 1 ? currentIndex + 1 : 0
          break
        case 'home':
          newIndex = 0
          break
        case 'end':
          newIndex = filteredEngines.value.length - 1
          break
      }

      focusedIndex.value = newIndex
      // 聚焦到对应的元素
      nextTick(() => {
        const targetElement = engineItemRefs.value[newIndex]
        if (targetElement) {
          targetElement.focus()
        }
      })
    }

    const handleSearch = () => {
      if (query.value.trim()) {
        emit('search', query.value)
      }
    }

    const isImageIcon = (icon) => {
      // 判断是否为图片数据 URL（base64 编码的 SVG）
      return icon && (icon.startsWith('data:image/svg+xml') || icon.startsWith('data:image/'))
    }

    // 点击外部关闭下拉菜单
    const handleClickOutside = (event) => {
      if (!event.target.closest('.engine-selector') && 
          !event.target.closest('.engine-selector-mobile') &&
          !event.target.closest('.engine-list') &&
          !event.target.closest('.engine-list-backdrop')) {
        showEngineList.value = false
      }
    }

    onMounted(() => {
      document.addEventListener('click', handleClickOutside)
    })

    onBeforeUnmount(() => {
      document.removeEventListener('click', handleClickOutside)
    })

    // 监听下拉菜单打开时重置过滤器和焦点
    watch(showEngineList, (isOpen) => {
      if (!isOpen) {
        engineFilter.value = ''
        focusedIndex.value = 0
      } else {
        // 打开时聚焦到当前选中的引擎
        const currentIndex = filteredEngines.value.findIndex(e => e.id === props.currentEngine)
        focusedIndex.value = currentIndex >= 0 ? currentIndex : 0
        nextTick(() => {
          const targetElement = engineItemRefs.value[focusedIndex.value]
          if (targetElement) {
            targetElement.focus()
          }
        })
      }
    })

    // 监听过滤结果变化，重置焦点
    watch(filteredEngines, () => {
      if (showEngineList.value) {
        focusedIndex.value = Math.min(focusedIndex.value, filteredEngines.value.length - 1)
      }
    })

    return {
      query,
      showEngineList,
      engineFilter,
      currentEngineName,
      currentEngineIcon,
      filteredEngines,
      focusedIndex,
      engineItemRefs,
      selectEngine,
      handleSearch,
      handleArrowKey,
      isImageIcon
    }
  }
}
</script>

<style scoped>
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

.search-container {
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
  animation: fadeInUp 0.5s var(--transition-timing);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.search-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

/* 桌面端布局 */
.desktop-layout {
  display: flex;
}

/* 移动端合并布局 - 默认隐藏 */
.mobile-layout {
  display: none;
}

.engine-selector {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-lg);
  background-color: var(--bg-card);
  border: 2px solid var(--border-color);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-base) var(--transition-timing);
  user-select: none;
  white-space: nowrap;
  box-shadow: var(--shadow-card);
  min-width: 100px;
}

.engine-selector:hover {
  border-color: var(--border-hover);
  box-shadow: var(--shadow);
  background-color: var(--bg-hover);
}

.engine-selector:focus-visible {
  outline: 2px solid var(--accent-color);
  outline-offset: 2px;
  border-color: var(--accent-color);
}

.engine-icon {
  font-size: 22px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
}

.engine-icon-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.dropdown-arrow {
  font-size: 10px;
  color: var(--text-secondary);
  transition: transform 0.2s ease;
  display: block;
}

.engine-list {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  min-width: 220px;
  background-color: var(--bg-card);
  border: 2px solid var(--border-color);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  z-index: 1000;
  max-height: 400px;
  overflow-y: auto;
  animation: slideDown 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 8px;
  display: flex;
  flex-direction: column;
}

.engine-list-search {
  padding: 8px;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 4px;
  position: sticky;
  top: 0;
  background-color: var(--bg-card);
  z-index: 1;
}

.engine-filter-input {
  width: 100%;
  padding: 8px 12px;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-size: 14px;
  transition: all 0.2s ease;
}

.engine-filter-input:focus {
  border-color: var(--accent-color);
  box-shadow: 0 0 0 3px var(--focus-ring);
  outline: none;
}

.engine-filter-input::placeholder {
  color: var(--text-secondary);
  opacity: 0.6;
}

.engine-list-empty {
  padding: 24px;
  text-align: center;
  color: var(--text-secondary);
  font-size: 14px;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.engine-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 10px;
  font-size: 15px;
  outline: none;
}

.engine-item:hover {
  background-color: var(--bg-hover);
}

.engine-item:focus-visible {
  outline: 2px solid var(--accent-color);
  outline-offset: -2px;
  background-color: var(--bg-hover);
}

.engine-item.keyboard-focus:focus {
  outline: 2px solid var(--accent-color);
  outline-offset: 2px;
}

.engine-item.active {
  background-color: var(--accent-color);
  color: white;
}

.engine-item.active .engine-name {
  color: white;
  font-weight: 600;
}

.engine-item .engine-name {
  flex: 1;
  font-weight: 500;
  color: var(--text-primary);
  line-height: 1.4;
}

.engine-item .checkmark {
  color: inherit;
  font-weight: bold;
  font-size: 16px;
  line-height: 1;
}

.search-form {
  flex: 1;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  background-color: var(--bg-card);
  border: 2px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xs);
  box-shadow: var(--shadow-card);
  transition: all var(--transition-base) var(--transition-timing);
}

.search-form:hover {
  border-color: var(--border-hover);
  box-shadow: var(--shadow);
}

.search-form:focus-within {
  border-color: var(--accent-color);
  box-shadow: 0 0 0 4px var(--focus-ring), var(--shadow);
}

.search-input {
  flex: 1;
  padding: 18px 24px;
  font-size: 18px;
  border: none;
  background: transparent;
  color: var(--text-primary);
  outline: none;
  line-height: 1.5;
}

.search-input::placeholder {
  color: var(--text-secondary);
  opacity: 0.7;
}

.search-input:focus {
  outline: none;
}

.search-btn {
  padding: var(--spacing-md) var(--spacing-lg);
  background-color: var(--accent-color);
  color: white;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-base) var(--transition-timing);
  cursor: pointer;
  flex-shrink: 0;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(76, 110, 245, 0.2);
}

.search-btn:hover {
  background-color: var(--accent-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(76, 110, 245, 0.3);
}

.search-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(76, 110, 245, 0.2);
}

.search-btn:focus-visible {
  outline: 2px solid var(--accent-color);
  outline-offset: 2px;
  background-color: var(--accent-hover);
}

.search-btn:active {
  transform: scale(0.98);
}

@media (max-width: 768px) {
  /* 隐藏桌面端布局 */
  .desktop-layout {
    display: none;
  }
  
  /* 显示移动端合并布局 */
  .mobile-layout {
    display: flex;
    width: 100%;
    background-color: var(--bg-card);
    border: 2px solid var(--border-color);
    border-radius: var(--radius-lg);
    padding: 6px;
    box-shadow: var(--shadow-card);
    transition: all var(--transition-base) var(--transition-timing);
    gap: 8px;
    align-items: center;
  }
  
  .mobile-layout:focus-within {
    border-color: var(--accent-color);
    box-shadow: 0 0 0 4px var(--focus-ring), var(--shadow);
  }
  
  /* 移动端搜索引擎选择器 */
  .engine-selector-mobile {
    position: relative;
    flex-shrink: 0;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--bg-hover);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all var(--transition-base) var(--transition-timing);
  }
  
  .engine-selector-mobile:hover {
    background-color: var(--border-color);
  }
  
  .engine-selector-mobile:focus-visible {
    outline: 2px solid var(--accent-color);
    outline-offset: 2px;
  }
  
  .engine-icon-mobile {
    font-size: 24px;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
  }
  
  /* 移动端搜索输入框 */
  .search-input-mobile {
    flex: 1;
    padding: 12px 16px;
    font-size: 16px;
    border: none;
    background: transparent;
    color: var(--text-primary);
    outline: none;
    line-height: 1.5;
    min-width: 0;
  }
  
  .search-input-mobile::placeholder {
    color: var(--text-secondary);
    opacity: 0.7;
  }
  
  /* 移动端搜索按钮 */
  .search-btn-mobile {
    flex-shrink: 0;
    width: 48px;
    height: 48px;
    padding: 0;
    background-color: var(--accent-color);
    color: white;
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all var(--transition-base) var(--transition-timing);
    cursor: pointer;
  }
  
  .search-btn-mobile:hover {
    background-color: var(--accent-hover);
    transform: scale(1.05);
  }
  
  .search-btn-mobile:focus-visible {
    outline: 2px solid var(--accent-color);
    outline-offset: 2px;
  }
  
  .search-btn-mobile:active {
    transform: scale(0.95);
  }
  
  /* 移动端遮罩层 */
  .engine-list-backdrop.mobile-only {
    display: none;
  }
  
  /* 移动端遮罩层 */
  .engine-list-backdrop.mobile-only {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
    animation: fadeIn 0.2s ease;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  /* 移动端下拉菜单 */
  .engine-list-mobile {
    position: fixed;
    top: auto !important;
    bottom: 0;
    left: 0;
    right: 0;
    min-width: auto;
    width: 100%;
    max-height: 60vh;
    border-radius: 20px 20px 0 0;
    border-bottom: none;
    border-left: none;
    border-right: none;
    z-index: 1000;
    animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(100%);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  /* 移动端列表项 */
  .engine-item {
    padding: 14px 20px;
    font-size: 16px;
  }
  
  .engine-item .engine-icon {
    font-size: 24px;
  }
}

@media (max-width: 480px) {
  .search-input-mobile {
    font-size: 15px;
    padding: 10px 12px;
  }
  
  .engine-selector-mobile,
  .search-btn-mobile {
    width: 44px;
    height: 44px;
  }
  
  .engine-icon-mobile {
    font-size: 22px;
    width: 22px;
    height: 22px;
  }
  
  .mobile-layout {
    padding: 4px;
    gap: 6px;
  }
}
</style>
