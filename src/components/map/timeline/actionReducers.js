import { SET_EPIC_ITEM } from '../actionReducers'

export const SET_YEAR = 'SET_YEAR'

/** Actions **/

export const setYear = year => ({
  type: SET_YEAR,
  payload: year,
})

/** Reducers **/

export const yearReducer = (initial = 1000) =>
  (prevYear = initial, { type, payload }) => {
    switch (type) {
      case SET_EPIC_ITEM:
        return payload[1]
      case SET_YEAR:
        return payload
      default:
        return prevYear
    }
  }
