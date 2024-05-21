import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, Text, Alert, Platform, TextInput, ScrollView, TouchableOpacity, KeyboardAvoidingView, ActivityIndicator, StyleSheet, SafeAreaView } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import SecureStorage from 'react-native-secure-storage';
import { ENDPOINTS } from '../config';
import { RootStackParamList } from '../helpNavigation/navigationTypes';

type Navigation = NativeStackNavigationProp<RootStackParamList>;

// interface User {
//     id: number;
//     name: string;
//     surname: string;
//     email: string;
//     login: string;
//     telephone: string;
// }

const EditProfile: React.FC<{ route: any }> = ({ route }) => {
    const navigation: Navigation = useNavigation<Navigation>();
    const { user } = route.params;

    const [loading, setLoading] = useState<boolean>(false);
    const [userName, setUserName] = useState<string>(user.name);
    const [userSurname, setUserSurname] = useState<string>(user.surname);
    const [email, setEmail] = useState<string>(user.email);
    const [login, setLogin] = useState<string>(user.login);
    const [telephone, setTelephone] = useState<string>(user.telephone);

    const handleUpdate = async () => {
        try {
            setLoading(true);

            const accessToken = await SecureStorage.getItem('access_token');
            if (!accessToken) {
                Alert.alert('Ошибка', 'Не удалось получить токен доступа');
                return;
            }

            const response = await axios.patch(ENDPOINTS.GET_USER, {
                name: userName,
                surname: userSurname,
                email: email,
                login: login,
                telephone: telephone,
                password: 'needToUse123))'
            }, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                }
            });

            if (response.data.data.code === 200) {
                Alert.alert('Успех', 'Профиль обновлен успешно');
                navigation.goBack();
                return;
            }

            Alert.alert('Ошибка', 'Не удалось обновить профиль');
        } catch (error: any) {
            Alert.alert('Ошибка', 'Что-то пошло не так! Попробуйте позже!');
        } finally {
            setLoading(false);
        }
    };

    const handleNameChange = useCallback((text: string): void => {
        setUserName(text);
    }, []);

    const handleSurnameChange = useCallback((text: string): void => {
        setUserSurname(text);
    }, []);

    const handleEmailChange = useCallback((text: string): void => {
        setEmail(text);
    }, []);

    const handleLoginChange = useCallback((text: string): void => {
        setLogin(text);
    }, []);

    const handleTelephoneChange = useCallback((text: string): void => {
        setTelephone(text);
    }, []);

    const nameInputRef = useRef<TextInput>(null);
    const surnameInputRef = useRef<TextInput>(null);
    const emailInputRef = useRef<TextInput>(null);
    const loginInputRef = useRef<TextInput>(null);
    const telephoneInputRef = useRef<TextInput>(null);

    useEffect(() => {
        if (loading) {
            nameInputRef.current?.blur();
            surnameInputRef.current?.blur();
            emailInputRef.current?.blur();
            loginInputRef.current?.blur();
            telephoneInputRef.current?.blur();
        }
    }, [loading]);

    const renderTitle = (): JSX.Element => {
        return (
            <Text style={styles.title}>{'Редактирование профиля'}</Text>
        );
    };

    const renderInputFields = (): JSX.Element => {
        return (
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <TextInput
                    style={styles.input}
                    value={userName}
                    onChangeText={handleNameChange}
                    placeholder={'Имя'}
                    ref={nameInputRef}
                />

                <TextInput
                    style={styles.input}
                    value={userSurname}
                    onChangeText={handleSurnameChange}
                    placeholder={'Фамилия'}
                    ref={surnameInputRef}
                />
                <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={handleEmailChange}
                    placeholder='Почта'
                    keyboardType='email-address'
                    ref={emailInputRef}
                />
                <TextInput
                    style={styles.input}
                    value={telephone}
                    onChangeText={handleTelephoneChange}
                    placeholder='Телефон'
                    ref={telephoneInputRef}
                />
                <TextInput
                    style={styles.input}
                    value={login}
                    onChangeText={handleLoginChange}
                    placeholder='Логин'
                    ref={loginInputRef}
                />
            </KeyboardAvoidingView>
        );
    };

    const renderButton = (): JSX.Element => {
        return (
            <TouchableOpacity
                style={styles.button}
                onPress={handleUpdate}
                disabled={loading}
            >
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Сохранить</Text>}
            </TouchableOpacity>
        );
    };

    const renderContent = (): JSX.Element => {
        return (
            <ScrollView
                contentContainerStyle={styles.contentContainer}
            >
                {renderTitle()}
                {renderInputFields()}
                {renderButton()}
            </ScrollView>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            {renderContent()}
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
    input: {
        height: 50,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#1D4E89',
        borderRadius: 5,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
    },
    contentContainer: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingVertical: 20,
        justifyContent: 'center',
    },
});

export default EditProfile;
