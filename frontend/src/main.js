import { createApp } from 'vue'
import { Capacitor } from '@capacitor/core'
import './style.css'
import App from './App.vue'
import i18n from './i18n'
import router from './router'

// The app is meant to run inside the iOS shell; in a normal browser the deployed
// site sends people to the landing page. `?web=1` keeps browser access for testing.
function shouldUseLandingPage() {
  if (!import.meta.env.PROD || Capacitor.isNativePlatform()) return false
  try {
    if (new URLSearchParams(location.search).has('web')) localStorage.setItem('chatmate_allow_web', '1')
    return localStorage.getItem('chatmate_allow_web') !== '1'
  } catch {
    return true
  }
}

const app = createApp(App)
app.use(i18n)
app.use(router)

app.config.errorHandler = (err, vm, info) => {
  console.error('Global error:', err, info)
}

if (shouldUseLandingPage()) {
  location.replace(new URL('..', location.href.split('#')[0]).href)
} else {
  app.mount('#app')
}
