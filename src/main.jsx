/**
 * Application entry point. Mounts <App /> and pulls in the global stylesheet.
 *
 * tokens.css must be imported here rather than in App.css so the design tokens
 * are defined before any component stylesheet references them.
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/tokens.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
