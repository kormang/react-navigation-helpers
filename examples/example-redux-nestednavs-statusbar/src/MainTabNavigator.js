import React from 'react'
import { TabNavigator } from 'react-navigation'
import {
  pluginGetConfigForRouteName,
  pluginGetNavigatorConfig,
  createNavigatorWithPlugins
} from 'react-navigation-helpers'
import Home from './Home'
import Profile from './Profile'

const MainNavigator = createNavigatorWithPlugins(
  TabNavigator,
  {
    Home: {
      screen: Home,
    },
    Profile: {
      screen: Profile,
    }
  },
  {
    initialRouteName: 'Home',
    tabBarPosition: 'bottom',
    animationEnabled: true,
    swipeEnabled: true,
    lazy: true,
    statusBarOptions: {
      hidden: false
    },
    tabBarOptions: {
      upperCaseLabel: false,
      showIcon: false,
      showLabel: true
    }
  },
  [
    pluginGetConfigForRouteName,
    pluginGetNavigatorConfig
  ]
)

export default MainNavigator
