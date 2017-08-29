import { createStore } from 'redux'
import rootReducer from './reducers'
import { AsyncStorage } from 'react-native'
import { persistStore, autoRehydrate } from 'redux-persist'

export default function configureStore (callback) {
  const store = createStore(rootReducer, undefined, autoRehydrate())
  persistStore(store, { storage: AsyncStorage, whitelist: [ 'user' ] }, callback)
  return store
}
