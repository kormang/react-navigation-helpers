import {
  createNavigatorWithPlugins,
  pluginGetNavigatorConfig,
  pluginGetConfigForRouteName
} from 'react-navigation-helpers'
import React from 'react'
import { StackNavigator } from 'react-navigation'
import MainTabNavigator from './MainTabNavigator'
import Login from './Login'
import Welcome from './Welcome'

// You need to do this ONLY for those navigators that you want to extract config from
export default RootStackNavigator = createNavigatorWithPlugins(StackNavigator,
  {
    Main: {
      screen: MainTabNavigator, // Nested navigators work great
      statusBarOptions: { hidden: false }
    },
    Login: { screen: Login },
    Welcome: { screen: Welcome }
  },
  {
    initialRouteName: 'Welcome',
    statusBarOptions: { hidden: true },
    navigationOptions: { header: null }
  },
  [ pluginGetNavigatorConfig, pluginGetConfigForRouteName ])
