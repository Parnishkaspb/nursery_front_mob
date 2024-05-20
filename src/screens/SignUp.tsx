import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, Text, Alert, Platform, TextInput, ScrollView, TouchableOpacity, KeyboardAvoidingView, ActivityIndicator, StyleSheet, SafeAreaView } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import SecureStorage from 'react-native-secure-storage';
import { ENDPOINTS } from '../config';
import { RootStackParamList } from '../helpNavigation/navigationTypes';

type Navigation = NativeStackNavigationProp<RootStackParamList>;

const SignUp: React.FC = () => {
    const navigation: Navigation = useNavigation<Navigation>();

    const [loading, setLoading] = useState<boolean>(false);
    const [userName, setUserName] = useState<string>('');
    const [userSurname, setUserSurname] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [login, setLogin] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [telephone, setTelephone] = useState<string>('');

    const user = { userName, userSurname, email, login, password, telephone };

    const handleLogin = async () => {
        try {
            setLoading(true);

            const response = await axios.post(ENDPOINTS.CREATE_USER, {
                login: login,
                password: password,
                email: email,
                name: userName,
                surname: userSurname,
                telephone: telephone,
            });

            if (response.data.data.code === 422) {
                Alert.alert('Не все данные заполнены!');
                return;
            }

            if (response.data.data.code === 200) {

                const access_token = response.data.data.access_token;
                console.log(access_token);
                await SecureStorage.setItem('access_token', access_token);
                navigation.replace('Main');
                return;
            }

            Alert.alert('Что-то пошло не так!');
        } catch (error: any) {
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

    const handlePasswordChange = useCallback((text: string): void => {
        setPassword(text);
    }, []);

    const handleTelephoneChange = useCallback((text: string): void => {
        setTelephone(text);
    }, []);

    const nameInputRef = useRef<TextInput>(null);
    const surnameInputRef = useRef<TextInput>(null);
    const emailInputRef = useRef<TextInput>(null);
    const loginInputRef = useRef<TextInput>(null);
    const passwordInputRef = useRef<TextInput>(null);
    const telephoneInputRef = useRef<TextInput>(null);

    useEffect(() => {
        if (loading) {
            nameInputRef.current?.blur();
            surnameInputRef.current?.blur();
            emailInputRef.current?.blur();
            loginInputRef.current?.blur();
            passwordInputRef.current?.blur();
            telephoneInputRef.current?.blur();
        }
    }, [loading]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('blur', () => {
            setUserName('');
            setUserSurname('');
            setEmail('');
            setLogin('');
            setPassword('');
            setTelephone('');


            nameInputRef.current?.blur();
            surnameInputRef.current?.blur();
            emailInputRef.current?.blur();
            loginInputRef.current?.blur();
            passwordInputRef.current?.blur();
            telephoneInputRef.current?.blur();
        });

        return unsubscribe;
    }, [navigation]);

    const renderTitle = (): JSX.Element => {
        return (
            <Text style={styles.title}>{'Регистрация'}</Text>
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
                    // Assuming validation is a function that validates the user details
                    handleLogin();
                }}
                disabled={loading}
            >
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Зарегистрироваться</Text>}
            </TouchableOpacity>
        );
    };

    const renderIfYouHaveAccount = (): JSX.Element => {
        return (
            <View style={styles.accountContainer}>
                <Text style={styles.accountText}>
                    Уже есть аккаунт?{' '}
                </Text>
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate('SignIn');
                    }}
                >
                    <Text style={styles.signInText}>
                        Войти
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
            {/* {renderHeader()} */}
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

export default SignUp;
