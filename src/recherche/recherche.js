
import React, { Component } from "react";
import {
  Text, View, TouchableHighlight,TouchableOpacity, Platform, Image, FlatList, ScrollView, StyleSheet, RefreshControl,I18nManager
} from 'react-native';
import axios from 'axios';
import { 
  Content,
  ListItem,
  Button,
  Separator,
  Thumbnail,
  Container,
  List,
  Body, Left,H2,H3,H4,Grid,
  Row,Icon,
  Col } from "native-base";
  import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
  import ImagePicker from "react-native-image-picker";
  //var ImagePicker = require ('react-native-image-picker');
 import AwesomeAlert from 'react-native-awesome-alerts';
 const Config = require('../../config');

class RechercheImage extends Component {
  constructor(props) {
    super(props);

    this.state = {
	  tel:'',
      pickedImage: null,
      photo: null,
      refreshing: false,
      data:[],
      showAlert: false,
      display:'none'
    }
  }

  static navigationOptions = {
    
    title:'Recherche Image',
    gestureEnabled: false,
    headerStyle: {
      backgroundColor:'green',
    },
    headerTitleStyle: { color:'#fff', },
    headerTintColor: '#fff'
    
  };
  
  reset = () => {
    this.setState({
      pickedImage: null
    });
  }

  showAlert = () => {
    this.setState({
      showAlert: true
    });
  };

  hideAlert = () => {
    this.setState({
      showAlert: false
    });
  }

  async extractor(){
        
    console.log("tester")   
    const form= new FormData();     
        form.append('image', {
          uri: this.state.photo.uri,
          name: 'myphoto.png',
          type: 'image/png'
        });
       
    
        this.showAlert()
    
        axios({
          method: 'post',
          url: `${Config.ApiBaseUrl}/extractor.php`,
          data: form,
          config: { headers: {'Content-Type': 'multipart/form-data' }}
        }).then( (response) => {
            console.warn(response.data);
            let data = response.data.extractors[0];
            if(response.data.success==1){  
              this.setState({
               data:data,
               showAlert:false
             }) 
             this.hideAlert()
             //this.props.navigation.navigate("Extractor", {data:this.state.data,photo: this.state.photo});
        
      
             }else if (response.data.success== 0){ 
              
         
             }
             
    
           
          }).catch((error) => {
            console.warn(error);
            alert("Error ")

           
            this.hideAlert()
          });
       
          
      
  }

  handleImage () {
    ImagePicker.showImagePicker({title:'Prendre une image', maxWidth: 700, maxHeight: 700}, res => {
      if (res.didCancel) {
        console.warn("User cancelled!");
      } else if (res.error) {
        console.warn("Error", res.error);
      } else {
        console.warn(res);
        this.setState({
          pickedImage: { uri: res.uri },
          display:'flex',
          photo:res,
        });
        //this.props.navigation.push("Prediction", { photo:res });
      }
    });

  }



  // Render any loading content that you like here
  render() {
    let i = 0;
    let {showAlert,display,photo} = this.state
    return (
      <Container>
        <ScrollView
          >
          <Content>

          <View style={{ width: wp('100%'), alignItems: 'center', justifyContent: 'center',  display:display}}>
            {photo && (
              <Image
                source={{ uri: photo.uri }}
                style={{ width: wp('100%'), height: 500 }}
              />
            )} 
          </View>

          <View style={{marginTop:hp('10%'), alignContent:'center', alignItems:'center',display:display}}>
            <Button rounded success style={{width:wp('90%')}}
              onPress={() => {
                
                console.warn("Url photo : "+photo.path)
                this.extractor()
                //this.checkAbonnement()
                //this.sendToNodeServer()
                //this.diagnostic()
              }} 
            >
              <Text style={{color: "#fff", fontWeight:"bold", fontSize:hp('2'), marginHorizontal:wp('22%')}}>J'ai besoin de ce produit</Text>
            </Button>
           </View>   
               
                             
          </Content>
          </ScrollView>
          <View style={{marginBottom:100,flex:1, backgroundColor: '#f3f3f3'}}>
          <Button warning iconLeft  rounded 
              style={{width:wp('50%'), marginBottom: hp('2%'), paddingRight:wp('8%'),
                borderWidth:1,
                borderColor:'rgba(0,0,0,0.2)',
                alignItems:'center',
                justifyContent:'center',
                position: 'absolute',                                          
                 botttom:60,                                                                                          
                right: 10,               
              }}

              onPress={() => {
                this.handleImage()
              }}>
                <Icon name='camera' style={{color:'green'}} />
                <Text>Prendre une image</Text>
            </Button>  
           </View>  
          
          
        <AwesomeAlert
          show={showAlert}
          showProgress={true}
          title="Recherche produit en cours ..."
          message=" Veuillez patienter un instant."
          closeOnTouchOutside={false}
          closeOnHardwareBackPress={true}
          onDismiss={() => {
            this.hideAlert()
          }}
        /> 
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  
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
        elevation: 10,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#eceff1',
    paddingVertical: 15,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
  
})


export default RechercheImage;

