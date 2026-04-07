import React from 'react'
import ReactDOM from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import App from './App.jsx'
import './index.css'
import * as serviceWorkerRegistration from './serviceWorkerRegistration'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// Register the service worker for PWA behavior
serviceWorkerRegistration.register()

// Capture beforeinstallprompt early and store globally so LandingPage can use it after loader
if (typeof window !== 'undefined' && !window.__deferredPrompt) {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    window.__deferredPrompt = e
  })
}