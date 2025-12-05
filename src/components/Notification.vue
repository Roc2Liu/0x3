<template>
  <Teleport to="body">
    <Transition name="notification">
      <div 
        v-if="visible" 
        class="notification-overlay" 
        @click.self="handleClose"
        @keydown.escape="handleClose"
      >
        <div 
          class="notification-dialog" 
          role="alertdialog" 
          :aria-labelledby="titleId"
          :aria-describedby="messageId"
          :aria-live="type === 'error' || type === 'warning' ? 'assertive' : 'polite'"
        >
          <div class="notification-header">
            <h3 :id="titleId" class="notification-title">{{ title }}</h3>
            <button 
              v-if="showClose"
              class="notification-close" 
              @click="handleClose"
              aria-label="关闭对话框"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
              <span class="visually-hidden">关闭</span>
            </button>
          </div>
          <div class="notification-content">
            <p v-if="message" :id="messageId" class="notification-message">{{ message }}</p>
            <div v-if="$slots.default" class="notification-slot">
              <slot></slot>
            </div>
          </div>
          <div class="notification-actions" role="group" aria-label="操作按钮">
            <button 
              v-for="(action, index) in actions" 
              :key="index"
              :class="['notification-btn', action.class || '']"
              :ref="el => { if (el && index === 0) firstButtonRef = el }"
              @click="handleAction(action)"
            >
              {{ action.label }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script>
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'

export default {
  name: 'Notification',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '提示'
    },
    message: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'info', // 'info', 'success', 'warning', 'error', 'confirm'
      validator: (value) => ['info', 'success', 'warning', 'error', 'confirm'].includes(value)
    },
    showClose: {
      type: Boolean,
      default: true
    },
    autoClose: {
      type: Boolean,
      default: false
    },
    duration: {
      type: Number,
      default: 3000
    },
    actions: {
      type: Array,
      default: () => []
    }
  },
  emits: ['update:modelValue', 'close', 'confirm', 'cancel'],
  setup(props, { emit }) {
    const visible = ref(props.modelValue)
    const titleId = computed(() => `notification-title-${Math.random().toString(36).substr(2, 9)}`)
    const messageId = computed(() => `notification-message-${Math.random().toString(36).substr(2, 9)}`)
    let autoCloseTimer = null
    let previousActiveElement = null
    let firstButtonRef = ref(null)

    const handleClose = () => {
      visible.value = false
      emit('update:modelValue', false)
      emit('close')
      // 恢复之前的焦点
      if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
        previousActiveElement.focus()
        previousActiveElement = null
      }
    }

    const handleAction = (action) => {
      if (action.handler) {
        action.handler()
      }
      if (action.confirm) {
        emit('confirm')
      }
      if (action.cancel) {
        emit('cancel')
      }
      if (action.close !== false) {
        handleClose()
      }
    }

    watch(() => props.modelValue, (newVal) => {
      visible.value = newVal
      if (newVal) {
        // 保存当前焦点元素
        previousActiveElement = document.activeElement
        // 聚焦到第一个按钮或关闭按钮
        nextTick(() => {
          const firstButton = document.querySelector('.notification-btn') || document.querySelector('.notification-close')
          if (firstButton) {
            firstButton.focus()
          }
        })
        // 自动关闭
        if (props.autoClose && props.duration > 0) {
          if (autoCloseTimer) clearTimeout(autoCloseTimer)
          autoCloseTimer = setTimeout(() => {
            handleClose()
          }, props.duration)
        }
      }
    }, { immediate: true })

    onBeforeUnmount(() => {
      if (autoCloseTimer) {
        clearTimeout(autoCloseTimer)
      }
    })

    return {
      visible,
      titleId,
      messageId,
      firstButtonRef,
      handleClose,
      handleAction
    }
  }
}
</script>

<style scoped>
.notification-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
  backdrop-filter: blur(4px);
}

.notification-dialog {
  background-color: var(--bg-card);
  border-radius: 16px;
  box-shadow: var(--shadow-lg);
  max-width: 480px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  border: 2px solid var(--border-color);
  animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border-color);
}

.notification-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.notification-close {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background-color: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.notification-close:hover {
  background-color: var(--bg-hover);
  color: var(--text-primary);
}

.notification-content {
  padding: 24px;
}

.notification-message {
  color: var(--text-primary);
  font-size: 15px;
  line-height: 1.6;
  margin: 0;
  white-space: pre-line;
}

.notification-slot {
  color: var(--text-primary);
  font-size: 15px;
  line-height: 1.6;
}

.notification-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 16px 24px;
  border-top: 1px solid var(--border-color);
}

.notification-btn {
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid var(--border-color);
  background-color: var(--bg-card);
  color: var(--text-primary);
  min-width: 80px;
}

.notification-btn:hover {
  background-color: var(--bg-hover);
  border-color: var(--border-hover);
  transform: translateY(-1px);
}

.notification-btn:active {
  transform: translateY(0);
}

.notification-btn.primary {
  background-color: var(--accent-color);
  color: white;
  border-color: var(--accent-color);
}

.notification-btn.primary:hover {
  background-color: var(--accent-hover);
  border-color: var(--accent-hover);
}

.notification-btn.danger {
  background-color: #dc3545;
  color: white;
  border-color: #dc3545;
}

.notification-btn.danger:hover {
  background-color: #c82333;
  border-color: #c82333;
}

.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.notification-enter-from,
.notification-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

@media (max-width: 768px) {
  .notification-dialog {
    max-width: 90%;
    margin: 20px;
  }
  
  .notification-header,
  .notification-content,
  .notification-actions {
    padding: 16px;
  }
  
  .notification-actions {
    flex-direction: column;
  }
  
  .notification-btn {
    width: 100%;
  }
}
</style>

