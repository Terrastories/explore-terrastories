import type { Map } from "maplibre-gl"
import homeIcon from "./home-icon.svg"

export default class HomeButton {
  _map: Map | undefined
  _container: HTMLElement
  _resetToCenter:  () => void

  constructor({reset}: {reset: () => void}) {
    this._map = undefined
    this._container = document.createElement("div")
    this._resetToCenter = reset.bind(this)
  }

  onAdd(map: Map) {
    this._map = map
    this._container.classList.add("maplibregl-ctrl")
    this._container.classList.add("maplibregl-ctrl-group")
    const button = document.createElement("button")
    button.setAttribute("aria-label", "Map Home")
    button.setAttribute("type", "button")
    const icon = document.createElement("span")
    icon.classList.add("maplibregl-ctrl-icon")
    icon.setAttribute("style", `background-image: url('${homeIcon}'); background-size: contain;`)
    button.append(icon)
    this._container.append(button)

    button.removeEventListener("click", () => this._resetToCenter())
    button.addEventListener("click", () => this._resetToCenter())

    return this._container
  }

  onRemove() {
    if (this._container.parentNode !== null) {
      this._container.parentNode.removeChild(this._container)
      this._map = undefined
    }
  }
}
