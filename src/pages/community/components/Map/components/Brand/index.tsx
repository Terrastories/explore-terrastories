import React from "react"
import type { Map } from "maplibre-gl"
import { renderToStaticMarkup } from "react-dom/server"
import Logo from "./logocombo.svg?react"

export default class Brand {
  _map: Map | undefined
  _container: HTMLElement

  opts: {
    containerClass?: string
  }

  constructor(_opts?: object) {
    this.opts = {}
    Object.assign(this.opts, _opts)

    this._map = undefined
    this._container = document.createElement("div")
  }

  onAdd(map: Map) {
    this._map = map
    // so it's properly styled on the map
    this._container.classList.add("maplibregl-ctrl")
    // provides the background and outline
    this._container.classList.add("maplibregl-ctrl-group")
    if (this.opts.containerClass) this._container.classList.add(this.opts.containerClass)

    const svg = renderToStaticMarkup(<Logo />)

    this._container.innerHTML = svg

    return this._container
  }

  onRemove() {
    if (this._container.parentNode !== null) {
      this._container.parentNode.removeChild(this._container)
      this._map = undefined
    }
  }
}
