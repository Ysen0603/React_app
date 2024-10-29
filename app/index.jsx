import { View, Text, StyleSheet, Image, Animated } from 'react-native'
import React, { useContext, useEffect, useRef } from 'react'
import { AuthContext } from './Context/Auth'
import { router } from 'expo-router'

const index = () => {
    const { user } = useContext(AuthContext)
    const fadeAnim = useRef(new Animated.Value(0)).current
    
    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true
        }).start()

        const redirect = setTimeout(() => {
            if (!user) {
                router.replace('(app)/(Login)/Login')
            } else {
                router.replace('(app)/Index')
            }
        }, 5000)

        return () => clearTimeout(redirect)
    }, [user])

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
                <Image 
                    source={{ uri: 'https://via.placeholder.com/150' }}
                    style={styles.logo}
                />
                <Text style={styles.title}>Welcome to SocialApp</Text>
                <Text style={styles.subtitle}>Connect, Share, Inspire</Text>
                
                <View style={styles.featuresContainer}>
                    <View style={styles.featureItem}>
                        <Text style={styles.featureTitle}>🌟 Share Moments</Text>
                        <Text style={styles.featureText}>Post your favorite photos and videos</Text>
                    </View>
                    
                    <View style={styles.featureItem}>
                        <Text style={styles.featureTitle}>💬 Connect</Text>
                        <Text style={styles.featureText}>Engage with your community</Text>
                    </View>
                    
                    <View style={styles.featureItem}>
                        <Text style={styles.featureTitle}>🚀 Grow Together</Text>
                        <Text style={styles.featureText}>Build meaningful connections</Text>
                    </View>
                </View>
            </Animated.View>
        </View>
    )
}

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
    },
    featuresContainer: {
        width: '100%',
        gap: 20,
    },
    featureItem: {
        backgroundColor: '#f8f9fa',
        padding: 20,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    featureTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#007AFF',
        marginBottom: 8,
    },
    featureText: {
        fontSize: 16,
        color: '#666',
        lineHeight: 22,
    }
})

export default index
