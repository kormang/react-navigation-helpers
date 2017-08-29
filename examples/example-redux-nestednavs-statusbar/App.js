import React from 'react'
import { Provider } from 'react-redux'
import { View } from 'react-native'
import { NavigationActionHelpers } from 'react-navigation-helpers'
import AppRoot from './src/RootAppComponent'
import configureStore from './src/store'
import { resetToMainNestedScreen } from './src/navigation-utils.js'

export default class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      rehydrated: false
    }
    this.store = configureStore((err) => {
      if (err) {
        throw err
      }
      const state = this.store.getState()
      const action = state.user.loggedIn
        ? resetToMainNestedScreen('Home')
        : NavigationActionHelpers.resetToRootScreen('Welcome')
      this.store.dispatch(action)
      this.setState({rehydrated: true})
    })
  }

  render () {
    if (!this.state.rehydrated) {
      return <View/>
    }
    return <Provider store={this.store}>
      <AppRoot/>
    </Provider>
  }
}
