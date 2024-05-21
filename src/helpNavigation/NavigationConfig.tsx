import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SignIn from '../screens/SignIn';
import SignUp from '../screens/SignUp';

import EditPassword from '../screens/EditPassword';
import EditProfile from '../screens/EditProfile';


import CreateInvestition from '../screens/CreateInvestition';

// import VisitDetailsScreen from '../screens/VisitDetailsScreen';

import { RootStackParamList, DrawerParamList } from './navigationTypes';

import { CustomDrawerContent } from './CustomDrawerContent';

const Stack = createStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator<DrawerParamList>();

export const MainDrawer = () => (
    <Drawer.Navigator
        initialRouteName="Home"
        drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
        <Drawer.Screen name="Profile" options={{ headerShown: false, title: 'Настройки' }} component={ProfileScreen} />
        <Drawer.Screen name="Home" options={{ headerShown: false, title: 'Ваши инвестиции' }} component={HomeScreen} />
        <Drawer.Screen name="CreateInvestition" options={{ headerShown: false, title: 'Инвестировать' }} component={CreateInvestition} />

        {/* <Drawer.Screen name="NewWrite" options={{ title: 'Записаться к врачу' }} component={NewWriteScreen} /> */}
    </Drawer.Navigator>
);

export const RootNavigator = () => (
    <Stack.Navigator initialRouteName="SignIn" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="Main" component={MainDrawer} />

        <Stack.Screen name="EditProfile" options={{ title: 'Редактировать данные' }} component={EditProfile} />
        <Stack.Screen name="EditPassword" options={{ title: 'Смена пароля' }} component={EditPassword} />

        <Stack.Screen name="CreateInvestition" options={{ title: 'Инвестировать' }} component={CreateInvestition} />

        {/*  */}

        {/*<Stack.Screen name="Edit" options={{ title: 'Редактировать данные' }} component={EditScreen} />
        <Stack.Screen name="VisitDetails" component={VisitDetailsScreen} /> */}
    </Stack.Navigator>
);
