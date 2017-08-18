import * as customNavigationActionTypes from './customNavigationActionTypes'
import { NavigationActions } from 'react-navigation'

/*
 Action creator for most common reset action when nested navigators are present.
 Sets index to 0, and key to null. Resets to `rootRouteName` (which must be part of root navigator).
 Then it executes navigate action which navigates to nested route with name `nestedRouteName`.
 After that arbitrary additionalActions will be executed.
 Currying is used because often we use same `rootRouteName`, so we can easily
 make specialized function without need to create wrapper.
 Provided additionalActions can not be CustomNavigationActions.
 */
const resetToNestedScreen = (rootRouteName) => (nestedRouteName, additionalActions = []) => ({
  type: customNavigationActionTypes.NESTED_RESET,
  payload: {
    index: 0,
    key: null,
    actions: [ NavigationActions.navigate({ routeName: rootRouteName }) ],
    toNestedAction: NavigationActions.navigate({ routeName: nestedRouteName }),
    additionalActions
  }
})

/*
 More general version of `resetToNestedScreen`.
 Action creator that will create action which will reset navigation to root and after that
 additionalActions could reset to any nested screen.
 payload should be object providing: `index`, `key`, `actions`, `toNestedAction`
 and `additionalActions` (which must be at least empty array).
 Provided additionalActions can not be CustomNavigationActions.
 */
const nestedReset = (payload) => ({
  type: customNavigationActionTypes.NESTED_RESET,
  payload
})

/*
 Action creator for action that will restore navigation state to some previous preserved state.
 It is useful when you would like to return to screen from which (for example) user went to Login screen.
 If you save navigation state from redux store you can pass it to this action creator as state,
 and it will be restored.
 It is also performance and memory optimization,
 as with resetting to desired state would create new screens,
 and the unmount and delete old screens. This will preserve screens.
 Provided additionalActions can not be CustomNavigationActions.
 */
const restore = (state, additionalActions = []) => ({
  type: customNavigationActionTypes.RESTORE,
  payload: {
    state,
    additionalActions
  }
})

/*
  Action creator for batch navigation action,
  a helper action used to carry array of other actions
  so that they don't have to be dispatched multiple times.
  Useful when you need to go back twice, or in similar scenarios.
  Provided actions can not be CustomNavigationActions.
*/
const batchNavigation = (actions) => ({
  type: customNavigationActionTypes.BATCH_NAVIGATION,
  payload: {
    actions
  }
})

/*
 Provides action creators for custom navigation actions which are not part of react-navigation.
 */
export const CustomNavigationActions = {
  ...customNavigationActionTypes,
  resetToNestedScreen,
  nestedReset,
  restore,
  batchNavigation
}

/*
 Action creator for most common reset action.
 Sets index to 0, and key to null. Resets to screenName (which must be part of root navigator).
 */
const resetToRootScreen = (screenName) =>
  NavigationActions.reset({
    index: 0,
    key: null,
    actions: [ NavigationActions.navigate({ routeName: screenName }) ]
  })

/*
 Navigate action creator, when addNavigationHelpers' results are not accessible.
 */
const navigate = (routeName, params, action) =>
  NavigationActions.navigate({
    routeName,
    params,
    action
  })

/*
 Back action creator, when addNavigationHelpers' results are not accessible.
 */
const back = (key) =>
  NavigationActions.back({
    key: key || null
  })

/*
 Provides action creator helpers for common react-navigation actions.
 */
export const NavigationActionHelpers = {
  resetToRootScreen,
  navigate,
  back
}
