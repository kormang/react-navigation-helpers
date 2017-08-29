import React from 'react'
import { connect } from 'react-redux'
import { View, StyleSheet } from 'react-native'
import { addNavigationHelpers } from 'react-navigation'
import RootStackNavigator from './RootStackNavigator'
import StatusBarHandler from './StatusBarHandler'
import { computeOptions, findCurrentRoute, findCurrentRouteName } from 'react-navigation-helpers'

const navigationSelector = state => state.navigation
// THIS IS IMPORTANT:
const getStatusBarOptions =
  computeOptions(navigationSelector)(RootStackNavigator)('statusBarOptions')

// only if you need this for some reason:
const getCurrentRouteName = findCurrentRouteName(findCurrentRoute(navigationSelector))

class AppRoot extends React.Component {
  render () {
    return <View style={styles.container}>
      <StatusBarHandler statusBarOptions={this.props.statusBarOptions}/>
      <RootStackNavigator navigation={addNavigationHelpers({
        dispatch: this.props.dispatch,
        state: this.props.nav
      })} />
    </View>
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
})

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
)(AppRoot)
