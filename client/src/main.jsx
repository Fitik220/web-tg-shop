import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './hooks/useAuth.jsx'
import { CartProvider } from './hooks/useCart.jsx'
import { LikesProvider } from './hooks/useLikes.jsx'
import { initTelegram } from './utils/telegram'

initTelegram()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <LikesProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </LikesProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
