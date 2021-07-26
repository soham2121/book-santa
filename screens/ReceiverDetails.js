import React from 'react';
import { View, Text } from 'react-native';
import db from '../config';
import firebase from 'firebase';

export default class ReceiverDetails extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            userId: firebase.auth().currentUser.email,
            receiverId: this.props.navigation.getParam('details')["user_id"],
            requestId: this.props.navigation.getParam('details')["request_id"],
            bookName: this.props.navigation.getParam('details')["book_name"],
            reasonForRequest: this.props.navigation.getParam('details')["reason_to_request"],
            receiverName: '',
            recieverContact: '',
            recieverAddress: '',
            receiverRequestDocID: '',
        }
    }

    getReceiverDetails = () => {
        db.collection('Users').where("emailId","==",this.state.receiverId).get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                this.setState({
                    recieverName: doc.data().first_name,
                    recieverContact: doc.data().contact,
                    recieverAddress: doc.data().address
                })
            })
        }) 
    }

    updateUserDetails = () => {
        db.collection('all_donations').add({
            book_name: this.state.bookName,
            request_id: this.state.requestId,
            requested_by: this.state.recieverName,
            donor_id: this.state.userId,
            request_status: "Donor Interested"
        })
    }

    render(){
        return(
            <View>
                <Text>Reciever Details</Text>
            </View>
        )
    }
}