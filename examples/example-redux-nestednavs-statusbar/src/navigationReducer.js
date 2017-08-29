import { createNavigationReducer } from 'react-navigation-helpers'
import RootStackNavigator from './RootStackNavigator'

// Home is nested inside Main, it works
const { navigationReducer } = createNavigationReducer('Home', RootStackNavigator)
export default navigationReducer
