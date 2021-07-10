import { createDrawerNavigator } from 'react-navigation-drawer';
import { AppTabNavigator } from './Apptabnavigator';
import CustomSidebarMenu from './CustomSidebarMenu';

export const AppDrawerNavigator = createDrawerNavigator({
    Home: {screen: AppTabNavigator},
},
{
    contentComponent: CustomSidebarMenu
},
{
    initialRouteName: "Home"
})