import { NavigationActions } from 'react-navigation'
import { CustomNavigationActions } from './navigationActions'

/*
  Provided initial screen and root navigator this function will return ready-to-use navigation reducer.
  Returns `{navigationReducer, navigationInitialState}`.
*/
function createNavigationReducer (initialScreen, rootNavigator) {
  function getInitialNavState (initialScreen, rootNavigator) {
    const action = NavigationActions.navigate({ routeName: initialScreen })
    return rootNavigator.router.getStateForAction(action)
  }
  const navigationInitialState = getInitialNavState(initialScreen, rootNavigator)

  function batchActions (actions, state, router) {
    // let reducer do some reducing :)
    return actions.reduce(
      (intermediateState, subAction) =>
        router.getStateForAction(subAction, intermediateState),
      state)
  }

  function handleCustomNavigationActions (action, state) {
    const router = rootNavigator.router
    switch (action.type) {
      case CustomNavigationActions.NESTED_RESET: {
        const resetSubAction = NavigationActions.reset({
          ...action.payload
        })
        const stateAfterReset = router
          .getStateForAction(resetSubAction, state)

        const { toNestedAction } = action.payload
        const stateNested = router.getStateForAction(toNestedAction, stateAfterReset)

        const { additionalActions } = action.payload
        return batchActions(additionalActions, stateNested, router)
      }
      case CustomNavigationActions.RESTORE: {
        const preservedState = action.payload.state
        const { additionalActions } = action.payload
        return batchActions(additionalActions, preservedState, router)
      }
      case CustomNavigationActions.BATCH_NAVIGATION: {
        return batchActions(action.payload.actions, state, router)
      }
    }
  }


  function navigationReducer (state = navigationInitialState, action) {
    const nextState = handleCustomNavigationActions(action, state) ||
      rootNavigator.router.getStateForAction(action, state)

    // Simply return the original `state` if `nextState` is null or undefined.
    return nextState || state
  }

  return {
    navigationInitialState,
    navigationReducer
  }
}

export default createNavigationReducer
