import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet, SafeAreaView, FlatList, RefreshControl, Alert } from 'react-native';
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

const HomeScreen: React.FC = () => {
    const navigation: Navigation = useNavigation<Navigation>();

    const [investitions, setInvestitions] = useState<Investition[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState<boolean>(false);

    const fetchProjects = async () => {
        try {
            const accessToken = await SecureStorage.getItem('access_token');
            if (!accessToken) {
                console.error('No access token found');
                return;
            }

            const response = await axios.get(ENDPOINTS.USER_INVESTITIONS, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                }
            });

            setInvestitions(response.data.data);

        } catch (error) {
            console.error('Failed to fetch user profile:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const deleteInvestition = async (id: number) => {
        try {
            const accessToken = await SecureStorage.getItem('access_token');
            if (!accessToken) {
                console.error('No access token found');
                return;
            }

            const response = await axios.delete(`${ENDPOINTS.USER_INVESTITIONS}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                }
            });

            if (response.data.data.code === 200) {
                Alert.alert('Успех!', response.data.data.message);
            }

            setInvestitions(prevInvestitions => prevInvestitions.filter(investition => investition.id !== id));

        } catch (error) {
            console.error('Failed to delete investition:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };


    useEffect(() => {
        fetchProjects();
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchProjects();
    }, []);

    const renderTitle = (): JSX.Element => {
        return (
            <Text style={styles.title}>{'Ваши инвестиции'}</Text>
        );
    };

    const renderProjectItem = ({ item }: { item: Investition }): JSX.Element => {
        return (
            <TouchableOpacity style={styles.projectItem}>
                <Text style={styles.projectTitle}>Сумма: {item.summa}</Text>
                <Text style={styles.projectDescription}>Срок: {item.years} года(лет)</Text>
                {item.money_give === 0 ? (
                    <>
                        <Text style={styles.projectDescriptionColor0}>Инвестиция еще не принята</Text>
                        <TouchableOpacity style={styles.button2} onPress={() => {
                            deleteInvestition(item.id)
                        }}>
                            <Text style={styles.buttonText}>Удалить</Text>
                        </TouchableOpacity>
                    </>
                ) : null}

                {
                    item.money_give === 1 ? (
                        <TouchableOpacity style={styles.button} onPress={() => {
                            navigation.navigate('InvestitionDetails', { investitionId: item.id })
                        }}>
                            <Text style={styles.buttonText}>Полная информация</Text>
                        </TouchableOpacity>
                    ) : null
                }
            </TouchableOpacity >
        );
    };



    const renderProjectsList = (): JSX.Element => {
        if (loading) {
            return <ActivityIndicator size="large" color="#1D4E89" />;
        }

        if (investitions.length === 0) {
            return (
                <View style={styles.container}>
                    <Text style={styles.noProjectsText}>У вас нет инвестиций</Text>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate('CreateInvestition')} // Замените 'InvestPage' на название вашего экрана для инвестирования
                    >
                        <Text style={styles.buttonText}>Инвестировать</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        return (
            <FlatList
                data={investitions}
                renderItem={renderProjectItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.projectListContainer}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            />
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
                {renderProjectsList()}
            </ScrollView>
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    title: {
        marginBottom: 30,
        textAlign: 'center',
        fontSize: 32,
        color: '#1D4E89',
        textTransform: 'capitalize',
    },
    projectItem: {
        backgroundColor: '#f8f9fa',
        borderRadius: 5,
        padding: 20,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    projectTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#343a40',
        marginBottom: 5,
    },
    projectDescription: {
        fontSize: 14,
        color: '#495057',
    },
    projectDescriptionColor0: {
        fontSize: 14,
        color: 'red',
    },
    noProjectsText: {
        textAlign: 'center',
        fontSize: 18,
        color: '#888',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#1D4E89',
        borderRadius: 5,
        height: 50,
        width: 200,
        alignItems: 'center',
        justifyContent: 'center',
    },
    button2: {
        backgroundColor: 'red',
        borderRadius: 5,
        height: 50,
        width: 200,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
    },


    contentContainer: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    projectListContainer: {
        paddingBottom: 20,
    },
});

export default HomeScreen;
