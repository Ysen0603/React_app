import { View, Text, StyleSheet, Image, Animated, TouchableOpacity } from 'react-native';
import React, { useContext, useEffect, useRef } from 'react';
import { AuthContext } from './Context/Auth';
import { router } from 'expo-router';

const index = () => {
    const { user } = useContext(AuthContext);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();

        const redirect = setTimeout(() => {
            if (user) {
                router.replace('(app)/Index');
            }
        }, 2000);

        return () => clearTimeout(redirect);
    }, [user]);

    const handleLogin = () => {
        router.replace('(app)/(Login)/Login');
    };

    const handleRegister = () => {
        router.replace('(app)/(Login)/register');
    };

    if (user) {
        return null; // Prevent showing anything if the user exists and we're redirecting
    }

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
                <Image
                    source={require('../assets/images/Social.png')}
                    style={styles.logo}
                />
                <Text style={styles.title}>Welcome to SocialApp</Text>
                <Text style={styles.subtitle}>Connect, Share, Inspire</Text>

                <View style={styles.buttonsContainer}>
                    <TouchableOpacity style={styles.button} onPress={handleLogin}>
                        <Text style={styles.buttonText}>Login</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, styles.registerButton]} onPress={handleRegister}>
                        <Text style={styles.buttonText}>Register</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    content: {
        width: '100%',
        alignItems: 'center',
    },
    logo: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 30,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 18,
        color: '#666',
        marginBottom: 40,
        textAlign: 'center',
    },
    buttonsContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: 20,
    },
    button: {
        backgroundColor: '#007AFF',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    registerButton: {
        backgroundColor: '#4CAF50', // A different color for the Register button
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default index;
