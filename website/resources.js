/**
 * Duck for resources that happen to be searchable.
 * @flow
 */
import Immutable from 'immutable'

export const ACTION_TYPES = {
}

export const actions = {
}

export const actionHandlers = {
}

export function reducer (
  state = new Immutable.Map(), action: Object
): Immutable.Map {
  const { type } = action
  if (type in actionHandlers) {
    return actionHandlers[type](state, action)
  } else {
    return state
  }
}
