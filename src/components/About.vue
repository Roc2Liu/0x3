<template>
  <div class="about-container" role="document">
    <div class="about-content">
      <div class="about-intro">
        <p class="slogan">
          <strong>0x3</strong> —— 今天同步，明天失忆，看不懂就等于没泄露，永远年轻，永远抽象。
        </p>
        <p class="about-description">
          一个连自己作者都懒得打字介绍的搜索引擎聚合导航网站。<br>
          主打的就是一个"能用、能搜、不恶心人"。
        </p>
        <div class="badges">
          <span class="badge badge-vue">Vue 3.4+（我真没偷懒）</span>
          <span class="badge badge-vite">Vite 5（打包快到飞起）</span>
          <span class="badge badge-license">MIT（随便抄，抄了别说是我教的）</span>
        </div>
      </div>

      <section class="about-section" aria-labelledby="features-title">
        <h2 id="features-title" class="section-title">核心特性（抽象）特性</h2>
          <ul class="feature-list">
          <li><strong>搜索引擎管理</strong>：想加就加，想删就删，反正不听话的直接送进垃圾桶</li>
          <li><strong>云同步双雄</strong>：
            <ul>
              <li>GitHub Gist：适合装逼的程序员</li>
              <li>匿名口令同步：适合社恐、不想登录、今天同步明天失忆的抽象用户</li>
          </ul>
          </li>
          <li><strong>背景图</strong>：最多存 5 张，再多作者怕你存储爆炸，毕竟硬盘贵的飞起</li>
          <li><strong>主题系统</strong>：浅色伤眼、深色护眼、自动摆烂，三种模式随便选</li>
          <li><strong>数据安全</strong>：「肉眼不可读」→「AI 也不可读」→「作者自己都不可读」—— 看不懂三连，永不翻车</li>
          </ul>
      </section>

      <section class="about-section" aria-labelledby="usage-title">
        <h2 id="usage-title" class="section-title">使用指南（建议直接无视）</h2>
        
        <div class="usage-item">
          <h3 class="usage-subtitle">加搜索引擎？三秒搞定</h3>
          <p class="faq-answer">设置 → 乱填名字 → 扔个 Emoji 当图标 → URL 里塞个 <code>{query}</code> → 点添加<br>示例：百度 https://www.baidu.com/s?wd={query}（别问我为啥还留百度，问就是情怀）</p>
        </div>

        <div class="usage-item">
          <h3 class="usage-subtitle">云同步？分两种人</h3>
          <p class="faq-answer">
            <strong>GitHub Gist 派</strong>：我有 token，我牛逼，我同步的就是慢才显得高级<br>
            <strong>匿名口令派</strong>：我连 GitHub 账号都不想登，今天同步，明天装失忆，24 小时后数据原地升天，永远年轻，永远抽象
          </p>
        </div>

        <div class="usage-item">
          <h3 class="usage-subtitle">背景图</h3>
          <p class="faq-answer">上传你老婆（或者二次元老婆），系统自动存 5 张，多了就踢最早那张，帮你实现"喜新厌旧"</p>
        </div>
      </section>

      <section class="about-section" aria-labelledby="tech-title">
        <h2 id="tech-title" class="section-title">技术栈（装逼专用）</h2>
        <ul class="tech-list">
          <li>Vue 3 + Composition API（Options API 太老土）</li>
          <li>Vite（webpack 谁用谁是孙子）</li>
          <li>LocalStorage + IndexedDB（作者不会搭后端）</li>
          <li>GitHub Gist 当云盘（马斯克看了都沉默）</li>
          <li>匿名同步服务器：一台 99 块钱{{ serverExpiryText }}到期的垃圾云 VPS +  24小时后删文件（环保节能）</li>
        </ul>
      </section>

      <section class="about-section" aria-labelledby="privacy-title">
        <h2 id="privacy-title" class="section-title">隐私保护宣言</h2>
        <ul class="feature-list">
          <li>不埋任何统计，不搞任何追踪，连 Google Analytics 都嫌它恶心</li>
          <li>上传的配置文件全是"艺术级密文"，自己都看不懂</li>
          <li>24 小时自动销毁，永远不会被前任翻到搜索记录</li>
          <li>核心隐私理念：看不懂 ＝ 没泄露，量子纠缠级加密</li>
        </ul>
      </section>

      <section class="about-section about-footer">
        <p class="footer-text">
          <strong>Made with ❤️ & ☕ & 抽象 by Roc2Liu</strong><br>
          <small style="opacity:0.6">（这些都是抽象AI生成的）</small>
        </p>
      </section>

      <div style="text-align:center; margin-top:60px; opacity:0.4; font-size:14px; line-height:2;">
        <p>常见问题：</p>

        <p>Q：服务器到期后同步还可用吗？<br>A：可用，只要你相信量子纠缠</p>

        <p>Q：为什么不续费？<br>A：因为作者相信"无常"才是真正的隐私</p>

        <p>Q：你这项目能活多久？<br>A：和这台 VPS 一样久 —— 但精神永存</p>

        <p><strong>—— 看不懂三连，祝你早日成佛</strong></p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'About',
  emits: ['close'],
  data() {
    return {
      previousActiveElement: null,
      escapeHandler: null,
      currentTime: new Date(),
      expiryDate: new Date('2026-08-10T09:38:33'),
      timer: null
    }
  },
  computed: {
    serverExpiryText() {
      const now = this.currentTime
      const diff = this.expiryDate - now
      
      if (diff <= 0) {
        return '已到期（作者已跑路）'
      }
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)
      
      if (days > 0) {
        return `还有 ${days} 天 ${hours} 小时 ${minutes} 分钟 ${seconds} 秒`
      } else if (hours > 0) {
        return `还有 ${hours} 小时 ${minutes} 分钟 ${seconds} 秒`
      } else if (minutes > 0) {
        return `还有 ${minutes} 分钟 ${seconds} 秒`
      } else {
        return `还有 ${seconds} 秒`
      }
    }
  },
  mounted() {
    this.previousActiveElement = document.activeElement
    this.escapeHandler = (e) => {
      if (e.key === 'Escape') {
        this.$emit('close')
      }
    }
    document.addEventListener('keydown', this.escapeHandler)
    
    // 每秒更新一次时间
    this.timer = setInterval(() => {
      this.currentTime = new Date()
    }, 1000)
  },
  beforeUnmount() {
    if (this.previousActiveElement && typeof this.previousActiveElement.focus === 'function') {
      this.previousActiveElement.focus()
    }
    if (this.escapeHandler) {
      document.removeEventListener('keydown', this.escapeHandler)
    }
    if (this.timer) {
      clearInterval(this.timer)
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


.about-content {
  max-width: 900px;
  margin: 0 auto;
  padding: calc(80px + var(--spacing-4xl)) var(--spacing-lg) var(--spacing-xl) var(--spacing-lg);
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

.slogan {
  font-size: 20px;
  line-height: 1.8;
  color: var(--text-primary);
  margin-bottom: 24px;
  text-align: center;
  padding: var(--spacing-md) 0;
  border-top: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
}

.slogan strong {
  color: var(--accent-color);
  font-weight: 700;
  font-size: 22px;
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

.feature-list ul {
  list-style: none;
  padding: 0;
  margin: 8px 0 0 0;
  padding-left: 20px;
}

.feature-list ul li {
  padding: 4px 0;
  padding-left: 20px;
  position: relative;
  font-size: 14px;
  color: var(--text-secondary);
}

.feature-list ul li::before {
  content: '▸';
  position: absolute;
  left: 0;
  color: var(--accent-color);
  font-weight: normal;
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
    top: calc(var(--spacing-sm) + 70px); /* 移动端 header 高度 + 间距 */
    right: var(--spacing-sm);
    width: 36px;
    height: 36px;
  }

  .about-content {
    padding: calc(70px + var(--spacing-lg)) 16px 24px 16px;
  }

  .section-title {
    font-size: 24px;
  }

  .about-description {
    font-size: 16px;
  }

  .slogan {
    font-size: 18px;
}

  .slogan strong {
    font-size: 20px;
  }
}
</style>
