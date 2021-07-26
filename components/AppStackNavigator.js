import { createStackNavigator } from 'react-navigation-stack';
import Donatebooks from '../screens/Donatebooks';
import ReceiverDetails from '../screens/ReceiverDetails';

export const appStackNavigator = createStackNavigator({
    donate: {screen: Donatebooks, 
        navigationOptions: {headerShown: false}
    },
    receiver: {screen: ReceiverDetails,
        navigationOptions: {headerShown: false}
    }
},
{
    initialRouteName: "donate"
})