import React from 'react';
import { View, Text, TouchableOpacity, Alert, KeyboardAvoidingView, TextInput, StyleSheet } from 'react-native';
import firebase from 'firebase';
import db from '../config';
import MyHeader from '../components/Header'
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default class Requestbooks extends React.Component{
    constructor(){
        super();
        this.state = {
            userId: firebase.auth().currentUser.email,
            bookname: '',
            reasonToRequest: '',
            requestedBookName: '',
            isBookRequestActive: '',
            bookStatus: '',
            requestId: '',
            userDocId: '',
            docId: ''
        }
    }

    createUniqueId(){
        return Math.random().toString(36).substring(7);
    }

    addRequest = async(bookName, reasonToRequest) => {
        var userId = this.state.userId;
        var randomRequestId = this.createUniqueId();
        db.collection('requested_books').add({
            "user_id": userId,
            "book_name": bookName,
            "reason_to_request": reasonToRequest,
            "request_id": randomRequestId,
            "book_status": "requested",
            "date": firebase.firestore.FieldValue.serverTimestamp() 
        })
        await this.getBookRequest()
        db.collection('users').where("email_Id", "==", userId).get()
        .then()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                db.collection('users').doc(doc.id),update({
                    isBookRequestActive: true
                })
            })
        })
        this.setState({
            bookName: '',
            reasonToRequest: '',
            requestId: randomRequestId
        })
        return Alert.alert("Book Requested successfully")
    }

    receivedBooks = (bookName) => {
        var userId = this.state.userId;
        var requestId = this.state.requestId;
        db.collection('received_books').add({
            "user_id": userId,
            "book_name": bookName,
            "request_id": requestId,
            "bookStatus": "received"
        })
    }

    getIsBookRequestActive = () => {
        console.log(this.state.userId);
        db.collection('users').where("email_id", "==", this.state.userId)
        .onSnapshot((query) => {
            query.forEach((doc) => {
                this.setState({
                    isBookRequestActive: doc.data().isBookRequestActive,
                    userDocId: doc.id
                })
            })
        })
    }

    getBookRequest = () => {
        var bookRequest = db.collection('requested_books').where("user_id", "==", this.state.userId).get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                if(doc.data().book_status !== "received"){
                    this.setState({
                        requestId: doc.data().request_id,
                        requestedBookName: doc.data().book_name,
                        bookStatus: doc.data().book_status,
                        docId: doc.id,
                    })
            }  
            })
            
        })
    }

    sendNotifications = () => {
        db.collection('users').where("email_id", "==", this.state.userId).get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                var firstName = doc.data().first_name;
                var lastName = doc.data().last_name;
                db.collection('all_notifications').where("request_id", "==", this.state.requestId).get()
                .then((snapshot) => {
                    snapshot.forEach((doc) => {
                        var donorId = doc.data().donor_id;
                        var bookName = doc.data().book_name;
                        db.collection('all_notifications').add({
                            'targeted_user_id': donorId,
                            "message": firstName + " " + lastName + " received the book" + bookName,
                            "notification_status": "unread",
                            "book_name": bookName
                        })
                    })
                })
            })
        })
    }

    updateBookRequestStatus = () => {
        db.collection('requested_books').doc(this.state.docId)
        .update({
            book_status: "Received"
        })
        db.collection('users').where("email_id", "==", this.state.userId).get()
        .ther((snapshot) => {
            db.collection('users').doc(doc.id).update({
                isBookRequestActive: false
            })
        })
    }

    componentDidMount = () => {
        this.getBookRequest();
        this.getIsBookRequestActive();
    }

    render(){
        if(this.state.isBookRequestActive === true){
            return(
                <View style = {{flex: 1, justifyContent: 'center'}}>
                    <View style = {{borderColor: "orange", borderWidth: 1, justifyContent: 'center', alignItems: 'center', padding: 10, margin: 10}}>
                        <Text>Book Name</Text>
                        <Text>{this.state.requestedBookName()}</Text>
                    </View>
                    <View style ={{borderColor: "orange", borderWidth: 1, justifyContent: 'center', alignItems: 'center', padding: 10, margin: 10}}>
                        <Text>Book Status</Text>
                        <Text>{this.state.bookStatus}</Text>
                    </View>
                    <TouchableOpacity style = {{borderWidth: 1, borderColor: "orange", width: 300, backgroundColor: "orange", alignItems: 'center', alignSelf: 'center', height: 30, marginTop: 30}}
                    onPress = {() => {
                        this.sendNotifications();
                        this.updateBookRequestStatus();
                        this.receivedBooks(this.state.requestedBookName);
                    }}><Text>I received the book</Text></TouchableOpacity>
                </View>
            )
        }
        else{
            return(
                <SafeAreaProvider>
                    <View style = {{flex: 1}}>
                        <MyHeader title = "Request Books" navigation = {this.props.navigation}/>
                        <ScrollView>
                            <KeyboardAvoidingView style = {styles.keyBoardStyle}>
                                <TextInput style = {styles.formTextInput} placeholder = {"Enter the book name"} onChangeText = {(text) => {
                                    this.setState({
                                        bookname: text
                                    })
                                }}/>
                                <TextInput style = {styles.formTextInput} placeholder = {"Reason to request"} onChangeText = {(text) => {
                                    this.setState({
                                        reasonToRequest: text
                                    })
                                }}/>
                                <TouchableOpacity style = {styles.button} onPress = {() => {
                                    this.addRequest(this.state.bookname, this.state.reasonToRequest)
                                }}><Text>Request</Text></TouchableOpacity>
                            </KeyboardAvoidingView>
                        </ScrollView>
                    </View>
                </SafeAreaProvider>
            )   
        }
        
    }
}

const styles = StyleSheet.create({
    keyBoardStyle : { 
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },

    formTextInput:{
        width: "75%",
        height: 35,
        alignSelf: 'center',
        borderColor: '#ffab91',
        borderRadius: 10,
        borderWidth: 1,
        marginTop: 20,
        padding: 10
    },
    
    button:{
        width: "75%",
        height: 50,
        justifyContent: 'center',
        alignItems: 'center', 
        borderRadius: 10, 
        backgroundColor: "#ff5722",
        shadowColor: "#000",
        shadowOffset: { 
            width: 0,
            height: 8, 
        },
        shadowOpacity: 0.44,
        shadowRadius: 10.32,
        elevation: 16,
        marginTop: 20
    }
})