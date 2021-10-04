import React from 'react';
import { View, Text, FlatList, TouchableOpacity, ListItem, Image, StyleSheet } from 'react-native';
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
            <ListItem
                key={i}
                title={item.book_name}
                subtitle={item.reason_to_request}
                titleStyle={{ color: 'black', fontWeight: 'bold' }}
                leftElement ={<Image
                    style={{height:50,width:50}}
                    source={{
                    uri: item.image_link,
                }}
                />}
                rightElement={
                    <TouchableOpacity style={styles.button} onPress ={()=>{
                            this.props.navigation.navigate("RecieverDetails",{"details": item})
                        }}
                    >
                    <Text style={{color:'#ffff'}}>View</Text>
                    </TouchableOpacity>
                }
                bottomDivider
            />
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

const styles = StyleSheet.create({
    keyBoardStyle : {
      flex:1,
      alignItems:'center',
      justifyContent:'center'
    },
    formTextInput:{
      width:"75%",
      height:35,
      alignSelf:'center',
      borderColor:'#ffab91',
      borderRadius:10,
      borderWidth:1,
      marginTop:20,
      padding:10,
    },
    button:{
      width:"75%",
      height:50,
      justifyContent:'center',
      alignItems:'center',
      borderRadius:10,
      backgroundColor:"#ff5722",
      shadowColor: "#000",
      shadowOffset: {
         width: 0,
         height: 8,
      },
      shadowOpacity: 0.44,
      shadowRadius: 10.32,
      elevation: 16,
      marginTop:20
      },
    }
  )