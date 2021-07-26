import React from 'react';
import { View, StyleSheet } from 'react-native';
import firebase from 'firebase';
import db from '../config';
import { ListItem } from 'react-native-elements/dist/list/ListItem';
import { Icon } from 'react-native-elements';

export default class MyDonations extends React.Component{
    constructor(){
        super();
        this.state = {
            userId: firebase.auth().currentUser.email,
            allDonations: [],
        }
        this.requestRef = null;
    }

    getAllDonations = () => {
        this.requestRef = db.collection("all_donations").where("user_id","==",this.state.userId)
        .onSnapshot((snapshot) => {
            var allDonations = snapshot.docs.map(document => document.data());
            this.setState({
                allDonations: allDonations
            })
        })
    }

    keyExtractor = (item, index) => index.toString();

    renderItem = (item, i) => {
        <ListItem
            key = {i}
            title = {item.book_name}
            subtitle = {"Requested by " + item.requestedBy + " Status " + item.request_status}
            leftelement = {<Icon name = "Book" type = "font-awesome" color = "#696969"/>}
        />
    }

    render(){
        return(
            <View>
                
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
})