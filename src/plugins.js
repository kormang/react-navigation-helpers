export function pluginGetConfigForRouteName (navigator,
                                            routeConfig,
                                            navigatorConfig) {
  navigator.pluginGetConfigForRouteName = function (routeName) {
    return routeConfig[routeName]
  }
  return navigator
}
export function pluginGetNavigatorConfig (navigator,
                                          routeConfig,
                                          navigatorConfig) {
  navigator.pluginGetNavigatorConfig = function () {
    return navigatorConfig
  }
  return navigator
}

export function createNavigatorWithPlugins (navigatorConstructor,
                                            routeConfig,
                                            navigatorConfig,
                                            pluginList) {
  const navigator = navigatorConstructor(routeConfig, navigatorConfig)
  return pluginList.reduce(
    (navigator, plugin) => plugin(navigator, routeConfig, navigatorConfig),
    navigator)
}
