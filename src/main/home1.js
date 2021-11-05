
import React, { Component } from "react";
import axios from 'axios';
import Toast from 'react-native-simple-toast'
import {
  Text, View, TouchableHighlight, StyleSheet, Platform, Image, StatusBar, Modal,  ScrollView, AsyncStorage,
  RefreshControl,Keyboard, TouchableOpacity, Linking,I18nManager
} from 'react-native';

import { 
  Container,
  Content, 
  Separator,
  Grid,
  Row,
  Col,
  Thumbnail,H2,H3
} from 'native-base';
  import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
  } from 'react-native-popup-menu';
  import Icon from "react-native-vector-icons/Ionicons";
  const Config = require('../../config');
  import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
 
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




class Home1 extends Component {
  constructor(props) {
    super(props);
    setI18nConfig(); // set initial config

    this.state = {
      sugModalVisible: false,
      suggestion:'',
      user:{},
      refreshing: false,
      photo: null,
      pickedImage:'',
      sujet:'',
      produits:'',
      tmpmaladie:'',
      content:'',
      abonnement:'',
      display:'flex',
      isLoading: false,
      test:''
      
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
 


   render() {

    console.warn(this.props)

    return (
        <Container style={{backgroundColor:'#eceff1'}}>
        <StatusBar barStyle="default" backgroundColor="green" />
        <ScrollView
          refreshControl={      
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }>
          <Content padder>

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
           
          <Grid style={{marginLeft:10, marginBottom:10}}>
          <Row>
              <Col style={{textAlign:'center'}} size={8}>
                <Text style={{alignContent:'center',alignItems:'center',justifyContent:'center', flex:1,fontSize:hp('2')}}>
                    <H3>LOUSSI</H3> {translate("home1.message1")}
                </Text>
              </Col>
          </Row>

          <Row style={{ marginTop:hp('2')}}>
              <Col style={{textAlign:'center'}} size={8}>
                <Text style={{alignContent:'center',alignItems:'center',justifyContent:'center', flex:1,fontSize:hp('2')}}>
                    <H3>LOUSSI</H3> {translate("home1.message2")}
                </Text>
              </Col>
          </Row>

            <Row style={{ marginTop:hp('2')}}>
              <Col style={{textAlign:'center'}} size={8}>
                  <Text style={{fontSize:hp('2'),alignItems:'stretch',justifyContent:'center',flex:1,fontWeight:'bold'}}>
                  {translate("home1.message3")}
                  </Text> 

                  <Text style={{marginTop:hp('2'), fontSize:hp('2'),alignItems:'stretch',justifyContent:'center',flex:1}}>
                  <Icon name="add-circle" /> {translate("home1.message4")}
                  </Text>  

                  <Text style={{marginTop:hp('2'), fontSize:hp('2'),alignItems:'stretch',justifyContent:'center',flex:1}}>
                  <Icon name="add-circle" /> {translate("home1.message5")}
                  </Text>  

                  <Text style={{marginTop:hp('2'), fontSize:hp('2'),alignItems:'stretch',justifyContent:'center',flex:1}}>
                  <Icon name="add-circle" /> {translate("home1.message6")}
                  </Text> 
                          
              </Col>
            </Row>

            <Row style={{ marginTop:hp('2')}}>
              <Col style={{textAlign:'center'}} size={3}>
                  <Text style={{fontSize:hp('2'),alignItems:'stretch',justifyContent:'center',flex:1}}>
                <H3>{translate("home1.message7")}</H3> </Text>       
              </Col>  
            </Row>

           
            
         
           
          </Grid> 
            

            <Grid > 
              
              <Row>
                <Col style={{alignItems:'center', marginRight:wp('2')}} size={4}>
                  <TouchableOpacity 
                    onPress={() => {
                      //this.checkAbonnement("Culture")
                      this.props.navigation.navigate("Login")
                    }}>

                    <View style={{alignItems:'center', borderRadius: hp('2'), backgroundColor:'#fff', borderWidth:1, borderColor:'green', marginBottom:hp(2),}}>
                      <View style={{margin:wp(3),}}>
                      <Icon active name={Platform.OS === "ios" ? "ios-person" : "md-person"} size={24} style={{marginRight:wp('3%'), marginLeft:wp("3%"), color:'green' }} /> 
                        {/*<Thumbnail  large source={diagnostic} style={{ marginLeft:wp(8), marginRight:wp(8), marginTop:wp(6), marginBottom: hp(0.5)}} />*/}
                      </View>
                      <View style={{alignItems:'center', marginBottom:hp(1), borderTopColor:'#eceff1', paddingHorizontal:wp(3), borderTopWidth:1,}}>
                        <Text style={{fontSize:hp('2.5%'), marginTop:hp(1), color:'black', fontWeight:'bold', alignContent:'center'}}> {translate("home1.message8")} </Text> 
                        <Text style={{fontSize:hp('1.8%'), marginTop:hp(1), color:'gray', alignContent:'center'}}> {translate("home1.message9")} </Text> 
                      </View>
                    </View>
                  </TouchableOpacity>
                </Col>

                <Col style={{alignItems:'center', marginLeft:wp('2')}} size={4}>
                  <TouchableOpacity 
                    onPress={() => {
                      this.props.navigation.push("Register");
                    }}
                    >
                      <View style={{alignItems:'center', borderRadius: hp('2'), backgroundColor:'#fff', borderWidth:1, borderColor:'green', marginBottom:hp(2)}}>
                        <View style={{margin:wp(3),}}>
                        <Icon active name={Platform.OS === "ios" ? "ios-add" : "md-add"} size={24} style={{marginRight:wp('3%'), marginLeft:wp("3%"), color:'green' }} /> 
                         {/*<Thumbnail  large source={diagnostic} style={{ marginLeft:wp(8), marginRight:wp(8), marginTop:wp(6), marginBottom: hp(0.5)}} />*/}
                        </View>
                        <View style={{alignItems:'center', marginBottom:hp(1), borderTopColor:'#eceff1', paddingHorizontal:wp(3), borderTopWidth:1,}}>
                          <Text style={{fontSize:hp('2.5%'), marginTop:hp(1), color:'black', fontWeight:'bold', alignContent:'center'}}> {translate("home1.message10")} </Text> 
                          <Text style={{fontSize:hp('1.8%'), marginTop:hp(1), color:'gray', alignContent:'center'}}> {translate("home1.message11")}   </Text> 
                        </View>
                      </View>
                  </TouchableOpacity>
                </Col>
            
              </Row>
             
            
             
          </Grid>

          </Content>  
   
        </ScrollView>
        <TouchableOpacity>
          <Separator style={{alignItems:'center'}} bordered>  
            <Text> @CLINICAGRO SARL 2019.</Text>    
          </Separator>
        </TouchableOpacity>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
       // backgroundColor: '#fff',
      },
      contentContainer: {
        paddingTop: 10,
      },
      welcomeContainer: {
        alignItems: 'center',
        marginTop: 5,
        marginBottom: 20,
      },
    welcomeImage: {
        width: 300,
        height: 100,
        resizeMode: 'contain',
        marginTop: 10,
        marginTop:50,
        alignItems: 'center',
      },
      textWrapper: {
        flexWrap: "wrap",
        alignItems: "flex-start",
        flexDirection: "row",
        },
        textBlock: {
        flexWrap: "wrap",
        alignItems: "flex-start",
        flexDirection: "row",
        position: "absolute",
        left: 10
        },
        boldText: {
        fontWeight: "bold",
        },
        normalText: {
        }
})



export default Home1

