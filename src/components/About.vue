<template>
  <div class="about-container" role="document">
    <button 
      class="close-btn" 
      @click="$emit('close')"
      aria-label="关闭关于页面"
      @keydown.escape="$emit('close')"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
      <span class="visually-hidden">关闭</span>
    </button>

    <div class="about-content">
      <div class="about-intro">
        <p class="about-description">
          一个美观、现代的搜索引擎聚合导航网站。支持多引擎切换、自定义添加、主题切换、背景图片、数据导入导出、云同步等功能。
        </p>
        <div class="badges">
          <span class="badge badge-vue">Vue 3.4+</span>
          <span class="badge badge-vite">Vite 5.0+</span>
          <span class="badge badge-license">MIT License</span>
        </div>
      </div>

      <section class="about-section" aria-labelledby="features-title">
        <h2 id="features-title" class="section-title">✨ 核心特性</h2>
        
        <ul class="feature-list">
          <li><strong>搜索引擎管理</strong>：多引擎切换、自定义添加、在线编辑、智能排序</li>
          <li><strong>数据管理</strong>：导入导出（加密）、云同步（GitHub Gist / 匿名口令同步）</li>
          <li><strong>背景图片</strong>：自定义背景、历史管理（最多 5 张）、磨砂透明效果</li>
          <li><strong>主题系统</strong>：浅色/深色/自动三种模式，时间自动切换</li>
        </ul>
      </section>

      <section class="about-section" aria-labelledby="usage-title">
        <h2 id="usage-title" class="section-title">📖 使用指南</h2>
        
        <div class="usage-item">
          <h3 class="usage-subtitle">添加搜索引擎</h3>
          <p class="faq-answer">设置 → 填写名称、图标（Emoji 或 SVG）和搜索 URL，URL 中使用 <code>{query}</code> 作为搜索关键词占位符。</p>
          <div class="code-example">
            <pre><code>Google: https://www.google.com/search?q={query}
百度:   https://www.baidu.com/s?wd={query}</code></pre>
          </div>
        </div>

        <div class="usage-item">
          <h3 class="usage-subtitle">云同步</h3>
          <p class="faq-answer"><strong>GitHub Gist：</strong>创建 GitHub Personal Access Token（需要 <code>gist</code> 权限），在设置中输入并验证保存。</p>
          <p class="faq-answer"><strong>匿名口令同步：</strong>选择"匿名口令同步"方式，输入一个同步口令，使用相同口令可在不同设备间同步。⚠️ 数据有效期为 24 小时，相同口令会覆盖之前的数据。</p>
        </div>

        <div class="usage-item">
          <h3 class="usage-subtitle">背景图片</h3>
          <p class="faq-answer">设置 → 背景图片，上传图片（最大 10MB）。系统自动保存最多 5 张历史背景，可快速切换。</p>
        </div>
      </section>

      <section class="about-section" aria-labelledby="tech-title">
        <h2 id="tech-title" class="section-title">🛠️ 技术栈</h2>
        <ul class="tech-list">
          <li><strong>Vue 3.4+</strong> - Composition API</li>
          <li><strong>Vite 5.0+</strong> - 构建工具</li>
          <li><strong>LocalStorage / IndexedDB</strong> - 本地存储</li>
          <li><strong>GitHub Gist API</strong> - 云同步</li>
        </ul>
      </section>

      <section class="about-section" aria-labelledby="privacy-title">
        <h2 id="privacy-title" class="section-title">🔒 隐私与安全</h2>
        <ul class="feature-list">
          <li>所有数据存储在浏览器本地，完全离线可用</li>
          <li>不使用任何分析或追踪工具</li>
          <li>配置文件加密存储</li>
        </ul>
      </section>

      <section class="about-section about-footer">
        <p class="footer-text">
          <strong>Made with ❤️ by Roc2Liu</strong>
        </p>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: 'About',
  emits: ['close'],
  mounted() {
    this.previousActiveElement = document.activeElement
    this.$nextTick(() => {
      const closeBtn = this.$el.querySelector('.close-btn')
      if (closeBtn) {
        closeBtn.focus()
      }
    })
    this.escapeHandler = (e) => {
      if (e.key === 'Escape') {
        this.$emit('close')
      }
    }
    document.addEventListener('keydown', this.escapeHandler)
  },
  beforeUnmount() {
    if (this.previousActiveElement && typeof this.previousActiveElement.focus === 'function') {
      this.previousActiveElement.focus()
    }
    if (this.escapeHandler) {
      document.removeEventListener('keydown', this.escapeHandler)
    }
  },
  data() {
    return {
      previousActiveElement: null,
      escapeHandler: null
    }
  }
}
</script>

<style scoped>
.about-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--bg-primary);
  z-index: var(--z-modal);
  overflow-y: auto;
  overflow-x: hidden;
}

.close-btn {
  position: fixed;
  top: var(--spacing-lg);
  right: var(--spacing-lg);
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-base) var(--transition-timing);
  cursor: pointer;
  z-index: var(--z-popover);
  box-shadow: var(--shadow-md);
}

.close-btn:hover {
  background-color: var(--bg-hover);
  border-color: var(--border-color);
}

.close-btn:focus-visible {
  outline: 2px solid var(--accent-color);
  outline-offset: 2px;
}

.about-content {
  max-width: 900px;
  margin: 0 auto;
  padding: var(--spacing-4xl) var(--spacing-lg) var(--spacing-xl) var(--spacing-lg);
  width: 100%;
  box-sizing: border-box;
}

.about-intro {
  margin-bottom: var(--spacing-2xl);
}

.about-description {
  font-size: 18px;
  line-height: 1.8;
  color: var(--text-primary);
  margin-bottom: 24px;
}

.badges {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.badge {
  padding: var(--spacing-xs) var(--spacing-md);
  border-radius: var(--radius-xs);
  font-size: 14px;
  font-weight: 500;
  display: inline-block;
}

.badge-vue {
  background-color: #4FC08D;
  color: white;
}

.badge-vite {
  background-color: #646CFF;
  color: white;
}

.badge-license {
  background-color: var(--bg-card);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.about-section {
  margin-bottom: var(--spacing-2xl);
}

.section-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--border-color);
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.feature-list li {
  padding: 8px 0;
  padding-left: 24px;
  position: relative;
  color: var(--text-primary);
  line-height: 1.6;
}

.feature-list li::before {
  content: '•';
  position: absolute;
  left: 8px;
  color: var(--accent-color);
  font-weight: bold;
}

.feature-list strong {
  color: var(--text-primary);
  font-weight: 600;
}

.usage-item {
  margin-bottom: 32px;
}

.usage-subtitle {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 16px;
}

.code-example {
  margin-top: var(--spacing-md);
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  padding: var(--spacing-md);
}

.code-example pre {
  margin: 12px 0 0 0;
  padding: 0;
  background: transparent;
  overflow-x: auto;
}

.code-example code {
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-primary);
  white-space: pre;
}

code {
  background-color: var(--bg-hover);
  padding: var(--spacing-xs) var(--spacing-xs);
  border-radius: var(--radius-xs);
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 14px;
  color: var(--accent-color);
}

.tech-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tech-list li {
  padding: 12px 0;
  padding-left: 24px;
  position: relative;
  color: var(--text-primary);
  line-height: 1.6;
}

.tech-list li::before {
  content: '▸';
  position: absolute;
  left: 8px;
  color: var(--accent-color);
}

.faq-answer {
  color: var(--text-primary);
  line-height: 1.6;
  margin: 0 0 12px 0;
}

.about-footer {
  text-align: center;
  padding-top: 24px;
  border-top: 1px solid var(--border-color);
  margin-top: 48px;
}

.footer-text {
  color: var(--text-secondary);
  font-size: 16px;
  line-height: 1.8;
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

@media (max-width: 768px) {
  .close-btn {
    top: 12px;
    right: 12px;
    width: 36px;
    height: 36px;
  }

  .about-content {
    padding: 70px 16px 24px 16px;
  }

  .section-title {
    font-size: 24px;
  }

  .about-description {
    font-size: 16px;
  }
}
</style>
