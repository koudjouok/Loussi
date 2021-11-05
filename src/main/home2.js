
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
  Icon,
  Separator,
  Grid,
  Row,
  Col,
  Thumbnail
} from 'native-base';
  import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
  } from 'react-native-popup-menu';
  const Config = require('../../config');
  import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
  import ImagePicker from "react-native-image-picker";
import * as RNLocalize from "react-native-localize";
import i18n from "i18n-js";
import memoize from "lodash.memoize"; // Use for caching/memoize for better performance
const tr = require("googletrans").default;





class Home2 extends Component {
  constructor(props) {
    super(props);
    

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

 
 
  

  
  

 

  

  // Render any loading content that you like here
   render() {

    const { photo } = this.state

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
           
          <Grid style={{marginLeft:10, marginBottom:10}}>

          <Row>
              <Col style={{textAlign:'center'}} size={8}>
             <Text style={{alignContent:'center',alignItems:'center',justifyContent:'center', flex:1,fontSize:hp('2'),fontWeight:"bold"}}>Message 1</Text>
              </Col>
          </Row>

            <Row style={{ marginTop:hp('2')}}>
              <Col size={3}>
                  <Text style={{fontSize:hp('3')}}>Message 2</Text>       
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
                        <Thumbnail  large source={diagnostic} style={{ marginLeft:wp(8), marginRight:wp(8), marginTop:wp(6), marginBottom: hp(0.5)}} />
                      </View>
                      <View style={{alignItems:'center', marginBottom:hp(1), borderTopColor:'#eceff1', paddingHorizontal:wp(3), borderTopWidth:1,}}>
                        <Text style={{fontSize:hp('2.5%'), marginTop:hp(1), color:'black', fontWeight:'bold', alignContent:'center'}}> Login </Text> 
                        <Text style={{fontSize:hp('1.8%'), marginTop:hp(1), color:'gray', alignContent:'center'}}> Connectez- vous </Text> 
                      </View>
                    </View>
                  </TouchableOpacity>
                </Col>
            
              </Row>
              <Row>
              <Col style={{alignItems:'center', marginLeft:wp('2')}} size={4}>
                  <TouchableOpacity 
                    onPress={() => {
                      this.props.navigation.push("Register");
                    }}
                    >
                      <View style={{alignItems:'center', borderRadius: hp('2'), backgroundColor:'#fff', borderWidth:1, borderColor:'green', marginBottom:hp(2)}}>
                        <View style={{margin:wp(3),}}>
                          <Thumbnail  large source={veterinary} style={{ marginLeft:wp(8), marginRight:wp(8), marginTop:wp(6), marginBottom: hp(0.5)}} />
                        </View>
                        <View style={{alignItems:'center', marginBottom:hp(1), borderTopColor:'#eceff1', paddingHorizontal:wp(3), borderTopWidth:1,}}>
                          <Text style={{fontSize:hp('2.5%'), marginTop:hp(1), color:'black', fontWeight:'bold', alignContent:'center'}}> Inscription </Text> 
                          <Text style={{fontSize:hp('1.8%'), marginTop:hp(1), color:'gray', alignContent:'center'}}> Inscrivez-vous   </Text> 
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
 
})



export default Home2

