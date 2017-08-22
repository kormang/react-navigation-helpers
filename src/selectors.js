import { createSelector } from 'reselect'

const findCurrentRouteImpl = (navigationState) => {
  if (!navigationState) {
    return null
  }
  const route = navigationState.routes[navigationState.index]
  // dive into nested navigators
  if (route.routes) {
    return findCurrentRouteImpl(route)
  }
  return route
}

/*
 Memoized selector that selects the current route from navigation state.
 Result of a curry chain is selector function,
 which means it accepts redux state.
 */
export const findCurrentRoute = (navigationSelector) =>
  createSelector([navigationSelector], findCurrentRouteImpl)

/*
 Memoized selector for current route name.
 It requires `currentRouteSelector` which can be obtained using `findCurrentRoute` function.
 Result of a curry chain is selector function,
 which means it accepts redux state.
 */
export const findCurrentRouteName = (currentRouteSelector) =>
  createSelector([currentRouteSelector],
    (currentRoute) => currentRoute ? currentRoute.routeName : currentRoute)

const findCurrentComponentImpl = (navigationState, navigator) => {
  if (!navigationState) {
    return null
  }
  const route = navigationState.routes[navigationState.index]
  const component = navigator.router.getComponentForRouteName(route.routeName)
  if (component.router) {
    return findCurrentComponentImpl(route, component)
  }
  return component
}

/*
 Memoized mutant selector, using provided navigator it returns component for current screen.
 Result of a curry chain is selector function,
 which means it accepts redux state.
 */
export const findCurrentComponent = (navigationSelector) => (navigator) => createSelector(
  [navigationSelector], (navState) => findCurrentComponentImpl(navState, navigator))

// ///////////////////////////
// Details of implementation:
// ///////////////////////////

const mergeOptions = (destination, source) => {
  if (source) {
    const options = typeof source === 'function'
      ? source()
      : source
    if (typeof options === 'object' && options !== null) {
      Object.assign(destination, options)
    } else {
      throw new Error('Options should be provided as object or function returning object.')
    }
  }
}

const computeOptionsImpl = (optionsName) => {
  const implFunc = (navigationState, component, routeConfig, options) => {
    if (!navigationState) {
      return null
    }

    // first merge config defined at component level, it has lowest priority
    mergeOptions(options, component[optionsName])

    // if it is navigator then first merge options from its config
    if (component.router && typeof component.pluginGetNavigatorConfig === 'function') {
      const navConfig = component.pluginGetNavigatorConfig()
      mergeOptions(options, navConfig[optionsName])
    }

    // if there is route config from higher level of hierarchy, it has highest priority
    // (React components have params which is even higher priority)
    const configOptions = routeConfig && routeConfig[optionsName]
    mergeOptions(options, configOptions)

    // if it is navigator then continue recursively
    if (component.router) {
      const navigator = component
      let route = navigationState.routes[ navigationState.index ]
      const nextComponent = navigator.router.getComponentForRouteName(route.routeName)
      let nextConfig = null
      if (typeof navigator.pluginGetConfigForRouteName === 'function') {
        nextConfig = navigator.pluginGetConfigForRouteName(route.routeName)
        // this should not really happen unless navigator has added its own
        // layer of routes (like DrawerNavigator), in which case we can transfer
        // pluginGetConfigForRouteName to underlying navigator
        // (since we know how it is implemented which is bad tight coupling :( )
        if (!nextConfig && nextComponent.router) {
          nextComponent.pluginGetConfigForRouteName = navigator.pluginGetConfigForRouteName
        }
        // However this still won't work with drawer open, but often it is not needed.
        // If you need it when drawer is open you should probaly override
        // pluginGetConfigForRouteName defined on DrawerNavigator,
        // to return something specialized when drawer is open.
        // I don't like this drawer, it is not elegant, nor beatuful, nor does it fit nicely
        // into philosophy that other navigators seem to share.
      }
      return implFunc(route, nextComponent, nextConfig, options)
    } else {
      // it is React component, params have higher priority config, if it exists
      const { params } = navigationState
      const paramOptions = params && params[optionsName]
      mergeOptions(options, paramOptions)
      return options
    }
  }
  return implFunc
}

// ////////////////

/*
 Selector for custom configurations and options. Result of a curry chain is selector function,
 which means it accepts redux state.
 Traverses navigation tree and collects options from route configuration, navigators,
 components and state params.
 In each of places where you can define options, you can define them as
 function returning object or as object it self.
 These functions or objects should be named as provided `optionsName`.
 There is four places where you can define custom options.
 These are ordered according to precedence
 (first will be merged into result first, so it has lower precedence,
 and can be overwritten by others).

 1. As static member of navigator or component.
 2. Inside navigator config, e.g. `StackNavigator(routeConfig, { statusBarOptions: {} })`.
 3. Inside routes config, e.g. `StackNavigator({ statusBarOptions: {} }, navigatorConfig)`.
 4. Inside navigation params, e.g. `navigation.state.params.statusBarOptions`.
 It will have effect only if it is present in leaf component of navigation tree.
 */
export const computeOptions = (navigationSelector) => (rootNavigator) => (optionsName) => {
  const implFunc = computeOptionsImpl(optionsName)
  return createSelector([navigationSelector],
    (navState) => implFunc(navState, rootNavigator, null, {}))
}
