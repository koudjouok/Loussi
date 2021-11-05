import React from 'react';
import {  createAppContainer } from "react-navigation";
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import RechercheText from "../recherche/rechercheText";
import RechercheImage from "../recherche/rechercheImage";





const TextTab = createStackNavigator({
    RechercheText: RechercheText
});

const ImageTab = createStackNavigator({
    RechercheImage: RechercheImage
});

const Tabs = createBottomTabNavigator({
    RechercheText: TextTab,
    RechercheImage: ImageTab
}, {
    defaultNavigationOptions: ({ navigation }) => ({
        tabBarIcon: () => {
            const { routeName } = navigation.state;
            let tabName;
            tabName = routeName === 'RechercheText' ? 'home' : 'grid';

            return <Icon name={tabName} size={20} />
        }
    })
});

export default createAppContainer(Tabs);