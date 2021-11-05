import React, {Component} from 'react';
import {I18nManager,TextInput,RefreshControl,PermissionsAndroid,Platform,ScrollView,StyleSheet,Modal,Text,ToastAndroid,View,Image,SafeAreaView,TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { CheckBox } from 'react-native-elements';
import axios from 'axios';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-community/async-storage';
import { Separator,Container, Content, Tab, Tabs, StyleProvider,Card, CardItem,Body,Button,Header,Title,List, ListItem } from 'native-base';

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



export default class ResultImage extends Component {

	constructor(props) {
		super(props);
		setI18nConfig(); // set initial config
		 this.state = {         
			produits:this.props.navigation.state.params.produits,
			latitude:this.props.navigation.state.params.latitude,
			longitude:this.props.navigation.state.params.longitude,
			modalVisible:false,
			checked1:false,
			checked2:false,
			checked3:false,
			checked4:false,
			checked5:false,
			star:'',
			produit_id:''
		}
	this.avis=''
	this.notation=this.notation.bind(this)

	
	  }

	  static navigationOptions = ({ navigation, navigate }) => ({
		title: 'Loussi',
		gestureEnabled: false,
		headerStyle: {
		  backgroundColor:'green',
		},
		headerTitleStyle: { color:'#fff', },
		headerTintColor: '#fff',
			
	  });

	  async componentDidMount() {
		RNLocalize.addEventListener("change", this.handleLocalizationChange); 
	  }
	
	  async componentWillUnmount() {
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

	  dismissModal() {
		this.setState({
		  modalVisible: false,
		});
	  }
	
	  
	
	  setModalVisible(visible,id) {
		this.setState({
		  modalVisible: visible,
		  produit_id:id
		});
	  }

	  notation=async (avis,star) =>{
			
		const value = await AsyncStorage.getItem('user');
		let id = JSON.parse(value).user.id
		console.warn('identifiant :'+id);
		const bodyFormData = new FormData();
		bodyFormData.append('obs',avis)
		bodyFormData.append('star',star)
		bodyFormData.append('id',id)
		bodyFormData.append('produit_id',this.state.produit_id)
		this.showAlert()
		axios({
		method: 'post',
		url: `${Config.ApiBaseUrl}/notes.php`,
		data: bodyFormData,
		config: { headers: {'Content-Type': 'multipart/form-data' }}
		}).then( async (response) => {
			if (response.data.success == 0){
			this.setState({
				showAlert: false,
			})
				//Toast.show(translate("Produit non trouvé"), Toast.LONG)
				alert(translate("recherche_text.product_not_found"))
				
			}else if (response.data.success == 1){
					this.setState({
						showAlert: false,
					})
					alert(translate("recherche_text.opinion_valid"))

				

			} 
			
			
		}).catch((error) => {
			console.warn(error);
			this.hideAlert()
			alert("Erreur connexion ")
		});

	//}
	
  }

  _avis(text){
	this.avis=text
   }

	  


	   
	  
	

	
		
    render() {
		let {produits} = this.state
 	 return (		
        <Container>
			
			<Separator style={{}} bordered>  
              <Text> {translate("recherche_text.list_of_product")} </Text>    
            </Separator> 

       <ScrollView
        refreshControl={      
          <RefreshControl
            refreshing={this.state.refreshing}
			onRefresh={this._onRefresh}
			
      
          />
          
        }>
          <Content padder style={{marginBottom:20}}>

            {
              produits.map((item, key) => (
                <Card> 
                  <CardItem>
                    <Body>
                      
                {item.urlimage=="" ?
                   <Text>.</Text>
                  :
                  <CardItem cardBody>
                    <Image source={{uri: item.urlimage}} style={{height: 200, width: null, flex: 1}}/>
                  </CardItem>
                 }
                      <Text style={{fontSize:hp(2.5), fontWeight:'bold',marginTop:hp(3), marginBottom:hp(1)}}>{item.produit_name}----{item.poids}</Text>
                      <Text style={{fontSize:hp(2.2), marginBottom:hp(1), display:"flex",color:'green'}}>{translate("recherche_text.structure")} : {item.societe_name}</Text>
					  <Text style={{fontSize:hp(2.2), marginBottom:hp(1), display:"flex",color:'green'}}>{translate("recherche_text.category")} : {item.categorie_name}</Text>
                      {item.star==""?
					   <Text>{translate("recherche_text.not_opinion")}</Text>
					   :
					   <Text style={{fontSize:hp(2.5), fontWeight:'bold', marginBottom:hp(1)}}>{translate("recherche_text.quality_of_product")} : {item.star}/5</Text>
					  }
					  <View style={{ flexDirection:'row', flex: 1,alignContent:'center', alignItems:'center',justifyAlign:'center'}}>    
						<SafeAreaView style={{flex: 1}}>  
							<Button style={{ marginVertical:hp(1), height:hp('4%')}} success
								onPress={
								()=>{
									this.props.navigation.push("Boutiques",{idproduit:item.id,recherche_id:item.recherche_id,lat:this.state.latitude,long:this.state.longitude,urlimage:item.urlimage,produit:item.produit_name});
									
								}
								}
							>
								<Text style={{ marginHorizontal:wp('4%'), color:"#fff"}}>{translate("recherche_text.place_of_product")}</Text>
							</Button>
					  </SafeAreaView> 

						
						<Button style={{flex:1, marginVertical:hp(1), height:hp('4%')}} warning
								onPress={
								()=>{
									this.setModalVisible(true,item.id)
								}
								}
							>
								<Icon active name={Platform.OS === "ios" ? "ios-pencil-sharp" : "md-pencil-sharp"} size={24} style={{marginRight:wp('3%'), marginLeft:wp("3%"), color:'green' }} /> 
								<Text style={{ marginHorizontal:wp('4%'), color:"#fff"}}>{translate("recherche_text.avis")}</Text>
							</Button>
           			 </View>
                     

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
          //title={translate("recherche_text.awesome_title")}
          message={translate("recherche_text.awesome_message")}
          closeOnTouchOutside={false}
          closeOnHardwareBackPress={true}
          onDismiss={() => {
            this.hideAlert()
          }}
        /> 

		<Modal
            animationType="slide"
            transparent={false}
            visible={this.state.modalVisible}
            onRequestClose={() => {
              this.setModalVisible(!this.state.modalVisible);
            }}>

          <Container  style={{backgroundColor:"#FFF" }}>   
            <Header style={{backgroundColor:"green"}}>
            
              <Body>
                <Title>{translate("recherche_text.title_avis")} </Title>
              </Body> 
            </Header>
			<ScrollView>
            <Content padder>
              {/*
              <Text style={{fontSize:hp('2.2'), marginBottom:hp(5)}}>
              {mess1}
              </Text>
              */
              }
              <Text style={{alignContent:'center', fontWeight:'bold', fontSize:hp('2.2'), marginBottom:hp(5)}}>
           {translate("recherche_text.infos_avis")}
              </Text>
              
                <View style={{borderWidth:2,flex: 1,alignContent:'center', alignItems:'center',justifyAlign:'center'}}>
                  <TextInput 
                  onChangeText={(text)=>this._avis(text)} 
				  
                  placeholder="Votre avis"
                  /> 
                </View> 


				<Text style={{fontSize:hp(2.2), marginTop:hp(3),marginBottom:hp(1), display:"flex",color:'green'}}>{translate("recherche_text.indicate_note")}</Text>
					
				<List>
                        <ListItem>
							<CheckBox checked={this.state.checked1} 
							title="J'ai détesté"
							checkedIcon='dot-circle-o'
							uncheckedIcon='circle-o'
							checkedColor='red'
							onPress={() => this.setState({checked1: !this.state.checked1,star:1,
							                              checked2:false,checked3:false,checked4:false,checked5:false})}
							 />
                        </ListItem>
                        <ListItem>
							<CheckBox checked={this.state.checked2} 
							title="je n'ai pas aimé"
							checkedIcon='dot-circle-o'
							uncheckedIcon='circle-o'
							checkedColor='orange'
							onPress={() => this.setState({checked2: !this.state.checked2,star:2,
								checked1:false,checked3:false,checked4:false,checked5:false})}
							 />
                        </ListItem>
						<ListItem>
							<CheckBox checked={this.state.checked3} 
							title="Acceptable"
							checkedIcon='dot-circle-o'
							uncheckedIcon='circle-o'
							checkedColor='violet'
							onPress={() => this.setState({checked3: !this.state.checked3,star:3,
								checked2:false,checked1:false,checked4:false,checked5:false})}
							 />
                        </ListItem>
						<ListItem>
							<CheckBox checked={this.state.checked4} 
							title="J'ai bien aimé"
							checkedIcon='dot-circle-o'
							uncheckedIcon='circle-o'
							checkedColor='purple'
							onPress={() => this.setState({checked4: !this.state.checked4,star:4,
								checked2:false,checked3:false,checked1:false,checked5:false})}
							 />
                        </ListItem>
						<ListItem>
							<CheckBox checked={this.state.checked5} 
							title="J'ai adoré"
							checkedIcon='dot-circle-o'
							uncheckedIcon='circle-o'
							checkedColor='green'
							onPress={() => this.setState({checked5: !this.state.checked5,star:5,
								checked2:false,checked3:false,checked4:false,checked1:false})}
							 />
                        </ListItem>
                    </List>
                            

              

              <View style={{ flexDirection:'row', flex: 1,alignContent:'center', alignItems:'center',justifyAlign:'center'}}>    
              <SafeAreaView style={{flex: 1}}>  
                  <TouchableOpacity
                  onPress={() => {
                    if(this.avis.length >0 && this.state.star!=''){
                       //this.showAlert()
                       this.dismissModal()
                       this.notation(this.avis,this.state.star)   
                    }
                    else{ 
                      alert(translate("recherche_text.field_avis"))
                       
                
                    }
                    
                  
                  }}
                  style={styles.button2}>
                    <Text style={{fontWeight:'bold'}} >{translate("btn_send")}</Text>
                </TouchableOpacity>          
             </SafeAreaView> 

             <SafeAreaView style={{flex: 1}}> 

             <TouchableOpacity
                  onPress={() => {
                    this.dismissModal()
                  
                  }}
                  style={styles.button3}>
                    <Text style={{fontWeight:'bold'}}>{translate("cancel")}</Text>
                 </TouchableOpacity>            
             </SafeAreaView> 
              </View>
             
             
            </Content>
	</ScrollView>
          </Container>
      </Modal>      
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
		borderColor:'green',
		paddingLeft:5,
		marginTop: hp('1')
	},
	button2: {
		backgroundColor: 'green',
		paddingVertical: 5,
		width: '90%',
		alignItems: 'center',
		borderRadius: 5,
		marginTop: 20,
	},
	button3: {
	  backgroundColor: 'red',
	  paddingVertical: 5,
	  width: '90%',
	  alignItems: 'center',
	  borderRadius: 5,
	  marginTop: 20,
	}
 });