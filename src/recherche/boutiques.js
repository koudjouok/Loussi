import React, {Component} from 'react';
import {I18nManager,TextInput,RefreshControl,PermissionsAndroid,Platform,ScrollView,StyleSheet,Text,ToastAndroid,View,Linking,Image,SafeAreaView,TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
  } from 'react-native-popup-menu';
  import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
  import AsyncStorage from '@react-native-community/async-storage';
  import { Separator,Container, Content, Tab, Tabs, StyleProvider,Card, CardItem,Body,Button,H3 } from 'native-base';
import Logout from './logout';
import AwesomeAlert from 'react-native-awesome-alerts';

import * as RNLocalize from "react-native-localize";
import i18n from "i18n-js";
import memoize from "lodash.memoize"; // Use for caching/memoize for better performance
const Config = require('../../config');
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

import geolib from 'geolib';
import Geolocation from 'react-native-geolocation-service';

export default class Boutiques extends Component {

	constructor(props) {
		super(props);
		setI18nConfig(); // set initial config
		 this.state = {         
			tel: "",
			refreshing: false,
			data:[],
			listeuser:[],
			user:{},
			showAlert: false,
			latitude: this.props.navigation.state.params.lat,
			longitude: this.props.navigation.state.params.long,
            idproduit:this.props.navigation.state.params.idproduit,
			recherche_id:this.props.navigation.state.params.recherche_id,
			produit:this.props.navigation.state.params.produit,
			urlimage:this.props.navigation.state.params.urlimage,
			affiche:false
		}

    this._Recherche=this._Recherche.bind(this)
	
	  }

	  static navigationOptions = ({ navigation, navigate }) => ({
		title: 'Loussi',
		gestureEnabled: false,
		headerStyle: {
		  backgroundColor:'green',
		},
		headerTitleStyle: { color:'#fff', },
		headerTintColor: '#fff',
		
		//<Button transparent onPress={()=>{ _this.showDialog(true)}}><Icon name='more' size={32} style={{color:'#fff', marginRight:wp('4')}}> </Icon></Button> ,
		
	  });

	  initiateWhatsApp = (tel,produit,boutique,adresse,prix,distance,taxi,rayon) => {
		// Check for perfect 10 digit length
	   
		        let message1 =translate("boutiques.whatsapp.message1")+produit+"* .";
				let message2 =translate("boutiques.whatsapp.message2")+boutique+"* .";
				let message3 =translate("boutiques.whatsapp.message3")+adresse+"* .";
				let message4 =translate("boutiques.whatsapp.message4")+prix+"* .";
				let message5 =translate("boutiques.whatsapp.message5")+distance+"* .";
				let message6 =translate("boutiques.whatsapp.message6")+taxi+"* .";
				let message7 =translate("boutiques.whatsapp.message7")+rayon+"* .";
				let message8 =translate("boutiques.whatsapp.message8");
				let message =message1+message2+message3+message4+message5+message6+message7+message8;

		let url =
		  'whatsapp://send?text=' + 
		   message +
		  '&phone=+' + tel;
		Linking.openURL(url)
		  .then((data) => {
			console.log('WhatsApp Opened');
	
		  })
		  .catch(() => {
			alert(translate("register.whatsapp_not_installed"));
			
		  });
	  };

	  componentDidMount() {
		RNLocalize.addEventListener("change", this.handleLocalizationChange);
		this._Recherche();
		 
	  }
	
	  componentWillUnmount() {
		RNLocalize.removeEventListener("change", this.handleLocalizationChange);
	  }
	
	  handleLocalizationChange = () => {
		setI18nConfig();
		this.forceUpdate();
	  };

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


	  _Recherche=async () =>{
		this.showAlert()

		
		const bodyFormData = new FormData();
		bodyFormData.append('produit_id',this.state.idproduit)
		bodyFormData.append('recherche_id',this.state.recherche_id)
		bodyFormData.append('lat',this.state.latitude)
		bodyFormData.append('long',this.state.longitude)
		
		axios({
		  method: 'post',
		  url: `${Config.ApiBaseUrl}/boutiques.php`,
		  data: bodyFormData,
		  config: { headers: {'Content-Type': 'multipart/form-data' }}
		}).then( async (response) => {
			console.warn('tab1',response.data.boutiques);

			if(response.data.boutiques==undefined){
				this.setState({
					showAlert: false
				})
					//Toast.show("Ce produit n'est referencé dans aucun supermarché pour l'instant.", Toast.LONG)
					alert(translate("boutiques.product_not_register"))
					//this.props.navigation.navigate("Tabs")
			}


			if (response.data.success == 0){
			  this.setState({
				showAlert: false
			})
				//Toast.show("Ce produit n'est referencé dans aucun supermarché pour l'instant.", Toast.LONG)
				alert(translate("boutiques.product_not_register"))
				//this.props.navigation.navigate("Tabs")
				
			  }else if (response.data.success == 1){
				this.setState({
					data: response.data.boutiques,
					showAlert: false,
					affiche:true
				})

			} 
			
			
		  }).catch((error) => {
			console.warn(error);
			this.hideAlert()
			alert("Erreur connexion ")
		  });
	  }
	  
	  localisationRayon=async (boutique_id,produit,boutique,adresse,prix,distance,taxi,rayon) =>{
		this.showAlert()
		const value = await AsyncStorage.getItem('user');
		let id = JSON.parse(value).user.id
		let tel = JSON.parse(value).user.tel
		console.log('identifiant :'+id);
		console.log('telephone :'+tel);
		const bodyFormData = new FormData();
		bodyFormData.append('boutique_id',boutique_id)
		bodyFormData.append('produit_id',this.state.idproduit)
		bodyFormData.append('recherche_id',this.state.recherche_id)
		
		axios({
		  method: 'post',
		  url: `${Config.ApiBaseUrl}/boutiqueselectionne.php`,
		  data: bodyFormData,
		  config: { headers: {'Content-Type': 'multipart/form-data' }}
		}).then( async (response) => {
			console.warn('tab1',response.data.produits);
			if (response.data.success == 0){
			  this.setState({
				showAlert: false
			})
				Toast.show(translate("boutiques.product_not_found"), Toast.LONG)
				alert(translate("boutiques.product_not_found"))
				
			  }else if (response.data.success == 1){
				this.setState({
					showAlert: false
				})

				this.initiateWhatsApp(tel,produit,boutique,adresse,prix,distance,taxi,rayon)
			} 
			
			
		  }).catch((error) => {
			console.warn(error);
			this.hideAlert()
			alert("Erreur connexion ")
		  });
	  }
	 

	  

	  
	

	
		
    render() {
		let {data, produits, showAlert} = this.state
 	 return (		
        <Container>
			 <Separator style={{}} bordered>  
              <Text> {translate("boutiques.list_of_shop")} </Text>    
            </Separator> 
       <ScrollView
        refreshControl={      
          <RefreshControl
            refreshing={this.state.refreshing}
			onRefresh={this._onRefresh}
			
      
          />
          
        }>
          <Content padder style={{marginBottom:20}}>

		  <View style={{ flexDirection:'row', flex: 1,alignContent:'center', alignItems:'center',justifyAlign:'center'}}>    
				<SafeAreaView style={{flex: 1}}>  
					<Card> 
						<CardItem>
							<CardItem cardBody>
										<Image source={{uri: this.state.urlimage}} style={{height: 100, width: null, flex: 1}}/>
							</CardItem>
					</CardItem> 
        		   </Card>
				</SafeAreaView> 

				<SafeAreaView style={{flex: 1}}>
				<Text style={{fontSize:hp(2.2), marginBottom:hp(1), display:"flex",color:'green',fontWeight:'bold'}}>{translate("boutiques.product_name")} : {this.state.produit}</Text>
				</SafeAreaView>
            </View>
		 
		  
            {
		     !this.state.affiche ?
			 <Text>{translate("boutiques.shop_unavailable")}</Text>
			:		
              data.map((item, key) => (
                <Card> 
                  <CardItem>
                    <Body>
					<H3 >{translate("boutiques.shop")} : </H3>
                      <Text style={{fontSize:hp(2.5), fontWeight:'bold', marginBottom:hp(1),color:'green'}}>{item.boutique_name}</Text>
					  <H3>{translate("boutiques.address_shop")} : </H3>
                      <Text style={{fontSize:hp(2.2), marginBottom:hp(1), display:"flex",color:'green'}}> {item.adresse}</Text>
					  <H3 >{translate("boutiques.price_product")} : </H3>
					  <Text style={{fontSize:hp(2.2), marginBottom:hp(1), display:"flex",color:'green'}}> {item.prix} FCFA</Text>
					  <H3>{translate("boutiques.meter")} : </H3>
					  <Text style={{fontSize:hp(2.2), marginBottom:hp(1), display:"flex",color:'green'}}> {item.distance}</Text>
					  <H3 >{translate("boutiques.price_transport")} : </H3>
                      <Text style={{fontSize:hp(2.2), marginBottom:hp(1), display:"flex",color:'green'}}> {item.transport}</Text>
                      <Button style={{ marginVertical:hp(1), height:hp('4%')}} success
                        onPress={
                          ()=>{
                           this.localisationRayon(item.id,this.state.produit,item.boutique_name,item.adresse,item.prix,item.distance,item.transport,item.localisation_rayon)
                          }
                        }
                      >
                        <Text style={{ marginHorizontal:wp('4%'), color:"#fff"}}>{translate("boutiques.buy_product")}</Text>
                      </Button> 
                     

                    </Body>    
                  </CardItem>
                </Card>    
                
              ))
            }


          </Content>
         
          </ScrollView>

         
        <AwesomeAlert
          show={this.state.showAlert}
          showProgress={true}
          title={translate("recherche_text.awesome_title")}
          message={translate("recherche_text.awesome_message")}
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
	backButton: {
		height: 44,
		width: 44,
		justifyContent: 'center',
		alignItems: 'center',
	  },
	  tabBarInfoText: {
		fontSize: 17,
		color: 'rgba(96,100,109, 1)',
		textAlign: 'center',
	  },
	  navigationFilename: {
		marginTop: 5,
	  },
	  main_container:{
		flex:1
	},
	textinput:{
		marginLeft:5,
		marginRight:5,
		height:50,
		borderColor:'#000000',
		borderWidth:1,
		paddingLeft:5,
		marginTop: hp('1')
	}
 });