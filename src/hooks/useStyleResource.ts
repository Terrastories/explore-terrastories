import React from "react"
import type { StyleSpecification } from "maplibre-gl"

import type { NormalizedMapConfig, ResolvedMapStyle } from "utils/mapConfig"
import { getFallbackStyle, prepareMapboxStyle } from "utils/mapbox"

const stylePromiseCache = new Map<string, Promise<StyleSpecification>>()

const getCacheKey = (resolved: ResolvedMapStyle) => {
  const styleKey = typeof resolved.style === "string"
    ? resolved.style
    : JSON.stringify(resolved.style)

  return [
    resolved.isMapboxStyle ? "mb" : "other",
    resolved.usesExternalStyle ? "ext" : "int",
    resolved.accessToken ?? "",
    styleKey ?? ""
  ].join("|")
}

export type StyleResource = {
  style: string | StyleSpecification | null,
  usesExternalStyle: boolean,
  isReady: boolean,
}

export const useStyleResource = (resolvedStyle: ResolvedMapStyle, normalizedConfig: NormalizedMapConfig): StyleResource => {
  const fallbackStyle = React.useCallback(
    () => getFallbackStyle(normalizedConfig.pmBasemapStyle, normalizedConfig.mapbox3dEnabled),
    [normalizedConfig.pmBasemapStyle, normalizedConfig.mapbox3dEnabled]
  )

  const [resource, setResource] = React.useState<Omit<StyleResource, "isReady">>(() => ({
    style: resolvedStyle.isMapboxStyle ? null : resolvedStyle.style,
    usesExternalStyle: resolvedStyle.usesExternalStyle,
  }))

  React.useEffect(() => {
    let cancelled = false

    if (!resolvedStyle.isMapboxStyle) {
      setResource({
        style: resolvedStyle.style,
        usesExternalStyle: resolvedStyle.usesExternalStyle,
      })
      return
    }

    if (!resolvedStyle.accessToken || typeof resolvedStyle.style !== "string") {
      console.warn("Missing Mapbox credentials. Falling back to Protomaps style.")
      setResource({ style: fallbackStyle(), usesExternalStyle: false })
      return
    }

    setResource({ style: null, usesExternalStyle: resolvedStyle.usesExternalStyle })

    const cacheKey = getCacheKey(resolvedStyle)

    if (!stylePromiseCache.has(cacheKey)) {
      stylePromiseCache.set(
        cacheKey,
        prepareMapboxStyle(resolvedStyle.style, resolvedStyle.accessToken)
      )
    }

    stylePromiseCache.get(cacheKey)!
      .then((styleSpec) => {
        if (cancelled) return
        setResource({ style: styleSpec, usesExternalStyle: true })
      })
      .catch((error) => {
        stylePromiseCache.delete(cacheKey)
        if (cancelled) return
        console.error(
          "Failed to load Mapbox style after retries. Falling back to Protomaps.",
          {
            styleUrl: resolvedStyle.style,
            errorName: error?.name,
            errorMessage: error?.message,
          }
        )
        setResource({ style: fallbackStyle(), usesExternalStyle: false })
      })

    return () => {
      cancelled = true
    }
  }, [resolvedStyle, fallbackStyle])

  return React.useMemo(() => ({
    ...resource,
    isReady: resource.style != null,
  }), [resource])
}
