import { createStackNavigator } from 'react-navigation-stack';
import Donatebooks from '../screens/Donatebooks';
import ReceiverDetails from '../screens/ReceiverDetails';

export const appStackNavigator = createStackNavigator({
    donate: {screen: Donatebooks},
    receiver: {screen: ReceiverDetails}
},
{
    initialRouteName: "donate"
})