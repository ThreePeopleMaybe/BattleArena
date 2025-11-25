import { View, Text, TextInput, TouchableOpacity } from "react-native";
import styles from '@/styleguide/styles'
import COLORS from "@/styleguide/colors";
import SPACING from "@/styleguide/spacing";
import React, { useState } from 'react';  
import { useRouter } from "expo-router";
import Button from "@/components/button";

export default function RegisterScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const router = useRouter();
  
  return (
    <View style={styles.screenContainer}>
      <View style={styles.formContainer}>
        <Text>
          Register
        </Text>

        <View style={styles.form}>
          <Text style={[styles.label, { color: COLORS.darkText, marginBottom: SPACING.sm }]}>
            Player Name
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your player name"
            placeholderTextColor={COLORS.lightText}
            value={fullName}
            onChangeText={setFullName}
          />

          <Text style={[styles.label, { color: COLORS.darkText, marginBottom: SPACING.sm }]}>
            Email
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor={COLORS.lightText}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <Text style={[styles.label, { color: COLORS.darkText, marginBottom: SPACING.sm }]}>
            Phone Number
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your phone number"
            placeholderTextColor={COLORS.lightText}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />

          <Text style={[styles.label, { color: COLORS.darkText, marginBottom: SPACING.sm }]}>
            Password
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor={COLORS.lightText}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Text style={[styles.label, { color: COLORS.darkText, marginBottom: SPACING.sm }]}>
            Confirm Password
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Confirm your password"
            placeholderTextColor={COLORS.lightText}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          <Button label="Register" onPress={() => alert("Register")}/>
          
        </View>

          <TouchableOpacity onPress={() => router.back()}>
            
            <Text>
              Already have an account? Login
            </Text>
          </TouchableOpacity>
      </View>
    </View>
  );
}
