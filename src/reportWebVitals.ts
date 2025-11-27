import type { Metric } from "web-vitals"

type ReportHandler = (metric: Metric) => void

const reportWebVitals = (onPerfEntry?: ReportHandler) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    // web-vitals v5 uses on* functions instead of get*
    import("web-vitals").then(({ onCLS, onFCP, onINP, onLCP, onTTFB }) => {
      onCLS(onPerfEntry)
      onFCP(onPerfEntry)
      onINP(onPerfEntry) // INP (Interaction to Next Paint) replaces FID in v5
      onLCP(onPerfEntry)
      onTTFB(onPerfEntry)
    })
  }
}

export default reportWebVitals
