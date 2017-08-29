import React from 'react'
import { View, Text, TouchableHighlight, TextInput, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as userActions from './userActions'
import { resetToMainNestedScreen } from './navigation-utils.js'

class Login extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      username: ''
    }
  }

  render () {
    return <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        onChangeText={(text) => this.setState({username: text})}
        placeholder="User name"/>
      <TouchableHighlight onPress={() => {
        this.props.userActions.login(this.state.username)
        this.props.resetToNestedScreen('Home')
      }}
      style={styles.button}>
        <Text>LOGIN</Text>
      </TouchableHighlight>
    </View>
  }
}

export default connect(
  (state) => ({
    user: state.user
  }),
  (dispatch) => ({
    userActions: bindActionCreators(userActions, dispatch),
    resetToNestedScreen: bindActionCreators(resetToMainNestedScreen, dispatch)
  })
)(Login)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#484',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    width: '100%',
    margin: 20
  },
  button: {
    padding: 20,
    backgroundColor: 'darkgreen'
  }
})
