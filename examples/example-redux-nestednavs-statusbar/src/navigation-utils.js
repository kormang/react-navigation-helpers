import { CustomNavigationActions, createReactNavigationReduxHelpers } from 'react-navigation-helpers'

export const resetToMainNestedScreen = CustomNavigationActions.resetToNestedScreen('Main')

export const navigationSelector = state => state.navigation

const reduxHelpers = createReactNavigationReduxHelpers('root', navigationSelector)

export const navigationMiddleware = reduxHelpers.navigationMiddleware
export const addListener = reduxHelpers.addListener
