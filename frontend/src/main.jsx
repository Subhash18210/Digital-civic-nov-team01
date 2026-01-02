import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css' // Make sure you have this, or remove if not using custom css
import { BrowserRouter } from 'react-router-dom' // <--- THIS IS KEY

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>  {/* <--- WRAP APP IN THIS */}
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)