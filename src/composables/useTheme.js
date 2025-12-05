import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'

const THEME_KEY = 'search-aggregator-theme'
const THEMES = {
  light: 'light',
  dark: 'dark',
  auto: 'auto'
}

// 根据时间判断应该使用暗色还是浅色模式
// 晚上8点（20:00）到早上6点（06:00）：暗色模式
// 早上6点（06:00）到晚上8点（20:00）：浅色模式
const getTimeBasedTheme = () => {
  const now = new Date()
  const hour = now.getHours()
  // 20:00-23:59 或 00:00-05:59 使用暗色模式
  return (hour >= 20 || hour < 6) ? 'dark' : 'light'
}

export function useTheme() {
  const theme = ref(localStorage.getItem(THEME_KEY) || THEMES.auto)
  let timeCheckInterval = null

  const applyTheme = (themeValue) => {
    const root = document.documentElement
    
    if (themeValue === THEMES.auto) {
      // 根据时间自动切换
      const timeBasedTheme = getTimeBasedTheme()
      root.setAttribute('data-theme', timeBasedTheme)
    } else {
      root.setAttribute('data-theme', themeValue)
    }
  }

  const toggleTheme = () => {
    const themes = [THEMES.light, THEMES.dark, THEMES.auto]
    const currentIndex = themes.indexOf(theme.value)
    const nextIndex = (currentIndex + 1) % themes.length
    theme.value = themes[nextIndex]
    localStorage.setItem(THEME_KEY, theme.value)
    applyTheme(theme.value)
  }

  const themeIcon = computed(() => {
    if (theme.value === THEMES.light) return '☀️'
    if (theme.value === THEMES.dark) return '🌙'
    return '🌓'
  })

  const themeText = computed(() => {
    if (theme.value === THEMES.light) return '浅色模式'
    if (theme.value === THEMES.dark) return '深色模式'
    return '自动模式（20:00-06:00 暗色）'
  })

  // 设置定时检查时间，每分钟检查一次
  const setupTimeCheck = () => {
    if (timeCheckInterval) {
      clearInterval(timeCheckInterval)
    }
    
    if (theme.value === THEMES.auto) {
      // 每分钟检查一次时间，如果时间跨越了切换点，自动切换主题
      timeCheckInterval = setInterval(() => {
        if (theme.value === THEMES.auto) {
          applyTheme(THEMES.auto)
        }
      }, 60000) // 60秒检查一次
    }
  }

  onMounted(() => {
    applyTheme(theme.value)
    setupTimeCheck()
  })

  onBeforeUnmount(() => {
    if (timeCheckInterval) {
      clearInterval(timeCheckInterval)
    }
  })

  watch(theme, (newTheme) => {
    applyTheme(newTheme)
    setupTimeCheck() // 主题改变时重新设置定时检查
  })

  return {
    theme,
    themeIcon,
    themeText,
    toggleTheme
  }
}

