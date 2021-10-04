import React from 'react';
import { View, Text, TouchableOpacity, Alert, KeyboardAvoidingView, TextInput, StyleSheet, FlatList } from 'react-native';
import firebase from 'firebase';
import db from '../config';
import MyHeader from '../components/Header'
import { ScrollView, TouchableHighlight } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BookSearch } from 'react-native-google-books';

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
        var books = await BookSearch.searchBook(bookName, 'AIzaSyD3ymT0zyqPkuPlJAuL7lWaVGKaH5dJoo4')
        db.collection('requested_books').add({
            "user_id": userId,
            "book_name": bookName,
            "reason_to_request": reasonToRequest,
            "request_id": randomRequestId,
            "book_status": "requested",
            "date": firebase.firestore.FieldValue.serverTimestamp(),
            image_link: books.data[0].volumeInfo.imageLinks.smallThumbnail
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

    async GetBooksFromAPI(bookName){
        this.setState({
            bookname: bookName,

        })
        if(bookName.length > 2){
            var books = await BookSearch.searchBook(bookName, "AIzaSyD3ymT0zyqPkuPlJAuL7lWaVGKaH5dJoo4")
            this.setState({
                dataSource: books.data,
                showFlatlist: true
            })
        }
    }

    renderItem = ({item,i}) => {
        return(
            <TouchableHighlight style = {{alignItems: 'center', backgroundColor: "#6921ab", padding: 10, width: '90%'}}
            activeOpacity = {0.6} underlayColor = '#ab2169' onPress = {() => {
                this.setState({
                    showFlatlist: false,
                    bookname: item.volumeInfo.title
                })
            }}
            bottomDivider><Text>{item.volumeInfo.title}</Text></TouchableHighlight>
        )
    }

    render(){
        <View style={{flex:1}}>
          <MyHeader title="Request Book" navigation ={this.props.navigation}/>

          <View>

          <TextInput
            style ={styles.formTextInput}
            placeholder={"enter book name"}
            onChangeText={text => this.getBooksFromApi(text)}
            onClear={text => this.getBooksFromApi('')}
            value={this.state.bookName}
          />

      {  this.state.showFlatlist ?

        (  <FlatList
        data={this.state.dataSource}
        renderItem={this.renderItem}
        enableEmptySections={true}
        style={{ marginTop: 10 }}
        keyExtractor={(item, index) => index.toString()}
      /> )
      :(
        <View style={{alignItems:'center'}}>
        <TextInput
          style ={[styles.formTextInput,{height:300}]}
          multiline
          numberOfLines ={8}
          placeholder={"Why do you need the book"}
          onChangeText ={(text)=>{
              this.setState({
                  reasonToRequest:text
              })
          }}
          value ={this.state.reasonToRequest}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={()=>{ this.addRequest(this.state.bookName,this.state.reasonToRequest);
          }}
          >
          <Text>Request</Text>
        </TouchableOpacity>
        </View>
      )
    }
            </View>
        </View>
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