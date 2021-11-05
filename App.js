
import React,{useEffect } from "react";
import {AsyncStorage,Alert} from 'react-native';
import AppNavigator from "./src/navigation/AppNavigator";
import { MenuProvider } from 'react-native-popup-menu';
import Notification from './src/notification/notification'
export default class App extends React.Component {

   constructor(props) {
        super(props);     
    }

  render() {
    
    return (
     
      
        <MenuProvider>
       <Notification/>
          <AppNavigator />
          
        </MenuProvider>
     
   
    );
  }
}
