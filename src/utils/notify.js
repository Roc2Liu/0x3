/**
 * 全局通知服务
 * 替代浏览器默认的 alert 和 confirm
 */

import { createApp, h } from 'vue'
import Notification from '../components/Notification.vue'

// 通知队列
let notificationQueue = []
let notificationContainer = null

/**
 * 创建通知容器
 */
function createNotificationContainer() {
  if (!notificationContainer) {
    notificationContainer = document.createElement('div')
    notificationContainer.id = 'notification-container'
    document.body.appendChild(notificationContainer)
  }
}

/**
 * 显示通知
 */
function showNotification(options) {
  createNotificationContainer()

  return new Promise((resolve) => {
    const notificationId = Math.random().toString(36).substr(2, 9)

    const handleClose = () => {
      removeNotification(notificationId)
      resolve(options.result || false)
    }

    const handleConfirm = () => {
      removeNotification(notificationId)
      resolve(true)
    }

    const handleCancel = () => {
      removeNotification(notificationId)
      resolve(false)
    }

    const notificationInstance = createApp({
      render: () => h(Notification, {
        ...options,
        modelValue: true,
        'onUpdate:modelValue': (value) => {
          if (!value) handleClose()
        },
        onConfirm: handleConfirm,
        onCancel: handleCancel,
        onClose: handleClose
      })
    })

    const mountPoint = document.createElement('div')
    notificationContainer.appendChild(mountPoint)
    notificationInstance.mount(mountPoint)

    notificationQueue.push({
      id: notificationId,
      instance: notificationInstance,
      mountPoint
    })
  })
}

/**
 * 移除通知
 */
function removeNotification(id) {
  const index = notificationQueue.findIndex(n => n.id === id)
  if (index !== -1) {
    const notification = notificationQueue[index]
    notification.instance.unmount()
    if (notification.mountPoint && notification.mountPoint.parentNode) {
      notification.mountPoint.parentNode.removeChild(notification.mountPoint)
    }
    notificationQueue.splice(index, 1)
  }
}

/**
 * Alert - 提示对话框
 */
export function alert(message, title = '提示') {
  return showNotification({
    title,
    message,
    type: 'info',
    showClose: true,
    actions: [
      {
        label: '确定',
        class: 'primary',
        handler: () => { }
      }
    ]
  })
}

/**
 * Confirm - 确认对话框
 */
export function confirm(message, title = '提示') {
  return showNotification({
    title,
    message,
    type: 'confirm',
    showClose: false,
    actions: [
      {
        label: '取消',
        class: '',
        handler: () => { },
        cancel: true,
        result: false
      },
      {
        label: '确定',
        class: 'primary',
        handler: () => { },
        confirm: true,
        result: true
      }
    ]
  })
}

/**
 * Success - 成功提示
 */
export function success(message, title = '成功', duration = 3000) {
  return showNotification({
    title,
    message,
    type: 'success',
    showClose: true,
    autoClose: true,
    duration,
    actions: [
      {
        label: '确定',
        class: 'primary',
        handler: () => { }
      }
    ]
  })
}

/**
 * Error - 错误提示
 */
export function error(message, title = '错误') {
  return showNotification({
    title,
    message,
    type: 'error',
    showClose: true,
    actions: [
      {
        label: '确定',
        class: 'danger',
        handler: () => { }
      }
    ]
  })
}

/**
 * Warning - 警告提示
 */
export function warning(message, title = '警告') {
  return showNotification({
    title,
    message,
    type: 'warning',
    showClose: true,
    actions: [
      {
        label: '确定',
        class: 'primary',
        handler: () => { }
      }
    ]
  })
}

