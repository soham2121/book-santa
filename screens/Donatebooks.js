import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import ReceiverDetails from './ReceiverDetails';
import db from '../config'

export default class Donatebooks extends React.Component{
    constructor(){
        super();
        this.state={
            booklist: ''
        }
    }

    componentDidMount(){
        var requestRef = db.collection('requested_books').onSnapshot((snapshot)=>{
            var booklist = snapshot.docs.map((doc) => doc.data());
            this.setState({
                booklist: booklist
            })
        })
    }

    keyExtractor = (item, index) => index.toString();

    renderItem = ({item, i}) => {
        return(
            <View>
                <Text style = {{paddingBottom: 5, paddingTop: 5}}>Book Name: {item.book_name}</Text>

                <Text style = {{paddingBottom: 5}}>Reason to request: {item.reason_to_request}</Text>

                <TouchableOpacity style = {{paddingBottom: 30, backgroundColor: "#CCCCCC", width: 200, height: 30, borderRadius: 10}}
                onPress = {() => this.props.navigation.navigate('receiver')}>

                <Text style = {{textAlign: 'center'}}>View</Text>

                </TouchableOpacity>

                <Text style = {{paddingBottom: 10}}>------------------------------------------------------------------------------------------------------------</Text>
            </View>
        )
    }

    render(){
        return(
            <View>
                <Text style = {{fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>Donate books screen</Text>
                <FlatList keyExtractor = {this.keyExtractor}
                data = {this.state.booklist}
                renderItem = {this.renderItem}>
                </FlatList>
            </View>
        )
    }
}