import React from 'react'
import { View, Text, TouchableHighlight, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as userActions from './userActions'
import { NavigationActionHelpers } from 'react-navigation-helpers'

const Profile = (props) =>
  <View style={{flex: 1}}>
    <Text>User: {props.user.name}</Text>
    <TouchableHighlight onPress={() => {
      props.userActions.logout()
      props.navActionHelpers.resetToRootScreen('Login')
    }}
    style={styles.button}>
      <Text>LOGOUT</Text>
    </TouchableHighlight>
  </View>

export default connect(
  (state) => ({
    user: state.user
  }),
  (dispatch) => ({
    userActions: bindActionCreators(userActions, dispatch),
    navActionHelpers: bindActionCreators(NavigationActionHelpers, dispatch)
  })
)(Profile)

const styles = StyleSheet.create({
  button: {
    padding: 20,
    backgroundColor: 'darkgreen'
  }
})
