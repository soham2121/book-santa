import React from 'react';
import { View, Text, StyleSheet } from 'react-native'
import { ListItem } from 'react-native-elements/dist/list/ListItem';
import MyHeader from '../components/Header'
import SwipeableFlatlist from '../components/SwipeableFlatlist';
import firebase from 'firebase';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import db from '../config'

export default class notifications extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            allNotifications: [],
            userId: firebase.auth().currentUser.email,
        };
        this.notificationRef = null;
    }

    componentDidMount(){
        this.getNotification();
    }
    
    getNotification = () => {
        this.requestRef = db.collection("All_notifications")
        .where("notification_status", "==", "unread")
        .where("targeted_user_id", "==", this.state.userId)
        .onSnapshot((snapshot) => {
            var allNotifications = [];
            snapshot.docs.map((doc) => {
                var notification = doc.data();
                notification["doc_id"] = doc.id;
                allNotifications.push(notification)
            })
            this.setState({
                allNotifications: allNotifications
            })
        })
    }

    componentWillUnmount(){
        this.notificationRef()
    }

    keyExtractor = (item, index) => index.toString();

    renderItem = ({item, index}) => {
        return(
            <ListItem 
            key = {index}
            leftElement = {<Icon name = "book" type = "font-awesome" color = '#696969'/>}
            title = {item.book_name}
            titleStyle = {{color: black, fontweight: 'bold'}}
            subtitle = {item.message}
            bottomDivider
            />
        )
    }

    render(){
        return(
            <SafeAreaProvider>
                <View style = {styles.container}>
                    <View style = {{flex: 0.1}}>
                        <MyHeader title = {"notifications"} navigation = {this.props.navigation}/>
                    </View>
                    <View style = {{flex: 0.9}}>
                        {
                            this.state.allNotifications.length === 0 ? (
                                <View style = {{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                                    <Text style = {{paddingTop: 10}}>You have no notifications</Text>
                                </View>
                            ):(
                                <SwipeableFlatlist
                                    allNotifications = {this.state.allNotifications}
                                />
                            )
                        }
                    </View>
                </View>
            </SafeAreaProvider>
        )}
    }

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
})