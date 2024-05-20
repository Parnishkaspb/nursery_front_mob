import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, Text, Alert, Platform, TextInput, ScrollView, TouchableOpacity, KeyboardAvoidingView, ActivityIndicator, StyleSheet, SafeAreaView } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import SecureStorage from 'react-native-secure-storage';
import { ENDPOINTS } from '../config';
import { RootStackParamList } from '../helpNavigation/navigationTypes';

type Navigation = NativeStackNavigationProp<RootStackParamList>;

const SignIn: React.FC = () => {
    const navigation: Navigation = useNavigation<Navigation>();

    const [loading, setLoading] = useState<boolean>(false);
    const [login, setLogin] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const user = { login, password };

    const handleLogin = async () => {
        try {
            setLoading(true);

            const response = await axios.post(ENDPOINTS.LOGIN_USER, {
                login: login,
                password: password,
            });

            console.log(response.data.data);
            if (response.data.data.code === 422) {
                Alert.alert('Не все данные заполнены!');
                return;
            }
            if (response.data.data.code === 200) {

                const access_token = response.data.data.access_token;
                console.log(access_token);
                await SecureStorage.setItem('access_token', access_token);
                // navigation.replace('Home');
                return;
            }

            Alert.alert('Что-то пошло не так!');
        } catch (error: any) {
            console.log(error);
            if (error.response.status === 409) {
                Alert.alert(
                    'Ошибка!!!!',
                    'Пользователь с таким логином или почто уже есть!',
                    [
                        {
                            text: 'OK',
                            onPress: () => {
                                console.log('OK Pressed');
                            },
                        },
                    ],
                    { cancelable: false },
                );
                return;
            }

            Alert.alert('Что-то пошло не так! Попробуйте позже!');
        } finally {
            setLoading(false);
        }
    };

    const handleLoginChange = useCallback((text: string): void => {
        setLogin(text);
    }, []);

    const handlePasswordChange = useCallback((text: string): void => {
        setPassword(text);
    }, []);

    const loginInputRef = useRef<TextInput>(null);
    const passwordInputRef = useRef<TextInput>(null);

    useEffect(() => {
        if (loading) {
            loginInputRef.current?.blur();
            passwordInputRef.current?.blur();
        }
    }, [loading]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('blur', () => {
            setLogin('');
            setPassword('');

            loginInputRef.current?.blur();
            passwordInputRef.current?.blur();
        });

        return unsubscribe;
    }, [navigation]);

    const renderTitle = (): JSX.Element => {
        return (
            <Text style={styles.title}>{'Войти'}</Text>
        );
    };

    const renderInputFields = (): JSX.Element => {
        return (
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <TextInput
                    style={styles.input}
                    value={login}
                    onChangeText={handleLoginChange}
                    placeholder='Логин'
                    ref={loginInputRef}
                />
                <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={handlePasswordChange}
                    placeholder='Пароль'
                    secureTextEntry={true}
                    ref={passwordInputRef}
                />
            </KeyboardAvoidingView>
        );
    };

    const renderButton = (): JSX.Element => {
        return (
            <TouchableOpacity
                style={styles.button}
                onPress={() => {
                    handleLogin();
                }}
                disabled={loading}
            >
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Войти</Text>}
            </TouchableOpacity>
        );
    };

    const renderIfYouHaveAccount = (): JSX.Element => {
        return (
            <View style={styles.accountContainer}>
                <Text style={styles.accountText}>
                    Нет аккаунта?{' '}
                </Text>
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate('SignUp');
                    }}
                >
                    <Text style={styles.signInText}>
                        Зарегистрироваться
                    </Text>
                </TouchableOpacity>
            </View>
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
                {renderIfYouHaveAccount()}
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
    header: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    goBackText: {
        fontSize: 18,
        color: '#007AFF',
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
    accountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
    },
    accountText: {
        fontSize: 16,
        color: '#888',
    },
    signInText: {
        fontSize: 16,
        color: '#1D4E89',
    },
    contentContainer: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingVertical: 20,
        justifyContent: 'center',
    },
});

export default SignIn;
