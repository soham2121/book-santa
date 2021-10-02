import React from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList, Text } from 'react-native';
import firebase from 'firebase';
import db from '../config';
import { ListItem } from 'react-native-elements/dist/list/ListItem';
import { Icon } from 'react-native-elements';
import MyHeader from '../components/Header';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default class MyDonations extends React.Component{
    constructor(){
        super();
        this.state = {
            userId: firebase.auth().currentUser.email,
            allDonations: [],
            donorId: '',
            donorName: ''
        }
        this.requestRef = null;
    }

    getDonorDetail = (donorId) => {
        db.collection('users').where('email_id','==',donorId).get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                this.setState({
                    donorName: doc.data().first_name + " " + doc.data().last_name
                })
            })
        })
    }

    componentDidMount = () => {
        this.getDonorDetail(this.state.donorId);
        this.getAllDonations();
    }

    componentWillUnmount = () => {
        this.requestRef();
    }

    sendNotificaion = (bookDetails, requestStatus) => {
        var requestId = bookDetails.request_Id;
        var donorId = donor_Id;
        db.collection("All_Notifications").where("request_Id", "==", requestId).where("donor_Id", "==", donorId).get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                var message = "";
                if(requestStatus === "Book Sent"){
                    message = this.state.donorName + " Sent You Book"
                }
                else{
                    message = this.state.donorName + " Has Shown Interest In Donating The Book"
                }
                db.collection("All_Notiifications").doc(doc.id).update({
                    "message": message,
                    "notification_status": "unread",
                    "date": firebase.firestore.FieldValue.serverTimestamp()
                })
            })
        })
    }

    sendBook = (bookDetails) => {
        if(bookDetails.request_status === "Book Sent"){
            var requestStatus = "Donor Interested";
            db.collection('Donations').doc(bookDetails.doc_id).update({
                "request_status": "Donor Interested"
            });
            this.sendNotification(bookDetails, requestStatus);
        }
        else{
            var requestStatus = "Book Sent";
            db.collection('Donations').doc(bookDetails.doc_id).update({
                "request_status": "Book Sent"
            });
            this.sendNotification(bookDetails, requestStatus);
        }
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
            leftElement = {<Icon name = "Book" type = "font-awesome" color = "#696969"/>}
            titleStyle = {{color: 'black', fontWeight: 'bold'}}
            rightElement = {<TouchableOpacity style = {[styles.button, {backgroundColor: item.request_status === "Book Sent" ? "green" 
            : "#ff5722"
            }]} onPress = {() => {
                this.sendBook(item)
            }}><Text style = {{color: '#ffff'}}>{item.request_status === "Book Sent" ? "Book Sent" : "Send Book"}</Text></TouchableOpacity>}
        />
    }

    render(){
        return(
            <SafeAreaProvider>
                <View style = {{flex: 1}}>
                    <MyHeader navigation = {this.props.navigation} title = "My Donations"/>
                    <View>
                        {this.state.allDonations.length === 0 ? (
                            <View style = {styles.subtitle}>
                                <Text style = {{fontSize: 20}}>List Of All Donations</Text>
                            </View>
                        ) : (
                            <FlatList
                                keyExtractor = {this.keyExtractor}
                                data = {this.state.allDonations}
                                renderItem = {this.renderItem()}
                            />
                        )}
                    </View>
                </View>
            </SafeAreaProvider>
        )
    }
}

const styles = StyleSheet.create({ 
    button:{
        width:100,
        height:30,
        justifyContent:'center',
        alignItems:'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        elevation : 16 
    },
    subtitle :{ flex:1, fontSize: 20, justifyContent:'center', alignItems:'center' } })