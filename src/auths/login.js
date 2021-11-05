import React, { Component } from "react";
import Icon from "react-native-vector-icons/Ionicons";
import Icon1 from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
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
  Label,
  ActivityIndicator,I18nManager
} from 'react-native';
import { 
  Container,
  Content, 
  Button,
  Item,
  Input,
  Grid,
  Col,
  H3,
  Form,
  } from 'native-base';
  import BackButton from './backButton';
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

class Login extends Component {
  constructor(props) {
    super(props);
    setI18nConfig(); // set initial config
     this.state = {         
          tel: "",
          password:"",
          display:'flex',
          isLoading: false,
          lang:"",
          test:"",
    }
    this.goToMainPage = this.goToMainPage.bind(this)
  }


  static navigationOptions = {
   header: null,
  };

  goToMainPage() {
    this.props.navigation.navigate("Main")
  }

  componentDidMount() {
    RNLocalize.addEventListener("change", this.handleLocalizationChange);
    console.log("langue :"+i18n.locale)
     
  }

  componentWillUnmount() {
    RNLocalize.removeEventListener("change", this.handleLocalizationChange);
  }

  handleLocalizationChange = () => {
    setI18nConfig();
    this.forceUpdate();
  };

  


  
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
     
     
        this.submit() 
      
    }
  }


  handleChange = (password) => {
    this.setState({password:password})
  }

  submit = () =>  {

    //this.setState({btn1Display:'none', btn2Display:'flex'})

    var bodyFormData = new FormData();

    const user = {
      tel: this.state.tel,
      password: this.state.password,
    };
    //let lang=i18n.locale;
    bodyFormData.append('tel',user.tel)
    bodyFormData.append('password',user.password)
    
    axios({
      method: 'post',
      url: `${Config.ApiBaseUrl}/login.php`,
      data: bodyFormData,
      config: { headers: {'Content-Type': 'multipart/form-data' }}
    })
    .then(async (response) =>{
        console.warn(response.data)
        if (response.data.success == 1){
          let user = response.data.login[0]
          await AsyncStorage.setItem('user', JSON.stringify({ user }));
          let value = await AsyncStorage.getItem('user')
          console.warn(value)

          Toast.show(translate("login.success_connexion"), Toast.SHORT)
          this.props.navigation.navigate("Main");
         
        }else if (response.data.success == 3){
          Toast.show(translate("login.incorrect_password"), Toast.LONG)
          this.setState({
            isLoading: false,
            display: 'flex'
          })
        } 
        else if (response.data.success == 0){
          Toast.show(translate("login.error_connexion"), Toast.LONG)
          this.setState({
            isLoading: false,
            display: 'flex'
          })
        } 
        else if (response.data.success == 2){
          Toast.show(translate("login.incorrect_phone"), Toast.LONG)
          this.setState({
            isLoading: false,
            display: 'flex'
          })
        } 

      }).catch((err) => {
        this.setState({
          isLoading: false,
          display: 'flex'
        })
       
      });
  }

  // Render any loading content that you like here
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
            <H3 style={{fontSize:hp('2.2%')}}>{translate("login.text_connexion")} </H3>
          </View>

          <Form style={{marginTop: hp('5')}}>

           
            <Item rounded style={{ color:'#b0bec5', marginBottom:hp('2%')}}>
              <Icon active name={Platform.OS === "ios" ? "ios-person" : "md-person"} size={24} style={{marginRight:wp('3%'), marginLeft:wp("3%"), color:'green' }} /> 
                <TextInput
                  style={{fontSize:hp(2.2), }}
                  // type={'cel-phone'}
                  keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
                  placeholder={translate("login.phone_number")} 
                  value={this.state.tel}
                    onChangeText={(text) => {
                    this.setState({
                      tel: text
                  })
                }}
              />                  
            </Item>
            <Item rounded style={{ color:'#b0bec5'}}>
              <Icon active name={Platform.OS === "ios" ? "ios-key" : "md-key"} size={24} style={{ marginRight:wp('2.8%'), marginLeft:wp("3%"), color:'green'}} /> 
              <Input 
                style={{}} 
                placeholder={translate("login.password")}
                onChangeText={this.handleChange}
                value={this.state.password}
                secureTextEntry
              />
            </Item>
          </Form>

          <Grid style={{ marginTop: 20}}>   
            <Col size={4}>
             
            </Col>
            <Col size={4}>
              <TouchableHighlight
                onPress={() => {
                  this.props.navigation.navigate("Forgetpass");
                }}>  
                  <Text style={{color:'rgba(96,100,109, 1)', marginTop: hp('3'), marginBottom:hp('2%'), fontWeight:"bold", marginLeft:wp('5%')}}> {translate("login.text_forgetpassword")}</Text>            
              </TouchableHighlight>
            </Col>
          </Grid>
          
          <Button rounded success style={{marginTop: hp('3')}}
           onPress={() => {
             if(this.state.isLoading == false){                
                ((this.state.tel).length != 0 && (this.state.password).length != 0) ? this.ShowHideActivityIndicator() : Toast.show("SVP, remplissez vos formulaires", Toast.SHORT)
             }            
           }} 
           block /*style={{ backgroundColor: "#015483", marginTop: 30, borderRadius:5, display:this.state.btn1Display}}*/>

            {
             this.state.isLoading ?  <ActivityIndicator size="large" color="#fff" /> : null
            }
            <Text style={{color: "#fff", fontWeight:"bold", fontSize:hp('2'), display:this.state.display}}>{translate("login.login")} </Text>
          </Button>

          <TouchableHighlight style={{ alignContent:'center', alignItems:'center'}}
            onPress={() => {
               this.props.navigation.navigate("Home1");
            }}>
          
            <Text style={{color: "gray", fontWeight:"bold", fontSize:hp('2'), marginTop: hp('2.5')}}>
           <BackButton/>{translate("back")} </Text>
          </TouchableHighlight>
          
        </Content>

      </ScrollView>

      {
        /* 
        <View style={styles.tabBarInfoContainer}>
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
              size={32} color="#ffc400" 
            />
            
            </View>
          </TouchableHighlight>
        </View> 
        */
    }

    </View>

    </Container>
    );
  }
}

const styles = StyleSheet.create({
  formContent: {
    marginTop: -70
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
    marginBottom: 30,
  },
  welcomeImage: {
    width: 300,
    height: 200,
    resizeMode: 'contain',
    marginTop: 10,
    marginBottom:30,
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



export default Login

