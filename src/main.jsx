import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast';
import { I18nextProvider } from 'react-i18next'
import i18n from './i18n'
import { CategoryProvider } from './contexts/CategoryContext.jsx'
import { ProductProvider } from './contexts/ProductContext.jsx'
import { LoginProvider } from './contexts/LoginContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LoginProvider>
      <Toaster />
      <ProductProvider>
        <CategoryProvider>
          <I18nextProvider i18n={i18n}>
            <BrowserRouter>
              <App className="bg-background h-screen" />
            </BrowserRouter>
          </I18nextProvider>
        </CategoryProvider>
      </ProductProvider>
    </LoginProvider>
  </StrictMode>,
)