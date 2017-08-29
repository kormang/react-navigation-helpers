import React from 'react'
import { View, Text } from 'react-native'
import { connect } from 'react-redux'

const Home = (props) =>
  <View style={{flex: 1}}>
    <Text>Home Screen:</Text>
    <Text>Hello {props.user.name}</Text>
  </View>

export default connect(
  (state) => ({
    user: state.user
  }),
  (dispatch) => ({
  })
)(Home)
