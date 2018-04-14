import { createStore, applyMiddleware, compose } from 'redux'
import rootReducer from './reducers'
import { AsyncStorage } from 'react-native'
import { persistStore, autoRehydrate } from 'redux-persist'
import {navigationMiddleware} from './navigation-utils'

export default function configureStore (callback) {
  const store = createStore(rootReducer, undefined, compose(applyMiddleware(navigationMiddleware), autoRehydrate()))
  persistStore(store, { storage: AsyncStorage, whitelist: [ 'user' ] }, callback)
  return store
}
