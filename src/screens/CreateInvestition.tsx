import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, Text, Alert, Platform, TextInput, ScrollView, TouchableOpacity, KeyboardAvoidingView, ActivityIndicator, StyleSheet, SafeAreaView } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import SecureStorage from 'react-native-secure-storage';
import { ENDPOINTS } from '../config';
import { RootStackParamList } from '../helpNavigation/navigationTypes';

type Navigation = NativeStackNavigationProp<RootStackParamList>;

const CreateInvestition: React.FC = () => {
    const navigation: Navigation = useNavigation<Navigation>();

    const [loading, setLoading] = useState<boolean>(false);
    const [summa, setSumma] = useState<string>('');
    const [percent, setPercent] = useState<number>(0);
    const [years, setYears] = useState<number>(0);

    const handleCreateInvestition = async () => {
        try {
            setLoading(true);

            const response = await axios.post(ENDPOINTS.USER_INVESTITIONS, {
                summa: summa,
                percent: percent,
                years: years
            });

            if (response.data.data.code === 422) {
                Alert.alert(response.data.data.message);
                return;
            }

            if (response.data.data.code === 200) {
                Alert.alert(response.data.data.message);
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

    const handleSummaChange = useCallback((text: string): void => {
        const numericValue = text.replace(/[^0-9]/g, '');
        setSumma(numericValue);
    }, []);

    const handlePercentChange = useCallback((text: number): void => {
        setPercent(text);
    }, []);

    const handleYearsChange = useCallback((text: number): void => {
        setYears(text);
    }, []);



    const summaInputRef = useRef<TextInput>(null);
    const percentInputRef = useRef<TextInput>(null);
    const yearsInputRef = useRef<TextInput>(null);


    useEffect(() => {
        if (loading) {
            summaInputRef.current?.blur();
            percentInputRef.current?.blur();
            yearsInputRef.current?.blur();

        }
    }, [loading]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('blur', () => {
            setSumma('');
            setPercent(0);
            setYears(0);


            summaInputRef.current?.blur();
            percentInputRef.current?.blur();
            yearsInputRef.current?.blur();
        });

        return unsubscribe;
    }, [navigation]);

    const renderTitle = (): JSX.Element => {
        return (
            <Text style={styles.title}>{'Инвестировать'}</Text>
        );
    };

    const renderInputFields = (): JSX.Element => {
        return (
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <TextInput
                    style={styles.input}
                    value={summa}
                    onChangeText={handleSummaChange}
                    placeholder={'Сумма инвестиции'}
                    keyboardType="numeric"
                    ref={summaInputRef}
                />
                <RNPickerSelect
                    onValueChange={(value) => setSelectedValue(value)}
                    items={[
                        { label: 'Опция 1', value: 'option1' },
                        { label: 'Опция 2', value: 'option2' },
                        { label: 'Опция 3', value: 'option3' },
                    ]}
                    style={pickerSelectStyles}
                    placeholder={{ label: 'Выберите опцию', value: null }}
                />

                {/* <TextInput
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
                /> */}
            </KeyboardAvoidingView>
        );
    };

    const renderButton = (): JSX.Element => {
        return (
            <TouchableOpacity
                style={styles.button}
                onPress={() => {
                    // Assuming validation is a function that validates the user details
                    handleCreateInvestition();
                }}
                disabled={loading}
            >
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Инвестировать</Text>}
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

export default CreateInvestition;
