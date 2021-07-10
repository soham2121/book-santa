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
        var requestRef = db.collection('Books').onSnapshot((snapshot)=>{
            var booklist = snapshot.docs.map((doc) => doc.data());
            this.setState({
                booklist: booklist
            })
            console.log(booklist)
        })
    }

    keyExtractor = (item, index) => index.toString();

    renderItem = ({item, i}) => {
        return(
            <View>
                <Text style = {{paddingBottom: 5, paddingTop: 5}}>Book Name: {item.name}</Text>

                <Text style = {{paddingBottom: 5}}>Book Pages: {item.pages}</Text>

                <Text style = {{paddingBottom: 5}}>Book Price: {item.price}</Text>

                <TouchableOpacity style = {{paddingBottom: 30, backgroundColor: "#CCCCCC", width: 200, height: 30, borderRadius: 10}}
                onPress = {this.props.navigation.navigate('receiver')}>

                <Text style = {{textAlign: 'center'}}>View</Text>

                </TouchableOpacity>
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