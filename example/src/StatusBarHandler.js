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
