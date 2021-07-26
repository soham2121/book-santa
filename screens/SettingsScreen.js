import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert} from 'react-native';
import MyHeader from '../components/Header';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import db from '../config';
import firebase from 'firebase';

export default class SettingsScreen extends React.Component{
    constructor(){
        super();
        this.state = {
            emailid: '',
            fistname: '',
            lastname: '',
            address: '',
            contact: '',
            docid: '',
        }
    }

    getUserDetails = () => {
        var user = firebase.auth().currentUser;
        var email = user.email;
        db.collection('Users').where("email_Id","==",email).get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                var data = doc.data();
                this.setState({
                    emailid: data.email_id,
                    firstname: data.first_name,
                    lastname: data.last_name,
                    address: data.address,
                    contact: data.contact,
                    docid: doc.id,
                })
            })
        })
    }

    updateUserDetails = () => {
        db.collection('Users').doc(this.state.docid)
        .update({
            "first_name": this.state.fistname,
            "last_name": this.state.lastname,
            "address": this.state.address,
            "contact": this.state.contact
        })
        Alert.alert("Profile updated successfully")
    }

    componentDidMount(){
        this.getUserDetails();
    }

    render(){
        return(
            <SafeAreaProvider>
                <View style = {styles.container}>
                    <MyHeader title = "settings" navigation = {this.props.navigation}/>
                    <View style = {styles.formContainer}>
                        <TextInput 
                            style = {styles.formTextInput} placeholder = {"First Name"} maxLength = {8} onChangeText = {(text)=>{
                                this.setState({
                                    firstname: text
                                })
                            }}
                            value = {this.state.firstname}
                        />

                        <TextInput
                        style = {styles.formTextInput} placeholder = {"Second Name"} maxLength = {8} onChangeText = {(text)=>{
                            this.setState({
                                lastname: text
                            })
                        }}
                        value = {this.state.lastname}
                        />

                        <TextInput style = {styles.formTextInput} placeholder = {"Address"} multiline = {true} onChangeText = {(text)=>{
                                this.setState({
                                    address: text
                                })
                            }}
                            value = {this.state.address}
                        />
                    
                        <TextInput
                        style = {styles.formTextInput} placeholder = {"Contact"} maxLength = {10} onChangeText = {(text)=>{
                            this.setState({
                                contact: text
                            })
                        }}
                        value = {this.state.contact}
                        />

                        <TouchableOpacity style = {styles.button} onPress = {()=>{
                            this.updateUserDetails();
                        }}>
                            <Text style = {styles.buttonText}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaProvider>
        )}
    }

const styles = StyleSheet.create({
    container: {
        flex:1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    formContainer:{
        flex:1,
        width:'100%',
        alignItems: 'center'
    },
    formTextInput:{ width:"75%", height:35, alignSelf:'center', borderColor:'#ffab91', borderRadius:10, borderWidth:1, marginTop:20, padding:10, },
    button:{ width:"75%", height:50, justifyContent:'center', alignItems:'center', borderRadius:10, backgroundColor:"#ff5722", shadowColor: "#000", shadowOffset: { width: 0, height: 8, }, shadowOpacity: 0.44, shadowRadius: 10.32, elevation: 16, marginTop:20 },
    buttonText:{ fontSize:25, fontWeight:"bold", color:"#fff" }
})