<template>
  <div class="about-container" role="document" aria-labelledby="about-title">
    <div class="about-header">
      <h1 id="about-title" class="about-title">
        <span class="about-icon">🔍</span>
        0x3 - 搜索引擎聚合导航
      </h1>
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
    </div>

    <div class="about-content">
      <div class="about-intro">
        <p class="about-description">
          一个美观、现代、完全无障碍的搜索引擎聚合导航网站。支持多引擎切换、自定义添加、主题切换、数据导入导出等功能。
        </p>
        <div class="badges">
          <span class="badge badge-vue">Vue 3.4+</span>
          <span class="badge badge-vite">Vite 5.0+</span>
          <span class="badge badge-license">MIT License</span>
        </div>
      </div>

      <section class="about-section" aria-labelledby="features-title">
        <h2 id="features-title" class="section-title">✨ 核心特性</h2>
        
        <div class="feature-group">
          <h3 class="feature-title">🔄 搜索引擎管理</h3>
          <ul class="feature-list">
            <li><strong>多引擎切换</strong>：快速切换不同的搜索引擎</li>
            <li><strong>自定义添加</strong>：添加任意搜索引擎，支持 Emoji 图标或 SVG 图片</li>
            <li><strong>在线编辑</strong>：随时编辑搜索引擎的名称、图标和 URL</li>
            <li><strong>智能排序</strong>：支持按名称或添加时间排序</li>
            <li><strong>搜索过滤</strong>：快速查找已添加的搜索引擎</li>
          </ul>
        </div>

        <div class="feature-group">
          <h3 class="feature-title">💾 数据管理</h3>
          <ul class="feature-list">
            <li><strong>本地存储</strong>：所有设置数据存储在浏览器 LocalStorage，可离线访问和配置</li>
            <li><strong>导入导出</strong>：支持加密的搜索引擎配置导入导出</li>
            <li><strong>数据安全</strong>：基于域名和时间戳的动态加密，确保数据安全</li>
            <li><strong>注意</strong>：搜索功能需要网络连接，无法离线搜索</li>
          </ul>
        </div>

        <div class="feature-group">
          <h3 class="feature-title">🎨 主题系统</h3>
          <ul class="feature-list">
            <li><strong>多种模式</strong>：浅色、深色、自动三种主题模式</li>
            <li><strong>时间自动切换</strong>：自动模式下，晚上 8 点到早上 6 点自动切换深色模式</li>
            <li><strong>系统跟随</strong>：自动模式跟随系统偏好设置</li>
            <li><strong>平滑过渡</strong>：主题切换带有平滑动画效果</li>
          </ul>
        </div>

        <div class="feature-group">
          <h3 class="feature-title">📱 响应式设计</h3>
          <ul class="feature-list">
            <li><strong>完美适配</strong>：桌面端和移动端都有优化的布局</li>
            <li><strong>触摸友好</strong>：移动端优化的触摸交互</li>
            <li><strong>简洁界面</strong>：PC 端专注于搜索体验，界面简洁干净</li>
          </ul>
        </div>

        <div class="feature-group">
          <h3 class="feature-title">📲 PWA 支持</h3>
          <ul class="feature-list">
            <li><strong>可安装应用</strong>：支持安装到桌面和移动设备</li>
            <li><strong>离线访问</strong>：Service Worker 缓存静态资源，应用界面可离线访问</li>
            <li><strong>离线配置</strong>：设置和管理搜索引擎可在离线状态下进行</li>
            <li><strong>自动更新</strong>：应用自动检查并更新到最新版本</li>
            <li><strong>原生体验</strong>：全屏显示，类似原生应用体验</li>
            <li><strong>注意</strong>：搜索功能需要网络连接</li>
          </ul>
        </div>

        <div class="feature-group">
          <h3 class="feature-title">♿ 无障碍支持</h3>
          <ul class="feature-list">
            <li><strong>WCAG 2.1 AA 级别</strong>：符合国际无障碍标准</li>
            <li><strong>键盘导航</strong>：所有功能完全支持键盘操作</li>
            <li><strong>屏幕阅读器</strong>：完整的 ARIA 标签和语义化 HTML</li>
            <li><strong>焦点管理</strong>：智能的焦点陷阱和焦点恢复</li>
            <li><strong>高对比度</strong>：支持系统高对比度模式</li>
            <li><strong>减少动画</strong>：尊重用户的减少动画偏好</li>
          </ul>
        </div>
      </section>

      <section class="about-section" aria-labelledby="usage-title">
        <h2 id="usage-title" class="section-title">📖 使用指南</h2>
        
        <div class="usage-item">
          <h3 class="usage-subtitle">基础搜索</h3>
          <ol class="usage-steps">
            <li>在搜索框中输入关键词</li>
            <li>点击搜索按钮或按 <kbd>Enter</kbd> 键</li>
            <li>搜索结果会在新标签页中打开</li>
          </ol>
        </div>

        <div class="usage-item">
          <h3 class="usage-subtitle">切换搜索引擎</h3>
          <ul class="feature-list">
            <li>点击搜索框左侧的引擎选择器</li>
            <li>从下拉列表中选择目标搜索引擎</li>
            <li>支持键盘导航：<kbd>↑</kbd> / <kbd>↓</kbd> 选择，<kbd>Enter</kbd> 确认</li>
            <li>支持搜索过滤：当引擎数量较多时，可以在下拉列表中输入关键词快速查找</li>
          </ul>
        </div>

        <div class="usage-item">
          <h3 class="usage-subtitle">添加搜索引擎</h3>
          <ol class="usage-steps">
            <li>点击右上角的 ⚙️ <strong>设置</strong> 按钮</li>
            <li>在"添加搜索引擎"表单中填写：
              <ul class="feature-list">
                <li><strong>名称</strong>：搜索引擎的显示名称（如：Google）</li>
                <li><strong>图标</strong>：输入 Emoji（如：🌐）或点击上传按钮选择 SVG 图片</li>
                <li><strong>搜索 URL</strong>：使用 <code>{query}</code> 作为搜索关键词占位符</li>
              </ul>
            </li>
            <li>点击"添加"按钮完成添加</li>
          </ol>
          <div class="code-example">
            <p><strong>URL 格式示例：</strong></p>
            <pre><code>Google:      https://www.google.com/search?q={query}
百度:        https://www.baidu.com/s?wd={query}
Bing:        https://www.bing.com/search?q={query}
GitHub:      https://github.com/search?q={query}
YouTube:     https://www.youtube.com/results?search_query={query}
DuckDuckGo:  https://duckduckgo.com/?q={query}</code></pre>
          </div>
        </div>
      </section>

      <section class="about-section" aria-labelledby="pwa-title">
        <h2 id="pwa-title" class="section-title">📲 安装 PWA 应用</h2>
        
        <div class="usage-item">
          <h3 class="usage-subtitle">桌面端（Chrome/Edge）</h3>
          <ol class="usage-steps">
            <li>点击浏览器地址栏右侧的安装图标</li>
            <li>或点击右上角菜单 → "安装 0x3"</li>
            <li>应用将安装到桌面，可以像原生应用一样使用</li>
          </ol>
        </div>

        <div class="usage-item">
          <h3 class="usage-subtitle">移动端（Android Chrome）</h3>
          <ol class="usage-steps">
            <li>打开网站后，浏览器会显示"添加到主屏幕"提示</li>
            <li>点击"添加"或通过菜单选择"添加到主屏幕"</li>
            <li>应用图标将出现在主屏幕上</li>
          </ol>
        </div>

        <div class="usage-item">
          <h3 class="usage-subtitle">iOS Safari</h3>
          <ol class="usage-steps">
            <li>点击底部的分享按钮</li>
            <li>选择"添加到主屏幕"</li>
            <li>应用图标将出现在主屏幕上</li>
          </ol>
        </div>

        <div class="usage-item">
          <p class="faq-answer">
            💡 <strong>提示</strong>：安装后应用界面和设置功能可以离线访问，所有数据存储在本地。应用会自动更新到最新版本。<br>
            ⚠️ <strong>注意</strong>：搜索功能需要网络连接，无法在离线状态下执行搜索。
          </p>
        </div>
      </section>

      <section class="about-section" aria-labelledby="shortcuts-title">
        <h2 id="shortcuts-title" class="section-title">⌨️ 键盘快捷键</h2>
        <div class="shortcuts-table">
          <table>
            <thead>
              <tr>
                <th>快捷键</th>
                <th>功能</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><kbd>Tab</kbd></td>
                <td>切换到下一个可聚焦元素</td>
              </tr>
              <tr>
                <td><kbd>Shift</kbd> + <kbd>Tab</kbd></td>
                <td>切换到上一个可聚焦元素</td>
              </tr>
              <tr>
                <td><kbd>Enter</kbd></td>
                <td>提交搜索 / 确认选择</td>
              </tr>
              <tr>
                <td><kbd>Space</kbd></td>
                <td>触发按钮 / 选择项</td>
              </tr>
              <tr>
                <td><kbd>Esc</kbd></td>
                <td>关闭弹窗 / 关闭下拉菜单</td>
              </tr>
              <tr>
                <td><kbd>↑</kbd> / <kbd>↓</kbd></td>
                <td>在下拉列表中导航</td>
              </tr>
              <tr>
                <td><kbd>Home</kbd> / <kbd>End</kbd></td>
                <td>跳转到列表首/尾</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="about-section" aria-labelledby="tech-title">
        <h2 id="tech-title" class="section-title">🛠️ 技术栈</h2>
        <ul class="tech-list">
          <li><strong>Vue 3.4+</strong> - 渐进式 JavaScript 框架（Composition API）</li>
          <li><strong>Vite 5.0+</strong> - 下一代前端构建工具</li>
          <li><strong>PWA</strong> - 渐进式 Web 应用（Service Worker、Web App Manifest）</li>
          <li><strong>CSS Variables</strong> - 动态主题切换</li>
          <li><strong>LocalStorage API</strong> - 本地数据存储</li>
        </ul>
      </section>

      <section class="about-section" aria-labelledby="privacy-title">
        <h2 id="privacy-title" class="section-title">🔒 隐私与安全</h2>
        <ul class="feature-list">
          <li><strong>本地存储</strong>：所有设置数据存储在浏览器本地，不会上传到任何服务器</li>
          <li><strong>离线访问</strong>：应用界面和设置功能可在离线状态下访问</li>
          <li><strong>无追踪</strong>：不使用任何分析或追踪工具</li>
          <li><strong>数据加密</strong>：导入导出的配置文件使用动态密钥加密</li>
          <li><strong>域名绑定</strong>：加密数据与域名绑定，增强安全性</li>
          <li><strong>PWA 离线缓存</strong>：Service Worker 仅缓存静态资源，不存储用户数据</li>
          <li><strong>搜索需要网络</strong>：搜索功能需要连接到目标搜索引擎服务器</li>
        </ul>
      </section>

      <section class="about-section" aria-labelledby="faq-title">
        <h2 id="faq-title" class="section-title">💡 常见问题</h2>
        
        <div class="faq-item">
          <h3 class="faq-question">Q: 如何添加其他搜索引擎？</h3>
          <p class="faq-answer">A: 进入设置页面，找到要添加的搜索引擎的搜索 URL 格式，将搜索关键词替换为 <code>{query}</code>，然后填写名称、图标和 URL 即可。</p>
        </div>

        <div class="faq-item">
          <h3 class="faq-question">Q: 数据存储在哪里？</h3>
          <p class="faq-answer">A: 所有设置数据（搜索引擎列表、当前引擎、主题设置）都存储在浏览器的 LocalStorage 中，可以在离线状态下访问和配置，不会上传到服务器。但是搜索功能需要网络连接，无法离线搜索。</p>
        </div>

        <div class="faq-item">
          <h3 class="faq-question">Q: 支持哪些图标格式？</h3>
          <p class="faq-answer">A: 支持两种图标格式：<strong>Emoji</strong>（直接输入 Emoji 字符）和 <strong>SVG 图片</strong>（通过上传按钮选择 SVG 格式的图片文件）。</p>
        </div>

        <div class="faq-item">
          <h3 class="faq-question">Q: 如何安装 PWA 应用？</h3>
          <p class="faq-answer">A: 
            <strong>桌面端</strong>：Chrome/Edge 浏览器会自动在地址栏显示安装图标，点击即可安装。<br>
            <strong>移动端</strong>：Android Chrome 会显示"添加到主屏幕"提示；iOS Safari 需要使用分享按钮 → "添加到主屏幕"。<br>
            安装后应用界面和设置功能可以离线访问，应用会自动更新到最新版本。<br>
            ⚠️ <strong>注意</strong>：搜索功能需要网络连接。
          </p>
        </div>
      </section>

      <section class="about-section" aria-labelledby="license-title">
        <h2 id="license-title" class="section-title">📄 许可证</h2>
        <p>本项目采用 MIT 许可证。</p>
      </section>

      <section class="about-section about-footer">
        <p class="footer-text">
          <strong>Made with ❤️ by Roc2Liu</strong><br>
          <span class="footer-subtext">Assisted by Claude (Anthropic)</span>
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
    // 保存当前焦点元素
    this.previousActiveElement = document.activeElement
    // 聚焦到关闭按钮
    this.$nextTick(() => {
      const closeBtn = this.$el.querySelector('.close-btn')
      if (closeBtn) {
        closeBtn.focus()
      }
    })
    // 添加 ESC 键监听
    this.escapeHandler = (e) => {
      if (e.key === 'Escape') {
        this.$emit('close')
      }
    }
    document.addEventListener('keydown', this.escapeHandler)
  },
  beforeUnmount() {
    // 恢复之前的焦点
    if (this.previousActiveElement && typeof this.previousActiveElement.focus === 'function') {
      this.previousActiveElement.focus()
    }
    // 移除 ESC 键监听
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
  z-index: 1001;
  overflow-y: auto;
  overflow-x: hidden;
}

.about-header {
  position: sticky;
  top: 0;
  background-color: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1002;
  backdrop-filter: blur(12px);
  background-color: rgba(255, 255, 255, 0.85);
  box-shadow: var(--shadow-sm);
}

[data-theme="dark"] .about-header {
  background-color: rgba(22, 27, 34, 0.85);
}

.about-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.about-icon {
  font-size: 28px;
}

.close-btn {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background-color: transparent;
  border: 1px solid transparent;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
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
  padding: 40px 24px;
  width: 100%;
  box-sizing: border-box;
}

.about-intro {
  margin-bottom: 48px;
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
  padding: 6px 12px;
  border-radius: 6px;
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
  margin-bottom: 48px;
}

.section-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--border-color);
}

.feature-group {
  margin-bottom: 32px;
}

.feature-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 12px;
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

.usage-steps {
  list-style: decimal;
  padding-left: 24px;
  margin-bottom: 16px;
}

.usage-steps li {
  margin-bottom: 8px;
  color: var(--text-primary);
  line-height: 1.6;
}

.code-example {
  margin-top: 16px;
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 16px;
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
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 14px;
  color: var(--accent-color);
}

kbd {
  display: inline-block;
  padding: 4px 8px;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 13px;
  line-height: 1;
  color: var(--text-primary);
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.shortcuts-table {
  overflow-x: auto;
}

.shortcuts-table table {
  width: 100%;
  border-collapse: collapse;
  background-color: var(--bg-card);
  border-radius: 8px;
  overflow: hidden;
}

.shortcuts-table thead {
  background-color: var(--bg-hover);
}

.shortcuts-table th,
.shortcuts-table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

.shortcuts-table th {
  font-weight: 600;
  color: var(--text-primary);
}

.shortcuts-table td {
  color: var(--text-primary);
}

.shortcuts-table tbody tr:last-child td {
  border-bottom: none;
}

.shortcuts-table tbody tr:hover {
  background-color: var(--bg-hover);
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

.faq-item {
  margin-bottom: 24px;
  padding: 20px;
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 8px;
}

.faq-question {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.faq-answer {
  color: var(--text-primary);
  line-height: 1.6;
  margin: 0;
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

.footer-subtext {
  color: var(--text-tertiary);
  font-size: 14px;
  font-weight: normal;
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
  .about-header {
    padding: 12px 16px;
  }

  .about-title {
    font-size: 20px;
  }

  .about-icon {
    font-size: 24px;
  }

  .about-content {
    padding: 24px 16px;
  }

  .section-title {
    font-size: 24px;
  }

  .about-description {
    font-size: 16px;
  }

  .shortcuts-table {
    font-size: 14px;
  }

  .shortcuts-table th,
  .shortcuts-table td {
    padding: 8px 12px;
  }
}

/* 无障碍：减少动画（尊重用户偏好） */
@media (prefers-reduced-motion: reduce) {
  .about-container,
  .close-btn,
  .badge {
    transition: none !important;
  }
}
</style>

