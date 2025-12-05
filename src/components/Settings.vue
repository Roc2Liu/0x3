<template>
  <div 
    class="settings-container" 
    role="dialog" 
    aria-labelledby="settings-title" 
    aria-modal="true"
    @keydown.escape="$emit('close')"
    tabindex="-1"
  >
    <div class="settings-header-bar">
      <h2 id="settings-title" class="settings-title">设置</h2>
      <button 
        class="close-btn"
        ref="closeButtonRef"
        @click="$emit('close')"
        aria-label="关闭设置"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
        <span class="visually-hidden">关闭</span>
      </button>
    </div>

    <div class="settings-content">
      <section class="settings-section" aria-labelledby="add-engine-title">
        <div class="section-header">
          <h3 id="add-engine-title" class="section-title">添加搜索引擎</h3>
          <div class="section-header-actions">
            <div class="import-export-buttons">
              <label class="import-btn" for="import-file" aria-label="导入搜索引擎配置" title="导入搜索引擎配置">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                导入
                <input 
                  id="import-file"
                  type="file"
                  accept=".json,application/json"
                  @change="handleImport"
                  style="display: none;"
                />
              </label>
              <button 
                class="export-btn" 
                @click="handleExport"
                aria-label="导出搜索引擎配置"
                title="导出搜索引擎配置"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                导出
              </button>
            </div>
          </div>
        </div>
        <div class="add-engine-card">
          <form class="add-engine-form" @submit.prevent="handleAddEngine" aria-label="添加搜索引擎表单">
            <div class="form-group">
              <label for="engine-name">名称</label>
              <input 
                id="engine-name"
                v-model="newEngine.name" 
                type="text" 
                placeholder="eg:Google" 
                required
                aria-required="true"
                :aria-describedby="validationErrors.name ? 'engine-name-error' : 'engine-name-desc'"
                :class="{ 'input-error': validationErrors.name }"
              />
              <small 
                v-if="validationErrors.name" 
                id="engine-name-error" 
                class="form-error"
                role="alert"
              >
                {{ validationErrors.name }}
              </small>
              <small 
                v-else 
                id="engine-name-desc" 
                class="form-hint"
              >
                搜索引擎的显示名称
              </small>
            </div>
            <div class="form-group">
              <label for="engine-icon">图标</label>
              <div class="icon-input-group">
                <input 
                  id="engine-icon"
                  v-model="newEngine.icon" 
                  type="text" 
                  placeholder="eg:🌐 或上传 SVG 图片" 
                  required
                  aria-required="true"
                  aria-describedby="engine-icon-desc"
                />
                <label for="engine-icon-upload" class="icon-upload-btn" :aria-label="newEngine.icon ? '更换图标' : '上传 SVG 图标'">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                  <span class="visually-hidden">上传 SVG</span>
                </label>
                <input 
                  id="engine-icon-upload"
                  type="file"
                  accept=".svg,image/svg+xml"
                  @change="handleIconUpload($event, 'new')"
                  style="display: none;"
                />
              </div>
              <small id="engine-icon-desc" class="form-hint">输入 Emoji 或上传 SVG 图片作为图标</small>
            </div>
            <div class="form-group">
              <label for="engine-url">搜索 URL</label>
              <input 
                id="engine-url"
                v-model="newEngine.url" 
                type="url" 
                placeholder="eg：https://www.google.com/search?q={query}" 
                required
                aria-required="true"
                :aria-describedby="validationErrors.url ? 'engine-url-error' : 'engine-url-desc'"
                :class="{ 'input-error': validationErrors.url }"
              />
              <small 
                v-if="validationErrors.url" 
                id="engine-url-error" 
                class="form-error"
                role="alert"
              >
                {{ validationErrors.url }}
              </small>
              <small 
                v-else 
                id="engine-url-desc" 
                class="form-hint"
              >
                使用 {query} 作为搜索关键词占位符
              </small>
            </div>
            <button type="submit" class="add-btn">
              添加
            </button>
          </form>
        </div>
      </section>

      <section class="settings-section" aria-labelledby="cloud-sync-title">
        <div class="section-header">
          <h3 id="cloud-sync-title" class="section-title">云同步</h3>
        </div>
        <div class="cloud-sync-card">
          <div v-if="!cloudSyncConfig" class="cloud-sync-setup">
            <!-- 同步方式选择 -->
            <div class="form-group">
              <label>同步方式</label>
              <div class="sync-type-selector">
                <label class="sync-type-option">
                  <input
                    type="radio"
                    v-model="syncType"
                    value="github"
                    @change="handleSyncTypeChange"
                  />
                  <span>GitHub Gist</span>
                </label>
                <label class="sync-type-option">
                  <input
                    type="radio"
                    v-model="syncType"
                    value="jianguoyun"
                    @change="handleSyncTypeChange"
                  />
                  <span>坚果云 WebDAV</span>
                </label>
              </div>
            </div>

            <!-- GitHub Gist 配置 -->
            <div v-if="syncType === 'github'" class="sync-config-section">
              <div class="form-group">
                <label for="github-token">GitHub Personal Access Token</label>
                <input
                  id="github-token"
                  v-model="githubToken"
                  type="password"
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                  class="token-input"
                  aria-describedby="token-help"
                />
                <small id="token-help" class="form-hint">
                  需要 <code>gist</code> 权限。创建 Token：
                  <a href="https://github.com/settings/tokens" target="_blank" rel="noopener noreferrer">
                    https://github.com/settings/tokens
                  </a>
                </small>
              </div>
              <div class="form-group" v-if="githubToken">
                <label for="gist-id">Gist ID（可选，首次上传后自动保存）</label>
                <input
                  id="gist-id"
                  v-model="gistId"
                  type="text"
                  placeholder="留空则创建新的 Gist"
                  class="token-input"
                />
                <small class="form-hint">如果已有 Gist ID，填写后可下载该 Gist 的数据</small>
              </div>
            </div>

            <!-- 坚果云 WebDAV 配置 -->
            <div v-if="syncType === 'jianguoyun'" class="sync-config-section">
              <div class="form-group">
                <label for="jianguoyun-username">坚果云用户名</label>
                <input
                  id="jianguoyun-username"
                  v-model="jianguoyunUsername"
                  type="text"
                  placeholder="您的坚果云账号"
                  class="token-input"
                />
              </div>
              <div class="form-group">
                <label for="jianguoyun-password">应用密码</label>
                <input
                  id="jianguoyun-password"
                  v-model="jianguoyunPassword"
                  type="password"
                  placeholder="坚果云应用专用密码"
                  class="token-input"
                  aria-describedby="jianguoyun-password-help"
                />
                <small id="jianguoyun-password-help" class="form-hint">
                  不是登录密码！需要在坚果云设置中生成应用密码。
                  <a href="https://help.jianguoyun.com/?p=2064" target="_blank" rel="noopener noreferrer">
                    查看如何生成应用密码
                  </a>
                </small>
              </div>
              <div class="form-group">
                <label for="jianguoyun-filepath">文件目录</label>
                <input
                  id="jianguoyun-filepath"
                  v-model="jianguoyunFilePath"
                  type="text"
                  placeholder="/0x3/"
                  class="token-input"
                  aria-describedby="jianguoyun-filepath-help"
                />
                <small id="jianguoyun-filepath-help" class="form-hint">
                  输入目录路径（如：<code>/0x3/</code>），上传时会自动生成带日期的文件名（如：<code>25-12-05-search-engines.json</code>）。下载时会使用当前日期的文件，如需下载特定日期的文件，可输入完整路径。
                </small>
              </div>
            </div>

            <button
              class="sync-setup-btn"
              @click="handleSetupCloudSync"
              :disabled="!canSetupSync || syncing"
            >
              <span v-if="syncing">验证中...</span>
              <span v-else>验证并保存</span>
            </button>
          </div>
          
          <div v-else class="cloud-sync-active">
            <div class="sync-status">
              <div class="status-item">
                <span class="status-label">同步方式：</span>
                <span class="status-value">{{ cloudSyncConfig.type === 'jianguoyun' ? '坚果云 WebDAV' : 'GitHub Gist' }}</span>
              </div>
              <div class="status-item">
                <span class="status-label">{{ cloudSyncConfig.type === 'jianguoyun' ? '用户名' : 'GitHub 用户' }}：</span>
                <span class="status-value">{{ cloudSyncConfig.username }}</span>
              </div>
              <div class="status-item" v-if="cloudSyncConfig.type === 'jianguoyun' && cloudSyncConfig.filePath">
                <span class="status-label">文件路径：</span>
                <span class="status-value">{{ cloudSyncConfig.filePath }}</span>
              </div>
              <div class="status-item" v-if="lastSyncTime">
                <span class="status-label">最后同步：</span>
                <span class="status-value">{{ formatLastSyncTime(lastSyncTime) }}</span>
              </div>
            </div>
            <div class="sync-actions">
              <button
                class="sync-upload-btn"
                @click="handleCloudUpload"
                :disabled="syncing"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                上传到云端
              </button>
              <button
                class="sync-download-btn"
                @click="handleCloudDownload"
                :disabled="syncing"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                从云端下载
              </button>
              <button
                class="sync-disconnect-btn"
                @click="handleDisconnectCloudSync"
                :disabled="syncing"
              >
                断开连接
              </button>
            </div>
          </div>
        </div>
      </section>

      <section class="settings-section" aria-labelledby="engines-list-title">
        <div class="section-header">
          <h3 id="engines-list-title" class="section-title">已添加的搜索引擎</h3>
          <div class="section-header-actions">
            <div class="engines-count" v-if="engines.length > 0">
              共 {{ engines.length }} 个（Bing 默认 + {{ customEnginesCount }} 个自定义）
            </div>
          </div>
        </div>
        
        <div v-if="engines.length > 0" class="engines-filter-bar">
          <div class="search-filter">
            <label for="engine-search" class="visually-hidden">搜索搜索引擎</label>
            <input
              id="engine-search"
              v-model="searchQuery"
              type="text"
              class="filter-input"
              placeholder="搜索引擎名称或 URL..."
              aria-label="搜索搜索引擎"
            />
            <svg v-if="searchQuery" @click="searchQuery = ''" class="clear-search" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-label="清除搜索">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </div>
          
          <div class="filter-tabs" role="tablist" aria-label="过滤类型">
            <button
              class="filter-tab"
              :class="{ active: filterType === 'all' }"
              role="tab"
              aria-selected="filterType === 'all'"
              @click="filterType = 'all'"
            >
              全部
            </button>
            <button
              class="filter-tab"
              :class="{ active: filterType === 'default' }"
              role="tab"
              aria-selected="filterType === 'default'"
              @click="filterType = 'default'"
            >
              默认
            </button>
            <button
              class="filter-tab"
              :class="{ active: filterType === 'custom' }"
              role="tab"
              aria-selected="filterType === 'custom'"
              @click="filterType = 'custom'"
            >
              自定义
            </button>
          </div>
          
          <div class="sort-controls">
            <label for="engine-sort" class="visually-hidden">排序方式</label>
            <select
              id="engine-sort"
              v-model="sortBy"
              class="sort-select"
              aria-label="排序方式"
            >
              <option value="name">按名称排序</option>
              <option value="added">按添加时间</option>
            </select>
          </div>
        </div>
        
        <div v-if="filteredEngines.length === 0" class="empty-state" role="status" aria-live="polite">
          <p v-if="engines.length === 0">还没有添加任何搜索引擎</p>
          <p v-else>没有找到匹配的搜索引擎</p>
        </div>
        <div v-else class="engines-grid" role="list">
          <div
            v-for="engine in filteredEngines"
            :key="engine.id"
            class="engine-card"
            :class="{ 'editing': editingEngineId === engine.id }"
            role="listitem"
          >
            <div v-if="editingEngineId !== engine.id" class="engine-info">
              <div class="engine-icon" aria-hidden="true">
                <img v-if="isImageIcon(engine.icon)" :src="engine.icon" :alt="`${engine.name} 图标`" class="engine-icon-img" />
                <span v-else>{{ engine.icon }}</span>
              </div>
              <div class="engine-details">
                <div class="engine-title">{{ engine.name }}</div>
                <div class="engine-url" :title="engine.url">{{ engine.url }}</div>
              </div>
            </div>
            
            <!-- 编辑表单 -->
            <form 
              v-else 
              class="edit-engine-form"
              @submit.prevent="handleUpdateEngine(engine.id)"
            >
              <div class="form-group-inline">
                <input
                  v-model="editingEngine.name"
                  type="text"
                  placeholder="名称"
                  required
                  class="edit-input"
                />
                <div class="edit-icon-input-wrapper">
                  <input
                    v-model="editingEngine.icon"
                    type="text"
                    placeholder="图标"
                    required
                    class="edit-input edit-input-icon"
                  />
                  <label :for="`edit-icon-upload-${engine.id}`" class="icon-upload-btn-small" :aria-label="editingEngine.icon ? '更换图标' : '上传 SVG 图标'">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    <span class="visually-hidden">上传 SVG</span>
                  </label>
                  <input 
                    :id="`edit-icon-upload-${engine.id}`"
                    type="file"
                    accept=".svg,image/svg+xml"
                    @change="handleIconUpload($event, 'edit')"
                    style="display: none;"
                  />
                </div>
              </div>
              <input
                v-model="editingEngine.url"
                type="url"
                placeholder="搜索 URL"
                required
                class="edit-input"
              />
              <div class="edit-actions">
                <button type="submit" class="save-btn" aria-label="保存">
                  保存
                </button>
                <button 
                  type="button" 
                  class="cancel-btn" 
                  @click="cancelEdit"
                  aria-label="取消"
                >
                  取消
                </button>
              </div>
            </form>
            
            <div v-if="editingEngineId !== engine.id" class="engine-actions">
              <button
                class="edit-btn"
                @click="startEdit(engine)"
                :aria-label="`编辑 ${engine.name}`"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                <span class="visually-hidden">编辑</span>
              </button>
              <div class="engine-actions-right">
                <span v-if="engine.id === 'bing'" class="default-badge" aria-label="默认搜索引擎，不可删除">默认</span>
              <button
                v-if="engine.id !== 'bing'"
                class="remove-btn"
                :class="{ 'remove-btn-default': engine.isDefault }"
                @click="handleRemoveEngine(engine.id)"
                :aria-label="`删除 ${engine.name}`"
              >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                  <span class="visually-hidden">删除</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { encryptData, decryptData } from '../utils/encrypt.js'
import { alert, confirm, success, error } from '../utils/notify.js'
import {
  getSyncConfig,
  saveSyncConfig,
  clearSyncConfig,
  isCloudSyncEnabled,
  getLastSyncTime,
  syncUpload,
  syncDownload,
  validateGitHubToken,
  validateJianguoyunCredentials
} from '../utils/cloudSync.js'

export default {
  name: 'Settings',
  props: {
    engines: {
      type: Array,
      required: true
    }
  },
  emits: ['add-engine', 'remove-engine', 'update-engine', 'close', 'import-engines'],
  data() {
    return {
      previousActiveElement: null,
      focusTrapHandler: null,
      newEngine: {
        name: '',
        icon: '',
        url: ''
      },
      editingEngineId: null,
      editingEngine: {
        name: '',
        icon: '',
        url: ''
      },
      searchQuery: '',
      filterType: 'all', // 'all', 'default', 'custom'
      sortBy: 'name', // 'name', 'added'
      syncType: 'github', // 'github' 或 'jianguoyun'
      githubToken: '',
      gistId: '',
      jianguoyunUsername: '',
      jianguoyunPassword: '',
      jianguoyunFilePath: '/0x3/',
      cloudSyncConfig: null,
      lastSyncTime: null,
      syncing: false
    }
  },
  computed: {
    defaultEnginesCount() {
      return this.engines.filter(e => e.id === 'bing').length
    },
    customEnginesCount() {
      return this.engines.filter(e => e.id !== 'bing').length
    },
    filteredEngines() {
      let result = [...this.engines]
      
      // 应用搜索过滤
      if (this.searchQuery.trim()) {
        const query = this.searchQuery.toLowerCase().trim()
        result = result.filter(engine => {
          return engine.name.toLowerCase().includes(query) ||
                 engine.url.toLowerCase().includes(query)
        })
      }
      
      // 应用类型过滤
      if (this.filterType === 'default') {
        result = result.filter(e => e.id === 'bing')
      } else if (this.filterType === 'custom') {
        result = result.filter(e => e.id !== 'bing')
      }
      
      // 应用排序
      if (this.sortBy === 'name') {
        result.sort((a, b) => {
          // Bing 优先，然后按名称排序
          if (a.id === 'bing') return -1
          if (b.id === 'bing') return 1
          return a.name.localeCompare(b.name, 'zh-CN')
        })
      } else if (this.sortBy === 'added') {
        result.sort((a, b) => {
          // Bing 优先，然后按 ID 排序（自定义引擎的 ID 包含时间戳）
          if (a.id === 'bing') return -1
          if (b.id === 'bing') return 1
          // 自定义引擎按添加时间倒序（后添加的在前）
          return b.id.localeCompare(a.id)
        })
      }
      
      return result
    },
    validationErrors() {
      const errors = {
        name: '',
        url: ''
      }
      
      // 检测名称冲突
      if (this.newEngine.name && this.newEngine.name.trim()) {
        const trimmedName = this.newEngine.name.trim().toLowerCase()
        const nameConflict = this.engines.find(e => 
          e.name.toLowerCase() === trimmedName
        )
        if (nameConflict) {
          errors.name = `已存在名称为 "${nameConflict.name}" 的搜索引擎`
        }
      }
      
      // 检测 URL 冲突
      if (this.newEngine.url && this.newEngine.url.trim()) {
        const trimmedUrl = this.newEngine.url.trim().toLowerCase()
        const urlConflict = this.engines.find(e => 
          e.url.trim().toLowerCase() === trimmedUrl
        )
        if (urlConflict) {
          errors.url = `已存在相同 URL 的搜索引擎 "${urlConflict.name}"`
        }
      }
      
      return errors
    }
  },
  methods: {
    async handleAddEngine() {
      // 验证名称
      if (!this.newEngine.name || !this.newEngine.name.trim()) {
        await alert('请输入搜索引擎名称')
        return
      }
      
      // 验证图标
      if (!this.newEngine.icon) {
        await alert('请输入图标（Emoji）或上传 SVG 图片')
        return
      }
      
      // 如果是文本图标，去除首尾空格；如果是图片数据 URL，保持原样
      const iconValue = this.isImageIcon(this.newEngine.icon) 
        ? this.newEngine.icon 
        : this.newEngine.icon.trim()
      
      if (!iconValue) {
        await alert('请输入图标（Emoji）或上传 SVG 图片')
        return
      }
      
      // 验证 URL
      if (!this.newEngine.url || !this.newEngine.url.trim()) {
        await alert('请输入搜索 URL')
        return
      }
      
      if (!this.newEngine.url.includes('{query}')) {
        await alert('URL 中必须包含 {query} 作为搜索关键词占位符')
        return
      }
      
      const engineData = {
        name: this.newEngine.name.trim(),
        icon: iconValue,
        url: this.newEngine.url.trim()
      }
      
      // 检测是否与现有搜索引擎冲突
      const trimmedName = engineData.name.toLowerCase()
      const trimmedUrl = engineData.url.trim().toLowerCase()
      
      // 检查是否有相同名称的搜索引擎（不区分大小写）
      const nameConflict = this.engines.find(e => 
        e.name.toLowerCase() === trimmedName
      )
      if (nameConflict) {
        await alert(`已存在名称为 "${nameConflict.name}" 的搜索引擎，请使用不同的名称`)
        return
      }
      
      // 检查是否有相同 URL 的搜索引擎（不区分大小写，忽略首尾空格）
      const urlConflict = this.engines.find(e => 
        e.url.trim().toLowerCase() === trimmedUrl
      )
      if (urlConflict) {
        await alert(`已存在相同 URL 的搜索引擎 "${urlConflict.name}"，请使用不同的 URL`)
        return
      }
      
      this.$emit('add-engine', engineData)
      
      // 重置表单
      this.newEngine = {
        name: '',
        icon: '',
        url: ''
      }
      
      // 重置文件上传输入框
      const fileInput = document.getElementById('engine-icon-upload')
      if (fileInput) {
        fileInput.value = ''
      }
    },
    async handleRemoveEngine(engineId) {
      // Bing 不可删除，这里不应该被调用，但保留检查
      if (engineId === 'bing') {
        await alert('Bing 是默认搜索引擎，不能删除')
        return
      }
      
      const engine = this.engines.find(e => e.id === engineId)
      const message = `确定要删除搜索引擎 "${engine?.name || ''}" 吗？`
      
      const result = await confirm(message)
      if (result) {
        this.$emit('remove-engine', engineId)
        // 如果正在编辑被删除的引擎，取消编辑
        if (this.editingEngineId === engineId) {
          this.cancelEdit()
        }
      }
    },
    startEdit(engine) {
      this.editingEngineId = engine.id
      this.editingEngine = {
        name: engine.name,
        icon: engine.icon,
        url: engine.url
      }
    },
    cancelEdit() {
      this.editingEngineId = null
      this.editingEngine = {
        name: '',
        icon: '',
        url: ''
      }
    },
    handleUpdateEngine(engineId) {
      // URL 验证在 composable 中处理
      this.$emit('update-engine', engineId, {
        name: this.editingEngine.name,
        icon: this.editingEngine.icon,
        url: this.editingEngine.url
      })
      
      this.cancelEdit()
    },
    isImageIcon(icon) {
      // 判断是否为图片：数据 URL（base64 编码的 SVG）或 SVG 文件路径
      return icon && (
        icon.startsWith('data:image/svg+xml') || 
        icon.startsWith('data:image/') ||
        icon.endsWith('.svg') ||
        (icon.startsWith('/') && icon.includes('.svg'))
      )
    },
    async handleIconUpload(event, type) {
      const file = event.target.files?.[0]
      if (!file) return

      // 验证文件类型
      if (!file.type.includes('svg') && !file.name.endsWith('.svg')) {
        await alert('请上传 SVG 格式的图片文件')
        event.target.value = '' // 清空文件选择
        return
      }

      // 验证文件大小（限制为 100KB）
      if (file.size > 100 * 1024) {
        await alert('SVG 文件大小不能超过 100KB')
        event.target.value = ''
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result
        if (result) {
          if (type === 'new') {
            this.newEngine.icon = result
          } else {
            this.editingEngine.icon = result
          }
        }
      }
      reader.onerror = async () => {
        await alert('读取文件失败，请重试')
        event.target.value = ''
      }
      reader.readAsDataURL(file)
      
      // 清空文件选择，允许重复选择同一文件
      event.target.value = ''
    },
    async handleExport() {
      try {
        // 只导出自定义引擎（不包括默认的 Bing）
        const customEngines = this.engines.filter(e => e.id !== 'bing')
        
        if (customEngines.length === 0) {
          await alert('没有可导出的自定义搜索引擎')
          return
        }
        
        // 准备导出数据
        const exportData = {
          version: '1.0',
          timestamp: new Date().toISOString(),
          engines: customEngines,
          count: customEngines.length
        }
        
        // 加密数据
        const encrypted = encryptData(exportData)
        
        // 创建下载链接
        const blob = new Blob([encrypted], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `0x3-search-engines-${new Date().toISOString().split('T')[0]}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        
        await success(`成功导出 ${customEngines.length} 个搜索引擎配置`)
      } catch (error) {
        console.error('导出失败:', error)
        await error('导出失败：' + error.message)
      }
    },
    handleImport(event) {
      const file = event.target.files?.[0]
      if (!file) return
      
      const reader = new FileReader()
      reader.onload = async (e) => {
        try {
          const encrypted = e.target?.result
          if (!encrypted) {
            throw new Error('文件读取失败')
          }
          
          // 解密数据
          const data = decryptData(encrypted)
          
          // 验证数据格式
          if (!data.engines || !Array.isArray(data.engines)) {
            throw new Error('无效的数据格式')
          }
          
          // 验证引擎数据
          const validEngines = data.engines.filter(engine => {
            return engine.id && engine.name && engine.url && engine.url.includes('{query}')
          })
          
          if (validEngines.length === 0) {
            throw new Error('没有有效的搜索引擎数据')
          }
          
          // 确认导入
          const message = `将导入 ${validEngines.length} 个搜索引擎。\n\n注意：\n- 如果存在相同 ID 的引擎，将被覆盖\n- Bing 默认引擎不会被导入\n\n确定要继续吗？`
          
          const result = await confirm(message)
          if (result) {
            // 导入成功后，成功通知会在 App.vue 中显示
            this.$emit('import-engines', validEngines)
          }
        } catch (error) {
          console.error('导入失败:', error)
          await error('导入失败：' + error.message)
        } finally {
          // 清空文件选择
          event.target.value = ''
        }
      }
      
      reader.onerror = async () => {
        await alert('文件读取失败，请重试')
        event.target.value = ''
      }
      
      reader.readAsText(file)
    },
    setupFocusTrap() {
      const container = this.$el
      const focusableElements = container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      const firstFocusable = focusableElements[0]
      const lastFocusable = focusableElements[focusableElements.length - 1]

      this.focusTrapHandler = (e) => {
        if (e.key !== 'Tab') return

        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstFocusable) {
            e.preventDefault()
            lastFocusable.focus()
          }
        } else {
          // Tab
          if (document.activeElement === lastFocusable) {
            e.preventDefault()
            firstFocusable.focus()
          }
        }
      }

      document.addEventListener('keydown', this.focusTrapHandler)
    },
    // 云同步相关方法
    loadCloudSyncConfig() {
      this.cloudSyncConfig = getSyncConfig()
      this.lastSyncTime = getLastSyncTime()
      if (this.cloudSyncConfig) {
        this.syncType = this.cloudSyncConfig.type || 'github'
        this.gistId = this.cloudSyncConfig.gistId || ''
        this.jianguoyunUsername = this.cloudSyncConfig.username || ''
        this.jianguoyunFilePath = this.cloudSyncConfig.filePath || '/0x3/'
      }
    },
    handleSyncTypeChange() {
      // 切换同步方式时清空相关输入
      if (this.syncType === 'github') {
        this.jianguoyunUsername = ''
        this.jianguoyunPassword = ''
      } else {
        this.githubToken = ''
        this.gistId = ''
      }
    },
    canSetupSync() {
      if (this.syncType === 'github') {
        return !!this.githubToken?.trim()
      } else {
        return !!(this.jianguoyunUsername?.trim() && this.jianguoyunPassword?.trim() && this.jianguoyunFilePath?.trim())
      }
    },
    formatLastSyncTime(date) {
      if (!date) return '从未同步'
      const now = new Date()
      const syncTime = new Date(date)
      const diffMs = now - syncTime
      const diffMins = Math.floor(diffMs / 60000)
      const diffHours = Math.floor(diffMs / 3600000)
      const diffDays = Math.floor(diffMs / 86400000)
      
      if (diffMins < 1) return '刚刚'
      if (diffMins < 60) return `${diffMins} 分钟前`
      if (diffHours < 24) return `${diffHours} 小时前`
      if (diffDays < 7) return `${diffDays} 天前`
      return syncTime.toLocaleDateString('zh-CN')
    },
    async handleSetupCloudSync() {
      this.syncing = true
      try {
        if (this.syncType === 'github') {
          if (!this.githubToken || !this.githubToken.trim()) {
            await error('请输入 GitHub Token')
            return
          }

          const result = await validateGitHubToken(this.githubToken.trim())
          
          if (!result.valid) {
            await error(result.error || 'Token 验证失败')
            return
          }

          // 保存配置
          const config = {
            type: 'github',
            token: this.githubToken.trim(),
            username: result.username,
            gistId: this.gistId.trim() || null
          }
          saveSyncConfig(config)
          this.cloudSyncConfig = config
          this.githubToken = '' // 清空输入框
          this.gistId = config.gistId || ''
          
          await success(`已连接到 GitHub 用户：${result.username}`)
        } else {
          // 坚果云 WebDAV
          if (!this.jianguoyunUsername?.trim() || !this.jianguoyunPassword?.trim()) {
            await error('请输入坚果云用户名和应用密码')
            return
          }

          if (!this.jianguoyunFilePath?.trim()) {
            await error('请输入文件目录')
            return
          }

          const result = await validateJianguoyunCredentials(
            this.jianguoyunUsername.trim(),
            this.jianguoyunPassword.trim()
          )
          
          if (!result.valid) {
            await error(result.error || '验证失败')
            return
          }

          // 保存配置
          const config = {
            type: 'jianguoyun',
            username: this.jianguoyunUsername.trim(),
            password: this.jianguoyunPassword.trim(),
            filePath: this.jianguoyunFilePath.trim()
          }
          saveSyncConfig(config)
          this.cloudSyncConfig = config
          this.jianguoyunPassword = '' // 清空密码输入框
          
          await success(`已连接到坚果云账号：${result.username}`)
        }
      } catch (err) {
        console.error('设置云同步失败:', err)
        await error('设置失败：' + err.message)
      } finally {
        this.syncing = false
      }
    },
    async handleCloudUpload() {
      if (!this.cloudSyncConfig) {
        await error('请先配置云同步')
        return
      }

      this.syncing = true
      try {
        // 准备导出数据（只导出自定义引擎）
        const customEngines = this.engines.filter(e => e.id !== 'bing')
        
        if (customEngines.length === 0) {
          await alert('没有可上传的自定义搜索引擎')
          return
        }

        const exportData = {
          version: '1.0',
          timestamp: new Date().toISOString(),
          engines: customEngines,
          count: customEngines.length
        }

        // 加密数据
        const encrypted = encryptData(exportData)

        // 上传到 Gist
        const result = await syncUpload(encrypted)

        if (!result.success) {
          await error(result.message)
          return
        }

        // 更新 Gist ID（如果是首次上传）
        if (result.gistId && !this.cloudSyncConfig.gistId) {
          this.cloudSyncConfig.gistId = result.gistId
          saveSyncConfig(this.cloudSyncConfig)
          this.gistId = result.gistId
        }

        this.lastSyncTime = getLastSyncTime()
        await success(`成功上传 ${customEngines.length} 个搜索引擎到云端`)
      } catch (err) {
        console.error('上传失败:', err)
        await error('上传失败：' + err.message)
      } finally {
        this.syncing = false
      }
    },
    async handleCloudDownload() {
      if (!this.cloudSyncConfig) {
        await error('请先配置云同步')
        return
      }

      if (this.cloudSyncConfig.type === 'github' && !this.cloudSyncConfig.gistId) {
        await error('未配置 Gist ID，请先在设置中填写或上传一次')
        return
      }

      this.syncing = true
      try {
        const result = await syncDownload()

        if (!result.success) {
          await error(result.message)
          return
        }

        // 解密数据
        const data = decryptData(result.data)

        // 验证数据格式
        if (!data.engines || !Array.isArray(data.engines)) {
          throw new Error('无效的数据格式')
        }

        // 验证引擎数据
        const validEngines = data.engines.filter(engine => {
          return engine.id && engine.name && engine.url && engine.url.includes('{query}')
        })

        if (validEngines.length === 0) {
          throw new Error('没有有效的搜索引擎数据')
        }

        // 确认导入
        const message = `将从云端下载 ${validEngines.length} 个搜索引擎。\n\n注意：\n- 如果存在相同 ID 的引擎，将被覆盖\n- Bing 默认引擎不会被覆盖\n\n确定要继续吗？`
        
        const confirmed = await confirm(message)
        if (confirmed) {
          this.$emit('import-engines', validEngines)
          this.lastSyncTime = getLastSyncTime()
          await success(`成功从云端下载 ${validEngines.length} 个搜索引擎`)
        }
      } catch (err) {
        console.error('下载失败:', err)
        await error('下载失败：' + err.message)
      } finally {
        this.syncing = false
      }
    },
    async handleDisconnectCloudSync() {
      const confirmed = await confirm('确定要断开云同步连接吗？\n\n断开后不会删除云端数据，但需要重新配置才能再次同步。')
      if (confirmed) {
        clearSyncConfig()
        this.cloudSyncConfig = null
        this.lastSyncTime = null
        this.syncType = 'github'
        this.githubToken = ''
        this.gistId = ''
        this.jianguoyunUsername = ''
        this.jianguoyunPassword = ''
        this.jianguoyunFilePath = '/0x3/'
        await success('已断开云同步连接')
      }
    }
  },
  mounted() {
    // 加载云同步配置
    this.loadCloudSyncConfig()
    // 保存当前焦点元素
    this.previousActiveElement = document.activeElement
    // 聚焦到第一个输入框或关闭按钮
    const firstInput = this.$el.querySelector('input') || this.$refs.closeButtonRef
    if (firstInput) {
      firstInput.focus()
    }
    // 焦点陷阱：防止焦点移出对话框
    this.setupFocusTrap()
  },
  beforeUnmount() {
    // 恢复之前的焦点
    if (this.previousActiveElement && typeof this.previousActiveElement.focus === 'function') {
      this.previousActiveElement.focus()
    }
    // 移除焦点陷阱
    if (this.focusTrapHandler) {
      document.removeEventListener('keydown', this.focusTrapHandler)
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

.settings-container {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: 48px 32px 64px;
}

.settings-header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 56px;
}

.settings-title {
  font-size: 28px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  line-height: 1.3;
  letter-spacing: -0.3px;
}

.close-btn {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background-color: transparent;
  border: none;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.close-btn:hover {
  background-color: var(--bg-hover);
  color: var(--text-primary);
}

.close-btn:focus-visible {
  outline: 2px solid var(--accent-color);
  outline-offset: 2px;
  border-color: var(--accent-color);
}

.close-btn:active {
  transform: scale(0.95);
}

.settings-content {
  display: flex;
  flex-direction: column;
  gap: 48px;
}

.settings-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.section-header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.import-export-buttons {
  display: flex;
  gap: 8px;
  align-items: center;
}

.export-btn,
.import-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  border: 1px solid var(--border-color);
  background-color: var(--bg-card);
  color: var(--text-primary);
}

.export-btn:hover,
.import-btn:hover {
  background-color: var(--bg-hover);
  border-color: var(--border-hover);
}

.export-btn:focus-visible,
.import-btn:focus-visible {
  outline: 2px solid var(--accent-color);
  outline-offset: 2px;
  border-color: var(--accent-color);
}

.export-btn:active,
.import-btn:active {
  transform: translateY(0);
}

.import-btn {
  position: relative;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  line-height: 1.5;
  letter-spacing: -0.2px;
}

.engines-count {
  font-size: 14px;
  color: var(--text-secondary);
  font-weight: 500;
}

/* 云同步样式 */
.cloud-sync-card {
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.sync-description {
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
}

.sync-type-selector {
  display: flex;
  flex-direction: row;
  gap: 16px;
  margin-top: 12px;
}

.sync-type-option {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  padding: 16px 20px;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  background-color: var(--bg-primary);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  flex: 1;
  min-width: 0;
  position: relative;
}

.sync-type-option:hover {
  border-color: var(--border-hover);
  background-color: var(--bg-hover);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.sync-type-option input[type="radio"] {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  margin: 0;
  cursor: pointer;
}

.sync-type-option input[type="radio"]:checked + span {
  color: var(--text-primary);
  font-weight: 500;
}

.sync-type-option:has(input[type="radio"]:checked) {
  border-color: var(--accent-color);
  background-color: var(--bg-card);
  box-shadow: 0 0 0 3px var(--focus-ring), 0 2px 8px rgba(0, 0, 0, 0.08);
}

.sync-config-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 8px;
}

.token-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-size: 14px;
  font-family: 'Courier New', monospace;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  line-height: 1.5;
}

.token-input:hover {
  border-color: var(--border-hover);
}

.token-input:focus {
  border-color: var(--accent-color);
  box-shadow: 0 0 0 3px var(--focus-ring);
  outline: none;
}

.token-input:focus {
  border-color: var(--accent-color);
  box-shadow: 0 0 0 4px var(--focus-ring);
  outline: none;
}

.token-input code {
  background-color: var(--bg-hover);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
}

.sync-setup-btn {
  padding: 12px 28px;
  border-radius: 8px;
  background-color: var(--accent-color);
  color: white;
  border: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  align-self: flex-start;
  margin-top: 4px;
}

.sync-setup-btn:hover:not(:disabled) {
  background-color: var(--accent-hover);
}

.sync-setup-btn:focus-visible {
  outline: 2px solid var(--accent-color);
  outline-offset: 2px;
}

.sync-setup-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.sync-status {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 16px;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  padding: 8px 0;
}

.status-label {
  color: var(--text-secondary);
  font-weight: 500;
}

.status-value {
  color: var(--text-primary);
  font-weight: 600;
}

.sync-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.sync-upload-btn,
.sync-download-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 10px;
  background-color: var(--accent-color);
  color: white;
  border: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.sync-upload-btn:hover:not(:disabled),
.sync-download-btn:hover:not(:disabled) {
  background-color: var(--accent-hover);
  transform: translateY(-1px);
}

.sync-upload-btn:focus-visible,
.sync-download-btn:focus-visible {
  outline: 2px solid var(--accent-color);
  outline-offset: 2px;
}

.sync-upload-btn:disabled,
.sync-download-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.sync-download-btn {
  background-color: var(--bg-hover);
  color: var(--text-primary);
  border: 2px solid var(--border-color);
}

.sync-download-btn:hover:not(:disabled) {
  background-color: var(--bg-card);
  border-color: var(--border-hover);
}

.sync-disconnect-btn {
  padding: 10px 16px;
  border-radius: 10px;
  background-color: transparent;
  color: var(--text-secondary);
  border: 2px solid var(--border-color);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.sync-disconnect-btn:hover:not(:disabled) {
  background-color: var(--bg-hover);
  border-color: var(--border-hover);
  color: var(--text-primary);
}

.sync-disconnect-btn:focus-visible {
  outline: 2px solid var(--accent-color);
  outline-offset: 2px;
}

.sync-disconnect-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.engines-filter-bar {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 4px;
}

.search-filter {
  position: relative;
  flex: 1;
}

.filter-input {
  width: 100%;
  padding: 12px 40px 12px 16px;
  border: 2px solid var(--border-color);
  border-radius: 12px;
  background-color: var(--bg-card);
  color: var(--text-primary);
  font-size: 15px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  line-height: 1.5;
}

.filter-input:focus {
  border-color: var(--accent-color);
  box-shadow: 0 0 0 4px var(--focus-ring);
  outline: none;
}

.filter-input::placeholder {
  color: var(--text-secondary);
  opacity: 0.6;
}

.clear-search {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: var(--text-secondary);
  transition: color 0.2s ease;
}

.clear-search:hover {
  color: var(--text-primary);
}

.filter-tabs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-tab {
  padding: 8px 16px;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--bg-card);
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.filter-tab:hover {
  border-color: var(--border-hover);
  background-color: var(--bg-hover);
}

.filter-tab.active {
  border-color: var(--accent-color);
  background-color: var(--accent-color);
  color: white;
}

.filter-tab:focus-visible {
  outline: 2px solid var(--accent-color);
  outline-offset: 2px;
}

.sort-controls {
  display: flex;
  align-items: center;
}

.sort-select {
  padding: 8px 12px;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--bg-card);
  color: var(--text-primary);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: inherit;
}

.sort-select:focus {
  border-color: var(--accent-color);
  box-shadow: 0 0 0 3px var(--focus-ring);
  outline: none;
}

.add-engine-card {
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 32px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.add-engine-card:focus-within {
  border-color: var(--accent-color);
  box-shadow: 0 0 0 3px var(--focus-ring);
}

.add-engine-card:focus-within {
  border-color: var(--accent-color);
  box-shadow: var(--shadow);
}

.add-engine-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form-group label {
  font-weight: 500;
  color: var(--text-primary);
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 6px;
  display: block;
}

.form-group input {
  padding: 12px 16px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-size: 14px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  line-height: 1.5;
  width: 100%;
}

.form-group input:hover {
  border-color: var(--border-hover);
}

.form-group input:focus {
  border-color: var(--accent-color);
  box-shadow: 0 0 0 3px var(--focus-ring);
  outline: none;
}

.form-group input:focus {
  border-color: var(--accent-color);
  box-shadow: 0 0 0 4px var(--focus-ring);
  outline: none;
}

.form-group input::placeholder {
  color: var(--text-secondary);
  opacity: 0.6;
}

.form-hint {
  color: var(--text-secondary);
  font-size: 13px;
  line-height: 1.5;
  margin-top: 4px;
}

.form-hint a {
  color: var(--accent-color);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border-bottom: 1px solid transparent;
  padding-bottom: 1px;
}

.form-hint a:hover {
  color: var(--accent-hover);
  border-bottom-color: var(--accent-hover);
}

.form-hint a:focus-visible {
  outline: 2px solid var(--accent-color);
  outline-offset: 2px;
  border-radius: 3px;
  border-bottom-color: transparent;
}

.form-error {
  color: #f03e3e;
  font-size: 13px;
  line-height: 1.4;
  margin-top: 4px;
  font-weight: 500;
}

.input-error {
  border-color: #f03e3e !important;
  background-color: rgba(240, 62, 62, 0.05) !important;
}

.input-error:focus {
  border-color: #f03e3e !important;
  box-shadow: 0 0 0 4px rgba(240, 62, 62, 0.15) !important;
}

.add-btn {
  padding: 12px 28px;
  background-color: var(--accent-color);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  align-self: flex-start;
  cursor: pointer;
  margin-top: 4px;
}

.add-btn:hover {
  background-color: var(--accent-hover);
}


.add-btn:focus-visible {
  outline: 2px solid var(--accent-color);
  outline-offset: 2px;
  background-color: var(--accent-hover);
}

.add-btn:active {
  transform: translateY(0);
}

.empty-state {
  text-align: center;
  padding: 48px 24px;
  color: var(--text-secondary);
  font-size: 15px;
}

.engines-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.engine-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  gap: 18px;
}

.engine-card:hover {
  border-color: var(--border-hover);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.engine-card.editing {
  flex-direction: column;
  align-items: stretch;
  width: 100%;
  box-sizing: border-box;
}

.engine-info {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
  min-width: 0;
}

.engine-icon {
  font-size: 36px;
  line-height: 1;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
}

.engine-icon-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.icon-input-group {
  display: flex;
  gap: 8px;
  align-items: center;
}

.icon-upload-btn {
  padding: 10px 14px;
  background-color: var(--bg-hover);
  border: 2px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.icon-upload-btn:hover {
  background-color: var(--bg-card);
  border-color: var(--accent-color);
  color: var(--accent-color);
}

.icon-upload-btn:focus-visible {
  outline: 2px solid var(--accent-color);
  outline-offset: 2px;
}

.edit-icon-input-wrapper {
  position: relative;
  flex: 0 0 100px;
  display: flex;
  align-items: center;
}

.icon-upload-btn-small {
  position: absolute;
  right: 8px;
  padding: 4px;
  background-color: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}

.icon-upload-btn-small:hover {
  background-color: var(--bg-hover);
  color: var(--accent-color);
}

.icon-upload-btn-small:focus-visible {
  outline: 2px solid var(--accent-color);
  outline-offset: 2px;
}

.engine-details {
  flex: 1;
  min-width: 0;
}

.engine-title {
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 6px;
  font-size: 16px;
  line-height: 1.4;
}

.engine-url {
  font-size: 13px;
  color: var(--text-secondary);
  word-break: break-word;
  overflow-wrap: break-word;
  line-height: 1.5;
  white-space: normal;
}

.remove-btn {
  width: 40px;
  height: 40px;
  padding: 0;
  background-color: transparent;
  border: 2px solid var(--border-color);
  border-radius: 10px;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  flex-shrink: 0;
}

.remove-btn:hover {
  background-color: #fee2e2;
  border-color: #ef4444;
  color: #ef4444;
  transform: scale(1.05);
}

[data-theme="dark"] .remove-btn:hover {
  background-color: rgba(239, 68, 68, 0.2);
}

.remove-btn:focus-visible {
  outline: 2px solid #ef4444;
  outline-offset: 2px;
}

.remove-btn:active {
  transform: scale(0.95);
}

.remove-btn-default {
  opacity: 0.8;
}

.remove-btn-default:hover {
  opacity: 1;
}

.default-badge {
  padding: 8px 16px;
  background-color: var(--bg-hover);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 13px;
  color: var(--text-secondary);
  font-weight: 500;
  flex-shrink: 0;
  margin-left: 8px;
}



.engine-actions {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: right;
  flex-shrink: 0;
  width: 100%;
}

.engine-actions-right {
  display: flex;
  gap: 8px;
  align-items: center;
}

.edit-btn {
  width: 40px;
  height: 40px;
  padding: 0;
  background-color: transparent;
  border: 2px solid var(--border-color);
  border-radius: 10px;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.edit-btn:hover {
  background-color: var(--accent-light);
  border-color: var(--accent-color);
  color: var(--accent-color);
  transform: scale(1.05);
}

.edit-btn:focus-visible {
  outline: 2px solid var(--accent-color);
  outline-offset: 2px;
}

.edit-btn:active {
  transform: scale(0.95);
}

.edit-engine-form {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  background-color: var(--bg-hover);
  border-radius: 12px;
  border: 2px solid var(--accent-color);
  width: 100%;
  box-sizing: border-box;
  min-width: 0;
}

.form-group-inline {
  display: flex;
  gap: 8px;
  width: 100%;
  min-width: 0;
}

.edit-input {
  flex: 1;
  padding: 10px 14px;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--bg-card);
  color: var(--text-primary);
  font-size: 14px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  line-height: 1.5;
  min-width: 0;
  box-sizing: border-box;
}

.edit-input-icon {
  flex: 0 0 100px;
  min-width: 100px;
  max-width: 100px;
  text-align: center;
  font-size: 18px;
}

.edit-input:focus {
  border-color: var(--accent-color);
  box-shadow: 0 0 0 3px var(--focus-ring);
  outline: none;
}


.edit-actions {
  display: flex;
  justify-content: right;
  gap: 8px;
  margin-top: 4px;
}

.save-btn,
.cancel-btn {
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.save-btn {
  background-color: var(--accent-color);
  color: white;
  border: none;
}

.save-btn:hover {
  background-color: var(--accent-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow);
}

.save-btn:focus-visible {
  outline: 2px solid var(--accent-color);
  outline-offset: 2px;
}

.cancel-btn {
  background-color: transparent;
  color: var(--text-secondary);
  border: 2px solid var(--border-color);
}

.cancel-btn:hover {
  background-color: var(--bg-hover);
  border-color: var(--border-hover);
}

.cancel-btn:focus-visible {
  outline: 2px solid var(--text-secondary);
  outline-offset: 2px;
}

@media (max-width: 768px) {
  .settings-container {
    padding: 0;
  }
  
  .settings-header-bar {
    margin-bottom: 32px;
  }
  
  .settings-title {
    font-size: 26px;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .engines-filter-bar {
    width: 100%;
  }
  
  .filter-tabs {
    width: 100%;
  }
  
  .filter-tab {
    flex: 1;
    text-align: center;
  }
  
  .engines-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .engine-card {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
  
  .engine-actions {
    width: 100%;
    justify-content: flex-end;
  }
  
  .edit-btn,
  .remove-btn {
    width: 44px;
    height: 44px;
  }
  
  .form-group-inline {
    display: flex;
    gap: 10px;
  }
  
  .edit-input {
    width: 100% !important;
  }
  
  .edit-actions {
    flex-direction: column;
  }
  
  .save-btn,
  .cancel-btn {
    width: 100%;
    height: 44px;
  }
  
  .add-engine-card {
    padding: 20px;
  }

  .cloud-sync-card {
    padding: 20px;
  }
  
  .settings-content {
    gap: 32px;
  }

  .settings-container {
    padding: 24px 16px 40px;
  }

  .settings-header-bar {
    margin-bottom: 32px;
  }

  .settings-title {
    font-size: 24px;
  }

  .section-title {
    font-size: 17px;
  }

  .settings-content {
    gap: 32px;
  }

  .settings-section {
    gap: 16px;
  }

  .section-title {
    font-size: 18px;
  }

  .add-engine-card {
    padding: 20px;
  }

  .add-engine-form {
    gap: 18px;
  }

  .cloud-sync-card {
    padding: 20px;
    gap: 16px;
  }

  .sync-type-selector {
    flex-direction: column;
    gap: 12px;
  }

  .sync-type-option {
    padding: 14px 18px;
  }

  .sync-config-section {
    gap: 16px;
  }

  .sync-status {
    grid-template-columns: 1fr;
    gap: 10px;
    padding-bottom: 12px;
    margin-bottom: 12px;
  }

  .status-item {
    padding: 6px 0;
  }

  .sync-actions {
    flex-direction: column;
  }

  .sync-upload-btn,
  .sync-download-btn,
  .sync-disconnect-btn {
    width: 100%;
    justify-content: center;
  }

  .engines-grid {
    grid-template-columns: 1fr;
    gap: 14px;
  }

  .engine-card {
    padding: 18px;
    gap: 14px;
  }

  .engines-filter-bar {
    gap: 12px;
  }
}
</style>
