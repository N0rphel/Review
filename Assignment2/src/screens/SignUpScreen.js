import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity} from 'react-native';
import { useDispatch } from 'react-redux';
import { registerUser } from '../redux/authSlice';

export default function SignUpScreen({ navigation }) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [gender, setGender] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    
    const handleSubmit = async () => {
        if (!username) {
            Alert.alert('Error', 'Username should not be empty');
            return;
        }

        if(!email){
            Alert.alert('Error', 'Email should not be empty');
            return;
        }

        if(!email){
            Alert.alert('Error', 'Email must be a valid email address');
            return;
        }
   
        if (!email.includes('@')) {
            Alert.alert('Error', 'Please enter a valid email');
            return;
        }

        if(!password){
            Alert.alert('Error', 'Password should not be empty');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters');
            return;
        }

        if(!gender){
            Alert.alert('Error', 'Gender must be either male or female');
            return;
        }

        if (!gender) {
            Alert.alert('Error', 'Gender is required');
            return;
        }


        setIsLoading(true);
        try {
            await dispatch(registerUser({ username, email, password, gender })).unwrap();
            navigation.navigate('Profile');
        } catch (error) {
            Alert.alert('Error', error.message || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClear = () => {
        setUsername('');
        setEmail('');
        setPassword('');
        setGender('');
    };

    return (
        <View style={styles.container}>
        <Text style={styles.title}>Sign Up a New User</Text>
        
        <Text style={styles.label}>User Name</Text>
        <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
        />

        <View style={styles.genderContainer}>
            <Text style={styles.label}>Gender</Text>
            <View style={styles.genderOptions}>
                <TouchableOpacity 
                    style={[styles.genderButton, gender === 'male' && styles.selectedGender]}
                    onPress={() => setGender('male')}
                >
                    <Text style={gender === 'male' ? styles.selectedGenderText : styles.genderText}>Male</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.genderButton, gender === 'female' && styles.selectedGender]}
                    onPress={() => setGender('female')}
                >
                    <Text style={gender === 'female' ? styles.selectedGenderText : styles.genderText}>Female</Text>
                </TouchableOpacity>
            </View>
        </View>
        
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
            <Button 
                title={isLoading ? "Loading..." : "Sign Up"} 
                onPress={handleSubmit} 
                disabled={isLoading}
            />
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
            <Text style={styles.switchText}>
                Switch to: sign in with an existing user
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
        fontSize: 24,
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
    genderContainer: {
        marginBottom: 15,
    },
    label: {
        marginRight: 10,
        fontSize: 16,
    },
        genderOptions: {
        flexDirection: 'row',
    },
    genderButton: {
        flex: 1,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        alignItems: 'center',
        marginRight: 10,
        borderRadius: 5,
    },
    selectedGender: {
        backgroundColor: '#007AFF',
        borderColor: '#007AFF',
    },
    genderText: {
        color: '#000',
    },
    selectedGenderText: {
        color: '#fff',
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