import React from 'react';
import { DrawerContentScrollView, DrawerItem, DrawerItemList, DrawerContentComponentProps } from '@react-navigation/drawer';
import { View } from 'react-native';
import { styles } from './NavigationConfig';

export const CustomDrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
    const { navigation } = props;

    return (
        <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                <DrawerItemList {...props} />
            </View>
            <View style={styles.exitButtonContainer}>
                <DrawerItem
                    label="Выход"
                    onPress={() => {
                        navigation.navigate('Logout');
                    }} />
            </View>
        </DrawerContentScrollView>
    );
};
