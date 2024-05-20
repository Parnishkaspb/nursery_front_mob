import React, { useEffect } from 'react';
import { DrawerContentScrollView, DrawerItem, DrawerItemList, DrawerContentComponentProps } from '@react-navigation/drawer';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import SecureStorage from 'react-native-secure-storage';
import axios from 'axios';
// import { styles } from './NavigationConfig';
import { RootStackParamList } from '../helpNavigation/navigationTypes';
import { ENDPOINTS } from '../config';
import { StyleSheet } from 'react-native';

type LoginFormProps = NativeStackNavigationProp<RootStackParamList, 'SignIn'>;

export const CustomDrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
    const navigation = useNavigation<LoginFormProps>();

    const handleLogout = async () => {
        const accessToken = await SecureStorage.getItem('access_token');
        if (accessToken) {
            await axios.post(ENDPOINTS.LOGOUT_USER, {}, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                }
            });
        }
        console.log('dsfsdfw');

        await SecureStorage.removeItem('access_token');
        navigation.navigate('SignIn');
    };

    return (
        <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                <DrawerItemList {...props} />
            </View>
            <View style={style.exitButtonContainer}>
                <DrawerItem
                    label={() => (
                        <View style={style.logoutLabel}>
                            <Text style={style.logoutText}>Выход</Text>
                        </View>
                    )}
                    onPress={() => {
                        handleLogout();
                    }}
                />
            </View>
        </DrawerContentScrollView>
    );
};

export const style = StyleSheet.create({
    exitButtonContainer: {
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        // paddingVertical: 7,
    },
    logoutLabel: {
        // flexDirection: 'row',
        alignItems: 'center',
    },
    logoutText: {
        fontSize: 20,
        color: 'black',
        marginLeft: 10,
    }
});