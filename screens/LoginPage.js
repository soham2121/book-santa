import React from 'react';
import { View, TouchableOpacity, TextInput, Text, StyleSheet, Alert, Modal, ScrollView, KeyboardAvoidingView } from 'react-native';
import db from '../config';
import firebase from 'firebase';
import SantaAnimation from '../components/santaclause';

export default class LoginPage extends React.Component{
    constructor(){
        super();
        this.state={
            emailId: '',
            password: '',
            firstName: '',
            lastName: '',
            address: '',
            contact: '',
            confirmPass: '',
            isModalVisible: 'false'
        }
    }

    userLogin = (emailId, password) => {
        firebase.auth().signInWithEmailAndPassword(emailId, password)
        .then(() => {
            this.props.navigation.navigate('drawer');
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            return Alert.alert(errorMessage, errorCode);
        })
    }   

    userSignUp = (emailId, password, confirmPass) => {
        if(password !== confirmPass){
            Alert.alert("Password doesnt match - Check your password")
        }
        else{
            firebase.auth().createUserWithEmailAndPassword(emailId, password)
            .then(() => {
                db.collection('users').add({
                    first_name: this.state.firstName,
                    last_name: this.state.lastName,
                    contact: this.state.contact,
                    email_id: this.state.emailId,
                    address: this.state.address
                })
                return Alert.alert('User added successfully',
                '',
                [
                    {text: 'ok', onPress: () => this.setState({
                        "isModalVisible": false
                    })}
                ]);
            })
            .catch(function(error){
                var errorCode = error.code;
                var errorMessage = error.message;
                return Alert.alert(errorMessage, errorCode);
            })
        }
    }

    showModal = () => {
        return(
            <Modal animationType = "fade"
            transparent = {true}
            visible = {this.state.isModalVisible}
            ><View
            style = {styles.modalContainer}>
                <ScrollView style = {{width: '100%'}}>
                    <KeyboardAvoidingView style = {styles.KeyboardAvoidingView}>
                        <Text style = {styles.modalTitle}>Registration</Text>
                        <TextInput style = {styles.formtextinput} placeholder = {"First Name"}
                        maxLength = {8} onChangeText = {(text)=>{
                            this.setState({
                                firstName: text
                            })
                        }}/>
                        
                        <TextInput style = {styles.formtextinput} placeholder = {"Last Name"}
                        maxLength = {8} onChangeText = {(text)=>{
                            this.setState({
                                lastName: text
                            })
                        }}/>
                        
                        <TextInput style = {styles.formtextinput} placeholder = {"Contact"}
                        maxLength = {10} keyboardType = {'numeric'} onChangeText = {(text)=>{
                            this.setState({
                                contact: text
                            })
                        }}/>
                        
                        <TextInput style = {styles.formtextinput} placeholder = {"Address"}
                        multiline = {true} onChangeText = {(text)=>{
                            this.setState({
                                address: text
                            })
                        }}/>
                        
                        <TextInput style = {styles.formtextinput} placeholder = {"Email Id"}
                        keyboardType = {'email-address'} onChangeText = {(text)=>{
                            this.setState({
                                emailId: text
                            })
                        }}/>
                        
                        <TextInput style = {styles.formtextinput} placeholder = {"Password"}
                        secureTextEntry = {true} onChangeText = {(text)=>{
                            this.setState({
                                password: text
                            })
                        }}/>
                        
                        <TextInput style = {styles.formtextinput} placeholder = {"Confirm Password"}
                        secureTextEntry = {true} onChangeText = {(text)=>{
                            this.setState({
                                confirmPass: text
                            })
                        }}/>
                        
                        <View style = {styles.modalBackButton}>
                            <TouchableOpacity style = {styles.registarButton}
                            onPress = {() => this.userSignUp(this.state.emailId, this.state.password, this.state.confirmPass)}>
                                <Text style = {styles.registarButtonText}>
                                    Register
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style = {styles.modalBackButton}>
                            <TouchableOpacity style = {styles.cancelButton}
                            onPress = {() => this.setState({
                                "isModalVisible": false
                            })}>
                                <Text style = {{color: '#FF5722'}}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </KeyboardAvoidingView>
                </ScrollView>
            </View></Modal>
        )
    }

    render(){
        return(
            <View style = {styles.container}>
                <View style = {{justifyContent: 'center', alignItems: 'center'}}></View>
                {this.showModal()}

                <View style = {{justifyContent: 'center', alignItems: 'center'}}>
                    {/* {<SantaAnimation/>} */}
                    <Text style = {styles.title}>Book Santa</Text>
                </View>

                <View>
                <TextInput style = {styles.loginBox} placeholder = "Email Id (abc@gmail.com)" keyboardType = 'email-address'
                onChangeText = {(text)=>{
                    this.setState({
                        emailId: text
                    });
                }}/>

                <TextInput style = {styles.loginBox} placeholder = "Password" secureTextEntry = {true} onChangeText = {(text)=>{
                    this.setState({
                        password: text
                    });
                }}/>

                <TouchableOpacity style = {styles.button,{marginBottom: 20, marginTop: 20}} onPress = {() => {
                    this.userLogin(this.state.emailId, this.state.password)
                }}><Text style = {styles.buttonText}>Login</Text></TouchableOpacity>

                <Text style = {styles.new}>New here?</Text>

                <TouchableOpacity style = {styles.button}  onPress = {() =>
                    this.setState({
                        isModalVisible: true
                    })
                }><Text style = {styles.buttonText}>Sign Up</Text></TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8BE85',
        alignItems: 'center',
        justifyContent: 'center'
    },
    profileContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 65,
        fontWeight: '300',
        paddingBottom: 30,
        color: '#ff3d00'
    },
    loginBox: {
        width: 300,
        height: 40,
        borderBottomWidth: 1.5,
        borderColor: '#ff8a65',
        fontSize: 20,
        margin: 10,
        paddingLeft: 10
    },
    button: {
        width: 300,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
        backgroundColor: '#ff9800',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.30,
        shadowRadius: 10.32,
        elevation: 16
    },
    buttonText: {
        color: '#ffff',
        fontWeight: '200',
        fontSize: 20,
    },
    buttonContainer: {
        flex: 1,
        alignItems: 'center',
    },
    new: {
        fontSize: 15
    },
    KeyboardAvoidingView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalTitle: {
        justifyContent: 'center',
        alignSelf: 'center',
        fontSize: 30,
        color: '#ff5722',
        margin: 50
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: '#ffff',
        marginRight: 30,
        marginLeft: 30,
        marginTop: 80,
        marginBottom: 80
    },
    formtextinput: {
        width: "75%",
        height: 35,
        alignSelf: 'center',
        borderColor: '#ffab91',
        borderRadius: 10,
        borderWidth: 1,
        marginTop: 20,
        padding: 10
    },
    registarButton: {
        width: 200,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderRadius: 10,
        marginTop: 30
    },
    registarButtonText: {
        color: '#ff5722',
        fontSize: 15,
        fontWeight: 'bold'
    },
    cancelButton: {
        width: 200,
        height: 30,
        marginTop: 5,
        justifyContent: 'center',
        alignItems: 'center'
    }   
})