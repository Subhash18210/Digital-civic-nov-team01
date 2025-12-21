import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom' // Import this!

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> {/* Wrapper #1: The Router */}
      <App />       {/* App contains AuthProvider */}
    </BrowserRouter>
  </React.StrictMode>,
)