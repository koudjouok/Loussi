import React, {useEffect,Component } from "react";
import { Platform,Alert,Linking } from "react-native";
import firebase from 'react-native-firebase';

export default class Notification extends Component {

async componentDidMount() {
  firebase.messaging().subscribeToTopic('topic');
  console.log('subscribe topic')
  this.checkPermission();
  this.createNotificationListeners(); //add this line
}

////////////////////// Add these methods //////////////////////
  
  //Remove listeners allocated in createNotificationListeners()
componentWillUnmount() {
  this.notificationListener();
  this.notificationOpenedListener();
}

async createNotificationListeners() {
  /*
  * Triggered when a particular notification has been received in foreground
  * */
  this.notificationListener = firebase.notifications().onNotification((notification) => {
      const { title, body,data } = notification;
      console.log('notification has been received in foreground',notification)
      console.log('data ',data.fenetre)
      this.showAlert(title, body,data.fenetre);
  });

  /*
  * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
  * */
  this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
      const { title, body,data } = notificationOpen.notification;
      console.log('App is in background',notificationOpen.notification)
      this.showAlert(title, body,data.fenetre);
  });

  /*
  * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
  * */
  const notificationOpen = await firebase.notifications().getInitialNotification();
  if (notificationOpen) {
      const { data } = notificationOpen.notification;
      console.log('App is closed',notificationOpen.notification)
      this.showAlert(data.title, data.body,data.fenetre);
  }
  /*
  * Triggered for data only payload in foreground
  * */
  this.messageListener = firebase.messaging().onMessage((message) => {
    //process data message
    
    console.log('Process data message',JSON.stringify(message));
  });
}

showAlert(title, body,fenetre) {
  Alert.alert(
    title, body,
    [
        { text: 'OK', onPress: () => {console.log('OK Pressed')
                                     Linking.openURL(fenetre)
                                     } },
    ],
    { cancelable: false },
  );
}

// firebase token for the user
async getToken(){
    firebase.messaging().getToken().then((fcmToken) => console.log("TOKEN:",fcmToken));
};

// request permission if permission diabled or not given
async requestPermission() {
    try {
        await firebase.messaging().requestPermission();
    } catch (error) {}
}

// if permission enabled get firebase token else request permission
async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
        this.getToken() // call function to get firebase token for personalized notifications.
    } else {
        this.requestPermission();
    }
}

render() {
    return null;
}
}