import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import 'dotenv';

sessionStorage.setItem("apiURL", "http://localhost:3000/api");

ReactDOM.createRoot(document.getElementById('root')!).render(

  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
