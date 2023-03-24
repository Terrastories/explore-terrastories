import mapboxgl, { Map, LngLatLike, LngLatBoundsLike, MapMouseEvent } from 'mapbox-gl'
import type { GeoJsonProperties } from 'geojson'

type MinimapOptions = {
  id: string,
  width: string,
  height: string,
  style: string,
  center: LngLatLike,
  zoom: number,
  zoomAdjust: (() => void),
  zoomLevels: number[][],
  lineColor: string,
  lineWidth: number,
  lineOpacity: number,
  fillColor: string,
  fillOpacity: number,
  dragPan: boolean,
  scrollZoom: boolean,
  boxZoom: boolean,
  dragRotate: boolean,
  keyboard: boolean,
  doubleClickZoom: boolean,
  touchZoomRotate: boolean,
  maxBounds?: LngLatBoundsLike,
  containerClass?: string
}

class Minimap {
  _parentMap: Map | undefined
  _miniMapCanvas: HTMLCanvasElement | undefined
  _miniMap: Map | undefined
  _container: HTMLElement | undefined
  _trackingRectCoordinates: any[][][]

  _ticking = false
  _lastMouseMoveEvent = null
  _isDragging = false
  _isCursorOverFeature = false
  _previousPoint = [0, 0]
  _currentPoint = [0, 0]
  _trackingRect: GeoJsonProperties | undefined

  options: MinimapOptions
  defaultOptions: MinimapOptions = {
    id: "mapboxgl-minimap",
    width: "320px",
    height: "180px",
    style: "mapbox://styles/mapbox/light-v10",
    center: [0, 0],
    zoom: 6,

    // should be a function; will be bound to Minimap
    zoomAdjust: this._zoomAdjust.bind(this),

    // if parent map zoom >= 18 and minimap zoom >= 14, set minimap zoom to 16
    zoomLevels: [
      [18, 14, 16],
      [16, 12, 14],
      [14, 10, 12],
      [12, 8, 10],
      [10, 6, 8],
      [8, 4, 6],
      [6, 2, 4],
      [3, 0, 2],
      [1, 0, 0]
    ],

    lineColor: "#136a7e",
    lineWidth: 1,
    lineOpacity: 1,

    fillColor: "#d77a34",
    fillOpacity: 0.25,

    dragPan: false,
    scrollZoom: false,
    boxZoom: false,
    dragRotate: false,
    keyboard: false,
    doubleClickZoom: false,
    touchZoomRotate: false
  }

  constructor(_options?: Object){
    this.options = this.defaultOptions
    Object.assign(this.options, _options)

    this._ticking = false
    this._lastMouseMoveEvent = null
    this._parentMap = undefined
    this._isDragging = false
    this._isCursorOverFeature = false
    this._previousPoint = [0, 0]
    this._currentPoint = [0, 0]
    this._trackingRectCoordinates = [[[], [], [], [], []]]
  }

  onAdd(parentMap: Map) {
    this._parentMap = parentMap;

    var opts = this.options;
    var container = this._container = this._createContainer(parentMap);
    var miniMap = this._miniMap = new mapboxgl.Map({
      attributionControl: false,
      container: container,
      style: opts.style,
      zoom: opts.zoom,
      center: opts.center,
      projection: {name: 'mercator'}
    });

    miniMap.getCanvas().removeAttribute('tabindex')
    if (opts.maxBounds) miniMap.setMaxBounds(opts.maxBounds)

    miniMap.on("load", this._load.bind(this));

    return this._container
  }

  _load() {
    var opts: any = this.options
    var parentMap: any = this._parentMap
    var miniMap: any = this._miniMap
    var interactions = [
      "dragPan", "scrollZoom", "boxZoom", "dragRotate",
      "keyboard", "doubleClickZoom", "touchZoomRotate"
    ]

    for(let interaction of interactions) {
      if (!opts[interaction]) {
        miniMap[interaction].disable()
      }
    }

    var bounds = miniMap.getBounds()

    this._convertBoundsToPoints(bounds)

    miniMap.addSource("trackingRect", {
      "type": "geojson",
      "data": {
        "type": "Feature",
        "properties": {
          "name": "trackingRect"
        },
        "geometry": {
          "type": "Polygon",
          "coordinates": this._trackingRectCoordinates
        }
      }
    })
    this._trackingRect = miniMap.getSource("trackingRect")

    miniMap.addLayer({
      "id": "trackingRectOutline",
      "type": "line",
      "source": "trackingRect",
      "layout": {},
      "paint": {
        "line-color": opts.lineColor,
        "line-width": opts.lineWidth,
        "line-opacity": opts.lineOpacity
      }
    })

    // needed for dragging
    miniMap.addLayer({
      "id": "trackingRectFill",
      "type": "fill",
      "source": "trackingRect",
      "layout": {},
      "paint": {
        "fill-color": opts.fillColor,
        "fill-opacity": opts.fillOpacity
      }
    })

    this._update()

    parentMap.on("move", this._update.bind(this))

    miniMap.on("mousemove", this._mouseMove.bind(this))
    miniMap.on("mousedown", this._mouseDown.bind(this))
    miniMap.on("mouseup", this._mouseUp.bind(this))

    miniMap.on("touchmove", this._mouseMove.bind(this))
    miniMap.on("touchstart", this._mouseDown.bind(this))
    miniMap.on("touchend", this._mouseUp.bind(this))

    this._miniMapCanvas = miniMap.getCanvasContainer()
    if (!this._miniMapCanvas) return
    this._miniMapCanvas.addEventListener("wheel", this._preventDefault)
    this._miniMapCanvas.addEventListener("mousewheel", this._preventDefault)
  }

  _mouseDown( e: MapMouseEvent ) {
    if( this._isCursorOverFeature )
    {
      this._isDragging = true
      this._previousPoint = this._currentPoint
      this._currentPoint = [e.lngLat.lng, e.lngLat.lat]
    }
  }

  _mouseMove (e: MapMouseEvent) {
    if (!this._parentMap) return
    if (!this._miniMap) return
    if (!this._miniMapCanvas) return

    this._ticking = false

    var miniMap = this._miniMap
    var features = miniMap.queryRenderedFeatures(e.point, {
      layers: ["trackingRectFill"]
    })

    // don't update if we're still hovering the area
    if( ! (this._isCursorOverFeature && features.length > 0) )
    {
      this._isCursorOverFeature = features.length > 0
      this._miniMapCanvas.style.cursor = this._isCursorOverFeature ? "move" : ""
    }

    if( this._isDragging )
    {
      this._previousPoint = this._currentPoint
      this._currentPoint = [e.lngLat.lng, e.lngLat.lat]

      var offset = [
        this._previousPoint[0] - this._currentPoint[0],
        this._previousPoint[1] - this._currentPoint[1]
      ]

      var newBounds = this._moveTrackingRect(offset)

      this._parentMap.fitBounds(newBounds, {
        duration: 80
      })
    }
  }

  _mouseUp() {
    this._isDragging = false
    this._ticking = false
  }

  _moveTrackingRect(offset: number[]) {
    if (!this._trackingRect) return

    var source = this._trackingRect
    var data = source._data

    if (!data) return
    var bounds = data.properties.bounds

    bounds._ne.lat -= offset[1];
    bounds._ne.lng -= offset[0];
    bounds._sw.lat -= offset[1];
    bounds._sw.lng -= offset[0];

    // convert bounds to points for trackingRect
    this._convertBoundsToPoints(bounds)

    // restrict bounds to max lat/lng before setting layer data
    bounds._ne.lat = Math.min(bounds._ne.lat, 90)
    bounds._ne.lng = Math.min(bounds._ne.lng, 180)
    bounds._sw.lat = Math.max(bounds._sw.lat, -90)
    bounds._sw.lng = Math.max(bounds._sw.lng, -180)

    source.setData(data)

    return bounds
  }

  _setTrackingRectBounds(bounds: any) {
    var source = this._trackingRect
    if (!source) return
    var data = source._data

    data.properties.bounds = bounds
    this._convertBoundsToPoints(bounds)
    source.setData(data)
  }

  _convertBoundsToPoints(bounds: any) {
    var ne = bounds._ne
    var sw = bounds._sw
    var trc = this._trackingRectCoordinates

    trc[0][0][0] = ne.lng
    trc[0][0][1] = ne.lat
    trc[0][1][0] = sw.lng
    trc[0][1][1] = ne.lat
    trc[0][2][0] = sw.lng
    trc[0][2][1] = sw.lat
    trc[0][3][0] = ne.lng
    trc[0][3][1] = sw.lat
    trc[0][4][0] = ne.lng
    trc[0][4][1] = ne.lat
  }

  _update() {
    if (this._isDragging) return
    if (!this._parentMap) return
    var parentBounds = this._parentMap.getBounds()

    this._setTrackingRectBounds(parentBounds)
    this.options.zoomAdjust()
  }

  _zoomAdjust() {
    if (!this._parentMap) return
    if (!this._miniMap) return

    var miniMap = this._miniMap
    var parentMap = this._parentMap
    var miniZoom = miniMap.getZoom() || 10
    var parentZoom = parentMap.getZoom() || 10
    var found = false

    for (let zoom of this.options.zoomLevels) {
      if (found) return

      if (parentZoom >= zoom[0]) {
        if (miniZoom >= zoom[1]) {
          miniMap.setZoom(zoom[2])
        }

        miniMap.setCenter(parentMap.getCenter())
        found = true
      }
    }
  }

  _createContainer(parentMap: Map) {
    var opts = this.options
    var container = document.createElement("div")

    container.className = "mapboxgl-ctrl-minimap mapboxgl-ctrl"
    if (opts.containerClass) container.classList.add(opts.containerClass)
    container.setAttribute('style', 'width: ' + opts.width + '; height: ' + opts.height + ';')
    container.addEventListener("contextmenu", this._preventDefault)

    parentMap.getContainer().appendChild(container)

    if( opts.id !== "" ) {
      container.id = opts.id
    }

    return container
  }

  _preventDefault(e: Event) {
    e.preventDefault()
  }

  onRemove() {
    return null
  }
}

export default Minimap