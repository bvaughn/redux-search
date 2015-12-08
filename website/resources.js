/**
 * Duck for resources that happen to be searchable.
 * @flow
 */
import { createSelector } from 'reselect'
import { getSearchSelectors, search as createSearch } from '../src/index'
import faker from 'faker'
import Immutable from 'immutable'
import keymirror from 'keymirror'

export const State = Immutable.Record({
  contacts: Immutable.OrderedMap()
})

export const ACTION_TYPES = keymirror({
  UPDATE_CONTACTS: null
})

const Contact = Immutable.Record({
  address: null,
  email: null,
  id: null,
  name: null,
  phone: null,
  title: null
})

export const actions = {
  generateContacts () {
    const contacts = {}
    for (var i = 0; i < 1000; i++) {
      let id = faker.random.uuid()
      contacts[id] = new Contact({
        address: faker.address.streetAddress(),
        email: faker.internet.email(),
        id: id,
        name: faker.name.findName(),
        phone: faker.phone.phoneNumber(),
        title: faker.name.title()
      })
    }
    return {
      type: ACTION_TYPES.UPDATE_CONTACTS,
      payload: Immutable.Map(contacts)
    }
  },

  searchContacts: createSearch('contacts')
}

export const actionHandlers = {
  [ACTION_TYPES.UPDATE_CONTACTS] (state, { payload }): State {
    return state.set('contacts', payload)
  }
}

export const resources = state => state.resources
export const contacts = createSelector(
  [resources],
  (resources) => resources.contacts
)

const { text, result } = getSearchSelectors('contacts')
export const searchString = text
export const filteredContactIds = createSelector(
  [result],
  (result) => Immutable.List(result)
)

export function reducer (state = new State(), action: Object): State {
  const { type } = action
  if (type in actionHandlers) {
    return actionHandlers[type](state, action)
  } else {
    return state
  }
}
