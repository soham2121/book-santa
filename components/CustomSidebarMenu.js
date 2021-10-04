import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Avatar } from 'react-native-elements';
import { DrawerItems } from 'react-navigation-drawer';
import * as ImagePicker from 'expo-image-picker';
import firebase from 'firebase';
import db from '../config';

export default class CustomSidebarMenu extends React.Component{
    state = {
        userId: firebase.auth().currentUser.email,
        image: "#",
        name: "",
        docId: ""
    }

    selectPicture = async() => {
        const {canceled, uri} = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowEditing: true,
            aspect: [4,3],
            quality: 1
        })
        if(!canceled){
            this.uploadImage(uri, this.state.userId)
        }
    }

    uploadImage = async(uri, imageName) => {
        var response = await fetch(uri)
        var blob = await response.blob()

        var ref = firebase.storage().ref().child("user_profiles/" + imageName);

        return ref.put(blob).then((response) => {
            this.fetchImage(imageName)
        })
    }

    fetchImage = (imageName) => {
        var storageRef = firebase.storage().ref().child("user_profiles/" + imageName);
        storageRef.getDownloadURL()
        .then((url) => {
            this.setState({
                image: url
            })
        })
        .catch((error) => {
            this.setState({
                image: "#"
            })
        })
    }

    getUserProfile(){
        db.collection('Users').where("email_id", "==", this.state.userId)
        .onSnapshot((snapshot) => {
            snapshot.forEach((doc) => {
                this.setState({
                    name: doc.data().first_name + " " + doc.data().last_name
                })
            })
        })
    }

    componentDidMount(){
        this.getUserProfile();
        this.fetchImage(this.state.userId)
    }

    render(){
        return(
            <View style = {styles.container}>
                <View style = {{flex: 0.5, alignItems: 'center', backgroundColor: "orange"}}>
                    <Avatar
                        rounded
                        source = {{uri: this.state.image}}
                        size = "medium"
                        onPress = {() => {
                            this.selectPicture();
                        }}
                        containerStyle = {styles.imageContainer}
                        showEditButton
                    />
                    <Text style = {{fontWeight: "100", fontSize: 20, paddingTop: 10}}>{this.state.name}</Text>
                </View>
                <View style = {styles.drawerItem}>
                    <DrawerItems {...this.props}/>
                </View>
                <View style = {styles.logoutbutton}>
                    <TouchableOpacity style = {{width: "100%", padding: 10, backgroundColor: "#DDDDDD"}}
                    onPress = {() => {
                        this.props.navigation.navigate('loginscreen');
                    }}> 
                        <Text style = {{textAlign: 'center', color: "rgb(33, 150, 243)", fontWeight: "bold"}}>
                            Logout
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    drawerItem: {
        flex: 0.8
    },
    logoutbutton: {
        flex: 0.2,
        justifyContent: 'flex-end'
    }
})