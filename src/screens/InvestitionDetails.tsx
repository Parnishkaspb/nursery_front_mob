import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Alert, TouchableOpacity, ActivityIndicator, StyleSheet, SafeAreaView, FlatList, RefreshControl } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import SecureStorage from 'react-native-secure-storage';
import { ENDPOINTS } from '../config';
import { RootStackParamList } from '../helpNavigation/navigationTypes';

type Navigation = NativeStackNavigationProp<RootStackParamList>;

interface Investition {
    id: number;
    summa: number;
    money_give: number;
    percent: number;
    years: number;
    create: string;
    update: string;
}

const InvestitionDetails: React.FC<{ route: any }> = ({ route }) => {
    const navigation: Navigation = useNavigation<Navigation>();
    const { investitionId } = route.params;

    const [investition, setInvestition] = useState<Investition | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState<boolean>(false);

    const fetchInvestition = async () => {
        try {
            setLoading(true);

            const accessToken = await SecureStorage.getItem('access_token');
            if (!accessToken) {
                console.error('No access token found');
                return;
            }

            const response = await axios.get(`${ENDPOINTS.USER_INVESTITIONS}/${investitionId}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                }
            });

            setInvestition(response.data.data);
        } catch (error) {
            console.error('Failed to fetch investition:', error);
            Alert.alert('Ошибка!', 'Не удалось загрузить данные инвестиции. Попробуйте позже.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchInvestition();
    }, [investitionId]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchInvestition();
    }, [investitionId]);

    const formatDate = (dateString: string) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' } as const;
        return new Date(dateString).toLocaleDateString('ru-RU', options);
    };

    const renderInvestitionDetails = (): JSX.Element => {
        if (loading) {
            return <ActivityIndicator size="large" color="#1D4E89" />;
        }

        if (!investition) {
            return <Text style={styles.noInvestitionText}>Не удалось загрузить данные инвестиции</Text>;
        }

        return (
            <View style={styles.detailsContainer}>
                <Text style={styles.detailItem}><Text style={styles.detailLabel}>Сумма:</Text> {investition.summa}₽</Text>
                <Text style={styles.detailItem}><Text style={styles.detailLabel}>Процент:</Text> {investition.percent}%</Text>
                <Text style={styles.detailItem}><Text style={styles.detailLabel}>Срок:</Text> {investition.years} года(лет)</Text>
                <Text style={styles.detailItem}><Text style={styles.detailLabel}>Дата создания:</Text> {formatDate(investition.create)}</Text>
                <Text style={styles.detailItem}><Text style={styles.detailLabel}>Дата обновления:</Text> {formatDate(investition.update)}</Text>
                <Text style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Статус:</Text> {investition.money_give === 0 ? 'Инвестиция еще не принята' : 'Инвестиция принята'}
                </Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <FlatList
                data={investition ? [investition] : []}
                renderItem={renderInvestitionDetails}
                keyExtractor={(item) => item.id.toString()}
                ListHeaderComponent={<Text style={styles.title}>Детали инвестиции</Text>}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
                contentContainerStyle={styles.contentContainer}
            />
            <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
                <Text style={styles.buttonText}>Назад</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    contentContainer: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    title: {
        marginBottom: 30,
        textAlign: 'center',
        fontSize: 32,
        color: '#1D4E89',
        textTransform: 'capitalize',
    },
    detailsContainer: {
        backgroundColor: '#f8f9fa',
        borderRadius: 5,
        padding: 20,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    // detailTitle: {
    //     fontSize: 24,
    //     fontWeight: 'bold',
    //     marginBottom: 10,
    // },
    detailItem: {
        fontSize: 18,
        marginBottom: 10,
        color: '#343a40',
    },
    detailLabel: {
        fontWeight: 'bold',
    },
    noInvestitionText: {
        textAlign: 'center',
        fontSize: 18,
        color: '#888',
    },
    button: {
        backgroundColor: '#1D4E89',
        borderRadius: 5,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        marginHorizontal: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
    },
});

export default InvestitionDetails;
