import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // Importing MaterialIcons from Expo
import axios from 'axios';

const AdminRegistrationPage = () => {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [emailId, setEmailId] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [responseMessage, setResponseMessage] = useState(''); // State to store response message

  const handleRegister = async () => {
    if (!fullName || !username || !password || !emailId || !mobileNumber) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!validateEmail(emailId)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (!validateMobileNumber(mobileNumber)) {
      Alert.alert('Error', 'Please enter a valid mobile number');
      return;
    }

    if (mobileNumber.length !== 10) {
      Alert.alert('Error', 'Mobile number must be exactly 10 digits');
      return;
    }

    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordPattern.test(password)) {
      Alert.alert(
        'Error',
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)'
      );
      return;
    }

    try {
      const response = await axios.post('http://192.168.0.123:8080/admin/register', {
        fullName,
        username,
        password,
        emailId,
        mobileNumber,
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // Extract response message
      const responseData = response.data;
      const message = responseData.message;

      // Update response message state
      setResponseMessage(message);

    } catch (error) {
      Alert.alert('Already Register with this Email', 'please try with other email.');
    }
  };

  const validateEmail = (email) => {
    // Basic email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const validateMobileNumber = (mobileNumber) => {
    // Basic mobile number validation (10 digits)
    const mobileNumberPattern = /^\d{10}$/;
    return mobileNumberPattern.test(mobileNumber);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); // Toggle the state to show or hide the password
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
        style={styles.input}
      />
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword} // Use secureTextEntry based on showPassword state
          style={[styles.input, styles.passwordInput]}
        />
        <MaterialIcons
          name={showPassword ? 'visibility' : 'visibility-off'}
          size={24}
          color="gray"
          onPress={togglePasswordVisibility} // Toggle password visibility on press
        />
      </View>
      <TextInput
        placeholder="Email ID"
        value={emailId}
        onChangeText={setEmailId}
        keyboardType="email-address"
        style={styles.input}
      />
      <TextInput
        placeholder="Mobile Number"
        value={mobileNumber}
        onChangeText={setMobileNumber}
        keyboardType="phone-pad"
        style={styles.input}
        maxLength={10}
      />
      <Button title="Register" onPress={handleRegister} />
      {responseMessage ? <Text style={styles.responseMessage}>{responseMessage}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  input: {
    marginBottom: 10,
    borderBottomWidth: 1,
    paddingVertical: 8,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  passwordInput: {
    flex: 1,
  },
  responseMessage: {
    color: 'green',
    marginTop: 10,
  },
});

export default AdminRegistrationPage;
