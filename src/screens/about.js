
import React, { Component } from "react";
//import MyWebView from '../../components/mywebview'
import {
  Text, View, TouchableHighlight, StyleSheet, Platform, Image, Linking,I18nManager
} from 'react-native';
import { Container, Content, H2, Button, Grid, Col, Row, Thumbnail,Separator  } from "native-base";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import * as RNLocalize from "react-native-localize";
import i18n from "i18n-js";
import memoize from "lodash.memoize"; // Use for caching/memoize for better performance


class About extends Component {
  constructor(props) {
    super(props);
    
  }
  static navigationOptions = {
    
    title:"Loussi",
    gesturesEnabled: false,
    headerStyle: {
      backgroundColor:'green',
    },
    headerTitleStyle: { color:'#fff', },
    headerTintColor: '#fff'
    
  };



  // Render any loading content that you like here
  render() {
    return (
        <Container>
           
          <Content padder>
          <Separator style={{}} bordered>  
              <Text style={{fontWeight:'bold', alignContent:'center', alignItems:'center',justifyContent:'center'}}> About </Text>    
            </Separator>
            <View style={{}}>
            <H2 style={{fontWeight:'bold'}}>{translate("about.context_title")}</H2>
              <Text style={{fontSize:hp('2.3'), marginBottom:hp('1')}}>
              {translate("about.context")}
            </Text>   
             

              <H2 style={{ marginBottom:hp('2'), fontWeight:'bold'}}>Contactez-nous</H2>
              <Text style={{fontSize:hp('2.3'), marginBottom:hp('1')}}>Téléphone : +237 696960054</Text>
              <Text style={{fontSize:hp('2.3'), marginBottom:hp('1')}}>E-mail : pyrruskoudjou@yahoo.fr</Text>
              <H2 style={{ marginBottom:hp('2'), fontWeight:'bold'}}>Si vous agroindustriel</H2>
              <Grid style={{marginTop:wp(5), marginBottom:hp(2)}}>
            <Row>
              <Col >
                <TouchableHighlight 
                  onPress={() => Linking.openURL('https://chat.whatsapp.com/7PzUlg77e105dPgzofzCy4')}
                >
                  <Row>
                    <Col size={3}>
                      <Thumbnail small source={What} /> 
                    </Col>
                    <Col size={5}>
                      <Text style={{marginTop:hp(1)}}>créer votre compte</Text>
                    </Col>
                  </Row>
                </TouchableHighlight>
               
              </Col>
              
            </Row>
          </Grid>
              <Text style={{fontSize:hp('2.3'), marginBottom:hp('1'), fontWeight:'bold'}}>Developped by CLINICAGRO SARL</Text>

            </View>
          </Content>
        </Container>
    );
  }
}

const styles = StyleSheet.create({
 
})

export default About;

