import React from 'react';
import { View, Text, TouchableOpacity,StyleSheet} from 'react-native';
import { Header, Icon, Card } from 'react-native-elements';
import { RFValue } from "react-native-responsive-fontsize";
import db from '../config';
import firebase from 'firebase';

export default class ReceiverDetails extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            userId: firebase.auth().currentUser.email,
            userName: '',
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

    getUserDetails = (userId) => {
        db.collection('users').where('email_id','==',userId).get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                this.setState({
                    userName: doc.data().first_name + " " + doc.data().last_name
                })
            })
        })
    }

    addNotification = () => {
        var message = this.state.userName + "Has Shows Interest In Dontating The Book";
        db.collection(All_notification).add({
            'targeted_user_id': this.state.receiverId,
            'donor_id': this.state.userId,
            'request_id': this.state.requestId,
            'book_name': this.state.bookName,
            'date': firebase.firestore.FieldValue.serverTimestamp(),
            'notification_status': "unread",
            'message': message
        })
    }

    componentDidMount = () => {
        this.getReceiverDetails();
        this.getUserDetails(this.state.userId)
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
            <View style = {styles.container}>
                <View style = {{flex: 0.1}}>
                    <Header
                    leftComponent = {<Icon name = 'arrow-left' type = 'feather' color = '#696969' onPress = {
                        () => this.props.navigation.goBack()
                    }
                    />}
                    centerComponent = {{text: "Donate Books", style: {color: '#90a5a9', fontSize: 20, fontWeight: 'bold'}}}
                    backgroundColor = "#eaf8fe"
                    />
                </View>

                <View style = {{flex: 0.3}}>
                    <Card title = {"Book Information"} titleStyle = {{fontSize: 20}}>
                        <Card>
                            <Text style = {{fontWeight: 'bold'}}>Name: {this.state.bookName}</Text>
                        </Card>
                        <Card>
                            <Text style = {{fontWeight: 'bold'}}>Reason: {this.state.reasonForRequest}</Text>
                        </Card>
                    </Card>
                </View>

                <View style = {{flex: 0.3}}>
                    <Card title = {"Reciever Information"} titleStyle = {{fontSize: 20}}>
                        <Card>
                            <Text style = {{fontWeight: 'bold'}}>Name: {this.state.recieverName}</Text>
                        </Card>
                        <Card>
                            <Text style = {{fontWeight: 'bold'}}>Contact: {this.state.recieverContact}</Text>
                        </Card>
                        <Card>
                            <Text style = {{fontWeight: 'bold'}}>Address: {this.state.recieverAddress}</Text>
                        </Card>
                    </Card>
                </View>

                <View style = {styles.buttonContainer}>
                    {
                        this.state.receiverId != this.state.userId ? (
                            <TouchableOpacity style = {styles.button} onPress = {
                                () => {
                                    this.updateBookStatus();
                                    this.addNotification();
                                    this.props.navigation.navigate('MyDonations')
                                }
                            }>
                                <Text>I Want To Donate</Text>
                            </TouchableOpacity>
                        ) : null
                    }
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
  
    button: {
      width: "75%",
      height: RFValue(60),
      justifyContent: "center",
      alignItems: "center",
      borderRadius: RFValue(60),
      backgroundColor: "#ff5722",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 8,
      },
      elevation: 16,
    },
  });