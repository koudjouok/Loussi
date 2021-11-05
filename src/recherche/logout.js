import React, { Component } from 'react';
import {StyleSheet, Text, View,I18nManager} from 'react-native';
import { withNavigation } from 'react-navigation';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from "react-native-vector-icons/Ionicons";
import Toast from 'react-native-simple-toast'
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
  } from 'react-native-popup-menu';
  import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
  import AsyncStorage from '@react-native-community/async-storage';

  import * as RNLocalize from "react-native-localize";
import i18n from "i18n-js";
import memoize from "lodash.memoize"; // Use for caching/memoize for better performance

const translationGetters = require('../../config_traductions');
//const Translate = require('translate');      // New wave
//const translation = require('google-translate-free');
const translate = memoize(
  (key, config) => i18n.t(key, config),
  (key, config) => (config ? key + JSON.stringify(config) : key)
);

const setI18nConfig = () => {
  // fallback if no available language fits
  const fallback = { languageTag: "en", isRTL: false };

  const { languageTag, isRTL } =
    RNLocalize.findBestAvailableLanguage(Object.keys(translationGetters)) ||
    fallback;

  // clear translation cache
  translate.cache.clear();
  // update layout direction
  I18nManager.forceRTL(isRTL);
  // set i18n-js config
  i18n.translations = { [languageTag]: translationGetters[languageTag]() };
  i18n.locale = languageTag;
};

class Logout extends Component {

    constructor(props) {
        super(props);
        setI18nConfig(); // set initial config
        
      }
    
      static navigationOptions = {
        header: null,
       };
    
       componentDidMount() {
        RNLocalize.addEventListener("change", this.handleLocalizationChange);
        
         
      }
    
      componentWillUnmount() {
        RNLocalize.removeEventListener("change", this.handleLocalizationChange);
      }
    
      handleLocalizationChange = () => {
        setI18nConfig();
        this.forceUpdate();
      };

 render() {
   return (
    <Menu>
        <MenuTrigger>     
        <Icon name="log-out" style={{ color:"#FFF",paddingRight:5, paddingLeft:10, marginBottom:10, marginRight:10}} />
        </MenuTrigger>
        <MenuOptions>
        <MenuOption key={4} style={{marginBottom:hp('0.8%')}} onSelect={
            async () => {
            await AsyncStorage.clear()
            Toast.show("Deconnexion effectuée",Toast.SHORT)
            this.props.navigation.navigate("Home1");
            //navigation.navigation.push("Paiement")
            }
        } >    
            <Text style={{color: '#141414', marginLeft:10}}> <Icon name="log-out" style={{color:"black", marginRight:wp(2)}}/>{translate("logout")}</Text>
        </MenuOption>

       
        
        
        </MenuOptions>
    </Menu>
   );
 }
}
const styles = StyleSheet.create({
 backButton: {
   height: 44,
   width: 44,
   justifyContent: 'center',
   alignItems: 'center',
 },
});
export default withNavigation(Logout);