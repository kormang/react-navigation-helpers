import React from 'react'
import { View, Text, TouchableHighlight, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { NavigationActionHelpers } from 'react-navigation-helpers'

const Welcome = (props) =>
  <View style={styles.container}>
    <Text style={styles.text}>Welcome to example app of react-navigation-helpers</Text>
    <TouchableHighlight onPress={() => {
      props.navActionHelpers.resetToRootScreen('Login')
    }}>
      <Text style={styles.button}>ENTER</Text>
    </TouchableHighlight>
  </View>

export default connect(
  (state) => ({
    user: state.user
  }),
  (dispatch) => ({
    navActionHelpers: bindActionCreators(NavigationActionHelpers, dispatch)
  })
)(Welcome)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f44',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    padding: 20,
    backgroundColor: 'green'
  },
  text: {
    padding: 20
  }
})