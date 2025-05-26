import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity, ActivityIndicator} from 'react-native';
import { useDispatch } from 'react-redux';
import { signIn } from '../API/drugSpeakAPI';
import { loginUser } from '../redux/authSlice';

export default function SignInScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      const user = await signIn(email, password);
      dispatch(loginUser(user));
      navigation.navigate('Drugs');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Invalid email or password';
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setEmail('');
    setPassword('');
  };


    return (
        <View style={styles.container}>
        <Text style={styles.title}>Sign in with email and password</Text>
        
        <Text style={styles.label}>Email</Text>
        <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
        />
        
        <Text style={styles.label}>Password</Text>
        <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
        />

        <View style={styles.buttonContainer}>
            <Button 
            title="Clear" 
            onPress={handleClear} 
            color="#888"
            />
            {isLoading ? (
            <ActivityIndicator size="small" color="#0000ff" />
            ) : (
            <Button 
                title="Sign In" 
                onPress={handleSignIn} 
            />
            )}
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.switchText}>
            Switch to: sign up a new user
            </Text>
        </TouchableOpacity>
        </View>
    );
    }

    const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 15,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    label: {
        marginRight: 10,
        fontSize: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    switchText: {
        color: 'blue',
        textAlign: 'center',
        marginTop: 15,
    },
    });