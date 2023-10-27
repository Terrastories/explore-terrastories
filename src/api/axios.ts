import axios from "axios"

axios.defaults.baseURL = import.meta.env.VITE_API_BASE
axios.defaults.headers["Content-Type"] = "application/json"
axios.defaults.headers["Axios"] = "application/json"

// Extend axios to allow embedded URL keys
// @embeddedParams = {key: value}
// where :key in /your/path/:key?params= is replaced with value
// TypeScript declaration in types/axios.d.ts
axios.interceptors.request.use(
  config => {
    if (!config.url) return config

    let currentUrl = config.url

    for (const k in config.embeddedParams) {
      currentUrl = currentUrl.replace(`:${k}`, config.embeddedParams[k])
    }

    return {
      ...config,
      url: currentUrl
    }
  }
)

axios.interceptors.response.use(
  response => {
    return response
  },
  error => {
    return Promise.reject(error)
  }
)

export default axios
