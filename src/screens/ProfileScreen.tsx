import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, Alert, TextInput, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet, SafeAreaView, FlatList, RefreshControl } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import SecureStorage from 'react-native-secure-storage';
import { ENDPOINTS } from '../config';
import { RootStackParamList } from '../helpNavigation/navigationTypes';

type Navigation = NativeStackNavigationProp<RootStackParamList>;

interface User {
    id: number;
    name: string;
    surname: string;
    email: string;
    telephone: string;
    login: string;
}

const ProfileScreen: React.FC = () => {
    const navigation: Navigation = useNavigation<Navigation>();

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState<boolean>(false);

    const fetchUserProfile = async () => {
        try {
            const accessToken = await SecureStorage.getItem('access_token');
            if (!accessToken) {
                console.error('No access token found');
                return;
            }

            const response = await axios.get(ENDPOINTS.GET_USER, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                }
            });

            setUser(response.data.data);

        } catch (error) {
            console.error('Failed to fetch user profile:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchUserProfile();
    }, []);

    const renderTitle = (): JSX.Element => {
        return (
            <Text style={styles.title}>{'Профиль'}</Text>
        );
    };

    const renderUserProfile = (): JSX.Element => {
        if (loading) {
            return <ActivityIndicator size="large" color="#1D4E89" />;
        }

        if (!user) {
            return <Text style={styles.noUserText}>Не удалось загрузить данные пользователя</Text>;
        }

        return (
            <View style={styles.profileContainer}>
                <Text style={styles.profileItem}><Text style={styles.profileLabel}>Имя:</Text> {user.name}</Text>
                <Text style={styles.profileItem}><Text style={styles.profileLabel}>Фамилия:</Text> {user.surname}</Text>
                <Text style={styles.profileItem}><Text style={styles.profileLabel}>Email:</Text> {user.email}</Text>
                <Text style={styles.profileItem}><Text style={styles.profileLabel}>Телефон:</Text> {user.telephone}</Text>
                <Text style={styles.profileItem}><Text style={styles.profileLabel}>Логин:</Text> {user.login}</Text>
                <TouchableOpacity
                    style={styles.editButton}
                // onPress={() => navigation.navigate('EditProfile', { userId: user.id })}
                >
                    <Text style={styles.editButtonText}>Редактировать профиль</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.editButton}
                // onPress={() => navigation.navigate('EditPassword')}
                >
                    <Text style={styles.editButtonText}>Сменить пароль</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView
                contentContainerStyle={styles.contentContainer}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                {renderTitle()}
                {renderUserProfile()}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    title: {
        marginBottom: 30,
        textAlign: 'center',
        fontSize: 32,
        color: '#1D4E89',
        textTransform: 'capitalize',
    },
    profileContainer: {
        backgroundColor: '#f8f9fa',
        borderRadius: 5,
        padding: 20,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    profileItem: {
        fontSize: 18,
        marginBottom: 10,
        color: '#343a40',
    },
    profileLabel: {
        fontWeight: 'bold',
    },
    noUserText: {
        textAlign: 'center',
        fontSize: 18,
        color: '#888',
    },
    editButton: {
        backgroundColor: '#1D4E89',
        borderRadius: 5,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    editButtonText: {
        color: '#fff',
        fontSize: 18,
    },
    contentContainer: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
});

export default ProfileScreen;
