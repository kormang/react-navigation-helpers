React Navigation Helpers
========================

**NOTE: This is highly experimental. I advise you to fork the repo so that you don't care about breaking changes, as future development of react-navigation is not taken into consideration.
However I strongly advise you to use this code, as it is product of frustration caused by react-navigation bugs and shortcomings.**

React-navigation is probably the best navigation for react-native, and it is beautiful. But it has its bugs and shortcomings, which I noticed just several hours after I started using it. Other users had already reported these problems on GitHub issue list. I decided to do something about it. First it was part of project I work on, but later I took it out and made this module so that I can use it on my other project.
This module could help you get started with React Navigation quickly and provide useful helper functions and redux action and navigators for advanced users.

Pull request are welcome, especially if you are going to add flow types, examples, tests and of course bug fixes :D.

_NOTE: It is primarily meant to be used with redux, but other folks could at least use some ideas._

_NOTE: There are a lot of comments in code, so feel free to browse code in order to find additional information._

**Example: Handling status bar configuration with navigation**

You probably already have most of these files.
If not, maybe this could help you configure react-navigation with redux.

_RootStackNavigator.js_
```js
import {
  createNavigatorWithPlugins,
  pluginGetNavigatorConfig,
  pluginGetConfigForRouteName
} from 'react-navigation-helpers'
import { StackNavigator } from 'react-navigation'
import MainTabNavigator from './MainTabNavigator'
.
.
.
// You need to do this ONLY for those navigators that you want to extract config from
export default RootStackNavigator = createNavigatorWithPlugins(StackNavigator,
  {
    Main: {
      screen: MainTabNavigator, // Nested navigators work great
      statusBarOptions: { hidden: false }
    Login: { screen: Login },
    Welcome: { screen: Welcome }
  },
  {
    ...,
    statusBarOptions: { hidden: true }
  },
  [ pluginGetNavigatorConfig, pluginGetConfigForRouteName ])

```

_SomeScreen.js_
```js
...
class SomeScreen extends React.Component {
  static statusBarOptions = () => {
    ...
    return { hidden: true, barStyle: 'optional, or any other property you want'}
  }

  onSomeEvent = () => {
    this.props.navigation.navigate('SomeOtherScreen', {
      statusBarOptions: { hidden: false, backgroundColor: 'red' }
    })
  }
  ...
}
...
```

_navigationReducer.js_
```js
import { createNavigationReducer } from 'react-navigation-helpers'
import RootStackNavigator from 'navigation/RootStackNavigator'
// Let's say that Home is nested inside Main, it works
const { navigationReducer } = createNavigationReducer('Home', RootStackNavigator)
export default navigationReducer
```

_reducers.js_
```js
import navigationReducer from './navigationReducer'
...
const reducers = combineReducers({
  ...
  navigation: navigationReducer
})
...
```

_StatusBarHandler.js_
```js
import { StatusBar, View, Platform } from 'react-native'
import React from 'react'

function containerStyleFromProps (props) {
  const height = props.statusBarOptions.hidden
    ? 0
    : Platform.select({ ios: 20, android: StatusBar.currentHeight })
  return {height}
}

export default (props) =>
  <View style={containerStyleFromProps(props)}>
    <StatusBar {...props.statusBarOptions} translucent/>
  </View>
```

_RootAppComponent.js_
```js
...
import RootStackNavigator from './RootStackNavigator'
import StatusBarHandler from './StatusBarHandler'
import { computeOptions, findCurrentRoute, findCurrentRouteName } from 'react-navigation-helpers'
...
const navigationSelector = state => state.navigationReducer
// THIS IS IMPORTANT:
const getStatusBarOptions =
  computeOptions(navigationSelector)(RootStackNavigator)('statusBarOptions')

// only if you need this for some reason:
const getCurrentRouteName = findCurrentRouteName(findCurrentRoute(navigationSelector))

class RootAppComponent extends React.Component {
  ...
  render () {
    return <View style={styles.appContainer}>
      <StatusBarHandler statusBarOptions={this.props.statusBarOptions}/>
      <RootStackNavigator navigation={addNavigationHelpers({
          dispatch: this.props.dispatch,
          state: this.props.nav
        })} />
    </View>
  }
}
...
export default connect(
  (state) => ({
    nav: state.navigation,
    statusBarOptions: getStatusBarOptions(state),
    // only if you need this for some reason:
    currentRouteName: getCurrentRouteName(state)
  }),
  (dispatch) => ({
    dispatch
  })
)(RootAppComponent)
```

You can make similar options for android back handling.
You can even combine it with react-native-android-back-button (Just remember not to subscribe to back button presses your self, in that case).

## Redux reducer

You can use `createNavigationReducer` to quickly and easily create navigation reducer that works with redux and react-navigation, and processes some of additional actions provided in this module.

```js
import { createNavigationReducer } from 'react-navigation-helpers'

/*
  RootStackNavigator is defined something like this:
  import { StackNavigator } from 'react-navigation'
  import MainDrawerNavigator from './MainDrawerNavigator'
  .
  .
  .
  export default StackNavigator({
    Main: { screen: MainDrawerNavigator }
  }, {
  ...
  })
*/
import RootStackNavigator from 'navigation/RootStackNavigator'


// Home is nested screen, it works!!!
const { navigationReducer } = createNavigationReducer('Home', RootStackNavigator)

// And that is it, you have navigation reducer, just combine it with other reducers and use it.
// All that is does is navigation, the only thing navigation reducer should be doing.
export default navigationReducer
```

## Additional custom actions

There is few action used to customize and improve react-navigation behavior.

```js
import { CustomNavigationActions } from 'react-navigation-helpers'
...

// Painless reset to nested screen
dispatch(CustomNavigationActions.resetToNestedScreen('OneOfScreensInRootNavigator')('SomeNestedScreenName'))

// More general version of resetToNestedScreen.
// If you want more control, you should provide,
// key, index, action, toNestedAction and additionalActions yourself.
// Provided additionalActions can not be CustomNavigationActions.
dispatch(CustomNavigationActions.nestedReset({
  index: 0,
  key: null,
  actions: [ NavigationActions.navigate('RootScreenName')],
  toNestedAction: NavigationActions.navigate('NestedScreen'),
  additionalActions: []
}))

/*
Useful when you would like to return to screen from which (for example) user went to Login screen.
If you save navigation state from redux store you can pass it to this action creator, and it will be restored.
It is also performance and memory optimization,
as with resetting to desired state would create new screens,
and the unmount and delete old screens. This will preserve screens.
*/
const navigationSnapshot = store.getState().navigation
dispatch(CustomNavigationActions.restore(navigationSnapshot))


// Basically to save your fingertips.
// Provided actions can not be CustomNavigationActions.
dispatch(CustomNavigationActions.batchNavigation([
  NavigationActions.navigate(),...
]))
```

**Check out `navigationActions.js` for more details.**

## Helper standard action creators

If you don't have access to:
```js
  this.props.navigation.navigate('SomeScreen')
```
you can use:
```js
 import { NavigationActionHelpers } from 'react-navigation-helpers'
 ...
 dispatch(NavigationActionHelpers.navigate('SomeScreen'))
```

**Check out `navigationActions.js` for more details.**

## Selectors

Selectors are used to pull some information from navigation state or tree.
One of them is especially powerful and useful, `computeOptions`, which is more than selector. For this selector to work at full potential two provided plugins are needed.


```js
import RootNavigator from './RootNavigator'
import { computeOptions, findCurrentRoute, findCurrentRouteName } from 'react-navigation-helpers'

const navigationSelector = state => state.navigationReducer

const getStatusBarOptions =
  computeOptions(navigationSelector)(RootNavigator)('statusBarOptions')

const getCurrentRouteName = findCurrentRouteName(findCurrentRoute(navigationSelector))

function mapStateToProps (state) {
  return {
    statusBarOptions: getStatusBarOptions(state),
    currentRouteName: getCurrentRouteName(state),
    nav: state.navigationReducer
  }
}
```

## Plugins

( I'm not sure if plugin and selector are right words here, but code works anyway :) ).

Plugins are used to add functionalities to navigators.

There are two provided plugins, that should be used with those navigators from which you want to extract route config (based on route name), or navigator config.

You can write your own plugins. I suppose you can use `enhance` from `react-navigation-addons` and make a plugin out of it.

Plugins are functions that accept navigator, route config, and navigator config, make changes and return modified navigator.

To create navigator with plugins do something like this:

```js
import { createNavigatorWithPlugins, pluginGetNavigatorConfig, pluginGetConfigForRouteName } from 'react-navigation-helpers'

// You don't need to do this for root or any other navigator, it is optional.
// computeOptions selector will use these two plugins where they are available.
const RootStackNavigator = createNavigatorWithPlugins(StackNavigator,
  {...},
  {...},
  [ pluginGetNavigatorConfig, pluginGetConfigForRouteName ])

```

**Definitely check out `selectors.js` and `helpers.js` for more details.**
