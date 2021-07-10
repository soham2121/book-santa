import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { DrawerItems } from 'react-navigation-drawer';

export default class CustomSidebarMenu extends React.Component{
    render(){
        return(
            <View style = {styles.container}>
                <View style = {styles.drawerItem}>
                    <DrawerItems {...this.props}/>
                </View>
                <View style = {styles.logoutbutton}>
                    <TouchableOpacity style = {{width: "100%", padding: 10, backgroundColor: "#DDDDDD"}}
                    onPress = {() => {
                        this.props.navigation.navigate('loginscreen');
                    }}> 
                        <Text style = {{textAlign: 'center', color: "rgb(33, 150, 243)", fontWeight: "bold"}}>
                            Logout
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    drawerItem: {
        flex: 0.8
    },
    logoutbutton: {
        flex: 0.2,
        justifyContent: 'flex-end'
    }
})