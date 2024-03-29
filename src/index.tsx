import React from "react"
import ReactDOM from "react-dom/client"

// Ensure index styles are loaded before App
// so any styles that follow are correctly cascaded
import "./index.css"

// Ensure translations are loaded for bundling
import "translations/i18n"

import App from "./App"
import reportWebVitals from "./reportWebVitals"

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
)

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
