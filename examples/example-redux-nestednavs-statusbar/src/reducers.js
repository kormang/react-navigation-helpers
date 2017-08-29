import { combineReducers } from 'redux'
import navigationReducer from './navigationReducer'
import userReducer from './userReducer'

const reducers = combineReducers({
 navigation: navigationReducer,
 user: userReducer
})

export default reducers
