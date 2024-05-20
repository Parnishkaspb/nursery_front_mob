import React, { useEffect } from 'react';
import { DrawerContentScrollView, DrawerItem, DrawerItemList, DrawerContentComponentProps } from '@react-navigation/drawer';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import SecureStorage from 'react-native-secure-storage';
import axios from 'axios';
import { styles } from './NavigationConfig';
import { RootStackParamList } from '../helpNavigation/navigationTypes';

type LoginFormProps = NativeStackNavigationProp<RootStackParamList, 'SignIn'>;

export const CustomDrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
    const navigation = useNavigation<LoginFormProps>();

    const handleLogout = async () => {
        const accessToken = await SecureStorage.getItem('access_token');
        if (accessToken) {
            await axios.post('logout', {}, {
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
            <View style={styles.exitButtonContainer}>
                <DrawerItem
                    label="Выход"
                    onPress={handleLogout}
                />
            </View>
        </DrawerContentScrollView>
    );
};
