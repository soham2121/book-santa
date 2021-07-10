import { createBottomTabNavigator } from 'react-navigation-tabs';
import Donatebooks from '../screens/Donatebooks';
import Requestbooks from '../screens/Requestbooks';
import { appStackNavigator } from './AppStackNavigator';

export const AppTabNavigator = createBottomTabNavigator({
    donatebooks: {screen: appStackNavigator},
    requestbooks: {screen: Requestbooks}
})