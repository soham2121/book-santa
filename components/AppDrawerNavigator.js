import { createDrawerNavigator } from 'react-navigation-drawer';
import { AppTabNavigator } from './Apptabnavigator';
import CustomSidebarMenu from './CustomSidebarMenu';
import SettingsScreen from '../screens/SettingsScreen';
import MyDonations from '../screens/MyDonation';
import notifications from '../screens/Notifications';

export const AppDrawerNavigator = createDrawerNavigator({
    Home: {screen: AppTabNavigator},
    MyDonations: {screen: MyDonations},
    Notification: {screen: notifications},
    Setting: {screen: SettingsScreen},
},
{
    contentComponent: CustomSidebarMenu
},
{
    initialRouteName: "Home"
})