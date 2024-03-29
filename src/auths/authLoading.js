import React, { Component } from "react";
import {
  ActivityIndicator,
  StatusBar,
  View,
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';

class AuthLoading extends Component {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem('user');
    //const userToken = await AsyncStorage.getItem('data');

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    this.props.navigation.navigate(userToken ? 'Main' : 'Home1'); //FirstCulture
  };

  // Render any loading content that you like here
  render() {
    return (
      <View >
        <ActivityIndicator />
        <StatusBar barStyle="default" />
   
      </View>
    );
  }
}

export default AuthLoading;