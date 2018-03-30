export const CHANGE_BASEMAP = 'CHANGE_BASEMAP'
export const SET_AREA = 'SET_AREA'
export const SET_AREA_COLOR_LABEL = 'SET_AREA_COLOR_LABEL'
export const CHANGE_AREA_DATA = 'CHANGE_AREA_DATA'
export const CHANGE_LABEL = 'CHANGE_LABEL'
export const CHANGE_COLOR = 'CHANGE_COLOR'
export const ADD_MARKER = 'ADD_MARKER'
export const REMOVE_MARKER = 'REMOVE_MARKER'
export const SET_MARKER = 'SET_MARKER'
export const TOGGLE_MARKER = 'TOGGLE_MARKER'

/** Actions **/

export const changeBasemap = basemap => ({
  type: CHANGE_BASEMAP,
  payload: basemap,
})

export const setArea = (data, color, label) => ({
  type: SET_AREA,
  payload: [data, color, label],
})

export const setAreaColorLabel = (color, label) => ({
  type: SET_AREA_COLOR_LABEL,
  payload: [color, label],
})

export const changeAreaData = data => ({
  type: CHANGE_AREA_DATA,
  payload: data,
})

export const changeLabel = text => ({
  type: CHANGE_LABEL,
  payload: text,
})

export const changeColor = color => ({
  type: CHANGE_COLOR,
  payload: color,
})

export const addMarker = marker => ({
  type: ADD_MARKER,
  payload: marker,
})

export const removeMarker = marker => ({
  type: REMOVE_MARKER,
  payload: marker,
})

export const setMarker = markers => ({
  type: SET_MARKER,
  payload: markers,
})

export const toggleMarker = marker => ({
  type: TOGGLE_MARKER,
  payload: marker,
})


/** Reducers **/

export const basemapReducer = (initial = 'watercolor') => (
  (initialBasemap = initial, { type, payload }) => {
    switch (type) {
      case CHANGE_BASEMAP:
        return payload;
      default:
        return initialBasemap;
    }
  }
)

export const areaReducer = (initial = { 'data': {}, 'color': 'ruler', 'label': 'ruler' }) => (
  (prevArea = initial, { type, payload }) => {
    switch (type) {
      case SET_AREA:
        return {
          data: payload[0],
          color: payload[1],
          label: payload[2]
        }
      case SET_AREA_COLOR_LABEL:
        return {
          ...prevArea,
          color: payload[0],
          label: payload[1]
        }
      case CHANGE_COLOR:
        return {
          ...prevArea,
          color: payload
        }
      case CHANGE_LABEL:
        return {
          ...prevArea,
          label: payload
        };
      case CHANGE_AREA_DATA:
        return {
          ...prevArea,
          data: payload
        };
      default:
        return prevArea;
    }
  }
)

export const markerReducer = (initial = []) => (
  (prevMarker = initial, { type, payload }) => {
    switch (type) {
      case SET_MARKER:
        return payload
      case TOGGLE_MARKER:
        if (prevMarker.indexOf(payload) > -1) {
          return [
            ...prevMarker.filter(marker =>
            marker !== payload)
          ]
        } else {
          return [
            ...prevMarker,
            payload
          ]
        }
      case ADD_MARKER:
        return [
          ...prevMarker,
          payload
        ]
      case REMOVE_MARKER:
        return [
          ...prevMarker.filter(marker =>
          marker !== payload)
        ]
      default:
        return prevMarker
    }
  }
)
