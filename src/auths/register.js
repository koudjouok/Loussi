import React, { Component } from "react";
import Icon from "react-native-vector-icons/Ionicons";
import Icon1 from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import Toast from 'react-native-simple-toast'

//import { Bubbles } from 'react-native-loader';
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
  ActivityIndicator,
  Linking,
  View,I18nManager
} from 'react-native';
import { 
  Container,
  Content, 
  Button,
  Item,
  Input,
  Body,
  Grid,
  Picker,
  Row,
  Col,
  Label,
  H3,
  Form,
  ListItem,
  Thumbnail,
  CheckBox} from 'native-base';
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

class Register extends Component {
  constructor(props) {
    super(props);
    setI18nConfig(); // set initial config
    this.state ={
      tel: "",
      code:"",
      display:'flex',
      townsData: [],
      isLoading: false
    }
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
        alert(translate("register.whatsapp_not_installed"));
        
      });
  };

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

 

  ShowHideActivityIndicator = () =>{
 
    if(this.state.isLoading == true)
    {
      this.setState({
        isLoading: false,
        display: 'flex'
      })
    }
    else
    {
      this.setState({
        isLoading: true,
        display: 'none'})
        this.onFinalise() 
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

  onFinalise = () =>  {

    //alert(this.state.userID)
    if (this.state.tel.length != 12) {
      this.setState({
        isLoading: false,
        display: 'flex'
      })
      alert(translate("register.phone_bad"));
      return;
    }

    if( this.state.tel != 0){
      let code = this.entierAleatoire(4);
      this.setState({code:code});
      var bodyFormData = new FormData();

      let lang='fr';
      bodyFormData.append('tel',this.state.tel)
      bodyFormData.append('code',code)
      bodyFormData.append('lang',lang)

      axios({
        method: 'post',
        url: `${Config.ApiBaseUrl}/register.php`,
        data: bodyFormData,
        config: { headers: {'Content-Type': 'multipart/form-data' }}
      })
      .then( async (response) =>{
        console.warn(response.success)
        if (response.data.success == 0){  
          this.setState({
            isLoading: false,
            display: 'flex'
          })   
          Toast.show(translate("register.failure_register"),Toast.LONG)

        }else if(response.data.success == 1){
          let message1 =translate("register.message1");
          let message2=translate("register.message2");
          let message3=translate("register.message3");
          let message4=translate("register.message4");
          let message5=translate("register.id")+this.state.tel+translate("register.password")+this.state.code
          let message =message1+message2+message3+message4+message5;
         this.initiateWhatsApp(message);
         // Toast.show("Inscription réussie",Toast.LONG);
          //this.props.navigation.navigate("Login");

        }else if(response.data.success == 2){

          this.setState({
            isLoading: false,
            display: 'flex'
          })
          Toast.show(translate("register.phone_exist"),Toast.LONG)

        }
       
        
      })
        .catch((err) => {
        
        console.warn(err.response);
        this.setState({
          isLoading: false,
          display: 'flex'
        })
        if (!err.response.status) {
          this.setState({
            isLoading: false,
            display: 'flex'
          })
          Toast.show(translate("register.error_connexion"), Toast.SHORT)
        }

        
      });
    }else{
      console.warn('error pas de userID dans le Storage')
      alert(translate("register.field_empty"))
    }
  }

  render() {
    return (
      <Container>
      <StatusBar barStyle="dark-content" backgroundColor="#fff"/>

      <View style={styles.container}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.welcomeContainer}>
          <Image
            source={
              __DEV__
              ? require('../../assets/logomalapse.png')
              : require('../../assets/logomalapse.png')
            }
            style={styles.welcomeImage}
          />
        </View>

        <Content style={styles.formContent} padder>

          <View style={{marginBottom:hp('5%'), alignContent:'center', alignItems:'center'}}>
          <H3 style={{fontSize:hp('2.2%'),fontWeight:'bold'}}>{translate("slogan")}</H3>
            <H3 style={{fontSize:hp('2.2%')}}>{translate("register.register")}</H3>
          </View>

          <Form>
          <Item rounded style={{ color:'#b0bec5', marginBottom:hp('2%')}}>
          <Icon active name={Platform.OS === "ios" ? "ios-person" : "md-person"} size={24} style={{marginRight:wp('3%'), marginLeft:wp("3%"), color:'green' }} /> 
              <Input style={{color:'#212121'}}  
              keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
              onChangeText={(tel)=>{
                this.setState({tel:tel})
              }}
               placeholder={translate("register.placeholder_phone")}/>
            </Item>
          </Form>
          <View>
          <Text style={{fontWeight:'bold'}}>{translate("register.infos")}</Text>
          </View>

          <Grid >  
          
          <Row style={{marginTop: hp('4')}}>
            <Col size={8}>
              <Button rounded success 
                onPress={() => {
                  ( this.state.tel).length != 0  ? this.ShowHideActivityIndicator() : Toast.show(translate("register.empty_phone"),Toast.SHORT)
                }} 
                block>
                {
                  this.state.isLoading ?  <ActivityIndicator size="large" color="#fff" /> : null
                 }
                <Text style={{color: "#fff", fontSize:hp('2'), display:this.state.display }}>{translate("register.valid_registration")}</Text>
              </Button>
          
              <TouchableHighlight style={{ alignContent:'center', alignItems:'center'}}
                onPress={() => {
                  this.props.navigation.pop();
                }}>
              
                <Text style={{color: "gray", fontWeight:"bold", fontSize:hp('2'), marginTop: hp('2.5')}}>
                <Icon1
              name= 'chevron-left'
              size={20}
            />{translate("back")}</Text>
              </TouchableHighlight>
            </Col>
           
          </Row>
          
          </Grid>
           
          

        </Content>

      </ScrollView>
      
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
    marginBottom:25,
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

export default Register;

