
import React, { Component } from "react";
import Icon from "react-native-vector-icons";
import axios from 'axios';
//import { Bubbles } from 'react-native-loader';
import Toast from 'react-native-simple-toast'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {
  Text, 
  StatusBar,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableHighlight,
  AsyncStorage,
  View,
  TextInput,
  Label,I18nManager,Linking
} from 'react-native';
import { 
  Container,
  Content, 
  Button,
  Item,
  Input,
  Grid,
  Col,
  H3,H1,
  Form,
  } from 'native-base';
// import { TextInput } from "react-native-gesture-handler";
const Config = require('../../config');

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


class Forgetpass extends Component {
  constructor(props) {
    super(props);
    setI18nConfig(); // set initial config
    this.state = {         
     tel:""
    }
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

   handleChange = (tel) => {
    this.setState({tel:tel})
  }


  entierAleatoire(length)
{
  var text = "";
  var possible = "123456789";
  for (var i = 0; i < length; i++) {
    var sup = Math.floor(Math.random() * possible.length);
    text += i > 0 && sup == i ? "0" : possible.charAt(sup);
  }
  return Number(text);
}

initiateWhatsApp = (whatsAppMsg) => {
    // Check for perfect 10 digit length
   
    // Using 91 for India
    // You can change 91 with your country code
    this.setState({
      isLoading: false,
      display: 'flex'
    }) 
    let url =
      'whatsapp://send?text=' + 
       whatsAppMsg +
      '&phone=+' + this.state.tel;
    Linking.openURL(url)
      .then((data) => {
        console.log('WhatsApp Opened');

      })
      .catch(() => {
        alert('Rassurez vous que vous avez installé whatsapp');
        
      });
  };



   submit = () =>  {

    let code = this.entierAleatoire(4);
    this.setState({code:code});
    
    var bodyFormData = new FormData();

    bodyFormData.append('tel',this.state.tel)
    bodyFormData.append('code',code)
    
    axios({
      method: 'post',
      url: `${Config.ApiBaseUrl}/forgetpass.php`,
      data: bodyFormData,
      config: { headers: {'Content-Type': 'multipart/form-data' }}
    })
    .then(async (response) =>{
        
        console.warn(response.data)

        if (response.data.success == 1){
          //Toast.show("Mot de passe mise à jour", Toast.LONG)
          //this.props.navigation.navigate("Login");
          let message1 =translate("forgetpass.message1");
          let message2=translate("forgetpass.message2");+this.state.tel+translate("forgetpass.message3");+this.state.code
          let message =message1+message2;
         this.initiateWhatsApp(message);
        }
        else if (response.data.success == 0){
          Toast.show(translate("forgetpass.problem_register"), Toast.LONG)
        }
        else if (response.data.success == 2){
          Toast.show(translate("forgetpass.phone_not_exist"), Toast.LONG)
        } 

      }).catch((err) => {
        this.setState({btn1Display:'flex', btn2Display:'none'})
        console.warn('err', err);
        //Network error
        if (!err.response.status) {
          Toast.show(translate("forgetpass.error_connexion"), Toast.SHORT)
        }
       
      });
      
  }
  
  // Render any loading content that you like here
  render() {
    return (
      <Container>
      <StatusBar barStyle="dark-content" backgroundColor="#fff"/>

      <View style={styles.container}>
     
      
        <Content style={styles.formContent} padder>

          <View style={{marginBottom:hp('4%'), marginTop:hp('15%')}}>
            <H1 style={{marginLeft:wp(5)}}>{translate("forgetpass.text1")}</H1>
          </View>

          <Form style={{marginTop: hp('5')}}>

            <Item  style={{ color:'#b0bec5'}}>
            
              <Input 
                style={{}} 
                keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
                placeholder={translate("forgetpass.placeholder_tel")}
                onChangeText={this.handleChange}
                value={this.state.tel}
               
              />
            </Item>
            
          </Form>
          
          <Button rounded success style={{marginTop: hp('3')}}
           onPress={() => {
            if(this.state.tel){
              this.submit()
            }else{
                alert(translate("forgetpass.empty_field"))
            }
           }} 
           block /*style={{ backgroundColor: "#015483", marginTop: 30, borderRadius:5, display:this.state.btn1Display}}*/>
            <Text style={{color: "#fff", fontWeight:"bold", fontSize:hp('2')}} >{translate("forgetpass.btn_update")} </Text>
          </Button>

          <TouchableHighlight style={{ alignContent:'center', alignItems:'center'}}
            onPress={() => {
              this.props.navigation.pop();
            }}>
          
            <Text style={{color: "gray", fontWeight:"bold", fontSize:hp('2'), marginTop: hp('2.5')}}>{translate("back")} </Text>
          </TouchableHighlight>
         
          
  
        </Content>


      {/* <View style={styles.tabBarInfoContainer}>
        <TouchableHighlight
          onPress={() => {
            this.props.navigation.navigate("FingerPrint");
          }}>  
          <View style={[styles.codeHighlightContainer, styles.navigationFilename]}>
            <Text style={styles.codeHighlightText}>Utiliser mon enpreinte digitale</Text>
            <Icon style={{marginTop:5}} 
            name={
              Platform.OS === 'ios'
                ? `ios-finger-print`
                : 'md-finger-print'
            }
            size={32} color="#ffc400" />
          
          </View>
        </TouchableHighlight>
      </View> */}
    </View>

    </Container>
    );
  }
}

const styles = StyleSheet.create({
  formContent: {
    marginTop: -40
  },

  inputLabel: {
    marginTop: -9
  },
  
  container: {
    flex: 1,
   // backgroundColor: '#fff',
  },
  contentContainer: {
    paddingTop: 10,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 0,
  },
  welcomeImage: {
    width: 300,
    height: 200,
    resizeMode: 'contain',
    marginTop: 10,
    alignItems: 'center',
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  codeHighlightContainer: {
    borderRadius: 3,
    paddingHorizontal: 4,
    alignItems:'center'
  },
  getStartedText: {
    fontSize: 18,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 26,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
})

export default Forgetpass;

