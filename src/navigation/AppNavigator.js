
import React from "react";
import { createSwitchNavigator, createAppContainer } from "react-navigation";
import { createStackNavigator } from 'react-navigation-stack';

 //import Slide from "../screens/slides/slide";
 import Register from "../auths/register";
 import Login from "../auths/login";
 import Forgetpass from "../auths/forgetpass";
 import Home1 from "../main/home1";
 import AuthLoading from "../auths/authLoading";
 import About from "../screens/about";
 import BottomTabs from './BottomTabs';
 import Boutiques from '../recherche/boutiques';
 import ResultImage from '../recherche/resultImage';
 


//const slideStack = createStackNavigator({ Slide: Slide });
const AuthStack = createStackNavigator({ Home1: Home1,Login: Login, Register: Register,Forgetpass:Forgetpass,About:About });
//const CultureSymp = createStackNavigator({ CultureSymp: CultureSymp });
const MainNavigator = createStackNavigator({Loussi: BottomTabs,Boutiques:Boutiques,ResultImage:ResultImage});


  AppNavigator = createSwitchNavigator(
    {
      AuthLoading: AuthLoading,
      Auth: AuthStack,
      Main: MainNavigator,
    },
    {
        initialRouteName: "AuthLoading",
     // headerMode: "none"
    }
  );
  const AppContainer = createAppContainer(AppNavigator);

export default AppContainer;

  