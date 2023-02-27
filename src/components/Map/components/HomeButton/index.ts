import type { Map, LngLatLike } from 'mapbox-gl'
import homeIcon from './home-icon.svg'

type Coordinates = {
  centerLat: number,
  centerLong: number,
  center: [number, number],
  zoom: number,
  pitch: number,
  bearing: number,
}

export default class HomeButton {
  _map: Map | undefined
  _container: HTMLElement
  centerLat: number
  centerLong: number
  zoom: number
  pitch: number
  bearing: number
  center: LngLatLike

  constructor({...config}:Coordinates) {
    this._map = undefined;
    this._container = document.createElement('div');
    this.centerLat = config.centerLat
    this.centerLong = config.centerLong
    this.zoom = config.zoom
    this.pitch = config.pitch
    this.bearing = config.bearing
    this.center = config.center
  }

  onAdd(map: Map) {
    this._map = map
    this._container.classList.add('mapboxgl-ctrl')
    this._container.classList.add('mapboxgl-ctrl-group')
    const button = document.createElement('button');
    button.setAttribute('aria-label', 'Map Home')
    button.setAttribute('type', 'button')
    const icon = document.createElement('span')
    icon.classList.add('mapboxgl-ctrl-icon')
    icon.setAttribute('style', `background-image: url('${homeIcon}'); background-size: contain;`)
    button.append(icon)
    this._container.append(button)

    button.addEventListener('click', () => this._resetToCenter())

    return this._container
  }

  onRemove() {
    if (this._container.parentNode !== null) {
      this._container.parentNode.removeChild(this._container)
      this._map = undefined
    }
  }

  _resetToCenter() {
    if (this._map === undefined) return
    this._map.flyTo({
      center: [this.centerLong, this.centerLat],
      zoom: this.zoom,
      pitch: this.pitch,
      bearing: this.bearing
    })
  }
}
