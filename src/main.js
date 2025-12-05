import { createApp } from 'vue'
import App from './App.vue'
import './style.css'

const app = createApp(App)
app.mount('#app')

// PWA: 处理安装提示和更新通知
let deferredPrompt = null

window.addEventListener('beforeinstallprompt', (e) => {
  // 阻止默认的安装提示
  e.preventDefault()
  deferredPrompt = e
  // 可以在这里显示自定义安装按钮
  console.log('PWA 可以安装')
})

// 监听应用安装
window.addEventListener('appinstalled', () => {
  console.log('PWA 已安装')
  deferredPrompt = null
})

// 导出安装函数供组件使用
window.installPWA = async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    console.log(`用户选择: ${outcome}`)
    deferredPrompt = null
  }
}

