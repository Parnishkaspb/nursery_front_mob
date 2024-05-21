import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, Text, Alert, Platform, TextInput, ScrollView, TouchableOpacity, KeyboardAvoidingView, ActivityIndicator, StyleSheet, SafeAreaView } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import SecureStorage from 'react-native-secure-storage';
import { ENDPOINTS } from '../config';
import { RootStackParamList } from '../helpNavigation/navigationTypes';

type Navigation = NativeStackNavigationProp<RootStackParamList>;

const EditPassword: React.FC<{ route: any }> = () => {
    const navigation: Navigation = useNavigation<Navigation>();

    const [loading, setLoading] = useState<boolean>(false);

    const [userPassword, setPassword] = useState<string>('');
    const [userNewPassword, setNewPassword] = useState<string>('');
    const [userNew2Password, setNew2Password] = useState<string>('');

    const handleUpdate = async () => {
        try {
            setLoading(true);

            if (userNewPassword !== userNew2Password) {
                Alert.alert('Ошибка', 'Пароли не совпадают!!!!');
                return;
            }

            const accessToken = await SecureStorage.getItem('access_token');
            if (!accessToken) {
                Alert.alert('Ошибка', 'Не удалось получить токен доступа');
                return;
            }

            const response = await axios.patch(ENDPOINTS.UPDATE_PASSWORD_USER, {
                old_password: userPassword,
                new_password: userNewPassword,
            }, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                }
            });

            if (response.data.data.code === 422) {
                Alert.alert('Предупреждение', response.data.data.message);
                return;
            }

            if (response.data.data.code === 200) {
                Alert.alert('Успех', response.data.data.message);
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

    const handlePasswordChange = useCallback((text: string): void => {
        setPassword(text);
    }, []);

    const handleNewPasswordChange = useCallback((text: string): void => {
        setNewPassword(text);
    }, []);

    const handleNew2PasswordChange = useCallback((text: string): void => {
        setNew2Password(text);
    }, []);


    const passwordInputRef = useRef<TextInput>(null);
    const passwordNewInputRef = useRef<TextInput>(null);
    const passwordNew2InputRef = useRef<TextInput>(null);


    useEffect(() => {
        if (loading) {
            passwordInputRef.current?.blur();
            passwordNewInputRef.current?.blur();
            passwordNew2InputRef.current?.blur();

        }
    }, [loading]);

    const renderTitle = (): JSX.Element => {
        return (
            <Text style={styles.title}>{'Смена пароля'}</Text>
        );
    };

    const renderInputFields = (): JSX.Element => {
        return (
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <TextInput
                    style={styles.input}
                    value={userPassword}
                    secureTextEntry={true}
                    onChangeText={handlePasswordChange}
                    placeholder={'Старый пароль'}
                    ref={passwordInputRef}
                />

                <TextInput
                    style={styles.input}
                    value={userNewPassword}
                    secureTextEntry={true}
                    onChangeText={handleNewPasswordChange}
                    placeholder={'Новый пароль'}
                    ref={passwordNewInputRef}
                />

                <TextInput
                    style={styles.input}
                    value={userNew2Password}
                    secureTextEntry={true}
                    onChangeText={handleNew2PasswordChange}
                    placeholder={'Повторите новый пароль'}
                    ref={passwordNew2InputRef}
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
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Сменить пароль</Text>}
            </TouchableOpacity>
        );
    };

    const renderButtonBack = (): JSX.Element => {
        return (
            <TouchableOpacity
                style={styles.buttonBack}
                onPress={navigation.goBack}
                disabled={loading}
            >
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Назад</Text>}
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
                {renderButtonBack()}
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
    buttonBack: {
        backgroundColor: 'red',
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

export default EditPassword;
