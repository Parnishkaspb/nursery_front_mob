import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, Text, Alert, Platform, TextInput, ScrollView, TouchableOpacity, KeyboardAvoidingView, ActivityIndicator, StyleSheet, SafeAreaView } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import SecureStorage from 'react-native-secure-storage';
import { ENDPOINTS } from '../config';
import { RootStackParamList } from '../helpNavigation/navigationTypes';
import RNPickerSelect from 'react-native-picker-select';

type Navigation = NativeStackNavigationProp<RootStackParamList>;

const CreateInvestition: React.FC = () => {
    const navigation: Navigation = useNavigation<Navigation>();

    const [loading, setLoading] = useState<boolean>(false);
    const [summa, setSumma] = useState<string>('');
    const [percent, setPercent] = useState<number>(0);
    const [years, setYears] = useState<number>(0);
    const [summaBackAfter, setSummaBackAfter] = useState<string>('');

    const handleCreateInvestition = async () => {
        try {
            setLoading(true);

            const accessToken = await SecureStorage.getItem('access_token');
            if (!accessToken) {
                console.error('No access token found');
                return;
            }

            const IntSumma = parseInt(summa);

            // console.log(typeIntSumma);

            if (IntSumma <= 4999999) {
                Alert.alert('ПРЕДУПРЕЖДЕНИЕ!', 'Сумма меньше 5000000₽',);
                return;
            }

            const response = await axios.post(ENDPOINTS.USER_INVESTITIONS, {
                summa: IntSumma,
                percent: percent,
                years: years
            }, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                }
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

    function setSelectedValue(value: any): void {
        let selectedPercent = 0;
        let selectedYears = 0;

        switch (value) {
            case '30':
                selectedPercent = 30;
                selectedYears = 3;
                break;
            case '40':
                selectedPercent = 40;
                selectedYears = 4;
                break;
            case '45':
                selectedPercent = 45;
                selectedYears = 5;
                break;
            default:
                selectedPercent = 0;
                selectedYears = 0;
        }

        setPercent(selectedPercent);
        setYears(selectedYears);

        console.log(selectedPercent);

        const summaNumber = parseFloat(summa);
        if (!isNaN(summaNumber)) {
            const newSummaBackAfter = (summaNumber * (1 + selectedPercent / 100)).toFixed(0);
            setSummaBackAfter(newSummaBackAfter);
        } else {
            setSummaBackAfter('');
        }
    }

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
                        { label: '3 года: 30%', value: 30 },
                        { label: '4 года: 40%', value: 40 },
                        { label: '5 лет: 45%', value: 45 },
                    ]}
                    style={pickerSelectStyles}
                    placeholder={{ label: 'Срок вложения:', value: null }}
                />

                <TextInput
                    style={styles.input}
                    value={summaBackAfter}
                    editable={false}
                    placeholder={'Сумма после возврата'}
                />
            </KeyboardAvoidingView>
        );
    };

    const renderButton = (): JSX.Element => {
        return (
            <TouchableOpacity
                style={styles.button}
                onPress={() => {
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


const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        height: 50,
        fontSize: 18,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        color: 'black',
        marginBottom: 20,
    },
    inputAndroid: {
        height: 50,
        fontSize: 18,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        color: 'black',
        marginBottom: 20,
    },
});

export default CreateInvestition;
