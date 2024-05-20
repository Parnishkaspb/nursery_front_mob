import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, Text, Alert, Platform, TextInput, ScrollView, TouchableOpacity, KeyboardAvoidingView, ActivityIndicator, StyleSheet, SafeAreaView, FlatList, RefreshControl } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import SecureStorage from 'react-native-secure-storage';
import { ENDPOINTS } from '../config';
import { RootStackParamList } from '../helpNavigation/navigationTypes';

type Navigation = NativeStackNavigationProp<RootStackParamList>;

interface Project {
    id: number;
    name: string;
    description: string;
}

const HomeScreen: React.FC = () => {
    const navigation: Navigation = useNavigation<Navigation>();

    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState<boolean>(false);

    const fetchProjects = async () => {
        try {
            const accessToken = await SecureStorage.getItem('access_token');
            if (!accessToken) {
                console.error('No access token found');
                return;
            }

            // const response = await axios.get(ENDPOINTS.USER_PROJECTS, {
            //     headers: {
            //         'Authorization': `Bearer ${accessToken}`,
            //     }
            // });

            // setProjects(response.data.data);


        } catch (error) {
            console.error('Failed to fetch projects:', error);
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
        // console.log('refresh');
    }, []);

    const renderTitle = (): JSX.Element => {
        return (
            <Text style={styles.title}>{'Ваши инвестиции'}</Text>
        );
    };

    const renderProjectItem = ({ item }: { item: Project }): JSX.Element => {
        return (
            <TouchableOpacity
                style={styles.projectItem}
            // onPress={() => navigation.navigate('ProjectDetails', { projectId: item.id })}
            >
                <Text style={styles.projectTitle}>{item.name}</Text>
                <Text style={styles.projectDescription}>{item.description}</Text>
            </TouchableOpacity>
        );
    };

    const renderProjectsList = (): JSX.Element => {
        if (loading) {
            return <ActivityIndicator size="large" color="#1D4E89" />;
        }

        if (projects.length === 0) {
            return <Text style={styles.noProjectsText}>У вас нет инвестиций</Text>;
        }

        return (
            <FlatList
                data={projects}
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
            <ScrollView contentContainerStyle={styles.contentContainer}>
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
    noProjectsText: {
        textAlign: 'center',
        fontSize: 18,
        color: '#888',
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
