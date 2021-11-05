'use strict';
import React, { PureComponent } from 'react';
import {I18nManager,TextInput,RefreshControl,PermissionsAndroid,Platform,ScrollView,StyleSheet,Text,ToastAndroid,View,Image,SafeAreaView,TouchableOpacity} from 'react-native';
import axios from 'axios';
import { RNCamera } from 'react-native-camera';
import AwesomeAlert from 'react-native-awesome-alerts';
import AsyncStorage from '@react-native-community/async-storage';
import { Separator,Container, Content, Tab, Tabs, StyleProvider,Card, CardItem,Body,Button } from 'native-base';
import Logout from './logout';
//import RNTextDetector from "react-native-text-detector";
import RNMlKit from 'react-native-firebase-mlkit';
//import TesseractOcr from 'react-native-tesseract-ocr';
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

const PendingView = () => (
  <View
    style={{
      flex: 1,
      backgroundColor: 'lightgreen',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
	   <TouchableOpacity onPress={() =>{		
	   } }>
	   		<Text>En attente d'activation</Text>
        </TouchableOpacity>
  
  </View>
);

export default class RechercheImage extends PureComponent {


	constructor(props) {
		super(props);
		setI18nConfig(); // set initial config
		this.state = {
		  tel:'',
		  photo:null,
		  data:[],
		  showAlert: false,
		  display:'none',
		  latitude: null,
		  longitude: null,
		  error: null,
		  ok:false,
		  mot_cherche:''
		}
		this.extractor=this.extractor.bind(this)
		this._recherche=this._recherche.bind(this)
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

	  async componentDidMount() {
		RNLocalize.addEventListener("change", this.handleLocalizationChange);
		const hasLocationPermission = await this.hasLocationPermission();

		if (!hasLocationPermission) {
			return;
		}
		
		 
	  }
	
	  async componentWillUnmount() {
		RNLocalize.removeEventListener("change", this.handleLocalizationChange);
		const hasLocationPermission = await this.hasLocationPermission();

		if (!hasLocationPermission) {
			return;
		}
	  }
	
	  handleLocalizationChange = () => {
		setI18nConfig();
		this.forceUpdate();
	  };

	  _getLocalisation =async(mot_cherche,photo)=>{
		console.log("Geolocalisation")
		console.log("OK: "+this.state.ok)
	    const hasLocationPermission = await this.hasLocationPermission();
		if (!hasLocationPermission) {
			return;
		}

		//this.requestLocationPermission();

		Geolocation.getCurrentPosition(
			(position) => {
			  this.setState({
				latitude: position.coords.latitude,
				longitude: position.coords.longitude,
				error: null,
			  });
			  this._recherche(mot_cherche,photo);
			},
			(error) => this.setState({ error: error.message }),
			{ enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
		  );
	  }

	  hasLocationPermissionIOS = async () => {
		const openSetting = () => {
		  Linking.openSettings().catch(() => {
			Alert.alert('Unable to open settings');
		  });
		};
		const status = await Geolocation.requestAuthorization('whenInUse');
	
		if (status === 'granted') {
		  return true;
		}
	
		if (status === 'denied') {
		  Alert.alert('Location permission denied');
		}
	
		if (status === 'disabled') {
		  Alert.alert(
			`Turn on Location Services to allow clinicAgro to determine your location.`,
			'',
			[
			  { text: 'Go to Settings', onPress: openSetting },
			  { text: "Don't Use Location", onPress: () => {} },
			],
		  );
		}
	
		return false;
	  };

	   hasLocationPermission = async () => {
		if (Platform.OS === 'ios') {
		  const hasPermission = await this.hasLocationPermissionIOS();
		  return hasPermission;
		}
	
		if (Platform.OS === 'android' && Platform.Version < 23) {
			this.setState({ok:true})
		  return true;
		}
	
		const hasPermission = await PermissionsAndroid.check(
		  PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
		 
		);
	
		if (hasPermission) {
			this.setState({ok:true})
		  return true;
		}
	
		const status = await PermissionsAndroid.request(
		  PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
		  {
			title: "Activez votre GPS",
			message:
			  "Activez votre service de localisation pour autoriser Loussi à déterminer votre position " +
			  "afin de vous fournir les coordonnées du supermarché le plus proche.",
			buttonNeutral: "Plutard",
			buttonNegative: "Annuler",
			buttonPositive: "OK"
		  }
		);
	
		if (status === PermissionsAndroid.RESULTS.GRANTED) {
			this.setState({ok:true});
		  return true;
		}
	
		if (status === PermissionsAndroid.RESULTS.DENIED) {
		  ToastAndroid.show(
			'Location permission denied by user.',
			ToastAndroid.LONG,
		  );
		  this.hideAlert1()
		} else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
		  ToastAndroid.show(
			'Location permission revoked by user.',
			ToastAndroid.LONG,
		  );
		  this.hideAlert1()
		}
	
		return false;
	  };




  render() {
    return (
      <View style={styles.container}>
        <RNCamera
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          //flashMode={RNCamera.Constants.FlashMode.on}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
         /* androidRecordAudioPermissionOptions={{
            title: 'Permission to use audio recording',
            message: 'We need your permission to use your audio',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}*/
        >
          {({ camera, status, recordAudioPermissionStatus }) => {
            if (status !== 'READY') return <PendingView />;
            return (
              <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
                <TouchableOpacity onPress={() => this.takePicture(camera)} style={styles.capture}>
                  <Text style={{ fontSize: 14 }}> SNAP </Text>
                </TouchableOpacity>
              </View>
            );
          }}
        </RNCamera>
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
      </View>
    );
  }

  takePicture = async function(camera) {
    const options = { quality: 0.5, base64: true,skipProcessing: true, forceUpOrientation: true };
    const data = await camera.takePictureAsync(options);
	//  eslint-disable-next-line
	this.showAlert()
	console.log(data.uri);
	const deviceTextRecognition = await RNMlKit.deviceTextRecognition(data.uri); 
	console.log('Text Recognition On-Device', deviceTextRecognition);
	
	if(deviceTextRecognition==""){
		alert("Recommencer la prise d'image de cet objet. S'il vous plait, veuillez améliorer la qualité de la prise d'image pour avoir des résultats satisfaisants.")
		this.hideAlert()		
	}else{
		this._getLocalisation(deviceTextRecognition,data)
	}
   
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

  async extractor(photo){
	this._getLocalisation();
    console.log("tester")   
    const form= new FormData();     
        form.append('image', {
          uri: photo.uri,
          name: 'myphoto.png',
          type: 'image/png'
		});
		if(this.state.latitude==null || this.state.longitude==null){
			alert("Veuillez activer votre service de localisation pour une meilleure expérience utilisation")
		}else{
			this.showAlert()
			axios({
			method: 'post',
			url: `${Config.ApiBaseUrl}/extractor.php`,
			data: form,
			config: { headers: {'Content-Type': 'multipart/form-data' }}
			}).then( (response) => {
				console.warn(response.data);
				let data = response.data.extractor[0];
				if(response.data.success==1){  
				this.setState({
					mot_cherche:data.mot_cherche,
				}) 
          
				//this._recherche(this.state.mot_cherche,photo)
				this.hideAlert()
				console.log("Mot recherché :"+this.state.mot_cherche)
				//this.props.navigation.navigate("Extractor", {data:this.state.data,photo: this.state.photo});
			
		
				}else if (response.data.success== 0){ 
					this.hideAlert()
					console.log("Mot recherché :"+this.state.mot_cherche)
					alert("Veuillez bien filmer la partie du produit où est marquée le nom du produit")
			
				}
				
			}).catch((error) => {
				console.warn(error);
				alert("Error ")

			
				this.hideAlert()
			});

		}
        
       
          
      
  }

  _recherche=async (mot_cherche,photo) =>{
		/*
		this.setState({latitude:null,longitude:null});
	    await this._getLocalisation();
		console.log("ok ok:"+this.state.ok)
		//this.showAlert()
		if(this.state.latitude==null || this.state.longitude==null){
			this.hideAlert()
			alert("Veuillez activer votre service de localisation pour une meilleure expérience utilisation")
			await this._getLocalisation();	
		}else{ */
			console.log("photo:"+photo.uri)
			let lang=i18n.locale;
			const value = await AsyncStorage.getItem('user');
			let id = JSON.parse(value).user.id
			console.warn('identifiant :'+id);
			const bodyFormData = new FormData();
			bodyFormData.append('mot_cherche',mot_cherche)
			bodyFormData.append('lang',lang)
			bodyFormData.append('id',id)
			bodyFormData.append('lat',this.state.latitude)
			bodyFormData.append('long',this.state.longitude)
			bodyFormData.append('urlimage', {
				uri: photo.uri,
				name: 'myphoto.png',
				type: 'image/png'
			});

			console.warn("latitude :"+this.state.latitude)
			console.warn("longitude :"+this.state.longitude)
		
		
			axios({
			method: 'post',
			url: `${Config.ApiBaseUrl}/recherche_image.php`,
			data: bodyFormData,
			config: { headers: {'Content-Type': 'multipart/form-data' }}
			}).then( async (response) => {
				console.warn('tab2',response.data.produits);
				if (response.data.success == 0){
				this.setState({
					showAlert: false
				})
					//Toast.show(translate("Produit non trouvé"), Toast.LONG)
					alert("Produit non trouvé. Recommencer la prise d'image de cet objet. S'il vous plait, veuillez améliorer la qualité de la prise d'image.")
					
				}else if (response.data.success == 1){
					this.setState({
						showAlert: false,
					})
					this.props.navigation.push("ResultImage",{produits:response.data.produits,latitude:this.state.latitude,longitude:this.state.longitude})
				} 
				
				
			}).catch((error) => {
				console.warn(error);
				this.hideAlert()
				alert("Erreur connexion ")
			});
		//}	
	
	
  }



}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
});