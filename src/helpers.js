import {
  createReduxBoundAddListener,
  createReactNavigationReduxMiddleware,
} from 'react-navigation-redux-helpers'
import _ from 'lodash'

// Navigates to screen with name routeName, and returns results from that screen via Promise.
// routeName, params, and action are standard parameters for navigation actions.
// navigationOrDispatch can be props.navigation,
// for convenience if called from React component connected to redux.
// navigationOrDispatch can also be redux dispatch function,
// for convenience if called from action creator.
// It is preferred to call this function like this:
// try {
//   const result = await navigateForResult(navigationOrDispatch, routeName, params, action)
// } catch (e) { console.log(e) }
// So caller will block until user or something else finishes it's job on screen routeName.
// For this to work, component mapped to routeName must implement simple API:
// It will get params as props.navigation.state.params passed from caller, but with two additional.
// IMPORTANT: Copy will be used so original caller's params will not be changed.
// These two additional parameters, are called onResultSuccess, and onResultFailure.
// IMPORTANT: If you have params already contains such members,
// they will be overwritten in copy passed to component.
// Component mapped to routeName should call onResultSuccess(result) to return result to caller,
// or onResultFailure(error) to throw error in caller's context.
// In other words, onResultSuccess will resolve Promise, and onResultFailure will reject it.
// Either caller or component should dispatch navigation back action, if you want to return from that
// screen after result is obtained.
export function navigateForResult (navigationOrDispatch, routeName, params, action) {
  return new Promise((resolve, reject) => {
    const newParams = {
      ...params,
      onResultSuccess: resolve,
      onResultFailure: reject
    }
    if (typeof navigationOrDispatch === 'function') {
      navigationOrDispatch(NavigationActionHelpers.navigate(routeName, newParams, action))
    } else {
      navigationOrDispatch.navigate(routeName, newParams, action)
    }
  })
}

export const defaultNavSelector = state => state.navigation

// Wrapper around react-navigation-redux-helpers createReactNavigationReduxMiddleware,
// and createReduxBoundAddListener.
// Accepts same parameters as createReactNavigationReduxMiddleware, but provides default values.
// IMPORTANT: This function will memoize based on first parameter, so if you call it twice
// it will return same object, thus it insures easy way to properly create these results
// from two different files. It makes things easier if you use default values. If you don't
// then you'll need to create file where you can create these helpers and then export them further.
// Returns `{navigationMiddleware, addListener}`.
export const createReactNavigationReduxHelpers = _.memoize(
  function (reduxSubscriberKey = 'root', navStateSelector = defaultNavSelector) {
    // Note: createReactNavigationReduxMiddleware must be run before createReduxBoundAddListener
    const navigationMiddleware = createReactNavigationReduxMiddleware(reduxSubscriberKey, navStateSelector)
    const addListener = createReduxBoundAddListener(reduxSubscriberKey)
    return {
      navigationMiddleware,
      addListener
    }
  }
)
