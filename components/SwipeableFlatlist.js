import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import db from '../config';
import { ListItem, Icon } from 'react-native-elements';

export default class SwipeableFlatlist extends React.Components{
    constructor(props){
        super(props);
        this.state = {
            allnotifications: this.props.allnotifications
        }
    }

    updatemarkasread = Notification => {
        db.collection("All_Notification")
        .doc(Notification.doc_id)
        .update({
            Notification: "Read"
        });
    }

    renderItem = data => {
        <ListItem
            leftElement = {<Icon/>}
            title = {data.item.book_name}
            titlestyle = {{color: "black", fontWeight: 'bold'}}
            subtitle = {data.item.message}
            bottomDivider
        />
    }

    onSwipeValueChange = swipeData => {
        var allNotifications = this.state.allnotifications;

        const {key,value} = swipeData

        if(value < -Dimensions.get('window').width){
            const newdata = [...allNotifications];
            const previousindex = allnotifications.findIndex(Item => Item.key === key); 
            this.updatemarkasread(allnotifications[previousindex]);
            new data.splice[previousindex, 1];
            this.setState({
                allnotifications: newdata
            })
        }
    }

    renderHiddenItem = () => {
        <View style = {styles.rowBack}>
            <View style = {[styles.backRightBtn, styles.backRightBtnRight]}>
                <Text style = {styles.backTextWhite}></Text>
            </View>
        </View>
    }

    render(){
        return(
            <View>
                <SwipeListView
                disableRightSwipe
                data = {this.state.allnotifications}
                renderItem = {this.renderItem()}
                renderHiddenItem = {this.renderHiddenItem()}
                rightOpenValue = {-Dimensions.get('window').width}
                previewRowKey = {0}
                previewOpenValue = {40}
                previewOpenDelay = {3000}
                onSwipeValueChange = {this.onSwipeValueChange()}
                />
            </View>
        )}
    }

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
})