import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import 'dotenv';

sessionStorage.setItem("apiURL", "https://wheres-sharma-backend.fly.dev/api");

ReactDOM.createRoot(document.getElementById('root')!).render(

  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
